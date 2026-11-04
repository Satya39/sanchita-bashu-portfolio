import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { gsap, prefersReducedMotion } from '../lib/gsap'

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const fragment = /* glsl */ `
  precision highp float;
  uniform sampler2D uTex;
  uniform vec2 uRes;
  uniform vec2 uImgRes;
  uniform vec2 uMouse;
  uniform float uVelocity;
  uniform float uTime;
  uniform float uIntro;
  varying vec2 vUv;

  // object-fit: cover
  vec2 cover(vec2 uv, vec2 res, vec2 img) {
    float ra = res.x / res.y;
    float ia = img.x / img.y;
    vec2 s = ra > ia ? vec2(1.0, ia / ra) : vec2(ra / ia, 1.0);
    return (uv - 0.5) * s + 0.5;
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    // intro settle-zoom
    float zoom = 1.0 + (1.0 - uIntro) * 0.35;
    vec2 zuv = (vUv - 0.5) / zoom + 0.5;
    vec2 uv = cover(zuv, uRes, uImgRes);

    // pointer-driven liquid displacement
    vec2 aspect = vec2(uRes.x / uRes.y, 1.0);
    vec2 d = (vUv - uMouse) * aspect;
    float dist = length(d);
    float influence = smoothstep(0.42, 0.0, dist) * uVelocity;
    vec2 dir = d / max(dist, 0.0001);
    float ripple = sin(dist * 28.0 - uTime * 4.0) * 0.5 + 0.5;
    vec2 disp = dir * influence * (0.06 + ripple * 0.03);

    vec2 fuv = uv - disp;
    float shift = influence * 0.014;
    float r = texture2D(uTex, fuv + vec2(shift, 0.0)).r;
    float g = texture2D(uTex, fuv).g;
    float b = texture2D(uTex, fuv - vec2(shift, 0.0)).b;
    vec3 col = vec3(r, g, b);

    // soft vignette + animated grain
    float vig = smoothstep(1.0, 0.3, length((vUv - 0.5) * vec2(1.0, 1.15)));
    col *= mix(0.78, 1.0, vig);
    col += (hash(vUv * uRes + fract(uTime)) - 0.5) * 0.045;

    gl_FragColor = vec4(col, 1.0);
  }
`

type Props = {
  src: string
  /** when true, plays the settle-zoom intro */
  intro: boolean
  className?: string
}

/**
 * Full-bleed WebGL portrait. Falls back to a plain <img> if the texture
 * cannot be loaded (e.g. CORS) or WebGL is unavailable.
 */
export default function HeroCanvas({ src, intro, className = '' }: Props) {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const uniformsRef = useRef<Record<string, THREE.IUniform> | null>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const el = wrap.current
    const cv = canvas.current
    if (!el || !cv) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: false, alpha: false, powerPreference: 'high-performance' })
    } catch {
      setFailed(true)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const uniforms: Record<string, THREE.IUniform> = {
      uTex: { value: null },
      uRes: { value: new THREE.Vector2(1, 1) },
      uImgRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uVelocity: { value: 0 },
      uTime: { value: 0 },
      uIntro: { value: prefersReducedMotion() ? 1 : 0 },
    }
    uniformsRef.current = uniforms
    const material = new THREE.ShaderMaterial({ uniforms, vertexShader: vertex, fragmentShader: fragment })
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    scene.add(mesh)

    const loader = new THREE.TextureLoader()
    loader.setCrossOrigin('anonymous')
    let disposed = false
    loader.load(
      src,
      (tex) => {
        if (disposed) return
        tex.colorSpace = THREE.NoColorSpace
        tex.minFilter = THREE.LinearFilter
        tex.generateMipmaps = false
        uniforms.uTex.value = tex
        uniforms.uImgRes.value.set(tex.image.width, tex.image.height)
        setReady(true)
      },
      undefined,
      () => setFailed(true),
    )

    const resize = () => {
      const { width, height } = el.getBoundingClientRect()
      if (!width || !height) return
      renderer.setSize(width, height, false)
      uniforms.uRes.value.set(width, height)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    // pointer tracking (in normalized canvas space, y up)
    const target = new THREE.Vector2(0.5, 0.5)
    const last = new THREE.Vector2(0.5, 0.5)
    let velTarget = 0
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = 1 - (e.clientY - r.top) / r.height
      // allow influence from slightly outside the element so edges still react
      const dx = x - last.x
      const dy = y - last.y
      velTarget = Math.min(1.4, velTarget + Math.hypot(dx, dy) * 7)
      last.set(x, y)
      target.set(x, y)
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let visible = true
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    io.observe(el)

    const mouse = uniforms.uMouse.value as THREE.Vector2
    const tick = (time: number) => {
      if (!visible || !uniforms.uTex.value) return
      mouse.lerp(target, 0.09)
      velTarget *= 0.9
      uniforms.uVelocity.value += (velTarget - uniforms.uVelocity.value) * 0.12
      uniforms.uTime.value = time
      renderer.render(scene, camera)
    }
    gsap.ticker.add(tick)

    return () => {
      disposed = true
      gsap.ticker.remove(tick)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      ;(uniforms.uTex.value as THREE.Texture | null)?.dispose()
      material.dispose()
      mesh.geometry.dispose()
      renderer.dispose()
      uniformsRef.current = null
    }
  }, [src])

  useEffect(() => {
    const u = uniformsRef.current
    if (!intro || !u || prefersReducedMotion()) return
    const tw = gsap.to(u.uIntro, { value: 1, duration: 2.4, ease: 'expo.out' })
    return () => {
      tw.kill()
    }
  }, [intro, ready])

  return (
    <div ref={wrap} className={`hero-canvas ${className}`}>
      <img src={src} alt="" aria-hidden className="hero-canvas-fallback" style={{ opacity: ready && !failed ? 0 : 1 }} />
      <canvas ref={canvas} style={{ opacity: ready && !failed ? 1 : 0 }} />
    </div>
  )
}
