import { useCallback, useEffect, useState } from 'react'
import './styles/components.css'
import './styles/sections.css'
import { ScrollTrigger } from './lib/gsap'
import { useLenis } from './hooks/useLenis'
import { profile } from './data/content'
import AmbientBackground from './components/AmbientBackground'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import FilmStrip from './components/FilmStrip'
import Journey from './components/Journey'
import Spotlight from './components/Spotlight'
import Filmography from './components/Filmography'
import Gallery from './components/Gallery'
import Showreel from './components/Showreel'
import Facts from './components/Facts'
import Press from './components/Press'
import Contact from './components/Contact'

export default function App() {
  const [revealed, setRevealed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [lightbox, setLightbox] = useState(false)

  const onReveal = useCallback(() => setRevealed(true), [])
  const onDone = useCallback(() => setLoaded(true), [])

  useLenis(loaded && !menuOpen && !lightbox)

  // lock native scroll during preloader; refresh triggers once layout settles
  useEffect(() => {
    document.documentElement.style.overflow = loaded ? '' : 'hidden'
    if (loaded) ScrollTrigger.refresh()
  }, [loaded])

  return (
    <>
      <AmbientBackground />
      <Cursor />
      {!loaded && <Preloader onReveal={onReveal} onDone={onDone} />}
      <Nav open={menuOpen} onToggle={setMenuOpen} visible={revealed} />

      <main>
        <Hero start={revealed} />
        <Marquee items={[profile.name, profile.nameDevanagari, 'Thukra Ke Mera Pyaar', 'JioHotstar', 'Archi Films']} className="hero-marquee" />
        <About />
        <FilmStrip />
        <Journey />
        <Spotlight />
        <Filmography />
        <Gallery onLock={setLightbox} />
        <Showreel />
        <Facts />
        <Press />
      </main>
      <Contact />

      <div className="grain" aria-hidden />
    </>
  )
}
