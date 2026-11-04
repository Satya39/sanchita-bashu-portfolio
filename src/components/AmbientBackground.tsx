import { useEffect, useRef } from 'react'
import { gsap, isTouch, prefersReducedMotion } from '../lib/gsap'

type Orb = { x: number; y: number; r: number; hue: [number, number, number]; a: number; sx: number; sy: number; p: number }
type Mote = { x: number; y: number; r: number; v: number; a: number; d: number }

/**
 * Fixed full-screen canvas behind the page: slow-drifting warm light orbs
 * (maroon / gold / plum) that react to scroll and pointer, plus a fine field
 * of rising gold dust. Keeps the page dark — it's a glow, not a wallpaper.
 */
export default function AmbientBackground() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext('2d', { alpha: true })
    if (!ctx) return

    const reduced = prefersReducedMotion()
    const touch = isTouch()
    const dpr = Math.min(window.devicePixelRatio || 1, touch ? 1 : 1.5)
    let w = 0
    let h = 0

    const orbs: Orb[] = [
      { x: 0.18, y: 0.25, r: 0.55, hue: [120, 38, 52], a: 0.55, sx: 0.00011, sy: 0.00007, p: 0 },
      { x: 0.82, y: 0.7, r: 0.5, hue: [200, 168, 107], a: 0.22, sx: -0.00009, sy: 0.00012, p: 2 },
      { x: 0.6, y: 0.15, r: 0.42, hue: [86, 46, 92], a: 0.4, sx: 0.00007, sy: -0.0001, p: 4 },
      { x: 0.3, y: 0.85, r: 0.45, hue: [150, 90, 40], a: 0.3, sx: -0.00012, sy: -0.00006, p: 1 },
    ]
    const motes: Mote[] = Array.from({ length: touch ? 28 : 70 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.6,
      v: 0.00004 + Math.random() * 0.00009,
      a: 0.08 + Math.random() * 0.3,
      d: Math.random() * Math.PI * 2,
    }))

    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 }
    let scrollK = 0

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      cv.width = Math.floor(w * dpr)
      cv.height = Math.floor(h * dpr)
      cv.style.width = `${w}px`
      cv.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e: PointerEvent) => {
      pointer.tx = e.clientX / w
      pointer.ty = e.clientY / h
    }
    if (!touch) window.addEventListener('pointermove', onMove, { passive: true })

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - h
      scrollK = max > 0 ? window.scrollY / max : 0
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const draw = (time: number) => {
      pointer.x += (pointer.tx - pointer.x) * 0.04
      pointer.y += (pointer.ty - pointer.y) * 0.04
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      const t = time * 1000
      for (const o of orbs) {
        const px = (o.x + Math.sin(t * o.sx + o.p) * 0.12 + (pointer.x - 0.5) * 0.06) * w
        const py = (o.y + Math.cos(t * o.sy + o.p) * 0.1 - scrollK * 0.35 + (pointer.y - 0.5) * 0.04) * h
        const rr = o.r * Math.max(w, h) * 0.5
        const g = ctx.createRadialGradient(px, py, 0, px, py, rr)
        const [r, gg, b] = o.hue
        g.addColorStop(0, `rgba(${r},${gg},${b},${o.a * 0.22})`)
        g.addColorStop(0.5, `rgba(${r},${gg},${b},${o.a * 0.07})`)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(px, py, rr, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalCompositeOperation = 'source-over'
      for (const m of motes) {
        m.y -= m.v
        m.x += Math.sin(t * 0.0004 + m.d) * 0.00008
        if (m.y < -0.02) {
          m.y = 1.02
          m.x = Math.random()
        }
        const tw = 0.6 + 0.4 * Math.sin(t * 0.0015 + m.d)
        ctx.fillStyle = `rgba(200,168,107,${m.a * tw})`
        ctx.beginPath()
        ctx.arc(m.x * w, m.y * h, m.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    if (reduced) {
      draw(0)
      return () => {
        window.removeEventListener('resize', resize)
        window.removeEventListener('scroll', onScroll)
      }
    }

    let visible = true
    const onVis = () => {
      visible = document.visibilityState === 'visible'
    }
    document.addEventListener('visibilitychange', onVis)
    const tick = (time: number) => {
      if (visible) draw(time)
    }
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      if (!touch) window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={ref} className="ambient" aria-hidden />
}
