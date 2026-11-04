import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'

type Props = { items: string[]; className?: string }

/**
 * Infinite marquee whose speed and direction react to scroll velocity.
 */
export default function Marquee({ items, className = '' }: Props) {
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = track.current
    if (!el || prefersReducedMotion()) return

    const tween = gsap.to(el, { xPercent: -50, repeat: -1, duration: 28, ease: 'none' })
    let current = 1
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const v = self.getVelocity()
        const dir = v < 0 ? -1 : 1
        const boost = gsap.utils.clamp(1, 6, 1 + Math.abs(v) / 900)
        current = dir * boost
        gsap.to(tween, { timeScale: current, duration: 0.4, overwrite: true })
        gsap.to(tween, { timeScale: dir, duration: 1.2, delay: 0.4, overwrite: false })
      },
    })
    return () => {
      st.kill()
      tween.kill()
    }
  }, [])

  const row = [...items, ...items]
  return (
    <div className={`marquee ${className}`} aria-hidden>
      <div ref={track} className="marquee-track">
        {[0, 1].map((k) => (
          <div key={k} className="marquee-group">
            {row.map((t, i) => (
              <span key={i} className="marquee-item display">
                {t}
                <i className="marquee-dot" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
