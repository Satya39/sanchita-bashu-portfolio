import { useEffect, useRef } from 'react'
import { gsap, isTouch } from '../lib/gsap'

/**
 * Custom cursor: a small dot that lerps behind the pointer, expands over links,
 * and turns into a labelled disc over elements carrying data-cursor="Label".
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = dot.current
    const lab = label.current
    if (!el || !lab || isTouch()) return

    document.body.classList.add('has-cursor')

    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' })

    let shown = false
    const onMove = (e: MouseEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
      if (!shown) {
        shown = true
        gsap.to(el, { autoAlpha: 1, duration: 0.3 })
      }
    }

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      const labelled = t.closest<HTMLElement>('[data-cursor]')
      if (labelled) {
        lab.textContent = labelled.dataset.cursor ?? ''
        el.classList.add('is-label')
        el.classList.remove('is-link')
        return
      }
      if (t.closest('a, button, [role="button"]')) {
        el.classList.add('is-link')
        el.classList.remove('is-label')
        return
      }
      el.classList.remove('is-link', 'is-label')
    }

    const onDown = () => el.classList.add('is-down')
    const onUp = () => el.classList.remove('is-down')
    const onLeave = () => gsap.to(el, { autoAlpha: 0, duration: 0.3 })
    const onEnter = () => gsap.to(el, { autoAlpha: 1, duration: 0.3 })

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)

    return () => {
      document.body.classList.remove('has-cursor')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
    }
  }, [])

  return (
    <div ref={dot} className="cursor" aria-hidden>
      <span ref={label} className="cursor-label" />
    </div>
  )
}
