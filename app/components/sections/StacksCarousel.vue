<script setup lang="ts">
import { computed } from 'vue'
import { me } from '~/data/me'
import { Badge } from '~/components/ui/badge'

const iconMap: Record<string, string> = {
  'javascript': '/icons/stacks/javascript.svg',
  'typescript': '/icons/stacks/typescript.svg',
  'vue.js': '/icons/stacks/vue.svg',
  'vue': '/icons/stacks/vue.svg',
  'nuxt.js': '/icons/stacks/nuxt.svg',
  'nuxt': '/icons/stacks/nuxt.svg',
  'node.js': '/icons/stacks/nodejs.svg',
  'node': '/icons/stacks/nodejs.svg',
  'docker': '/icons/stacks/docker.svg',
  'git': '/icons/stacks/git.svg',
  'nosql': '/icons/stacks/mongodb.svg',
  'mongodb': '/icons/stacks/mongodb.svg',
  'kotlin': '/icons/stacks/kotlin.svg'
}

const stackItems = computed(() =>
  me.stack.map((name) => ({
    name,
    icon: iconMap[name.toLowerCase()] ?? undefined
  }))
)

// Repete a sequência dentro de cada metade para garantir preenchimento contínuo em qualquer resolução
const halfTrackItems = computed(() => [
  ...stackItems.value,
  ...stackItems.value
])
</script>

<template>
  <div
    class="relative w-full overflow-hidden py-6 md:pl-20"
    aria-label="Linguagens e Tecnologias"
  >
    <div
      class="relative mx-auto flex w-full max-w-6xl items-center overflow-hidden"
      style="-webkit-mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%); mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);"
    >
      <!-- Trilho duplicado (2 metades idênticas) que desliza de 0 a -50% continuamente da direita para a esquerda -->
      <div class="animate-stacks-marquee flex w-max items-center will-change-transform">
        <div
          v-for="groupIndex in 2"
          :key="groupIndex"
          class="flex shrink-0 items-center gap-4 pr-4 sm:gap-6 sm:pr-6"
          :aria-hidden="groupIndex === 2 ? 'true' : undefined"
        >
          <Badge
            v-for="(item, idx) in halfTrackItems"
            :key="`${groupIndex}-${idx}-${item.name}`"
            as="div"
            variant="default"
            class="shrink-0 gap-3 rounded-full border-black/15 bg-[#FFFFFF]/85 px-5 py-2.5 shadow-sm backdrop-blur-md dark:border-white/15 dark:bg-[#0A0A0A]/85"
          >
            <img
              v-if="item.icon"
              :src="item.icon"
              :alt="item.name"
              class="h-5 w-5 shrink-0 object-contain"
              loading="lazy"
            />
            <span
              v-else
              class="h-2 w-2 shrink-0 rounded-full bg-[#FE5101]"
            />
            <span class="text-sm font-semibold tracking-wide text-[#000000] sm:text-base dark:text-[#FFFFFF]">
              {{ item.name }}
            </span>
          </Badge>
        </div>
      </div>
    </div>
  </div>
</template>
