import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'
import { filmography } from '../data/content'

/**
 * Pinned horizontal scroll of selected work on desktop; stacked list on mobile.
 */
export default function Filmography() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    const tr = track.current
    if (!el || !tr || prefersReducedMotion()) return

    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px)', () => {
      const distance = () => tr.scrollWidth - window.innerWidth
      const scroll = gsap.to(tr, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })

      // images drift inside their frames as the track moves (depth)
      tr.querySelectorAll<HTMLElement>('.film-card img').forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -8 },
          {
            xPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: img, containerAnimation: scroll, start: 'left right', end: 'right left', scrub: true },
          },
        )
      })

      // progress bar
      gsap.fromTo(
        '.work-progress > i',
        { scaleX: 0 },
        { scaleX: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${distance()}`, scrub: true } },
      )

      // intro title drift
      gsap.to('.work-intro h2', {
        xPercent: -40,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${distance() * 0.5}`, scrub: true },
      })
    })

    mm.add('(max-width: 899px)', () => {
      gsap.utils.toArray<HTMLElement>('.film-card').forEach((card) => {
        gsap.fromTo(card, { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, scrollTrigger: { trigger: card, start: 'top 90%', once: true } })
      })
    })

    ScrollTrigger.refresh()
    return () => mm.revert()
  }, [])

  return (
    <section ref={root} id="work" className="work">
      <div ref={track} className="work-track">
        <div className="work-intro">
          <p className="eyebrow">Selected work</p>
          <h2 className="display">
            Screen
            <br />
            <em>&amp;</em> song
          </h2>
          <p className="work-hint eyebrow">{filmography.length} credits · 2022 — 2026</p>
        </div>

        {filmography.map((f, i) => (
          <article key={f.title} className="film-card" data-cursor={f.href ? 'View' : undefined}>
            <a className="film-link" href={f.href} target={f.href ? '_blank' : undefined} rel="noreferrer">
              <div className="film-media">
                <img src={f.image} alt={`${f.title} — ${f.role}`} loading="lazy" decoding="async" />
                <span className="film-type eyebrow">
                  {f.type}
                  {f.platform ? ` · ${f.platform}` : ''}
                </span>
              </div>
              <div className="film-meta">
                <span className="film-index mono-num">0{i + 1}</span>
                <span className="film-year mono-num eyebrow">{f.year}</span>
                <h3 className="display">{f.title}</h3>
                <p>{f.role}</p>
                <p className="film-director">{f.director}</p>
                {f.note && <p className="film-note eyebrow">{f.note}</p>}
              </div>
            </a>
          </article>
        ))}

        <div className="work-end">
          <p className="eyebrow">Full credits on IMDb</p>
          <a className="work-end-link display italic" href="https://www.imdb.com/name/nm3301582/" target="_blank" rel="noreferrer">
            View all →
          </a>
        </div>
      </div>
      <div className="work-progress">
        <i />
      </div>
    </section>
  )
}
