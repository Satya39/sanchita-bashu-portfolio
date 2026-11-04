import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { showreel } from '../data/content'

/**
 * Showreel frame that grows from a letterboxed inset to full width as you scroll,
 * autoplays muted, and switches to sound on click.
 */
export default function Showreel() {
  const root = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.reel-frame',
        { clipPath: 'inset(12% 22% 12% 22% round 4px)', scale: 0.96 },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0px)',
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 10%', scrub: true },
        },
      )
      gsap.fromTo(
        '.reel-title',
        { yPercent: 40 },
        { yPercent: -40, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
    }, el)
    return () => ctx.revert()
  }, [])

  const toggle = async () => {
    const v = video.current
    if (!v) return
    if (!playing) {
      v.muted = false
      v.currentTime = 0
      try {
        await v.play()
      } catch {
        /* autoplay with sound blocked — user gesture already present, ignore */
      }
      setPlaying(true)
    } else {
      v.muted = true
      setPlaying(false)
    }
  }

  return (
    <section ref={root} id="showreel" className="section reel">
      <h2 className="reel-title display" aria-hidden>
        Show<em>reel</em>
      </h2>
      <div className="reel-frame" data-cursor={playing ? 'Mute' : 'Play'} onClick={toggle}>
        <video ref={video} src={showreel.src} poster={showreel.poster} muted loop playsInline autoPlay preload="metadata" />
        <div className={`reel-overlay${playing ? ' is-playing' : ''}`}>
          <span className="reel-play">
            <i />
          </span>
          <span className="eyebrow">
            {showreel.caption} · {showreel.duration}
          </span>
        </div>
      </div>
      <div className="reel-caption container">
        <p className="eyebrow">Selected scenes · {showreel.caption}</p>
        <p className="eyebrow">Click to play with sound</p>
      </div>
    </section>
  )
}
