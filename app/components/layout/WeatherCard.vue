<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Motion } from 'motion-v'
import LiquidGlass from '~/components/glass/LiquidGlass.vue'
import type { WeatherResponse } from '~~/server/api/weather.get'

const weather = ref<WeatherResponse>({
  city: 'São Paulo, SP',
  country: 'Brasil',
  temperature: 26,
  conditionText: 'Ensolarado',
  conditionType: 'sunny',
  humidity: 54,
  windKph: 12,
  isFallbackLocation: true,
  source: 'simulated-fallback'
})

const loading = ref(true)
const cardRef = ref<HTMLElement | null>(null)

// Efeito Magnetic Button (coordenadas de deslocamento magnético)
const magX = ref(0)
const magY = ref(0)
const isHovered = ref(false)

function handleMouseMove(e: MouseEvent) {
  if (!cardRef.value) return
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

const isRainy = computed(() => weather.value.conditionType === 'rainy')

async function fetchWeather(params: Record<string, string>) {
  try {
    loading.value = true
    const query = new URLSearchParams(params).toString()
    const data = await $fetch<WeatherResponse>(`/api/weather?${query}`)
    if (data) {
      weather.value = data
    }
  } catch {
    // Mantém estado de fallback de São Paulo
  } finally {
    loading.value = false
  }
}

// Alterna entre Ensolarado e Chuvoso ao clicar quando em modo fallback para fácil visualização dos 2 estados
function toggleWeatherPreview() {
  if (weather.value.source === 'simulated-fallback') {
    if (weather.value.conditionType === 'sunny') {
      weather.value = {
        ...weather.value,
        conditionType: 'rainy',
        conditionText: 'Chuvoso',
        temperature: 18
      }
    } else {
      weather.value = {
        ...weather.value,
        conditionType: 'sunny',
        conditionText: 'Ensolarado',
        temperature: 26
      }
    }
  }
}

onMounted(() => {
  if (!('geolocation' in navigator)) {
    fetchWeather({ fallback: 'true', city: 'São Paulo, SP' })
    return
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
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
        fallback: 'false',
        city: detectedCity
      })
    },
    () => {
      // Se o usuário negar permissão, exibe São Paulo
      fetchWeather({ fallback: 'true', city: 'São Paulo, SP' })
    },
    { timeout: 6000, maximumAge: 300000 }
  )
})
</script>

<template>
  <div
    ref="cardRef"
    class="relative select-none"
    @mousemove="handleMouseMove"
    @mouseenter="isHovered = true"
    @mouseleave="handleMouseLeave"
  >
    <Motion
      :animate="{
        x: magX,
        y: magY,
        scale: isHovered ? 1.04 : 1
      }"
      :transition="{
        type: 'spring',
        stiffness: 260,
        damping: 18,
        mass: 0.6
      }"
    >
      <LiquidGlass
        as="button"
        type="button"
        :tint="isRainy ? 'rainy' : 'sunny'"
        :interactive="true"
        rounded="rounded-2xl"
        class-name="group relative w-[210px] sm:w-[235px] px-3.5 py-2.5 text-left transition-colors duration-500"
        title="Clique para alternar prévia Sol / Chuva"
        @click="toggleWeatherPreview"
      >
        <!-- Glow de fundo condicional (Mais amarelo no sol / Mais cinza na chuva) -->
        <div
          class="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full blur-xl transition-colors duration-500"
          :class="isRainy ? 'bg-slate-400/35 dark:bg-slate-500/30' : 'bg-amber-400/45 dark:bg-yellow-400/35'"
        />

        <!-- Layout inspirado no Uiverse zanina-yassine/neat-starfish-50 -->
        <div class="relative flex items-center justify-between gap-2">
          <!-- Coluna Esquerda: Local, Data e Temperatura -->
          <div class="flex flex-col justify-between min-w-0">
            <div class="flex items-center gap-1">
              <svg
                class="h-3 w-3 shrink-0"
                :class="isRainy ? 'text-slate-700 dark:text-slate-300' : 'text-amber-700 dark:text-amber-300'"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span
                class="truncate text-xs font-bold tracking-tight"
                :class="isRainy ? 'text-slate-800 dark:text-slate-100' : 'text-amber-950 dark:text-amber-50'"
              >
                {{ weather.city }}
              </span>
            </div>

            <span
              class="text-[10px] capitalize opacity-75"
              :class="isRainy ? 'text-slate-700 dark:text-slate-300' : 'text-amber-900 dark:text-amber-200'"
            >
              {{ formattedDate }} • {{ weather.conditionText }}
            </span>

            <div class="mt-1 flex items-baseline gap-1.5">
              <span
                class="text-2xl font-extrabold leading-none tracking-tight"
                :class="isRainy ? 'text-slate-900 dark:text-white' : 'text-amber-950 dark:text-white'"
              >
                {{ weather.temperature }}°
              </span>
              <span
                class="rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase"
                :class="
                  isRainy
                    ? 'bg-slate-600/20 text-slate-800 dark:bg-slate-400/20 dark:text-slate-200'
                    : 'bg-amber-500/25 text-amber-950 dark:bg-amber-400/20 dark:text-amber-200'
                "
              >
                Celsius
              </span>
            </div>
          </div>

          <!-- Coluna Direita: Ilustração animada estilo neat-starfish-50 -->
          <div class="relative flex h-14 w-14 shrink-0 items-center justify-center">
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
      </LiquidGlass>
    </Motion>
  </div>
</template>
