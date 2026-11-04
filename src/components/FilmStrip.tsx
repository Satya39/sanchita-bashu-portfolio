import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'
import { strip } from '../data/content'

/**
 * Two full-bleed rows of photographs drifting in opposite directions,
 * tilted like a contact sheet. Speed follows scroll velocity.
 */
export default function FilmStrip() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return
    const rows = el.querySelectorAll<HTMLElement>('.strip-row')
    const tweens = Array.from(rows).map((row, i) =>
      gsap.to(row, { xPercent: i % 2 ? 0 : -50, repeat: -1, duration: 60 + i * 12, ease: 'none', ...(i % 2 ? { startAt: { xPercent: -50 } } : {}) }),
    )
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const v = self.getVelocity()
        const boost = gsap.utils.clamp(1, 4, 1 + Math.abs(v) / 1200)
        tweens.forEach((tw) => {
          gsap.to(tw, { timeScale: boost, duration: 0.3, overwrite: true })
          gsap.to(tw, { timeScale: 1, duration: 1.4, delay: 0.3 })
        })
      },
    })
    const inner = el.querySelector('.strip-inner')
    const tilt = gsap.fromTo(inner, { rotate: -2.5 }, { rotate: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
    return () => {
      st.kill()
      tilt.kill()
      tweens.forEach((t) => t.kill())
    }
  }, [])

  const half = Math.ceil(strip.length / 2)
  const rows = [strip.slice(0, half), strip.slice(half)]

  return (
    <section ref={root} className="strip" aria-label="Photographs">
      <div className="strip-inner">
      {rows.map((imgs, r) => (
        <div key={r} className="strip-row">
          {[0, 1].map((k) => (
            <div key={k} className="strip-group" aria-hidden={k === 1}>
              {imgs.map((s, i) => (
                <figure key={`${k}-${i}`} className="strip-frame">
                  <img src={s.src} alt={k === 0 ? s.alt : ''} loading="lazy" decoding="async" draggable={false} />
                </figure>
              ))}
            </div>
          ))}
        </div>
      ))}
      </div>
    </section>
  )
}
