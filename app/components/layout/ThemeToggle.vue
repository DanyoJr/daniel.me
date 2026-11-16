<script setup lang="ts">
import { Motion } from 'motion-v'
import { useTheme } from '~/composables/useTheme'
import { Card } from '~/components/ui/card'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <Motion
    :while-hover="{ scale: 1.07 }"
    :while-tap="{ scale: 0.94 }"
  >
    <Card
      as="button"
      type="button"
      :interactive="true"
      rounded="rounded-3xl"
      class-name="flex h-[52px] w-[52px] sm:h-[60px] sm:w-[60px] md:h-12 md:w-12 items-center justify-center text-[#000000] dark:text-[#FFFFFF]"
      :aria-label="isDark ? 'Ativar modo claro' : 'Ativar modo escuro'"
      :title="isDark ? 'Mudar para Light Mode' : 'Mudar para Dark Mode'"
      @click="toggleTheme"
    >
      <div class="flex h-full w-full items-center justify-center">
        <!-- Ícone Sol (visível no Dark Mode para alternar para claro) -->
        <svg
          v-if="isDark"
          class="h-5 w-5 text-[#FE5101] transition-transform duration-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>

        <!-- Ícone Lua (visível no Light Mode para alternar para escuro) -->
        <svg
          v-else
          class="h-5 w-5 text-[#000000] transition-transform duration-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </div>
    </Card>
  </Motion>
</template>
