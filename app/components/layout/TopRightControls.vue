<script setup lang="ts">
import WeatherCard from './WeatherCard.vue'
import AppDock from './AppDock.vue'
import ThemeToggle from './ThemeToggle.vue'
</script>

<template>
  <header
    class="fixed top-4 inset-x-4 sm:inset-x-8 z-50 mx-auto flex max-w-5xl flex-row items-center justify-between gap-2 sm:gap-4 md:top-6 md:right-6 md:left-auto md:mx-0 md:max-w-none md:justify-end md:gap-3"
    aria-label="Clima, Navegação e Tema"
  >
    <WeatherCard class="shrink-0" />
    <AppDock />
    <ThemeToggle class="shrink-0" />
  </header>
</template>
