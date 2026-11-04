import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { spotlight } from '../data/content'
import RevealImage from './RevealImage'
import SplitText from './SplitText'

/**
 * Feature block for her signature role: poster with a drifting gold frame,
 * outlined title in the background, plot, and a facts ledger that draws in.
 */
export default function Spotlight() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.spot-bg', { xPercent: 10 }, { xPercent: -25, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.fromTo('.spot-frame', { x: 28, y: 28 }, { x: 12, y: 12, ease: 'none', scrollTrigger: { trigger: '.spot-media', start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.fromTo(
        '.spot-fact',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.07, scrollTrigger: { trigger: '.spot-facts', start: 'top 85%', once: true } },
      )
      gsap.fromTo(
        '.spot-fact',
        { '--line-scale': 0 } as gsap.TweenVars,
        { '--line-scale': 1, duration: 1.1, stagger: 0.07, ease: 'expo.inOut', scrollTrigger: { trigger: '.spot-facts', start: 'top 85%', once: true } } as gsap.TweenVars,
      )
      gsap.utils.toArray<HTMLElement>('.spot-para').forEach((p) =>
        gsap.fromTo(p, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1, scrollTrigger: { trigger: p, start: 'top 88%', once: true } }),
      )
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="spotlight" className="section spotlight">
      <span className="spot-bg display" aria-hidden>
        {spotlight.short}
      </span>
      <div className="container spot-grid">
        <div className="spot-media">
          <RevealImage src={spotlight.poster} alt={`${spotlight.title} poster`} className="spot-img" parallax={5} />
          <span className="spot-frame" aria-hidden />
          <a className="spot-watch eyebrow" href={spotlight.watch} target="_blank" rel="noreferrer" data-cursor="Watch">
            Watch on {spotlight.platform} ↗
          </a>
        </div>

        <div className="spot-copy">
          <p className="eyebrow">Spotlight · {spotlight.platform}</p>
          <SplitText as="h2" className="display spot-title" text={spotlight.headline} stagger={0.05} />
          <p className="spot-sub display italic">{spotlight.title}</p>
          {spotlight.paragraphs.map((p, i) => (
            <p key={i} className="spot-para">
              {p}
            </p>
          ))}

          <dl className="spot-facts">
            {spotlight.facts.map((f) => (
              <div key={f.label} className="spot-fact">
                <dt className="eyebrow">{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
