<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Motion } from 'motion-v'
import { me, type ProjectItem } from '~/data/me'
import type { GitHubReposResponse } from '~~/server/api/github-repos.get'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle
} from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'

const projects = ref<ProjectItem[]>(me.projects)
const isLoadingProjects = ref(true)

const EXTENSION_MAP: Record<string, string> = {
  vue: 'vue',
  typescript: 'ts',
  javascript: 'js',
  kotlin: 'kt',
  java: 'java',
  html: 'html',
  css: 'css',
  c: 'c'
}

function getFileExtension(project: ProjectItem): string {
  const lang = (project.language || project.tags[0] || 'ts').toLowerCase()
  return EXTENSION_MAP[lang] || 'ts'
}

onMounted(async () => {
  try {
    const data = await $fetch<GitHubReposResponse>('/api/github-repos')
    if (data?.projects?.length) {
      projects.value = data.projects
    }
  } catch {
    // Mantém os projetos de fallback configurados em me.ts
  } finally {
    isLoadingProjects.value = false
  }
})
</script>

<template>
  <section
    id="projects"
    class="relative flex min-h-screen w-full items-center justify-center px-4 py-24 sm:px-8 md:pl-28 md:pr-12"
    aria-label="Projetos Principais"
  >
    <div class="mx-auto w-full max-w-6xl">
      <!-- Cabeçalho da Seção -->
      <div class="mb-12 flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        <div>
          <h2 class="mt-3 text-3xl font-extrabold tracking-tight text-[#000000] sm:text-4xl dark:text-[#FFFFFF]">
            Projetos
          </h2>
        </div>

        <Button
          as="a"
          variant="ghost"
          :href="me.contact.githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="h-auto rounded-full border border-black/15 bg-black/5 px-4 py-2 text-xs font-semibold text-[#000000] transition-colors hover:bg-black/5 hover:border-[#FE5101] hover:text-[#FE5101] dark:border-white/15 dark:bg-white/5 dark:text-[#FFFFFF] dark:hover:bg-white/5 dark:hover:border-[#FE5101] dark:hover:text-[#FE5101]"
        >
          <span>Ver todos no GitHub (@{{ me.githubUsername }})</span>
          <span aria-hidden="true">↗</span>
        </Button>
      </div>

      <!-- Grid com os Projetos do GitHub -->
      <div
        v-if="isLoadingProjects"
        class="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3"
        aria-busy="true"
      >
        <Card
          v-for="idx in 3"
          :key="`project-skeleton-${idx}`"
          rounded="rounded-xl"
          class-name="flex h-full flex-col justify-between p-6 sm:p-7"
        >
          <CardContent>
            <!-- Header Visual do Card do Projeto (Skeleton) -->
            <div class="relative mb-6 flex h-40 w-full flex-col justify-between overflow-hidden rounded-lg border border-black/15 bg-black/[0.03] p-4 dark:border-white/15 dark:bg-white/[0.03]">
              <div class="flex items-center justify-between">
                <Skeleton class="h-6 w-20 rounded-full" />
                <Skeleton class="h-4 w-8" />
              </div>

              <div class="rounded-md border border-black/10 bg-[#FFFFFF]/80 p-3 dark:border-white/10 dark:bg-[#000000]/80">
                <div class="mb-2 flex items-center gap-1.5">
                  <Skeleton class="h-2 w-2 rounded-full" />
                  <Skeleton class="h-2 w-2 rounded-full" />
                  <Skeleton class="h-2 w-2 rounded-full" />
                  <Skeleton class="ml-2 h-2.5 w-28" />
                </div>
                <div class="space-y-1.5">
                  <Skeleton class="h-1.5 w-3/4 rounded-full" />
                  <Skeleton class="h-1.5 w-1/2 rounded-full" />
                </div>
              </div>
            </div>

            <!-- Título e Descrição (Skeleton) -->
            <Skeleton class="h-3.5 w-24" />
            <Skeleton class="mt-2 h-6 w-3/4" />
            <div class="mt-3.5 space-y-2">
              <Skeleton class="h-3.5 w-full" />
              <Skeleton class="h-3.5 w-5/6" />
              <Skeleton class="h-3.5 w-2/3" />
            </div>
          </CardContent>

          <!-- Rodapé do Card: Tags + Links (Skeleton) -->
          <CardFooter>
            <div class="flex flex-wrap gap-2">
              <Skeleton class="h-6 w-16 rounded-md" />
              <Skeleton class="h-6 w-20 rounded-md" />
              <Skeleton class="h-6 w-14 rounded-md" />
            </div>

            <div class="mt-4 flex items-center gap-3 pt-1">
              <Skeleton class="h-4 w-16" />
              <Skeleton class="h-6 w-24 rounded-full" />
            </div>
          </CardFooter>
        </Card>
      </div>

      <div v-else class="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
        <Motion
          v-for="(project, index) in projects"
          :key="project.id"
          :initial="{ opacity: 0, y: 28 }"
          :while-in-view="{ opacity: 1, y: 0, transition: { duration: 0.55, delay: index * 0.1 } }"
          :viewport="{ once: true, amount: 0.2 }"
          :transition="{ duration: 0.18, ease: 'easeOut' }"
          :while-hover="{ y: -6, transition: { duration: 0.18, ease: 'easeOut', out: true } }"
        >
          <Card
            :interactive="true"
            rounded="rounded-xl"
            class-name="flex h-full flex-col justify-between p-6 sm:p-7"
          >
            <CardContent>
              <!-- Header Visual do Card do Projeto -->
              <div
                class="relative mb-6 flex h-40 w-full flex-col justify-between overflow-hidden rounded-lg border border-black/15 bg-gradient-to-br p-4 dark:border-white/15"
                :class="project.gradient"
              >
                <div class="flex items-center justify-between">
                  <Badge variant="dark" class="px-3 py-1 text-[11px]">
                    {{ project.highlight }}
                  </Badge>
                  <span class="text-xs font-bold text-[#FE5101]">
                    #0{{ index + 1 }}
                  </span>
                </div>

                <!-- Mockup minimalista de código/janela -->
                <div class="rounded-md border border-black/15 bg-[#FFFFFF]/80 p-3 backdrop-blur-md dark:border-white/15 dark:bg-[#000000]/80">
                  <div class="mb-2 flex items-center gap-1.5">
                    <span class="h-2 w-2 rounded-full bg-[#FE5101]" />
                    <span class="h-2 w-2 rounded-full bg-[#000000] dark:bg-[#FFFFFF]" />
                    <span class="h-2 w-2 rounded-full bg-black/30 dark:bg-white/30" />
                    <span class="ml-2 truncate text-[10px] font-mono text-black/60 dark:text-white/60">
                      {{ project.title.toLowerCase().replace(/\s+/g, '-') }}.{{ getFileExtension(project) }}
                    </span>
                  </div>
                  <div class="space-y-1.5">
                    <div class="h-1.5 w-3/4 rounded-full bg-[#FE5101]" />
                    <div class="h-1.5 w-1/2 rounded-full bg-black/25 dark:bg-white/30" />
                  </div>
                </div>
              </div>

              <!-- Título e Descrição -->
              <span class="text-xs font-semibold text-[#FE5101]">
                {{ project.subtitle }}
              </span>
              <CardTitle class="mt-1 leading-snug">
                {{ project.title }}
              </CardTitle>
              <CardDescription class="mt-3">
                {{ project.description }}
              </CardDescription>
            </CardContent>

            <!-- Rodapé do Card: Tags + Links (GitHub / Deploy) -->
            <CardFooter>
              <div class="flex flex-wrap gap-2">
                <Badge
                  v-for="tag in project.tags"
                  :key="tag"
                  variant="default"
                  class="rounded-md px-2.5 py-1"
                >
                  {{ tag }}
                </Badge>
              </div>

              <div
                v-if="project.repoUrl || project.liveUrl"
                class="mt-4 flex items-center gap-3 pt-1"
              >
                <a
                  v-if="project.repoUrl"
                  :href="project.repoUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#000000] transition-colors hover:text-[#FE5101] dark:text-[#FFFFFF] dark:hover:text-[#FE5101]"
                >
                  <span>GitHub</span>
                  <span aria-hidden="true">↗</span>
                </a>

                <Badge
                  v-if="project.liveUrl"
                  as="a"
                  :href="project.liveUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="purple"
                  class="gap-1.5 border-transparent bg-[#FE5101] px-3 py-1 text-xs font-semibold text-[#FFFFFF] transition-opacity hover:opacity-90"
                >
                  <span>Live Demo</span>
                  <span aria-hidden="true">↗</span>
                </Badge>
              </div>
            </CardFooter>
          </Card>
        </Motion>
      </div>
    </div>
  </section>
</template>
