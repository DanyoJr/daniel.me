<script setup lang="ts">
import { Motion } from 'motion-v'
import { me } from '~/data/me'
import { Badge } from '~/components/ui/badge'
import { Card } from '~/components/ui/card'
</script>

<template>
  <section
    id="contact"
    class="relative flex min-h-[75vh] w-full items-center justify-center px-4 py-24 sm:px-8 md:pl-28 md:pr-12"
    aria-label="Entre em contato"
  >
    <div class="mx-auto w-full max-w-5xl">
      <Motion
        :initial="{ opacity: 0, y: 24 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :viewport="{ once: true, amount: 0.3 }"
        :transition="{ duration: 0.6 }"
      >
        <Card
          rounded="rounded-xl"
          class-name="p-5 sm:p-8 md:p-10 text-center"
        >
          <!-- Texto superior solicitado: "Entre em contato" -->
          <Badge
            variant="purple"
            class="px-3.5 py-1 text-xs font-bold uppercase tracking-widest"
          >
            Contact Me
          </Badge>
          <h2 class="mt-3 text-2xl font-extrabold tracking-tight text-[#000000] sm:text-4xl dark:text-[#FFFFFF]">
            Entre em contato
          </h2>

          <!-- Localização -->
          <Badge
            variant="default"
            class="mt-4 max-w-full justify-center gap-2 px-4 py-1.5 text-xs font-medium sm:text-sm"
          >
            <svg
              class="h-4 w-4 shrink-0 text-[#FE5101]"
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
            <span class="truncate">{{ me.contact.location }}</span>
          </Badge>

          <!-- Dois buttons sem action contendo Email e LinkedIn -->
          <div class="mt-8 grid w-full grid-cols-1 gap-3.5 sm:gap-4 md:grid-cols-2">
            <Motion class="min-w-0 w-full" :while-hover="{ scale: 1.02 }">
              <Card
                as="button"
                type="button"
                tint="subtle"
                :interactive="true"
                rounded="rounded-lg"
                class-name="w-full px-4 py-3.5 sm:px-5 sm:py-4 text-[#000000] dark:text-[#FFFFFF] cursor-default"
              >
                <div class="flex min-w-0 w-full items-center gap-3">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#FE5101]/15 text-[#FE5101] dark:bg-[#FE5101]/25 dark:text-[#FE5101]">
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
                  <div class="min-w-0 flex-1 text-left">
                    <span class="block text-[10px] font-bold uppercase tracking-wider text-black/50 dark:text-white/50">
                      E-mail
                    </span>
                    <span class="block truncate text-xs font-semibold sm:text-sm">
                      {{ me.contact.email }}
                    </span>
                  </div>
                </div>
              </Card>
            </Motion>

            <Motion class="min-w-0 w-full" :while-hover="{ scale: 1.02 }">
              <Card
                as="button"
                type="button"
                tint="subtle"
                :interactive="true"
                rounded="rounded-lg"
                class-name="w-full px-4 py-3.5 sm:px-5 sm:py-4 text-[#000000] dark:text-[#FFFFFF] cursor-default"
              >
                <div class="flex min-w-0 w-full items-center gap-3">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-sky-500/20 text-sky-700 dark:bg-sky-500/25 dark:text-sky-300">
                    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
                      />
                    </svg>
                  </div>
                  <div class="min-w-0 flex-1 text-left">
                    <span class="block text-[10px] font-bold uppercase tracking-wider text-black/50 dark:text-white/50">
                      LinkedIn
                    </span>
                    <span class="block truncate text-xs font-semibold sm:text-sm">
                      {{ me.contact.linkedin }}
                    </span>
                  </div>
                </div>
              </Card>
            </Motion>
          </div>
        </Card>
      </Motion>
    </div>
  </section>
</template>
