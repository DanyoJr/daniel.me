<script setup lang="ts">
import WeatherCard from './WeatherCard.vue'
import ThemeToggle from './ThemeToggle.vue'
</script>

<template>
  <header
    class="fixed top-20 right-3 z-40 flex items-center gap-2 md:top-6 md:right-6 sm:gap-3"
    aria-label="Clima e Tema"
  >
    <WeatherCard />
    <ThemeToggle />
  </header>
</template>
