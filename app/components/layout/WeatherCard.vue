<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Motion } from 'motion-v'
import { Card } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Skeleton } from '~/components/ui/skeleton'
import type { WeatherResponse } from '~~/server/api/weather.get'

const weather = ref<WeatherResponse | null>(null)

const loading = ref(false)
const cardRef = ref<HTMLElement | null>(null)
const isMobile = ref(false)

// Efeito Magnetic Button (coordenadas de deslocamento magnético)
const magX = ref(0)
const magY = ref(0)
const isHovered = ref(false)

function checkMobile() {
  isMobile.value =
    window.innerWidth < 768 ||
    window.matchMedia('(hover: none), (pointer: coarse)').matches

  if (isMobile.value) {
    isHovered.value = false
    magX.value = 0
    magY.value = 0
  }
}

function handleMouseEnter() {
  if (isMobile.value) return
  isHovered.value = true
}

function handleMouseMove(e: MouseEvent) {
  if (isMobile.value || !cardRef.value) return
  const rect = cardRef.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  const deltaX = e.clientX - centerX
  const deltaY = e.clientY - centerY

  // Atração magnética suave (fator 0.28)
  magX.value = deltaX * 0.28
  magY.value = deltaY * 0.28
}

function handleMouseLeave() {
  isHovered.value = false
  magX.value = 0
  magY.value = 0
}

const formattedDate = computed(() => {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short'
  }).format(new Date())
})

const isRainy = computed(() => weather.value?.conditionType === 'rainy')

async function fetchWeather(params: Record<string, string>) {
  try {
    loading.value = true
    const query = new URLSearchParams(params).toString()
    const data = await $fetch<WeatherResponse>(`/api/weather?${query}`)
    if (data) {
      weather.value = data
    }
  } catch {
    weather.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)

  if (!('geolocation' in navigator)) {
    return
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      loading.value = true
      const { latitude, longitude } = pos.coords
      let detectedCity = 'Sua Localização'

      // Tenta obter o nome da cidade via geocodificação reversa gratuita caso disponível
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
        )
        if (geoRes.ok) {
          const geoData = await geoRes.json()
          const addr = geoData?.address
          const city = addr?.city || addr?.town || addr?.municipality || addr?.state_district
          const state = addr?.ISO3166_2_lvl4?.split('-')?.[1] || ''
          if (city) {
            detectedCity = state ? `${city}, ${state}` : city
          }
        }
      } catch {
        // Segue com o rótulo padrão
      }

      await fetchWeather({
        lat: String(latitude),
        lon: String(longitude),
        city: detectedCity
      })
    },
    () => {
      // Se o usuário negar permissão, o componente não deve aparecer
      loading.value = false
      weather.value = null
    },
    { timeout: 6000, maximumAge: 300000 }
  )
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<template>
  <div
    v-if="loading || weather"
    ref="cardRef"
    class="relative select-none"
    @mousemove="handleMouseMove"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <Motion
      :animate="{
        x: isMobile ? 0 : magX,
        y: isMobile ? 0 : magY,
        scale: !isMobile && isHovered ? 1.04 : 1
      }"
      :transition="{
        type: 'spring',
        stiffness: 260,
        damping: 18,
        mass: 0.6
      }"
    >
      <Card
        :tint="weather ? (isRainy ? 'rainy' : 'sunny') : 'default'"
        rounded="rounded-xl"
        class-name="group relative flex h-[52px] sm:h-[60px] md:h-auto w-[142px] sm:w-[225px] md:w-[235px] items-center px-2.5 sm:px-3.5 py-1 sm:py-1.5 md:py-2.5 text-left transition-colors duration-500"
      >
        <!-- Skeleton durante carregamento dos requests de localização/clima -->
        <div
          v-if="loading && !weather"
          class="relative flex h-full w-full items-center justify-between gap-1.5 sm:gap-2"
          aria-busy="true"
        >
          <div class="flex min-w-0 flex-1 flex-col justify-between gap-1">
            <div class="flex items-center gap-1">
              <Skeleton class="h-3 w-3 shrink-0 rounded-full" />
              <Skeleton class="h-3 w-20 sm:w-28" />
            </div>
            <Skeleton class="hidden sm:block h-2.5 w-24" />
            <div class="mt-0.5 flex items-baseline gap-1.5">
              <Skeleton class="h-5 w-9 sm:h-6 sm:w-11" />
              <Skeleton class="h-3.5 w-10 rounded-md" />
            </div>
          </div>

          <div class="relative flex h-9 w-9 sm:h-11 sm:w-11 md:h-14 md:w-14 shrink-0 items-center justify-center">
            <Skeleton class="h-8 w-8 sm:h-10 sm:w-10 md:h-11 md:w-11 rounded-full" />
          </div>
        </div>

        <!-- Layout inspirado no Uiverse zanina-yassine/neat-starfish-50 -->
        <div
          v-else-if="weather"
          class="relative flex h-full w-full items-center justify-between gap-1.5 sm:gap-2"
        >
          <!-- Coluna Esquerda: Local, Data e Temperatura -->
          <div class="flex flex-col justify-between min-w-0">
            <div class="flex items-center gap-1">
              <svg
                class="h-3 w-3 shrink-0 text-[#FE5101]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span
                class="truncate text-[11px] sm:text-xs font-bold leading-tight tracking-tight text-[#000000] dark:text-[#FFFFFF]"
              >
                {{ weather.city }}
              </span>
            </div>

            <span
              class="hidden sm:block truncate text-[10px] leading-tight capitalize text-black/60 dark:text-white/60"
            >
              {{ formattedDate }} • {{ weather.conditionText }}
            </span>

            <div class="mt-0.5 flex items-baseline gap-1 sm:gap-1.5">
              <span
                class="text-lg sm:text-xl md:text-2xl font-extrabold leading-none tracking-tight text-[#000000] dark:text-[#FFFFFF]"
              >
                {{ weather.temperature }}°
              </span>
              <Badge
                :variant="isRainy ? 'default' : 'purple'"
                class="rounded-md border-transparent px-1 sm:px-1.5 py-0.5 text-[8px] sm:text-[9px] font-semibold uppercase leading-none"
                :class="
                  isRainy
                    ? 'bg-black/10 text-[#000000] dark:bg-white/15 dark:text-[#FFFFFF]'
                    : 'bg-[#FE5101]/20 text-[#FE5101] dark:bg-[#FE5101]/25 dark:text-[#FE5101]'
                "
              >
                Celsius
              </Badge>
            </div>
          </div>

          <!-- Coluna Direita: Ilustração animada estilo neat-starfish-50 -->
          <div class="relative flex h-9 w-9 sm:h-11 sm:w-11 md:h-14 md:w-14 shrink-0 items-center justify-center">
            <!-- Estado Ensolarado -->
            <template v-if="!isRainy">
              <div class="animate-weather-sun relative flex items-center justify-center">
                <div class="h-9 w-9 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 shadow-[0_0_20px_rgba(251,191,36,0.85)]" />
              </div>
              <!-- Nuvem frontal suave -->
              <svg
                class="animate-weather-cloud absolute -bottom-0.5 -right-0.5 h-8 w-10 drop-shadow-md"
                viewBox="0 0 64 44"
                fill="none"
              >
                <path
                  d="M49.5 18.5C48.2 10.3 41.1 4 32.5 4C24.8 4 18.3 9.1 16.1 16.1C15.4 16 14.7 16 14 16C7.4 16 2 21.4 2 28C2 34.6 7.4 40 14 40H49C55.1 40 60 35.1 60 29C60 23.3 55.6 18.6 49.5 18.5Z"
                  fill="white"
                  fill-opacity="0.92"
                />
              </svg>
            </template>

            <!-- Estado Chuvoso (Mais cinza com gotas animadas) -->
            <template v-else>
              <!-- Nuvem escura traseira -->
              <svg
                class="absolute -top-0.5 right-0 h-8 w-10 opacity-70"
                viewBox="0 0 64 44"
                fill="none"
              >
                <path
                  d="M49.5 18.5C48.2 10.3 41.1 4 32.5 4C24.8 4 18.3 9.1 16.1 16.1C15.4 16 14.7 16 14 16C7.4 16 2 21.4 2 28C2 34.6 7.4 40 14 40H49C55.1 40 60 35.1 60 29C60 23.3 55.6 18.6 49.5 18.5Z"
                  fill="#64748B"
                />
              </svg>
              <!-- Nuvem cinza principal -->
              <svg
                class="animate-weather-cloud relative z-10 h-9 w-11 drop-shadow"
                viewBox="0 0 64 44"
                fill="none"
              >
                <path
                  d="M49.5 18.5C48.2 10.3 41.1 4 32.5 4C24.8 4 18.3 9.1 16.1 16.1C15.4 16 14.7 16 14 16C7.4 16 2 21.4 2 28C2 34.6 7.4 40 14 40H49C55.1 40 60 35.1 60 29C60 23.3 55.6 18.6 49.5 18.5Z"
                  fill="#CBD5E1"
                />
              </svg>
              <!-- Gotas de chuva -->
              <div class=" absolute bottom-0.5 flex gap-1.5">
                <span class="animate-weather-rain h-2 w-0.5 rounded-full bg-sky-400" style="animation-delay: 0s" />
                <span class="animate-weather-rain h-2.5 w-0.5 rounded-full bg-sky-400" style="animation-delay: 0.35s" />
                <span class="animate-weather-rain h-2 w-0.5 rounded-full bg-sky-400" style="animation-delay: 0.7s" />
              </div>
            </template>
          </div>
        </div>
      </Card>
    </Motion>
  </div>
</template>
