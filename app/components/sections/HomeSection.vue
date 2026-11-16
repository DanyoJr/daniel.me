<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Motion } from 'motion-v'
import { me, defineAge } from '~/data/me'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { Skeleton } from '~/components/ui/skeleton'
import type { SpotifyTrackResponse } from '~~/server/api/spotify.get'

// Idade calculada dinamicamente a partir de me.nascimento ("2005-06-28")
const currentAge = computed(() => defineAge(me.nascimento))

// Formatação natural da lista de tecnologias ("A, B, C e D")
const formattedStack = computed(() => {
  if (me.stack.length <= 1) return me.stack[0] ?? ''
  return `${me.stack.slice(0, -1).join(', ')} e ${me.stack[me.stack.length - 1]}`
})

const isLoadingTopBar = ref(true)

// Estado do Spotify (via /api/spotify com fallback para me.spotifyFallback)
const spotify = ref<SpotifyTrackResponse>({
  ...me.spotifyFallback,
  source: 'fallback'
})

// Estado do GitHub (via API pública do GitHub com fallback para me.githubFallback)
const github = ref({
  repositories: me.githubFallback.repositories,
  followers: me.githubFallback.followers,
  profileUrl: me.contact.githubUrl,
  loadedFromApi: false
})

function scrollToContact() {
  const el = document.getElementById('contact')
  el?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(async () => {
  try {
    await Promise.allSettled([
      // 1. Busca dados do Spotify na server route
      (async () => {
        try {
          const spData = await $fetch<SpotifyTrackResponse>('/api/spotify')
          if (spData?.title) {
            spotify.value = spData
          }
        } catch {
          // Mantém fallback do me.ts
        }
      })(),
      // 2. Busca dados reais da API pública do GitHub
      (async () => {
        try {
          const ghRes = await fetch(`https://api.github.com/users/${me.githubUsername}`)
          if (ghRes.ok) {
            const ghData = await ghRes.json()
            github.value = {
              repositories: typeof ghData.public_repos === 'number' ? ghData.public_repos : me.githubFallback.repositories,
              followers: typeof ghData.followers === 'number' ? ghData.followers : me.githubFallback.followers,
              profileUrl: ghData.html_url || me.contact.githubUrl,
              loadedFromApi: true
            }
          }
        } catch {
          // Mantém fallback do me.ts
        }
      })()
    ])
  } finally {
    isLoadingTopBar.value = false
  }
})
</script>

<template>
  <section
    id="home"
    class="relative flex min-h-screen w-full items-center justify-center px-4 pt-24 pb-20 sm:px-8 sm:pt-28 md:pl-28 md:pr-12 md:pt-28"
  >
    <Motion
      class="mx-auto w-full max-w-5xl"
      :initial="{ opacity: 0, y: 24 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.6, ease: 'easeOut' }"
    >
      <!-- Container retangular opaco único -->
      <Card tint="solid" class="p-6 sm:p-10">
        <!-- Linha Superior: Spotify | GitHub | LinkedIn (da esquerda para a direita, separados por linhas) -->
        <div class="grid grid-cols-1 divide-y divide-black/10 md:grid-cols-3 md:divide-x md:divide-y-0 dark:divide-white/15">
          <!-- 1. Spotify (Esquerda) -->
          <div
            v-if="isLoadingTopBar"
            class="flex flex-col justify-between py-4 md:py-2 md:pr-6"
            aria-busy="true"
          >
            <div class="mb-2 flex items-center justify-between">
              <Skeleton class="h-3.5 w-14" />
              <Skeleton class="h-3.5 w-24" />
            </div>
            <div class="flex items-center gap-3.5">
              <Skeleton class="h-14 w-14 shrink-0 rounded-xl" />
              <div class="min-w-0 flex-1 space-y-2">
                <Skeleton class="h-4 w-3/4" />
                <Skeleton class="h-3 w-1/2" />
                <div class="space-y-1 pt-0.5">
                  <Skeleton class="h-1.5 w-full rounded-full" />
                  <Skeleton class="h-1.5 w-4/5 rounded-full" />
                </div>
              </div>
            </div>
          </div>
          <a
            v-else
            :href="spotify.songUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex flex-col justify-between py-4 transition-opacity hover:opacity-85 md:py-2 md:pr-6"
          >
            <div class="mb-2 flex items-center justify-between">
              <span class="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Spotify
              </span>
              <span class="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-slate-500 dark:text-slate-400">
                <span
                  v-if="spotify.isPlaying"
                  class="inline-block h-2 w-2 animate-ping rounded-full bg-emerald-400"
                />
                {{ spotify.isPlaying ? 'now playing' : 'last played song' }}
              </span>
            </div>

            <div class="flex items-center gap-3.5">
              <div class="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black shadow-sm">
                <img
                  v-if="spotify.albumArt"
                  :src="spotify.albumArt"
                  :alt="spotify.title"
                  class="h-full w-full object-cover opacity-90"
                />
                <svg
                  v-else
                  class="h-8 w-8 text-[#1ED760]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.786-.963-.335.077-.67-.133-.746-.469-.077-.336.132-.67.469-.746 3.809-.87 7.076-.496 9.713 1.115.293.18.386.563.207.856zm1.224-2.722c-.226.367-.706.482-1.072.257-2.687-1.652-6.785-2.131-9.965-1.166-.413.127-.848-.106-.973-.517-.125-.413.108-.848.52-.973 3.632-1.102 8.147-.568 11.234 1.328.366.226.48.707.256 1.071zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.493.15-1.016-.129-1.166-.623-.148-.495.13-1.015.625-1.166 3.532-1.073 9.404-.866 13.115 1.337.445.264.59.838.327 1.282-.264.443-.838.59-1.283.327z"
                  />
                </svg>
              </div>

              <div class="min-w-0 flex-1 space-y-1.5">
                <div class="truncate text-sm font-bold text-slate-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400 transition-colors">
                  {{ spotify.title }}
                </div>
                <div class="truncate text-xs text-slate-600 dark:text-slate-400">
                  {{ spotify.artist }}
                </div>
                <div class="space-y-1 pt-0.5">
                  <div class="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div class="h-full w-3/4 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                  </div>
                  <div class="h-1.5 w-4/5 rounded-full bg-slate-200/80 dark:bg-slate-800/80" />
                </div>
              </div>
            </div>
          </a>

          <!-- 2. GitHub (Centro) -->
          <div
            v-if="isLoadingTopBar"
            class="flex flex-col justify-between py-4 md:px-6 md:py-2"
            aria-busy="true"
          >
            <div class="mb-2 flex items-center justify-between">
              <Skeleton class="h-3.5 w-14" />
              <Skeleton class="h-3.5 w-24" />
            </div>
            <div class="flex items-center gap-3.5">
              <Skeleton class="h-14 w-14 shrink-0 rounded-xl" />
              <div class="min-w-0 flex-1 space-y-2.5">
                <Skeleton class="h-4 w-36" />
                <div class="flex items-center gap-2.5">
                  <Skeleton class="h-5 w-16 rounded-full" />
                  <Skeleton class="h-5 w-20 rounded-full" />
                </div>
              </div>
            </div>
          </div>
          <a
            v-else
            :href="github.profileUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex flex-col justify-between py-4 transition-opacity hover:opacity-85 md:px-6 md:py-2"
          >
            <div class="mb-2 flex items-center justify-between">
              <span class="text-[11px] font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                GitHub
              </span>
              <span class="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                @{{ me.githubUsername }}
              </span>
            </div>

            <div class="flex items-center gap-3.5">
              <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950">
                <svg class="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </div>

              <div class="min-w-0 flex-1">
                <h3 class="truncate text-sm font-bold uppercase tracking-wider text-slate-900 group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400 transition-colors">
                  MY GITHUB PROFILE
                </h3>
                <div class="mt-2 flex flex-wrap items-center gap-2.5 text-xs">
                  <div class="flex items-center gap-1.5">
                    <Badge variant="counter">
                      {{ github.repositories }}
                    </Badge>
                    <span class="text-slate-600 dark:text-slate-300">repos</span>
                  </div>

                  <div class="flex items-center gap-1.5">
                    <Badge variant="counter">
                      {{ github.followers }}
                    </Badge>
                    <span class="text-slate-600 dark:text-slate-300">followers</span>
                  </div>
                </div>
              </div>
            </div>
          </a>

          <!-- 3. LinkedIn (Direita) -->
          <div
            v-if="isLoadingTopBar"
            class="flex flex-col justify-between py-4 md:py-2 md:pl-6"
            aria-busy="true"
          >
            <div class="mb-2 flex items-center justify-between">
              <Skeleton class="h-3.5 w-16" />
              <Skeleton class="h-3.5 w-24" />
            </div>
            <div class="flex items-center gap-3.5">
              <Skeleton class="h-14 w-14 shrink-0 rounded-xl" />
              <div class="min-w-0 flex-1 space-y-2">
                <Skeleton class="h-4 w-36" />
                <Skeleton class="h-3 w-4/5" />
              </div>
            </div>
          </div>
          <a
            v-else
            :href="me.contact.linkedinUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex flex-col justify-between py-4 transition-opacity hover:opacity-85 md:py-2 md:pl-6"
          >
            <div class="mb-2 flex items-center justify-between">
              <span class="text-[11px] font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                LinkedIn
              </span>
              <span class="truncate text-[11px] font-medium tracking-wide text-slate-500 dark:text-slate-400">
                {{ me.linkedinCard.status }}
              </span>
            </div>

            <div class="flex items-center gap-3.5">
              <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 shadow-sm dark:bg-white">
                <svg class="h-8 w-8 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
                  />
                </svg>
              </div>

              <div class="min-w-0 flex-1">
                <h3 class="truncate text-sm font-bold uppercase tracking-wider text-slate-900 group-hover:text-sky-600 dark:text-white dark:group-hover:text-sky-400 transition-colors">
                  LINKEDIN PROFILE
                </h3>
                <p class="mt-0.5 truncate text-xs text-slate-600 dark:text-slate-400">
                  {{ me.linkedinCard.headline }}
                </p>
              </div>
            </div>
          </a>
        </div>

        <!-- Linha divisória horizontal -->
        <Separator class="my-8" />

        <!-- Texto Sobre Mim (Centralizado conforme estrutura do print) -->
        <div class="mx-auto max-w-3xl text-center">
          <div class="space-y-4 text-base leading-relaxed text-[#000000]/85 sm:text-lg sm:leading-8 dark:text-[#FFFFFF]/90">
            <p>
              Sou <strong class="font-bold text-[#FE5101]">{{ me.nome }}</strong>,
              tenho <strong class="font-bold text-[#FE5101]">{{ currentAge }} anos</strong>,
              profissional de tecnologia e estudante de
              <span class="underline decoration-[#FE5101]/70 underline-offset-4">{{ me.education.current[0] }}</span>.
            </p>

            <p>
              Atualmente, atuo como <strong class="font-bold text-[#FE5101]">{{ me.work.role }}</strong> na
              <strong class="font-bold text-[#FE5101]">{{ me.work.company }}</strong>, onde trabalho com resolução de problemas,
              integraçõese e APIs. Essa experiência me permite compreender diferentes camadas
              de uma aplicação e enxergar a tecnologia além do código.
            </p>

            <p>
              Tenho direcionado minha trajetória ao desenvolvimento de software, com foco em
              <span class="font-semibold text-[#000000] dark:text-[#FFFFFF]">{{ me.interests.join(' e ') }}</span>.
              No meu dia a dia de estudos e projetos, exploro tecnologias como
              <span class="font-semibold text-[#000000] dark:text-[#FFFFFF]">{{ formattedStack }}</span>.
            </p>

            <p>
              Sou movido pela curiosidade e pelo aprendizado contínuo. Gosto de entender como as coisas funcionam,
              investigar problemas e transformar ideias em soluções. Acredito que um bom desenvolvimento começa pela
              compreensão do problema e se concretiza em soluções eficientes, escaláveis e bem estruturadas.
            </p>
          </div>

          <!-- Hobbies & Interesses -->
          <div class="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-black/60 dark:text-white/60">
            <span class="font-semibold uppercase tracking-wider text-black/60 dark:text-white/60">Hobbies:</span>
            <Badge
              v-for="hobby in me.hobbies"
              :key="hobby"
              variant="default"
              class="rounded-lg bg-black/5 px-2.5 py-1 font-medium capitalize dark:bg-white/5"
            >
              {{ hobby }}
            </Badge>
          </div>
        </div>

        <!-- Linha divisória horizontal antes do botão -->
        <Separator class="my-8" />

        <!-- Botão de Contato centralizado -->
        <div class="flex justify-center">
          <Motion
            class="inline-block"
            :while-hover="{ scale: 1.04 }"
            :while-tap="{ scale: 0.96 }"
          >
            <Button
              type="button"
              variant="default"
              class="h-auto cursor-pointer rounded-full px-8 py-3 text-sm font-semibold tracking-wide sm:text-base"
              @click="scrollToContact"
            >
              Entrar em contato
            </Button>
          </Motion>
        </div>
      </Card>
    </Motion>
  </section>
</template>
