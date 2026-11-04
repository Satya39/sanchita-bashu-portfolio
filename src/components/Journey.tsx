import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { journey, profile } from '../data/content'
import SplitText from './SplitText'

/**
 * Vertical timeline: a gold rule draws down with scroll while each milestone
 * un-masks as it crosses the viewport. Ends on a large pull quote.
 */
export default function Journey() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.journey-rule > i',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.journey-list', start: 'top 70%', end: 'bottom 70%', scrub: true } },
      )
      gsap.utils.toArray<HTMLElement>('.journey-item').forEach((item) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 78%', once: true } })
        tl.fromTo(item.querySelector('.journey-dot'), { scale: 0 }, { scale: 1, duration: 0.6, ease: 'back.out(3)' }, 0)
          .fromTo(item.querySelector('.journey-year'), { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.9 }, 0.05)
          .fromTo(item.querySelector('.journey-body'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1 }, 0.15)
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="journey" className="section journey container">
      <div className="section-head">
        <SplitText as="h2" className="display" text="The *journey*" />
        <p className="eyebrow">
          {profile.hometown} → {profile.location}
        </p>
      </div>

      <div className="journey-list">
        <span className="journey-rule" aria-hidden>
          <i />
        </span>
        {journey.map((m, i) => (
          <div key={i} className="journey-item">
            <span className="journey-dot" aria-hidden />
            <span className="journey-year display mono-num">{m.year}</span>
            <div className="journey-body">
              <h3 className="display">{m.title}</h3>
              <p>{m.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <blockquote className="journey-quote">
        <SplitText as="p" className="display journey-quote-text" text={`“${profile.quote.text}”`} stagger={0.04} />
        <cite className="eyebrow">— {profile.name}, {profile.quote.source}</cite>
      </blockquote>
    </section>
  )
}
