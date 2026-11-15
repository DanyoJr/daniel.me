<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Motion } from 'motion-v'
import { me, defineAge } from '~/data/me'
import LiquidGlass from '~/components/glass/LiquidGlass.vue'
import type { SpotifyTrackResponse } from '~~/server/api/spotify.get'

// Idade calculada dinamicamente a partir de me.nascimento ("2005-06-28")
const currentAge = computed(() => defineAge(me.nascimento))

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
  // 1. Busca dados do Spotify na server route
  try {
    const spData = await $fetch<SpotifyTrackResponse>('/api/spotify')
    if (spData?.title) {
      spotify.value = spData
    }
  } catch {
    // Mantém fallback do me.ts
  }

  // 2. Busca dados reais da API pública do GitHub
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
})
</script>

<template>
  <section
    id="home"
    class="relative flex min-h-screen w-full items-center justify-center px-4 pt-36 pb-20 sm:px-8 md:pl-28 md:pr-12 md:pt-28"
  >
    <div class="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
      <!-- CARD 1 (Esquerda): Container Liquid Glass com os 3 sub-cards (Música, GitHub e LinkedIn) -->
      <Motion
        class="lg:col-span-6"
        :initial="{ opacity: 0, x: -32 }"
        :animate="{ opacity: 1, x: 0 }"
        :transition="{ duration: 0.65, ease: 'easeOut' }"
      >
        <LiquidGlass
          rounded="rounded-3xl"
          class-name="p-4 sm:p-6"
        >
          <div class="flex flex-col gap-4">
            <!-- Sub-card 1: Música (Spotify API + Fallback) -->
            <Motion :while-hover="{ scale: 1.015 }">
              <LiquidGlass
                as="a"
                :href="spotify.songUrl"
                target="_blank"
                rel="noopener noreferrer"
                tint="subtle"
                :interactive="true"
                rounded="rounded-2xl"
                class-name="block p-4"
              >
                <div class="mb-1 flex items-center justify-end">
                  <span class="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-slate-600 dark:text-slate-400">
                    <span
                      v-if="spotify.isPlaying"
                      class="inline-block h-2 w-2 animate-ping rounded-full bg-emerald-400"
                    />
                    {{ spotify.isPlaying ? 'now playing' : 'last played song' }}
                  </span>
                </div>

                <div class="flex items-center gap-4">
                  <!-- Ícone do Spotify estilo o print -->
                  <div class="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-black shadow-md">
                    <img
                      v-if="spotify.albumArt"
                      :src="spotify.albumArt"
                      :alt="spotify.title"
                      class="h-full w-full object-cover opacity-90"
                    />
                    <svg
                      v-else
                      class="h-10 w-10 text-[#1ED760]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.786-.963-.335.077-.67-.133-.746-.469-.077-.336.132-.67.469-.746 3.809-.87 7.076-.496 9.713 1.115.293.18.386.563.207.856zm1.224-2.722c-.226.367-.706.482-1.072.257-2.687-1.652-6.785-2.131-9.965-1.166-.413.127-.848-.106-.973-.517-.125-.413.108-.848.52-.973 3.632-1.102 8.147-.568 11.234 1.328.366.226.48.707.256 1.071zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.493.15-1.016-.129-1.166-.623-.148-.495.13-1.015.625-1.166 3.532-1.073 9.404-.866 13.115 1.337.445.264.59.838.327 1.282-.264.443-.838.59-1.283.327z"
                      />
                    </svg>
                  </div>

                  <!-- Informações da música + Barras estilizadas como no print -->
                  <div class="min-w-0 flex-1 space-y-2">
                    <div class="truncate text-sm font-bold text-slate-900 dark:text-white">
                      {{ spotify.title }}
                    </div>
                    <div class="truncate text-xs text-slate-600 dark:text-slate-300">
                      {{ spotify.artist }}
                    </div>
                    <!-- Barras visuais inspiradas no print -->
                    <div class="space-y-1.5 pt-0.5">
                      <div class="h-2 w-full overflow-hidden rounded-full bg-slate-400/30 dark:bg-slate-600/40">
                        <div class="h-full w-3/4 rounded-full bg-emerald-500/75 dark:bg-emerald-400/70" />
                      </div>
                      <div class="h-2 w-4/5 rounded-full bg-slate-400/25 dark:bg-slate-600/35" />
                    </div>
                  </div>
                </div>
              </LiquidGlass>
            </Motion>

            <!-- Sub-card 2: GitHub Profile (GitHub API real + Fallback) -->
            <Motion :while-hover="{ scale: 1.015 }">
              <LiquidGlass
                as="a"
                :href="github.profileUrl"
                target="_blank"
                rel="noopener noreferrer"
                tint="subtle"
                :interactive="true"
                rounded="rounded-2xl"
                class-name="block p-4"
              >
                <div class="flex items-center gap-4">
                  <!-- Ícone GitHub fundo branco estilo o print -->
                  <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-md">
                    <svg class="h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      />
                    </svg>
                  </div>

                  <div class="min-w-0 flex-1">
                    <h3 class="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      MY GITHUB PROFILE
                    </h3>
                    <div class="mt-2.5 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                      <div class="flex items-center gap-1.5">
                        <span class="rounded-full bg-purple-600/85 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
                          {{ github.repositories }}
                        </span>
                        <span class="text-slate-700 dark:text-slate-200">repositories</span>
                      </div>

                      <div class="flex items-center gap-1.5">
                        <span class="rounded-full bg-purple-600/85 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
                          {{ github.followers }}
                        </span>
                        <span class="text-slate-700 dark:text-slate-200">followers</span>
                      </div>
                    </div>
                  </div>
                </div>
              </LiquidGlass>
            </Motion>

            <!-- Sub-card 3: LinkedIn (Mocado do me.ts conforme solicitado) -->
            <Motion :while-hover="{ scale: 1.015 }">
              <LiquidGlass
                as="a"
                :href="me.contact.linkedinUrl"
                target="_blank"
                rel="noopener noreferrer"
                tint="subtle"
                :interactive="true"
                rounded="rounded-2xl"
                class-name="block p-4"
              >
                <div class="mb-1 flex items-center justify-end">
                  <span class="text-[11px] font-medium tracking-wide text-slate-600 dark:text-slate-400">
                    {{ me.linkedinCard.status }}
                  </span>
                </div>

                <div class="flex items-center gap-4">
                  <!-- Ícone LinkedIn -->
                  <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white shadow-md">
                    <svg class="h-10 w-10 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
                      />
                    </svg>
                  </div>

                  <div class="min-w-0 flex-1">
                    <h3 class="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      LINKEDIN PROFILE
                    </h3>
                    <p class="mt-1 truncate text-xs text-slate-700 dark:text-slate-300">
                      {{ me.linkedinCard.headline }}
                    </p>
                    <!-- Barras de status inspiradas no print -->
                    <div class="mt-2.5 grid grid-cols-2 gap-2.5">
                      <div class="h-2.5 rounded-full bg-slate-400/35 dark:bg-slate-600/50">
                        <div class="h-full w-4/5 rounded-full bg-sky-500/75" />
                      </div>
                      <div class="h-2.5 rounded-full bg-slate-400/35 dark:bg-slate-600/50">
                        <div class="h-full w-2/3 rounded-full bg-indigo-500/75" />
                      </div>
                    </div>
                  </div>
                </div>
              </LiquidGlass>
            </Motion>
          </div>
        </LiquidGlass>
      </Motion>

      <!-- CARD 2 (Direita): Breve explicação sobre a pessoa + Idade dinâmica + Botão Entrar em contato -->
      <Motion
        class="lg:col-span-6"
        :initial="{ opacity: 0, x: 32 }"
        :animate="{ opacity: 1, x: 0 }"
        :transition="{ duration: 0.65, delay: 0.12, ease: 'easeOut' }"
      >
        <LiquidGlass
          rounded="rounded-3xl"
          class-name="p-6 sm:p-8 lg:p-10"
        >
          <div class="mb-4 flex flex-wrap items-center gap-2">
            <span class="rounded-full bg-purple-600/20 px-3 py-1 text-xs font-semibold text-purple-800 border border-purple-400/30 dark:bg-purple-500/20 dark:text-purple-200">
              {{ currentAge }} anos
            </span>
            <span
              v-for="course in me.education.completed"
              :key="course"
              class="rounded-full bg-white/40 px-3 py-1 text-xs font-medium text-slate-800 border border-white/40 dark:bg-white/10 dark:text-slate-200 dark:border-white/15"
            >
              🎓 {{ course }}
            </span>
          </div>

          <p class="text-base leading-relaxed text-slate-800 sm:text-lg sm:leading-8 dark:text-slate-100">
            Olá, meu nome é <strong class="font-bold text-purple-700 dark:text-purple-300">{{ me.nome }}</strong>,
            tenho <strong class="font-bold text-purple-700 dark:text-purple-300">{{ currentAge }} anos</strong> e sou um
            apaixonado desenvolvedor web full-stack formado em
            <span class="underline decoration-purple-400/60 underline-offset-4">{{ me.education.completed[0] }}</span>.
            Minha paixão pelo software se traduz na habilidade de conceber ideias e transformá-las em realidade,
            por meio de interfaces elegantes e arquiteturas sólidas em
            <span class="font-semibold">{{ me.interests.join(', ') }}</span>.
            Dedico um cuidado meticuloso à experiência do usuário, à arquitetura e à qualidade do código em todos os
            projetos que realizo.
          </p>

          <!-- Hobbies & Interesses vindos do me.ts -->
          <div class="mt-6 flex flex-wrap items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
            <span class="font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Hobbies:</span>
            <span
              v-for="hobby in me.hobbies"
              :key="hobby"
              class="rounded-xl bg-white/35 px-2.5 py-1 font-medium capitalize border border-white/30 dark:bg-white/5 dark:border-white/10"
            >
              {{ hobby }}
            </span>
          </div>

          <!-- Botão "Entrar em contato" com Liquid Glass roxo estilo o print -->
          <div class="mt-8">
            <Motion
              class="inline-block"
              :while-hover="{ scale: 1.05 }"
              :while-tap="{ scale: 0.96 }"
            >
              <LiquidGlass
                as="button"
                type="button"
                tint="purple"
                :interactive="true"
                rounded="rounded-full"
                class-name="px-7 py-3 text-sm sm:text-base font-semibold tracking-wide text-white"
                @click="scrollToContact"
              >
                Entrar em contato
              </LiquidGlass>
            </Motion>
          </div>
        </LiquidGlass>
      </Motion>
    </div>
  </section>
</template>
