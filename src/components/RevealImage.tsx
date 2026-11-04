import { useEffect, useRef, type CSSProperties } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'

type Props = {
  src: string
  alt: string
  className?: string
  style?: CSSProperties
  /** vertical parallax travel in percent (0 disables) */
  parallax?: number
  sizes?: string
  loading?: 'lazy' | 'eager'
  onClick?: () => void
}

/**
 * Image that un-masks from the top with a slow settle-zoom when scrolled into view,
 * with optional scrub-driven parallax afterwards.
 */
export default function RevealImage({
  src,
  alt,
  className = '',
  style,
  parallax = 0,
  sizes,
  loading = 'lazy',
  onClick,
}: Props) {
  const wrap = useRef<HTMLDivElement>(null)
  const img = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const el = wrap.current
    const im = img.current
    if (!el || !im) return
    if (prefersReducedMotion()) return

    const finalScale = parallax ? 1.18 : 1
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })
      tl.to(el, { clipPath: 'inset(0 0 0% 0)', duration: 1.5, ease: 'expo.inOut' }, 0)
        .fromTo(im, { scale: 1.3 }, { scale: finalScale, duration: 1.9, ease: 'expo.out' }, 0.1)

      if (parallax) {
        gsap.fromTo(
          im,
          { yPercent: -parallax },
          {
            yPercent: parallax,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      }
    }, el)

    return () => ctx.revert()
  }, [parallax])

  useEffect(() => {
    // image dimensions can shift layout once loaded
    const im = img.current
    if (!im) return
    const refresh = () => ScrollTrigger.refresh()
    if (im.complete) return
    im.addEventListener('load', refresh, { once: true })
    return () => im.removeEventListener('load', refresh)
  }, [])

  return (
    <div ref={wrap} className={`reveal-img ${className}`} style={style} onClick={onClick}>
      <img ref={img} src={src} alt={alt} sizes={sizes} loading={loading} decoding="async" draggable={false} />
    </div>
  )
}
