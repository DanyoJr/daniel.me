import { onMounted, watch } from 'vue'
import { useState } from '#imports'

export function useTheme() {
  const isDark = useState<boolean>('theme-dark', () => true)

  const applyTheme = (dark: boolean) => {
    if (import.meta.client) {
      const root = document.documentElement
      if (dark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
      localStorage.setItem('daniel-me-theme', dark ? 'dark' : 'light')
    }
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme(isDark.value)
  }

  onMounted(() => {
    const saved = localStorage.getItem('daniel-me-theme')
    if (saved === 'light') {
      isDark.value = false
    } else if (saved === 'dark') {
      isDark.value = true
    }
    applyTheme(isDark.value)
  })

  watch(isDark, (val) => {
    applyTheme(val)
  })

  return {
    isDark,
    toggleTheme
  }
}
