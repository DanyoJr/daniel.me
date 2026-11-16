import { onMounted, watch } from 'vue'
import { useState } from '#imports'

export type DockPosition = 'left' | 'top'
export type DockBehavior = 'fixed' | 'reactive'

export function useDockSettings() {
  const position = useState<DockPosition>('dock-position', () => 'left')
  const behavior = useState<DockBehavior>('dock-behavior', () => 'fixed')

  onMounted(() => {
    const savedPos = localStorage.getItem('daniel-me-dock-pos') as DockPosition | null
    const savedBehavior = localStorage.getItem('daniel-me-dock-behavior') as DockBehavior | null

    if (savedPos === 'left' || savedPos === 'top') {
      position.value = savedPos
    }
    if (savedBehavior === 'fixed' || savedBehavior === 'reactive') {
      behavior.value = savedBehavior
    }
  })

  watch(position, (val) => {
    if (import.meta.client) {
      localStorage.setItem('daniel-me-dock-pos', val)
    }
  })

  watch(behavior, (val) => {
    if (import.meta.client) {
      localStorage.setItem('daniel-me-dock-behavior', val)
    }
  })

  const setPosition = (pos: DockPosition) => {
    position.value = pos
  }

  const setBehavior = (beh: DockBehavior) => {
    behavior.value = beh
  }

  return {
    position,
    behavior,
    setPosition,
    setBehavior
  }
}
