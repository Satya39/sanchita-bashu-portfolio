import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'
import { profile } from '../data/content'
import SplitText from './SplitText'
import RevealImage from './RevealImage'

export default function About() {
  const stats = useRef<HTMLDivElement>(null)

  // count-up numbers
  useEffect(() => {
    const el = stats.current
    if (!el) return
    const nums = el.querySelectorAll<HTMLElement>('.stat-value')
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      nums.forEach((n) => {
        const raw = n.dataset.value ?? '0'
        const m = raw.match(/^([^\d]*)([\d.]+)(.*)$/)
        const prefix = m?.[1] ?? ''
        const num = parseFloat(m?.[2] ?? '0')
        const suffix = m?.[3] ?? ''
        const decimals = (m?.[2].split('.')[1] ?? '').length
        const o = { v: 0 }
        gsap.fromTo(n, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 1, scrollTrigger: { trigger: n, start: 'top 90%', once: true } })
        gsap.to(o, {
          v: num,
          duration: 1.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: n, start: 'top 90%', once: true },
          onUpdate: () => (n.textContent = prefix + o.v.toFixed(decimals) + suffix),
        })
      })
      gsap.fromTo('.stat', { '--line-scale': 0 } as gsap.TweenVars, {
        '--line-scale': 1,
        duration: 1.2,
        stagger: 0.1,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      } as gsap.TweenVars)
    }, el)
    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" className="section about container">
      <div className="about-grid">
        <div className="about-media">
          <RevealImage src={profile.aboutImage} alt={`${profile.name}, portrait`} className="about-img" parallax={6} />
          <span className="about-caption eyebrow">
            <span>Born {profile.born} · {profile.hometown}</span>
            <span className="devanagari">dear october, you kept me busy</span>
          </span>
        </div>

        <div className="about-copy">
          <p className="eyebrow about-eyebrow">About</p>
          <SplitText as="h2" className="display about-title" text={profile.headline} stagger={0.05} />
          {profile.intro.map((p, i) => (
            <SplitText key={i} as="p" className="about-para" text={p} stagger={0.012} duration={1} />
          ))}

          <div ref={stats} className="stats">
            {profile.stats.map((s) => (
              <div key={s.label} className="stat">
                <span className="stat-value display mono-num" data-value={s.value}>
                  {s.value}
                </span>
                <span className="eyebrow">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
