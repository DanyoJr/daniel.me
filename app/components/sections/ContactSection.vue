<script setup lang="ts">
import { Motion } from 'motion-v'
import { me } from '~/data/me'
import LiquidGlass from '~/components/glass/LiquidGlass.vue'
</script>

<template>
  <section
    id="contact"
    class="relative flex min-h-[75vh] w-full items-center justify-center px-4 py-24 sm:px-8 md:pl-28 md:pr-12"
    aria-label="Entre em contato"
  >
    <div class="mx-auto w-full max-w-4xl">
      <Motion
        :initial="{ opacity: 0, y: 24 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :viewport="{ once: true, amount: 0.3 }"
        :transition="{ duration: 0.6 }"
      >
        <LiquidGlass
          rounded="rounded-3xl"
          class-name="p-8 sm:p-12 text-center"
        >
          <!-- Texto superior solicitado: "Entre em contato" -->
          <span class="inline-block rounded-full bg-purple-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-purple-800 border border-purple-400/30 dark:text-purple-300">
            Contact Me
          </span>
          <h2 class="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Entre em contato
          </h2>

          <!-- Localização -->
          <div class="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-white/35 px-4 py-1.5 text-sm font-medium text-slate-700 border border-white/40 dark:bg-white/10 dark:text-slate-200 dark:border-white/15">
            <svg
              class="h-4 w-4 text-purple-600 dark:text-purple-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{{ me.contact.location }}</span>
          </div>

          <!-- Dois buttons sem action contendo Email e LinkedIn -->
          <div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Motion :while-hover="{ scale: 1.03 }">
              <LiquidGlass
                as="button"
                type="button"
                tint="subtle"
                :interactive="true"
                rounded="rounded-2xl"
                class-name="w-full sm:w-auto px-6 py-4 text-slate-900 dark:text-white cursor-default"
              >
                <div class="flex items-center justify-center gap-3">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-600/20 text-purple-700 dark:bg-purple-500/25 dark:text-purple-300">
                    <svg
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
                  </div>
                  <div class="text-left">
                    <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      E-mail
                    </span>
                    <span class="text-sm font-semibold sm:text-base">
                      {{ me.contact.email }}
                    </span>
                  </div>
                </div>
              </LiquidGlass>
            </Motion>

            <Motion :while-hover="{ scale: 1.03 }">
              <LiquidGlass
                as="button"
                type="button"
                tint="subtle"
                :interactive="true"
                rounded="rounded-2xl"
                class-name="w-full sm:w-auto px-6 py-4 text-slate-900 dark:text-white cursor-default"
              >
                <div class="flex items-center justify-center gap-3">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 text-sky-700 dark:bg-sky-500/25 dark:text-sky-300">
                    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
                      />
                    </svg>
                  </div>
                  <div class="text-left">
                    <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      LinkedIn
                    </span>
                    <span class="text-sm font-semibold sm:text-base">
                      {{ me.contact.linkedin }}
                    </span>
                  </div>
                </div>
              </LiquidGlass>
            </Motion>
          </div>
        </LiquidGlass>
      </Motion>
    </div>
  </section>
</template>
