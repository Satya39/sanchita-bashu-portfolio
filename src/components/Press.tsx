import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { awards, press } from '../data/content'
import SplitText from './SplitText'

export default function Press() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.award-row',
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, stagger: 0.08, scrollTrigger: { trigger: '.awards', start: 'top 85%', once: true } },
      )
      gsap.fromTo(
        '.award-row',
        { '--line-scale': 0 } as gsap.TweenVars,
        { '--line-scale': 1, duration: 1.2, stagger: 0.08, ease: 'expo.inOut', scrollTrigger: { trigger: '.awards', start: 'top 85%', once: true } } as gsap.TweenVars,
      )
      gsap.fromTo(
        '.press-outlet',
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.8, stagger: 0.1, scrollTrigger: { trigger: '.press-list', start: 'top 80%', once: true } },
      )
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="press" className="section press container">
      <div className="section-head">
        <SplitText as="h2" className="display" text="Press & *milestones*" />
        <p className="eyebrow">Coverage &amp; recognition</p>
      </div>

      <div className="press-grid">
        <div className="press-list">
          {press.map((p) => (
            <blockquote key={p.outlet} className="press-quote">
              <SplitText as="p" className="display press-text" text={`“${p.quote}”`} stagger={0.02} duration={1.1} />
              <footer className="press-outlet">
                {p.href ? (
                  <a className="eyebrow link-line" href={p.href} target="_blank" rel="noreferrer">
                    {p.outlet} ↗
                  </a>
                ) : (
                  <span className="eyebrow">{p.outlet}</span>
                )}
                <span className="eyebrow mono-num">{p.year}</span>
              </footer>
            </blockquote>
          ))}
        </div>

        <div className="awards">
          <p className="eyebrow awards-head">Milestones</p>
          {awards.map((a) => (
            <div key={a.title} className="award-row">
              <span className="mono-num award-year">{a.year}</span>
              <span className="award-title">{a.title}</span>
              <span className="award-for">{a.for}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
