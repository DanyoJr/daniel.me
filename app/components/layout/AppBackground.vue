<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  dotColor?: string
  dotSize?: number
  dotSpacing?: number
  orbitSpeed?: number
  impactRadius?: number
  scaleOnHover?: number
  enableRevolve?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  dotColor: 'var(--bg-dot-color, #FE5101)',
  dotSize: 3,
  dotSpacing: 28,
  orbitSpeed: 1.5,
  impactRadius: 100,
  scaleOnHover: 1.8,
  enableRevolve: true
})

interface DotItem {
  bx: number
  by: number
  inclination: number
  ascension: number
  phase: number
  speedMult: number
}

const canvasRef = ref<HTMLCanvasElement | null>(null)

function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t))
  return c * c * (3 - 2 * c)
}

function resolveVar(raw: string, el: HTMLElement): string {
  const s = raw.trim()
  if (!s.startsWith('var(')) return s
  const inner = s.slice(4, -1).trim()
  const commaIdx = inner.indexOf(',')
  const varName = (commaIdx !== -1 ? inner.slice(0, commaIdx) : inner).trim()
  const fallback = commaIdx !== -1 ? inner.slice(commaIdx + 1).trim() : ''
  try {
    const resolved = getComputedStyle(el).getPropertyValue(varName).trim()
    if (resolved) return resolved
  } catch {
    // ignore
  }
  if (fallback) return resolveVar(fallback, el)
  return '#888888'
}

function parseColor(raw: string, el: HTMLElement): { r: number; g: number; b: number } {
  const color = resolveVar(raw, el)
  if (color.startsWith('rgb')) {
    const m = color.match(/[\d.]+/g) || []
    return {
      r: Number(m[0]) || 0,
      g: Number(m[1]) || 0,
      b: Number(m[2]) || 0
    }
  }
  let h = color.replace('#', '')
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('')
  }
  const n = parseInt(h.slice(0, 6), 16)
  if (Number.isNaN(n)) return { r: 136, g: 136, b: 136 }
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255
  }
}

let raf = 0
let ro: ResizeObserver | null = null
let removeListeners: (() => void) | null = null

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  let W = 0
  let H = 0
  const mouse = { x: -9999, y: -9999 }
  let hovering = false
  let leaveTs = 0
  let prevTs = 0
  let globalAngle = 0
  let dots: DotItem[] = []
  let spacingSnap = props.dotSpacing

  function buildDots() {
    const sp = props.dotSpacing
    spacingSnap = sp
    dots = []
    const cols = Math.ceil(W / sp) + 2
    const rows = Math.ceil(H / sp) + 2
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({
          bx: c * sp,
          by: r * sp,
          inclination: Math.random() * Math.PI,
          ascension: Math.random() * Math.PI * 2,
          phase: Math.random() * Math.PI * 2,
          speedMult: 0.7 + Math.random() * 0.6
        })
      }
    }
  }

  function resize() {
    if (!canvas || !ctx) return
    const rect = canvas.getBoundingClientRect()
    W = rect.width
    H = rect.height
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    buildDots()
  }

  ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  const onMouseMove = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect()
    mouse.x = e.clientX - rect.left
    mouse.y = e.clientY - rect.top
    hovering = true
  }

  const onMouseLeave = () => {
    mouse.x = -9999
    mouse.y = -9999
    hovering = false
    leaveTs = performance.now()
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true })
  document.addEventListener('mouseleave', onMouseLeave)

  removeListeners = () => {
    window.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseleave', onMouseLeave)
  }

  function loop(ts: number) {
    raf = requestAnimationFrame(loop)
    if (!canvas || !ctx) return

    const dt = Math.min((ts - (prevTs || ts)) / 1000, 0.05)
    prevTs = ts

    if (spacingSnap !== props.dotSpacing) buildDots()
    globalAngle += props.orbitSpeed * dt

    ctx.clearRect(0, 0, W, H)
    const rgb = parseColor(props.dotColor, canvas)
    const mx = mouse.x
    const my = mouse.y
    const timeSinceLeave = hovering ? 0 : Math.max(0, ts - leaveTs) / 1000
    const decay = hovering ? 1 : smoothstep(Math.max(0, 1 - timeSinceLeave * 1.5))

    for (const d of dots) {
      const dx = d.bx - mx
      const dy = d.by - my
      const dist = Math.sqrt(dx * dx + dy * dy)
      const inRange = dist < props.impactRadius && dist > 0

      let x = d.bx
      let y = d.by
      let scale = 1
      let alpha = 0.3

      if (inRange) {
        const t = dist / props.impactRadius
        const inf = smoothstep(1 - t) * decay

        if (props.enableRevolve) {
          const orbitR = (1 - t) * props.dotSpacing * 0.7 * inf
          const theta = globalAngle * d.speedMult + d.phase

          const cosA = Math.cos(d.ascension)
          const sinA = Math.sin(d.ascension)
          const cosI = Math.cos(d.inclination)
          const sinI = Math.sin(d.inclination)

          const lx = Math.cos(theta)
          const ly = Math.sin(theta) * cosI
          const lz = Math.sin(theta) * sinI

          const ox = (lx * cosA - ly * sinA) * orbitR
          const oy = (lx * sinA + ly * cosA) * orbitR

          x = d.bx + ox
          y = d.by + oy

          const depthScale = 0.75 + 0.25 * ((lz + 1) * 0.5)
          scale = (1 + (props.scaleOnHover - 1) * inf) * depthScale
          alpha = (0.3 + 0.7 * inf) * depthScale
        } else {
          scale = 1 + (props.scaleOnHover - 1) * inf
          alpha = 0.3 + 0.7 * inf
        }
      }

      const r = (props.dotSize / 2) * scale
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`
      ctx.fill()
    }
  }

  raf = requestAnimationFrame(loop)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  ro?.disconnect()
  removeListeners?.()
})
</script>

<template>
  <div class="fixed inset-0 -z-10 overflow-hidden bg-[#FFFFFF] dark:bg-[#000000] transition-colors duration-500">
    <!-- Filtro SVG global para refração Liquid Glass -->
    <svg class="hidden" aria-hidden="true">
      <defs>
        <filter id="liquid-glass-refraction" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015"
            numOctaves="2"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="12"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>

    <!-- Componente Dot-Grid-BG portado fielmente do Framer (Dot-Grid-BG-GVxaLr.js) -->
    <canvas
      ref="canvasRef"
      class="block h-full w-full"
    />
  </div>
</template>
