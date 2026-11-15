<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Motion } from 'motion-v'
import LiquidGlass from '~/components/glass/LiquidGlass.vue'
import { useDockSettings } from '~/composables/useDockSettings'

const route = useRoute()
const router = useRouter()
const { position, behavior, setPosition, setBehavior } = useDockSettings()

const isMobile = ref(false)
const isNearEdge = ref(false)
const isDockHovered = ref(false)
const isDropdownOpen = ref(false)
const activeSection = ref<'home' | 'projects' | 'contact' | 'blog'>('home')
const dropdownContainerRef = ref<HTMLElement | null>(null)

// No mobile fica sempre no topo; no PC respeita position ('left' ou 'top')
const effectivePosition = computed(() => {
  if (isMobile.value) return 'top'
  return position.value
})

// Quando behavior === 'reactive' no PC, mostra quando o mouse chega perto da borda, quando o dock está em hover ou com dropdown aberto
const isDockVisible = computed(() => {
  if (isMobile.value) return true
  if (behavior.value === 'fixed') return true
  return isNearEdge.value || isDockHovered.value || isDropdownOpen.value
})

const navItems = [
  { id: 'home', label: 'Home', hash: '#home', path: '/' },
  { id: 'projects', label: 'Projects', hash: '#projects', path: '/' },
  { id: 'blog', label: 'Blog', hash: '', path: '/blog' },
  { id: 'contact', label: 'Contact Me', hash: '#contact', path: '/' }
] as const

async function handleNavClick(item: typeof navItems[number]) {
  isDropdownOpen.value = false

  if (item.id === 'blog') {
    activeSection.value = 'blog'
    await router.push('/blog')
    return
  }

  activeSection.value = item.id
  if (route.path !== '/') {
    await router.push({ path: '/', hash: item.hash })
    setTimeout(() => {
      const el = document.querySelector(item.hash)
      el?.scrollIntoView({ behavior: 'smooth' })
    }, 150)
  } else {
    const el = document.querySelector(item.hash)
    el?.scrollIntoView({ behavior: 'smooth' })
  }
}

function checkViewport() {
  isMobile.value = window.innerWidth < 768
}

function handleGlobalMouseMove(e: MouseEvent) {
  if (isMobile.value || behavior.value !== 'reactive') return

  if (effectivePosition.value === 'left') {
    isNearEdge.value = e.clientX <= 85
  } else {
    isNearEdge.value = e.clientY <= 85
  }
}

function handleGlobalClickOutside(e: MouseEvent) {
  if (!isDropdownOpen.value) return
  if (dropdownContainerRef.value && !dropdownContainerRef.value.contains(e.target as Node)) {
    isDropdownOpen.value = false
  }
}

function updateActiveSectionOnScroll() {
  if (route.path === '/blog') {
    activeSection.value = 'blog'
    return
  }

  const contactEl = document.getElementById('contact')
  const projectsEl = document.getElementById('projects')

  const scrollY = window.scrollY + window.innerHeight * 0.38

  if (contactEl && scrollY >= contactEl.offsetTop) {
    activeSection.value = 'contact'
  } else if (projectsEl && scrollY >= projectsEl.offsetTop) {
    activeSection.value = 'projects'
  } else {
    activeSection.value = 'home'
  }
}

onMounted(() => {
  checkViewport()
  updateActiveSectionOnScroll()
  window.addEventListener('resize', checkViewport)
  window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true })
  window.addEventListener('scroll', updateActiveSectionOnScroll, { passive: true })
  document.addEventListener('mousedown', handleGlobalClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkViewport)
  window.removeEventListener('mousemove', handleGlobalMouseMove)
  window.removeEventListener('scroll', updateActiveSectionOnScroll)
  document.removeEventListener('mousedown', handleGlobalClickOutside)
})
</script>

<template>
  <!-- Indicador sutil na borda quando o Dock está em modo Reativo e recolhido -->
  <div
    v-if="!isMobile && behavior === 'reactive' && !isDockVisible"
    class="pointer-events-none fixed z-40 transition-opacity duration-300"
    :class="
      effectivePosition === 'left'
        ? 'left-0 top-1/2 -translate-y-1/2 h-28 w-1.5 rounded-r-full bg-purple-400/50 blur-[1px]'
        : 'top-0 left-1/2 -translate-x-1/2 w-28 h-1.5 rounded-b-full bg-purple-400/50 blur-[1px]'
    "
  />

  <aside
    class="fixed z-50"
    :class="
      effectivePosition === 'left'
        ? 'left-4 top-1/2 -translate-y-1/2 sm:left-6'
        : 'top-3 left-1/2 -translate-x-1/2 md:top-6'
    "
    aria-label="Dock de Navegação Principal"
    @mouseenter="isDockHovered = true"
    @mouseleave="isDockHovered = false"
  >
    <Motion
      :animate="{
        x: effectivePosition === 'left' ? (isDockVisible ? 0 : -76) : 0,
        y: effectivePosition === 'top' ? (isDockVisible ? 0 : -76) : 0,
        opacity: isDockVisible ? 1 : 0.15
      }"
      :transition="{
        type: 'spring',
        stiffness: 260,
        damping: 24
      }"
    >
      <LiquidGlass
        as="nav"
        rounded="rounded-3xl"
        class-name="p-2"
      >
        <div
          class="flex items-center gap-1.5 sm:gap-2"
          :class="effectivePosition === 'left' ? 'flex-col' : 'flex-row'"
        >
          <!-- Itens de Navegação: Home, Projects, Blog, Contact Me -->
          <Motion
            v-for="item in navItems"
            :key="item.id"
            :while-hover="{ scale: 1.12 }"
            :while-tap="{ scale: 0.94 }"
          >
            <button
              type="button"
              class="group relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-300"
              :class="
                (route.path === '/blog' ? item.id === 'blog' : activeSection === item.id)
                  ? 'bg-purple-600/80 text-white shadow-[0_4px_18px_rgba(124,58,237,0.45)] border border-purple-300/40'
                  : 'text-slate-700 hover:bg-white/40 dark:text-slate-200 dark:hover:bg-white/10'
              "
              :aria-label="item.label"
              @click="handleNavClick(item)"
            >
              <!-- Ícone Home -->
              <svg
                v-if="item.id === 'home'"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>

              <!-- Ícone Projects -->
              <svg
                v-else-if="item.id === 'projects'"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>

              <!-- Ícone Blog -->
              <svg
                v-else-if="item.id === 'blog'"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>

              <!-- Ícone Contact Me -->
              <svg
                v-else-if="item.id === 'contact'"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>

              <!-- Tooltip do item -->
              <span
                class="pointer-events-none absolute whitespace-nowrap rounded-xl bg-slate-900/90 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 dark:bg-slate-800/95"
                :class="
                  effectivePosition === 'left'
                    ? 'left-14 top-1/2 -translate-y-1/2'
                    : 'top-14 left-1/2 -translate-x-1/2'
                "
              >
                {{ item.label }}
              </span>
            </button>
          </Motion>

          <!-- Divisor -->
          <div
            class="bg-slate-400/30 dark:bg-white/15"
            :class="effectivePosition === 'left' ? 'my-1 h-px w-7' : 'mx-1 h-7 w-px'"
          />

          <!-- Botão de Engrenagem (Configurações do Dock) com Dropdown -->
          <div ref="dropdownContainerRef" class="relative">
            <Motion
              :while-hover="{ scale: 1.12, rotate: 35 }"
              :while-tap="{ scale: 0.94 }"
            >
              <button
                type="button"
                class="group relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-300"
                :class="
                  isDropdownOpen
                    ? 'bg-white/60 text-purple-600 dark:bg-white/20 dark:text-purple-300'
                    : 'text-slate-700 hover:bg-white/40 dark:text-slate-200 dark:hover:bg-white/10'
                "
                aria-label="Configurações do Dock"
                @click="isDropdownOpen = !isDropdownOpen"
              >
                <svg
                  class="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
                  />
                  <circle cx="12" cy="12" r="3" />
                </svg>

                <span
                  v-if="!isDropdownOpen"
                  class="pointer-events-none absolute whitespace-nowrap rounded-xl bg-slate-900/90 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 dark:bg-slate-800/95"
                  :class="
                    effectivePosition === 'left'
                      ? 'left-14 top-1/2 -translate-y-1/2'
                      : 'top-14 left-1/2 -translate-x-1/2'
                  "
                >
                  Configurações
                </span>
              </button>
            </Motion>

            <!-- Dropdown Menu Liquid Glass -->
            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="scale-95 opacity-0"
              enter-to-class="scale-100 opacity-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="scale-100 opacity-100"
              leave-to-class="scale-95 opacity-0"
            >
              <div
                v-if="isDropdownOpen"
                class="absolute z-50 w-64"
                :class="
                  effectivePosition === 'left'
                    ? 'left-14 bottom-0'
                    : 'top-14 right-0'
                "
              >
                <LiquidGlass
                  rounded="rounded-2xl"
                  class-name="p-3.5 text-slate-800 dark:text-slate-100"
                >
                  <div class="mb-2 flex items-center justify-between border-b border-slate-300/40 pb-2 dark:border-white/10">
                    <span class="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                      Configurações do Dock
                    </span>
                  </div>

                  <!-- Opção 1: Comportamento (Fixo vs Reativo) -->
                  <div class="mb-3">
                    <p class="mb-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                      Comportamento (PC)
                    </p>
                    <div class="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        class="rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all"
                        :class="
                          behavior === 'fixed'
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'bg-white/40 text-slate-700 hover:bg-white/60 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/15'
                        "
                        @click="setBehavior('fixed')"
                      >
                        Fixo
                      </button>
                      <button
                        type="button"
                        class="rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all"
                        :class="
                          behavior === 'reactive'
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'bg-white/40 text-slate-700 hover:bg-white/60 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/15'
                        "
                        @click="setBehavior('reactive')"
                      >
                        Reativo
                      </button>
                    </div>
                    <p class="mt-1 text-[10px] leading-tight text-slate-500 dark:text-slate-400">
                      {{
                        behavior === 'reactive'
                          ? 'Aparece quando o cursor se aproxima da borda.'
                          : 'Permanece visível acompanhando a página.'
                      }}
                    </p>
                  </div>

                  <!-- Opção 2: Posição no PC (Lateral Esquerda vs Topo) -->
                  <div class="hidden md:block">
                    <p class="mb-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                      Posição na Tela (PC)
                    </p>
                    <div class="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        class="flex items-center justify-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all"
                        :class="
                          position === 'left'
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'bg-white/40 text-slate-700 hover:bg-white/60 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/15'
                        "
                        @click="setPosition('left')"
                      >
                        Esquerda
                      </button>
                      <button
                        type="button"
                        class="flex items-center justify-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all"
                        :class="
                          position === 'top'
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'bg-white/40 text-slate-700 hover:bg-white/60 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/15'
                        "
                        @click="setPosition('top')"
                      >
                        Em Cima
                      </button>
                    </div>
                  </div>

                  <p class="mt-1 text-[10px] text-slate-500 md:hidden dark:text-slate-400">
                    No mobile o Dock fica padronizado no topo para melhor ergonomia.
                  </p>
                </LiquidGlass>
              </div>
            </Transition>
          </div>
        </div>
      </LiquidGlass>
    </Motion>
  </aside>
</template>
