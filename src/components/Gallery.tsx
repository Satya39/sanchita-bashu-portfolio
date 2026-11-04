import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'
import { gallery } from '../data/content'
import RevealImage from './RevealImage'
import SplitText from './SplitText'

type Props = { onLock: (locked: boolean) => void }

export default function Gallery({ onLock }: Props) {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState<number | null>(null)

  // columns scroll at different speeds
  useEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 720px)', () => {
      // columns start aligned and drift apart as the section scrolls through
      const speeds = [-12, 8, -5]
      el.querySelectorAll<HTMLElement>('.gallery-col').forEach((col, i) => {
        gsap.fromTo(
          col,
          { yPercent: 0 },
          { yPercent: speeds[i], ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
        )
      })
    })
    ScrollTrigger.refresh()
    return () => mm.revert()
  }, [])

  const close = useCallback(() => setActive(null), [])
  const step = useCallback((d: number) => {
    setActive((a) => (a === null ? a : (a + d + gallery.length) % gallery.length))
  }, [])

  useEffect(() => {
    onLock(active !== null)
    if (active === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, close, step, onLock])

  const cols: number[][] = [[], [], []]
  gallery.forEach((_, i) => cols[i % 3].push(i))

  return (
    <section ref={root} id="gallery" className="section gallery container">
      <div className="section-head">
        <SplitText as="h2" className="display" text="Gallery" />
        <p className="eyebrow">{gallery.length} frames · editorial &amp; stills</p>
      </div>

      <div className="gallery-grid">
        {cols.map((col, ci) => (
          <div key={ci} className="gallery-col">
            {col.map((i) => {
              const g = gallery[i]
              return (
                <figure key={g.src} className="gallery-item" data-cursor="View" onClick={() => setActive(i)}>
                  <RevealImage src={g.src} alt={g.alt} style={{ aspectRatio: g.ratio }} />
                  <figcaption className="eyebrow">
                    <span className="mono-num">0{i + 1}</span>
                    <span className={/[\u0900-\u097F]/.test(g.alt) ? 'devanagari' : undefined}>{g.alt}</span>
                  </figcaption>
                </figure>
              )
            })}
          </div>
        ))}
      </div>

      {active !== null && <Lightbox index={active} onClose={close} onStep={step} />}
    </section>
  )
}

function Lightbox({ index, onClose, onStep }: { index: number; onClose: () => void; onStep: (d: number) => void }) {
  const root = useRef<HTMLDivElement>(null)
  const img = useRef<HTMLImageElement>(null)
  const g = gallery[index]

  useEffect(() => {
    const el = root.current
    if (!el) return
    const tl = gsap.timeline()
    tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: 'power2.out' }).fromTo(
      '.lightbox-figure',
      { scale: 0.92, y: 30, autoAlpha: 0 },
      { scale: 1, y: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out' },
      0.1,
    )
    return () => {
      tl.kill()
    }
  }, [])

  // crossfade between images
  useEffect(() => {
    if (!img.current) return
    gsap.fromTo(img.current, { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'expo.out' })
  }, [index])

  return (
    <div ref={root} className="lightbox" role="dialog" aria-modal aria-label={g.alt} data-lenis-prevent>
      <button className="lightbox-bg" onClick={onClose} aria-label="Close" />
      <figure className="lightbox-figure">
        <img ref={img} src={g.src} alt={g.alt} style={{ aspectRatio: g.ratio }} />
        <figcaption>
          <span className="eyebrow mono-num">
            {String(index + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}
          </span>
          <span>{g.alt}</span>
        </figcaption>
      </figure>
      <button className="lightbox-nav prev" onClick={() => onStep(-1)} aria-label="Previous" data-cursor="Prev" />
      <button className="lightbox-nav next" onClick={() => onStep(1)} aria-label="Next" data-cursor="Next" />
      <button className="lightbox-close eyebrow" onClick={onClose}>
        Close
      </button>
    </div>
  )
}
