'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'

declare global {
  interface Window {
    RoughNotation?: {
      annotate: (
        el: HTMLElement,
        config: {
          type: 'underline' | 'box' | 'circle' | 'highlight' | 'bracket'
          color?: string
          strokeWidth?: number
          padding?: number | number[]
          multiline?: boolean
          iterations?: number
          animationDuration?: number
        }
      ) => { show: () => void; remove: () => void }
      annotationGroup: (items: Array<{ show: () => void }>) => { show: () => void }
    }
  }
}

export default function AuraAmbientField() {
  const pathname = usePathname()

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const halo = document.getElementById('aura-subpage-halo')

    const handlePointerMove = (e: PointerEvent) => {
      if (halo) {
        const x = (e.clientX / window.innerWidth) * 100
        const y = (e.clientY / window.innerHeight) * 100
        halo.style.setProperty('--aura-spot-x', `${x.toFixed(1)}%`)
        halo.style.setProperty('--aura-spot-y', `${y.toFixed(1)}%`)
      }

      const target = e.target as HTMLElement | null
      const card = target?.closest?.('.aura-spotlight-card') as HTMLElement | null
      if (card) {
        const rect = card.getBoundingClientRect()
        card.style.setProperty('--aura-card-x', `${(e.clientX - rect.left).toFixed(0)}px`)
        card.style.setProperty('--aura-card-y', `${(e.clientY - rect.top).toFixed(0)}px`)
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const created: Array<{ remove: () => void }> = []

    const applyAnnotations = () => {
      if (!window.RoughNotation) return
      const nodes = document.querySelectorAll<HTMLElement>('[data-rough]')
      const toShow: Array<{ show: () => void }> = []

      nodes.forEach((node) => {
        if (node.dataset.roughMounted === '1') return
        node.dataset.roughMounted = '1'
        const kind = (node.dataset.rough as 'underline' | 'highlight' | 'box') || 'underline'
        const ann = window.RoughNotation!.annotate(node, {
          type: kind,
          color: kind === 'highlight' ? 'rgba(193, 135, 75, 0.20)' : '#c1874b',
          strokeWidth: kind === 'box' ? 1.5 : 2,
          padding: kind === 'box' ? [2, 6] : 2,
          multiline: true,
          iterations: kind === 'highlight' ? 1 : 2,
          animationDuration: 720,
        })
        created.push(ann)
        toShow.push(ann)
      })

      if (toShow.length > 0) {
        window.RoughNotation.annotationGroup(toShow).show()
      }
    }

    const timer = window.setTimeout(applyAnnotations, 240)
    window.addEventListener('aura-rough-ready', applyAnnotations)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('aura-rough-ready', applyAnnotations)
      created.forEach((a) => {
        try {
          a.remove()
        } catch {
          // ignore cleanup errors
        }
      })
      document.querySelectorAll<HTMLElement>('[data-rough-mounted]').forEach((el) => {
        delete el.dataset.roughMounted
      })
    }
  }, [pathname])

  return (
    <>
      <Script
        src="/resume/vendor/rough-notation.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.dispatchEvent(new Event('aura-rough-ready'))
        }}
      />
      <div className="aura-ambient-stage" aria-hidden="true">
        <div className="aura-ambient-grid" />
        <div className="aura-subpage-halo" id="aura-subpage-halo" />
        <div className="aura-dust-amber" />
      </div>
    </>
  )
}
