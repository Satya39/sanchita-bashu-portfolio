import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

gsap.defaults({ ease: 'expo.out', duration: 1.2 })

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isTouch = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: none), (pointer: coarse)').matches

export { gsap, ScrollTrigger }
