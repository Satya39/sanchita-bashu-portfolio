import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { profile } from '../data/content'

type Props = {
  /** fires when the curtain begins to lift — start hero intro here */
  onReveal: () => void
  /** fires when the preloader is fully off-screen */
  onDone: () => void
}

export default function Preloader({ onReveal, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return

    if (prefersReducedMotion()) {
      onReveal()
      onDone()
      return
    }

    const letters = el.querySelectorAll<HTMLElement>('.pre-letter > span')
    const progress = { n: 0 }
    const tl = gsap.timeline({ paused: true, onComplete: onDone })

    tl.to(letters, { y: 0, duration: 1.3, stagger: 0.04, ease: 'expo.out' }, 0.15)
      .to(
        progress,
        {
          n: 100,
          duration: 2.1,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (counter.current) counter.current.textContent = String(Math.round(progress.n)).padStart(3, '0')
          },
        },
        0,
      )
      .to('.pre-bar', { scaleX: 1, duration: 2.1, ease: 'power2.inOut' }, 0)
      .to(letters, { y: '-115%', duration: 0.8, stagger: 0.025, ease: 'expo.in' }, '+=0.25')
      .to('.pre-meta', { opacity: 0, duration: 0.4 }, '<')
      .add(onReveal, '-=0.15')
      .to(el, { yPercent: -100, duration: 1.15, ease: 'expo.inOut' }, '-=0.15')

    const ready = (document as Document & { fonts?: FontFaceSet }).fonts?.ready ?? Promise.resolve()
    let cancelled = false
    ready.then(() => {
      if (!cancelled) tl.play()
    })

    return () => {
      cancelled = true
      tl.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const chars = Array.from(profile.name)

  return (
    <div ref={root} className="preloader" aria-hidden>
      <div className="pre-name display">
        {chars.map((c, i) =>
          c === ' ' ? (
            <span key={i} className="pre-space" />
          ) : (
            <span key={i} className="pre-letter">
              <span>{c}</span>
            </span>
          ),
        )}
      </div>
      <div className="pre-meta">
        <span className="eyebrow">{profile.role} · Portfolio</span>
        <span ref={counter} className="pre-counter mono-num">
          000
        </span>
      </div>
      <div className="pre-bar" />
    </div>
  )
}
