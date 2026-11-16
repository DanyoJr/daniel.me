<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Motion } from 'motion-v'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
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
        ? 'left-0 top-1/2 -translate-y-1/2 h-28 w-1.5 rounded-r-full bg-[#FE5101]/80 blur-[1px]'
        : 'top-0 left-1/2 -translate-x-1/2 w-28 h-1.5 rounded-b-full bg-[#FE5101]/80 blur-[1px]'
    "
  />

  <aside
    class="relative z-50 shrink-0 md:fixed"
    :class="
      effectivePosition === 'left'
        ? 'md:left-6 md:top-1/2 md:-translate-y-1/2'
        : 'md:top-6 md:left-1/2 md:-translate-x-1/2'
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
      <Card
        as="nav"
        rounded="rounded-3xl"
        class-name="flex h-[52px] sm:h-[60px] md:h-auto items-center overflow-visible px-1.5 py-1 sm:p-2"
      >
        <div
          class="flex h-full items-center gap-1 sm:gap-2"
          :class="effectivePosition === 'left' ? 'flex-col' : 'flex-row'"
        >
          <!-- Itens de Navegação: Home, Projects, Blog, Contact Me -->
          <Motion
            v-for="item in navItems"
            :key="item.id"
            :while-hover="{ scale: 1.12 }"
            :while-tap="{ scale: 0.94 }"
          >
            <Button
              type="button"
              :variant="
                (route.path === '/blog' ? item.id === 'blog' : activeSection === item.id)
                  ? 'dockActive'
                  : 'dock'
              "
              size="dockIcon"
              class="group relative"
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
                class="pointer-events-none absolute whitespace-nowrap rounded-xl border border-white/15 bg-[#000000]/95 px-2.5 py-1 text-xs font-medium text-[#FFFFFF] opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100"
                :class="
                  effectivePosition === 'left'
                    ? 'left-14 top-1/2 -translate-y-1/2'
                    : 'top-14 left-1/2 -translate-x-1/2'
                "
              >
                {{ item.label }}
              </span>
            </Button>
          </Motion>

          <!-- Divisor -->
          <Separator
            :orientation="effectivePosition === 'left' ? 'horizontal' : 'vertical'"
            class="bg-black/15 dark:bg-white/15"
            :class="effectivePosition === 'left' ? 'my-1 h-px w-7' : 'mx-1 h-7 w-px'"
          />

          <!-- Botão de Engrenagem (Configurações do Dock) com Dropdown -->
          <div ref="dropdownContainerRef" class="relative">
            <Motion
              :while-hover="{ scale: 1.12 }"
              :while-tap="{ scale: 0.94 }"
            >
              <Button
                type="button"
                variant="dock"
                size="dockIcon"
                class="group relative"
                :class="
                  isDropdownOpen
                    ? 'bg-[#FE5101]/20 text-[#FE5101] hover:bg-[#FE5101]/20 dark:bg-[#FE5101]/25 dark:text-[#FE5101] dark:hover:bg-[#FE5101]/25'
                    : ''
                "
                aria-label="Configurações do Dock"
                @click="isDropdownOpen = !isDropdownOpen"
              >
                <svg
                  class="h-5 w-5 transition-transform duration-300 group-hover:rotate-45"
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
                  class="pointer-events-none absolute whitespace-nowrap rounded-xl border border-white/15 bg-[#000000]/95 px-2.5 py-1 text-xs font-medium text-[#FFFFFF] opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100"
                  :class="
                    effectivePosition === 'left'
                      ? 'left-14 top-1/2 -translate-y-1/2'
                      : 'top-14 left-1/2 -translate-x-1/2'
                  "
                >
                  Configurações
                </span>
              </Button>
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
                <Card
                  rounded="rounded-2xl"
                  class-name="bg-[#FFFFFF]/95 p-3.5 text-[#000000] shadow-2xl dark:bg-[#0A0A0A]/95 dark:text-[#FFFFFF]"
                >
                  <div class="mb-2 flex items-center justify-between border-b border-black/15 pb-2 dark:border-white/15">
                    <span class="text-xs font-bold uppercase tracking-wider text-[#FE5101]">
                      Configurações do Dock
                    </span>
                  </div>

                  <!-- Aviso exclusivo para Mobile -->
                  <div v-if="isMobile" class="py-1">
                    <p class="text-xs font-medium leading-relaxed text-black/75 dark:text-white/75">
                      As configurações de posição e comportamento do Dock funcionam apenas no <span class="font-semibold text-[#FE5101]">PC</span>.
                    </p>
                    <p class="mt-1.5 text-[11px] leading-snug text-black/55 dark:text-white/55">
                      No celular, o Dock permanece fixo no topo para melhor ergonomia.
                    </p>
                  </div>

                  <!-- Controles exclusivos para PC -->
                  <template v-else>
                    <!-- Opção 1: Comportamento (Fixo vs Reativo) -->
                    <div class="mb-3">
                      <p class="mb-1.5 text-[11px] font-medium text-black/60 dark:text-white/60">
                        Comportamento
                      </p>
                      <div class="grid grid-cols-2 gap-1.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          class="h-auto rounded-xl px-2.5 py-1.5 text-xs font-semibold"
                          :class="
                            behavior === 'fixed'
                              ? 'bg-[#FE5101] text-[#FFFFFF] shadow-sm hover:bg-[#FE5101] dark:hover:bg-[#FE5101]'
                              : 'bg-black/5 text-[#000000] hover:bg-black/10 dark:bg-white/5 dark:text-[#FFFFFF]/80 dark:hover:bg-white/15'
                          "
                          @click="setBehavior('fixed')"
                        >
                          Fixo
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          class="h-auto rounded-xl px-2.5 py-1.5 text-xs font-semibold"
                          :class="
                            behavior === 'reactive'
                              ? 'bg-[#FE5101] text-[#FFFFFF] shadow-sm hover:bg-[#FE5101] dark:hover:bg-[#FE5101]'
                              : 'bg-black/5 text-[#000000] hover:bg-black/10 dark:bg-white/5 dark:text-[#FFFFFF]/80 dark:hover:bg-white/15'
                          "
                          @click="setBehavior('reactive')"
                        >
                          Reativo
                        </Button>
                      </div>
                      <p class="mt-1 text-[10px] leading-tight text-black/55 dark:text-white/55">
                        {{
                          behavior === 'reactive'
                            ? 'Aparece quando o cursor se aproxima da borda.'
                            : 'Permanece visível acompanhando a página.'
                        }}
                      </p>
                    </div>

                    <!-- Opção 2: Posição no PC (Lateral Esquerda vs Topo) -->
                    <div>
                      <p class="mb-1.5 text-[11px] font-medium text-black/60 dark:text-white/60">
                        Posição na Tela
                      </p>
                      <div class="grid grid-cols-2 gap-1.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          class="h-auto rounded-xl px-2.5 py-1.5 text-xs font-semibold"
                          :class="
                            position === 'left'
                              ? 'bg-[#FE5101] text-[#FFFFFF] shadow-sm hover:bg-[#FE5101] dark:hover:bg-[#FE5101]'
                              : 'bg-black/5 text-[#000000] hover:bg-black/10 dark:bg-white/5 dark:text-[#FFFFFF]/80 dark:hover:bg-white/15'
                          "
                          @click="setPosition('left')"
                        >
                          Esquerda
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          class="h-auto rounded-xl px-2.5 py-1.5 text-xs font-semibold"
                          :class="
                            position === 'top'
                              ? 'bg-[#FE5101] text-[#FFFFFF] shadow-sm hover:bg-[#FE5101] dark:hover:bg-[#FE5101]'
                              : 'bg-black/5 text-[#000000] hover:bg-black/10 dark:bg-white/5 dark:text-[#FFFFFF]/80 dark:hover:bg-white/15'
                          "
                          @click="setPosition('top')"
                        >
                          Em Cima
                        </Button>
                      </div>
                    </div>
                  </template>
                </Card>
              </div>
            </Transition>
          </div>
        </div>
      </Card>
    </Motion>
  </aside>
</template>
