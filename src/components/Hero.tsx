import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { profile } from '../data/content'
import HeroCanvas from './HeroCanvas'

type Props = { start: boolean }

function Chars({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`chars ${className}`} aria-hidden>
      {Array.from(text).map((c, i) => (
        <span key={i} className="char">
          <span>{c}</span>
        </span>
      ))}
    </span>
  )
}

export default function Hero({ start }: Props) {
  const root = useRef<HTMLElement>(null)

  // intro choreography
  useEffect(() => {
    const el = root.current
    if (!el || !start) return
    const reduced = prefersReducedMotion()
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.to('.hero-media', { clipPath: 'inset(0% 0 0 0)', duration: reduced ? 0 : 1.6, ease: 'expo.inOut' }, 0)
        .to('.hero-first .char > span', { y: 0, duration: 1.4, stagger: 0.045 }, 0.35)
        .to('.hero-last .char > span', { y: 0, duration: 1.4, stagger: 0.045 }, 0.6)
        .fromTo('.hero-fade', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.2, stagger: 0.1 }, 0.9)
        .fromTo('.hero-rule', { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'expo.inOut' }, 0.9)
    }, el)
    return () => ctx.revert()
  }, [start])

  // scroll-out parallax
  useEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const st = { trigger: el, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('.hero-first', { yPercent: 60, ease: 'none', scrollTrigger: st })
      gsap.to('.hero-last', { yPercent: -30, ease: 'none', scrollTrigger: st })
      gsap.to('.hero-media', { yPercent: 18, scale: 0.92, ease: 'none', scrollTrigger: st })
      gsap.to('.hero-fade, .hero-rule', { autoAlpha: 0, ease: 'none', scrollTrigger: { ...st, end: '40% top' } })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="top" className="hero">
      <div className="hero-media" data-cursor="Portrait">
        <HeroCanvas src={profile.heroImage} intro={start} />
        <span className="hero-media-frame" aria-hidden />
      </div>
      <p className="hero-credit eyebrow hero-fade">
        <span className="devanagari">थोड़ी नज़ाकत, थोड़ी शरारत</span> · {profile.instagram.handle}
      </p>

      <div className="hero-top container">
        <p className="eyebrow hero-fade">
          <span className="devanagari">{profile.nameDevanagari}</span> — {profile.tagline}
        </p>
        <p className="eyebrow hero-fade hero-top-right">
          Shanvika in Thukra Ke Mera Pyaar · JioHotstar
          <br />
          Based in {profile.location} · {profile.instagram.followers} on Instagram
        </p>
      </div>

      <h1 className="hero-title display" aria-label={profile.name}>
        <span className="hero-first">
          <Chars text={profile.firstName} />
        </span>
        <span className="hero-last italic">
          <Chars text={profile.lastName} />
        </span>
      </h1>

      <div className="hero-bottom container">
        <div className="hero-scroll hero-fade">
          <span className="hero-scroll-line" />
          <span className="eyebrow">Scroll</span>
        </div>
      </div>
      <p className="hero-blurb hero-fade">{profile.intro[0]}</p>
      <span className="hero-rule" />
    </section>
  )
}
