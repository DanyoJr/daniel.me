<script setup lang="ts">
import AppBackground from '~/components/layout/AppBackground.vue'
import AppDock from '~/components/layout/AppDock.vue'
import TopRightControls from '~/components/layout/TopRightControls.vue'
import { useTheme } from '~/composables/useTheme'

// Inicializa o tema (Dark / Light)
useTheme()
</script>

<template>
  <div class="relative min-h-screen w-full text-slate-900 dark:text-slate-100">
    <!-- Fundo Mesh / Ondas adaptável ao tema -->
    <AppBackground />

    <!-- Dock Fixo/Reativo com Engrenagem de Configurações -->
    <AppDock />

    <!-- Topo Direito: Card de Clima Magnético + Botão Dark Mode -->
    <TopRightControls />

    <!-- Conteúdo das Páginas -->
    <main class="relative z-10 w-full">
      <slot />
    </main>
  </div>
</template>
