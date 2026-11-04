import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { facts } from '../data/content'
import SplitText from './SplitText'

/** Off-screen dossier: a grid of short facts that flips in card by card. */
export default function Facts() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.fact-card',
        { autoAlpha: 0, y: 30, rotateX: -12 },
        { autoAlpha: 1, y: 0, rotateX: 0, duration: 1, stagger: { each: 0.06, from: 'start' }, scrollTrigger: { trigger: '.facts-grid', start: 'top 85%', once: true } },
      )
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="facts" className="section facts container">
      <div className="section-head">
        <SplitText as="h2" className="display" text="Off *screen*" />
        <p className="eyebrow">The dossier</p>
      </div>
      <div className="facts-grid">
        {facts.map((f) => (
          <div key={f.label} className="fact-card">
            <span className="eyebrow">{f.label}</span>
            <p className={f.devanagari ? 'devanagari' : undefined}>{f.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
