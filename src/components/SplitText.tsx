import { createElement, useEffect, useRef, type ElementType } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'

type Props = {
  text: string
  as?: ElementType
  className?: string
  delay?: number
  stagger?: number
  duration?: number
  /** 'scroll' animates on entering the viewport; 'manual' waits for `play` */
  mode?: 'scroll' | 'manual'
  play?: boolean
  start?: string
}

/**
 * Word-level masked text reveal. Wrap a word in *asterisks* to render it italic.
 */
export default function SplitText({
  text,
  as = 'p',
  className,
  delay = 0,
  stagger = 0.035,
  duration = 1.2,
  mode = 'scroll',
  play = false,
  start = 'top 88%',
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const played = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const targets = el.querySelectorAll<HTMLElement>('.split-word > span')

    if (prefersReducedMotion()) {
      gsap.set(targets, { y: 0 })
      return
    }

    if (mode === 'manual') {
      if (!play || played.current) return
      played.current = true
      const tw = gsap.to(targets, { y: 0, duration, stagger, delay, ease: 'expo.out' })
      return () => {
        tw.kill()
      }
    }

    const tween = gsap.to(targets, { y: 0, duration, stagger, delay, ease: 'expo.out', paused: true })
    const st = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => tween.play(),
    })
    return () => {
      st.kill()
      tween.kill()
    }
  }, [play, mode, delay, stagger, duration, start])

  const words = text.split(' ')
  const children = words.map((raw, i) => {
    const italic = raw.length > 2 && raw.startsWith('*') && raw.endsWith('*')
    const word = italic ? raw.slice(1, -1) : raw
    return (
      <span key={i}>
        <span className={`split-word${italic ? ' italic' : ''}`}>
          <span>{word}</span>
        </span>
        {i < words.length - 1 ? ' ' : null}
      </span>
    )
  })

  return createElement(as, { ref, className, 'aria-label': text }, children)
}
