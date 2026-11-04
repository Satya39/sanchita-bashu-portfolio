import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { navLinks, profile } from '../data/content'

type Props = {
  open: boolean
  onToggle: (open: boolean) => void
  visible: boolean
}

function useClock(timeZone = 'Asia/Kolkata') {
  const [time, setTime] = useState('')
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 10_000)
    return () => clearInterval(id)
  }, [timeZone])
  return time
}

export default function Nav({ open, onToggle, visible }: Props) {
  const overlay = useRef<HTMLDivElement>(null)
  const header = useRef<HTMLElement>(null)
  const time = useClock()
  const first = useRef(true)

  // header slides in once the preloader is gone
  useEffect(() => {
    if (!visible || !header.current) return
    gsap.fromTo(header.current, { y: -24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.2, delay: 0.4 })
  }, [visible])

  useEffect(() => {
    const el = overlay.current
    if (!el) return
    const links = el.querySelectorAll<HTMLElement>('.menu-link > span')
    const meta = el.querySelectorAll<HTMLElement>('.menu-meta > *')
    const reduced = prefersReducedMotion()

    if (first.current) {
      first.current = false
      gsap.set(el, { clipPath: 'inset(0 0 100% 0)', pointerEvents: 'none' })
      gsap.set(links, { yPercent: 120 })
      gsap.set(meta, { autoAlpha: 0 })
      return
    }

    const tl = gsap.timeline()
    if (open) {
      tl.set(el, { pointerEvents: 'auto' })
        .to(el, { clipPath: 'inset(0 0 0% 0)', duration: reduced ? 0 : 1.1, ease: 'expo.inOut' })
        .to(links, { yPercent: 0, duration: 1.1, stagger: 0.06, ease: 'expo.out' }, '-=0.55')
        .to(meta, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, '-=0.7')
    } else {
      tl.to(links, { yPercent: -120, duration: 0.6, stagger: 0.03, ease: 'expo.in' })
        .to(meta, { autoAlpha: 0, duration: 0.3 }, '<')
        .to(el, { clipPath: 'inset(0 0 100% 0)', duration: reduced ? 0 : 0.9, ease: 'expo.inOut' }, '-=0.2')
        .set(el, { pointerEvents: 'none' })
        .set(links, { yPercent: 120 })
    }
    return () => {
      tl.kill()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onToggle(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onToggle])

  return (
    <>
      <header ref={header} className="nav">
        <a href="#top" className="nav-logo display italic" aria-label="Back to top">
          {profile.name}
        </a>
        <div className="nav-right">
          <span className="nav-time eyebrow mono-num">
            {profile.location} {time}
          </span>
          <button
            className={`nav-burger${open ? ' is-open' : ''}`}
            onClick={() => onToggle(!open)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <span className="nav-burger-label eyebrow">{open ? 'Close' : 'Menu'}</span>
            <span className="nav-burger-lines">
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>

      <div ref={overlay} className="menu" aria-hidden={!open}>
        <nav className="menu-links">
          {navLinks.map((l, i) => (
            <a key={l.href} href={l.href} className="menu-link display" onClick={() => onToggle(false)}>
              <span>
                <small className="mono-num">0{i + 1}</small>
                {l.label}
              </span>
            </a>
          ))}
        </nav>
        <div className="menu-meta">
          <div>
            <span className="eyebrow">Collabs &amp; work</span>
            {profile.email ? (
              <a className="link-line" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            ) : (
              <a className="link-line" href={profile.instagram.href} target="_blank" rel="noreferrer">
                {profile.instagram.handle}
              </a>
            )}
          </div>
          <div>
            <span className="eyebrow">Production</span>
            <a className="link-line" href="https://www.instagram.com/archi_films24" target="_blank" rel="noreferrer">
              Archi Films
            </a>
          </div>
          <div>
            <span className="eyebrow">Follow</span>
            <div className="menu-social">
              {profile.social.map((s) => (
                <a key={s.label} className="link-line" href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
