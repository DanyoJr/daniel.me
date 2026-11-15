<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { me } from '~/data/me'
import LiquidGlass from '~/components/glass/LiquidGlass.vue'

const stacks = me.stacksDetailed
const sectionRef = ref<HTMLElement | null>(null)
const scrollProgress = ref(0)
const viewportWidth = ref(1200)

function updateScroll() {
  if (!sectionRef.value) return
  const rect = sectionRef.value.getBoundingClientRect()
  const scrollableDistance = rect.height - window.innerHeight
  if (scrollableDistance <= 0) {
    scrollProgress.value = 0
    return
  }
  const raw = -rect.top / scrollableDistance
  scrollProgress.value = Math.min(1, Math.max(0, raw))
}

function updateViewport() {
  viewportWidth.value = window.innerWidth
  updateScroll()
}

// Índice contínuo de 0 até (stacks.length - 1) conforme o scroll avança
const activeFloatIndex = computed(() => {
  return scrollProgress.value * (stacks.length - 1)
})

const currentActiveIndex = computed(() => {
  return Math.round(activeFloatIndex.value)
})

// Largura de cada card + gap para cálculo preciso do deslocamento da direita para a esquerda
const cardStride = computed(() => {
  if (viewportWidth.value < 640) return 320
  if (viewportWidth.value < 1024) return 400
  return 440
})

// Desloca o trilho da direita para a esquerda conforme scrollProgress vai de 0 a 1
const trackTranslateX = computed(() => {
  return -activeFloatIndex.value * cardStride.value
})

function getCardStyle(index: number) {
  const dist = Math.abs(index - activeFloatIndex.value)
  // Permite 1 a 2 cards em foco central e aplica blur progressivo na entrada (direita) e saída (esquerda)
  const blurAmount = dist <= 0.45 ? 0 : Math.min(14, (dist - 0.45) * 11)
  const opacity = dist <= 0.45 ? 1 : Math.max(0.22, 1 - (dist - 0.45) * 0.55)
  const scale = dist <= 0.45 ? 1 : Math.max(0.86, 1 - (dist - 0.45) * 0.1)

  return {
    filter: `blur(${blurAmount.toFixed(1)}px)`,
    opacity: opacity.toFixed(2),
    transform: `scale(${scale.toFixed(3)})`,
    transition: 'filter 80ms linear, opacity 80ms linear, transform 80ms linear'
  }
}

function scrollToStackIndex(index: number) {
  if (!sectionRef.value) return
  const rect = sectionRef.value.getBoundingClientRect()
  const sectionTop = window.scrollY + rect.top
  const scrollableDistance = rect.height - window.innerHeight
  const targetRatio = stacks.length > 1 ? index / (stacks.length - 1) : 0
  window.scrollTo({
    top: sectionTop + scrollableDistance * targetRatio,
    behavior: 'smooth'
  })
}

onMounted(() => {
  updateViewport()
  window.addEventListener('scroll', updateScroll, { passive: true })
  window.addEventListener('resize', updateViewport)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScroll)
  window.removeEventListener('resize', updateViewport)
})
</script>

<template>
  <!-- Seção com 340vh para transformar o scroll vertical na passagem horizontal dos cards -->
  <section
    id="stacks"
    ref="sectionRef"
    class="relative h-[340vh] w-full"
    aria-label="Stacks e Linguagens"
  >
    <div class="sticky top-0 flex h-screen w-full flex-col justify-center overflow-hidden py-16 md:pl-20">
      <!-- Cabeçalho da Seção -->
      <div class="mx-auto mb-8 w-full max-w-6xl px-4 text-center sm:px-8">
        <span class="inline-block rounded-full bg-purple-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-purple-800 border border-purple-400/30 dark:text-purple-300">
          Tech Stack & Languages
        </span>
        <h2 class="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Stacks & Linguagens
        </h2>
        <p class="mt-2 text-xs text-slate-600 sm:text-sm dark:text-slate-400">
          Role a página para explorar as tecnologias da direita para a esquerda
        </p>
      </div>

      <!-- Palco do Carrossel com Zonas de Blur na Entrada (Direita) e Saída (Esquerda) -->
      <div class="relative flex w-full items-center justify-center py-6">
        <!-- Blur de Saída (Esquerda) -->
        <div
          class="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 sm:w-32 md:w-48 bg-gradient-to-r from-slate-100/80 via-slate-100/30 to-transparent backdrop-blur-[6px] dark:from-[#050818]/85 dark:via-[#050818]/35"
          style="-webkit-mask-image: linear-gradient(to right, black 35%, transparent 100%); mask-image: linear-gradient(to right, black 35%, transparent 100%);"
        />

        <!-- Blur de Entrada (Direita) -->
        <div
          class="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 sm:w-32 md:w-48 bg-gradient-to-l from-slate-100/80 via-slate-100/30 to-transparent backdrop-blur-[6px] dark:from-[#050818]/85 dark:via-[#050818]/35"
          style="-webkit-mask-image: linear-gradient(to left, black 35%, transparent 100%); mask-image: linear-gradient(to left, black 35%, transparent 100%);"
        />

        <!-- Trilho centralizado que move os cards da direita para a esquerda -->
        <div class="relative flex w-full items-center justify-center overflow-visible">
          <div
            class="flex items-stretch will-change-transform"
            :style="{
              transform: `translate3d(${trackTranslateX}px, 0, 0)`,
              paddingLeft: 'calc(50% - 150px)',
              paddingRight: 'calc(50% - 150px)',
              gap: viewportWidth < 640 ? '20px' : '40px'
            }"
          >
            <div
              v-for="(item, idx) in stacks"
              :key="item.id"
              class="shrink-0 w-[300px] sm:w-[360px] lg:w-[400px]"
              :style="getCardStyle(idx)"
            >
              <LiquidGlass
                :interactive="true"
                rounded="rounded-3xl"
                class-name="h-full p-6 sm:p-8"
              >
                <!-- Brilho temático da stack -->
                <div
                  class="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br blur-2xl opacity-75"
                  :class="item.accentBg"
                />

                <div class="relative flex h-full flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between gap-3">
                      <!-- Ícone vetorial dedicado para cada Stack -->
                      <div
                        class="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/30 bg-white/60 shadow-md dark:border-white/15 dark:bg-slate-950/70"
                      >
                        <!-- MongoDB Icon -->
                        <svg
                          v-if="item.id === 'mongodb'"
                          class="h-8 w-8 text-emerald-500"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path
                            d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z"
                          />
                        </svg>

                        <!-- Nuxt Icon -->
                        <svg
                          v-else-if="item.id === 'nuxt'"
                          class="h-8 w-8 text-[#00DC82]"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path
                            d="M13.69 18.75h6.54c.62 0 1.2-.33 1.51-.87.31-.54.31-1.2 0-1.74L15.86 5.9c-.31-.54-.89-.87-1.51-.87-.62 0-1.2.33-1.51.87l-1.55 2.7-3.04-5.28c-.31-.54-.89-.87-1.51-.87-.62 0-1.2.33-1.51.87L.26 16.14c-.31.54-.31 1.2 0 1.74.31.54.89.87 1.51.87h11.92zm.65-7.45 4.3 7.45h-8.6l4.3-7.45z"
                          />
                        </svg>

                        <!-- Vue Icon -->
                        <svg
                          v-else-if="item.id === 'vue'"
                          class="h-8 w-8 text-[#42B883]"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path
                            d="M2 3h3.5L12 15l6.5-12H22L12 21 2 3zm4.5 0H9l3 5.5L15 3h2.5L12 13 6.5 3z"
                          />
                        </svg>

                        <!-- TypeScript Icon -->
                        <svg
                          v-else-if="item.id === 'typescript'"
                          class="h-8 w-8 text-blue-500"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path
                            d="M3 3h18v18H3V3zm10.71 14.86c.5.98 1.51 1.73 3.09 1.73 1.6 0 2.8-.83 2.8-2.36 0-1.41-.81-2.04-2.25-2.66l-.42-.18c-.73-.31-1.04-.52-1.04-1.02 0-.41.31-.73.81-.73.48 0 .8.21 1.09.73l1.31-.87c-.55-.96-1.33-1.33-2.4-1.33-1.51 0-2.48.96-2.48 2.23 0 1.38.81 2.03 2.03 2.55l.42.18c.78.34 1.24.55 1.24 1.13 0 .48-.45.83-1.15.83-.83 0-1.31-.43-1.67-1.03l-1.38.8zM13 11.25H8v1.5h1.75v5.75h1.5v-5.75H13v-1.5z"
                          />
                        </svg>

                        <!-- JavaScript Icon -->
                        <svg
                          v-else
                          class="h-8 w-8 text-amber-400"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path
                            d="M3 3h18v18H3V3zm4.73 15.04c.4.85 1.19 1.55 2.54 1.55 1.5 0 2.53-.8 2.53-2.55v-5.78h-1.7V17c0 .86-.35 1.08-.9 1.08-.58 0-.82-.4-1.09-.87l-1.38.83zm5.98-.18c.5.98 1.51 1.73 3.09 1.73 1.6 0 2.8-.83 2.8-2.36 0-1.41-.81-2.04-2.25-2.66l-.42-.18c-.73-.31-1.04-.52-1.04-1.02 0-.41.31-.73.81-.73.48 0 .8.21 1.09.73l1.31-.87c-.55-.96-1.33-1.33-2.4-1.33-1.51 0-2.48.96-2.48 2.23 0 1.38.81 2.03 2.03 2.55l.42.18c.78.34 1.24.55 1.24 1.13 0 .48-.45.83-1.15.83-.83 0-1.31-.43-1.67-1.03l-1.38.8z"
                          />
                        </svg>
                      </div>

                      <span class="rounded-full bg-white/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-700 border border-white/40 dark:bg-white/10 dark:text-slate-200 dark:border-white/15">
                        0{{ idx + 1 }} / 0{{ stacks.length }}
                      </span>
                    </div>

                    <div class="mt-6">
                      <span class="text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                        {{ item.category }}
                      </span>
                      <h3 class="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">
                        {{ item.name }}
                      </h3>
                      <p class="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                        {{ item.description }}
                      </p>
                    </div>
                  </div>

                  <div class="mt-6 flex items-center justify-between border-t border-slate-300/40 pt-4 text-xs dark:border-white/10">
                    <span class="font-medium text-slate-600 dark:text-slate-400">Experiência</span>
                    <span class="font-bold text-slate-900 dark:text-white">{{ item.level }}</span>
                  </div>
                </div>
              </LiquidGlass>
            </div>
          </div>
        </div>
      </div>

      <!-- Indicadores de Progresso do Scroll -->
      <div class="mx-auto mt-6 flex flex-col items-center gap-3 px-4">
        <div class="flex items-center gap-2">
          <button
            v-for="(item, idx) in stacks"
            :key="item.id"
            type="button"
            class="h-2 rounded-full transition-all duration-300"
            :class="
              currentActiveIndex === idx
                ? 'w-8 bg-purple-600 dark:bg-purple-400'
                : 'w-2 bg-slate-400/50 hover:bg-slate-500 dark:bg-white/25'
            "
            :aria-label="`Ir para ${item.name}`"
            @click="scrollToStackIndex(idx)"
          />
        </div>
      </div>
    </div>
  </section>
</template>
