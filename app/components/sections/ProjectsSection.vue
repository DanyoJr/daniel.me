<script setup lang="ts">
import { Motion } from 'motion-v'
import { me } from '~/data/me'
import LiquidGlass from '~/components/glass/LiquidGlass.vue'

const projects = me.projects
</script>

<template>
  <section
    id="projects"
    class="relative flex min-h-screen w-full items-center justify-center px-4 py-24 sm:px-8 md:pl-28 md:pr-12"
    aria-label="Projetos Principais"
  >
    <div class="mx-auto w-full max-w-6xl">
      <!-- Cabeçalho da Seção -->
      <div class="mb-12 text-center md:text-left">
        <span class="inline-block rounded-full bg-purple-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-purple-800 border border-purple-400/30 dark:text-purple-300">
          Selected Works
        </span>
        <h2 class="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Projetos Principais
        </h2>
        <p class="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base dark:text-slate-300">
          Os 3 principais projetos desenvolvidos com foco em performance, arquitetura limpa e experiência do usuário.
        </p>
      </div>

      <!-- Grid com os 3 Projetos Principais -->
      <div class="grid grid-cols-1 gap-7 md:grid-cols-3">
        <Motion
          v-for="(project, index) in projects"
          :key="project.id"
          :initial="{ opacity: 0, y: 28 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, amount: 0.2 }"
          :transition="{ duration: 0.55, delay: index * 0.12 }"
          :while-hover="{ y: -6 }"
        >
          <LiquidGlass
            :interactive="true"
            rounded="rounded-3xl"
            class-name="flex h-full flex-col justify-between p-6 sm:p-7"
          >
            <div>
              <!-- Header Visual do Card do Projeto -->
              <div
                class="relative mb-6 flex h-40 w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/30 bg-gradient-to-br p-4 dark:border-white/15"
                :class="project.gradient"
              >
                <div class="flex items-center justify-between">
                  <span class="rounded-full bg-slate-950/60 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                    {{ project.highlight }}
                  </span>
                  <span class="text-xs font-bold text-slate-800/80 dark:text-white/80">
                    #0{{ index + 1 }}
                  </span>
                </div>

                <!-- Mockup minimalista de código/janela -->
                <div class="rounded-xl border border-white/30 bg-white/50 p-3 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/60">
                  <div class="mb-2 flex items-center gap-1.5">
                    <span class="h-2 w-2 rounded-full bg-rose-400" />
                    <span class="h-2 w-2 rounded-full bg-amber-400" />
                    <span class="h-2 w-2 rounded-full bg-emerald-400" />
                    <span class="ml-2 truncate text-[10px] font-mono text-slate-600 dark:text-slate-400">
                      {{ project.title.toLowerCase().replace(/\s+/g, '-') }}.ts
                    </span>
                  </div>
                  <div class="space-y-1.5">
                    <div class="h-1.5 w-3/4 rounded-full bg-purple-500/60" />
                    <div class="h-1.5 w-1/2 rounded-full bg-slate-400/50 dark:bg-slate-600" />
                  </div>
                </div>
              </div>

              <!-- Título e Descrição -->
              <span class="text-xs font-semibold text-purple-700 dark:text-purple-300">
                {{ project.subtitle }}
              </span>
              <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                {{ project.title }}
              </h3>
              <p class="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {{ project.description }}
              </p>
            </div>

            <!-- Tags de Tecnologias -->
            <div class="mt-6 border-t border-slate-300/40 pt-4 dark:border-white/10">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in project.tags"
                  :key="tag"
                  class="rounded-xl bg-white/45 px-2.5 py-1 text-xs font-semibold text-slate-800 border border-white/40 dark:bg-white/10 dark:text-slate-200 dark:border-white/10"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </LiquidGlass>
        </Motion>
      </div>
    </div>
  </section>
</template>
