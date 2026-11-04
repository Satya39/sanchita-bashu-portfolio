import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'

/**
 * Smooth scroll via Lenis, driven by GSAP's ticker so ScrollTrigger
 * and the scroll position are always in sync (no jitter).
 */
export function useLenis(enabled: boolean) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // anchor links scroll via lenis
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const id = a.getAttribute('href')
      if (!id || id === '#') return
      const el = document.querySelector(id)
      if (!el) return
      e.preventDefault()
      lenis.scrollTo(el as HTMLElement, { offset: 0, duration: 1.6 })
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    const lenis = lenisRef.current
    if (!lenis) return
    if (enabled) lenis.start()
    else lenis.stop()
  }, [enabled])

  return lenisRef
}
