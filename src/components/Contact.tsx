import { useEffect, useRef } from 'react'
import { gsap, isTouch, prefersReducedMotion } from '../lib/gsap'
import { profile } from '../data/content'
import SplitText from './SplitText'
import Marquee from './Marquee'

/** Magnetic hover: element leans toward the pointer and springs back. */
function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || isTouch() || prefersReducedMotion()) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' })
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const onLeave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [strength])
  return ref
}

export default function Contact() {
  const btn = useMagnetic<HTMLAnchorElement>(0.3)
  const year = new Date().getFullYear()

  return (
    <footer id="contact" className="contact">
      <div className="section container contact-inner">
        <p className="eyebrow">Get in touch</p>
        <SplitText
          as="h2"
          className="display contact-title"
          text="Let’s make something *unforgettable.*"
          stagger={0.06}
        />

        <div className="contact-row">
          {profile.email ? (
            <a ref={btn} className="contact-cta" href={`mailto:${profile.email}`} data-cursor="Email">
              <span>{profile.email}</span>
            </a>
          ) : (
            <a ref={btn} className="contact-cta" href={profile.instagram.href} target="_blank" rel="noreferrer" data-cursor="Open">
              <span>{profile.instagram.handle}</span>
            </a>
          )}

          <div className="contact-meta">
            <div>
              <span className="eyebrow">Collabs &amp; work</span>
              <p>Brand, film and series enquiries</p>
              <a className="link-line" href={profile.instagram.href} target="_blank" rel="noreferrer">
                DM on Instagram
              </a>
            </div>
            <div>
              <span className="eyebrow">Production</span>
              <p>Founder, Archi Films</p>
              <a className="link-line" href="https://www.instagram.com/archi_films24" target="_blank" rel="noreferrer">
                @archi_films24
              </a>
            </div>
            <div>
              <span className="eyebrow">Follow</span>
              <ul>
                {profile.social.map((s) => (
                  <li key={s.label}>
                    <a className="link-line" href={s.href} target="_blank" rel="noreferrer">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Marquee items={['Film', 'Series', 'Music videos', 'Brand films', 'Live events']} className="contact-marquee" />

      <div className="footer container">
        <span className="eyebrow">
          © {year} {profile.name}
        </span>
        <span className="eyebrow">{profile.location}</span>
        <a href="#top" className="eyebrow link-line">
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}
