<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Motion } from 'motion-v'
import { Badge } from '~/components/ui/badge'
import { Card } from '~/components/ui/card'

const targetPhrases = [
  'EM DESENVOLVIMENTO',
  'ARTIGOS & TECH BLOG EM BREVE',
  'COMPILING NEW POSTS...'
]

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>[]{}'
const displayedText = ref('EM DESENVOLVIMENTO')
const displayedSubtitle = ref('Estamos preparando conteúdos sobre Full Stack, Nuxt, Vue, TypeScript e MongoDB.')
const currentPhraseIndex = ref(0)

let scrambleTimer: ReturnType<typeof setInterval> | null = null
let cycleTimer: ReturnType<typeof setInterval> | null = null

function runScramble(newText: string) {
  if (scrambleTimer) clearInterval(scrambleTimer)
  let iteration = 0

  scrambleTimer = setInterval(() => {
    displayedText.value = newText
      .split('')
      .map((letter, idx) => {
        if (letter === ' ') return ' '
        if (idx < iteration) {
          return newText[idx]
        }
        return chars[Math.floor(Math.random() * chars.length)]
      })
      .join('')

    if (iteration >= newText.length) {
      if (scrambleTimer) clearInterval(scrambleTimer)
    }

    iteration += 1 / 2.5
  }, 32)
}

function triggerNextScramble() {
  currentPhraseIndex.value = (currentPhraseIndex.value + 1) % targetPhrases.length
  runScramble(targetPhrases[currentPhraseIndex.value]!)
}

onMounted(() => {
  runScramble(targetPhrases[0]!)
  cycleTimer = setInterval(() => {
    triggerNextScramble()
  }, 4500)
})

onUnmounted(() => {
  if (scrambleTimer) clearInterval(scrambleTimer)
  if (cycleTimer) clearInterval(cycleTimer)
})
</script>

<template>
  <section
    class="relative flex min-h-screen w-full items-center justify-center px-4 py-24 sm:px-8 md:pl-24"
    aria-label="Blog em desenvolvimento"
  >
    <Motion
      class="w-full max-w-2xl"
      :initial="{ opacity: 0, scale: 0.94, y: 20 }"
      :animate="{ opacity: 1, scale: 1, y: 0 }"
      :transition="{ duration: 0.6, ease: 'easeOut' }"
    >
      <Card
        :interactive="true"
        rounded="rounded-3xl"
        class-name="p-8 sm:p-14 text-center"
        @mouseenter=" runScramble(targetPhrases[currentPhraseIndex]!) "
      >
        <Badge
          variant="purple"
          class="mx-auto mb-5 gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
        >
          <span class="h-2 w-2 animate-pulse rounded-full bg-[#FE5101]" />
          Blog Status
        </Badge>

        <!-- Scramble Text Central -->
        <h1
          class="font-mono text-2xl font-extrabold tracking-wider text-[#000000] sm:text-4xl md:text-5xl dark:text-[#FFFFFF] select-all"
        >
          {{ displayedText }}
        </h1>

        <p class="mx-auto mt-4 max-w-md text-sm leading-relaxed text-black/65 sm:text-base dark:text-white/65">
          {{ displayedSubtitle }}
        </p>

        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Motion :while-hover="{ scale: 1.05 }" :while-tap="{ scale: 0.95 }">
            <NuxtLink to="/">
              <Card
                as="span"
                tint="purple"
                :interactive="true"
                rounded="rounded-full"
                class-name="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-[#FFFFFF]"
              >
                ← Voltar para Home
              </Card>
            </NuxtLink>
          </Motion>
        </div>
      </Card>
    </Motion>
  </section>
</template>
