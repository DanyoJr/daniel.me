<script setup lang="ts">
import HomeSection from '~/components/sections/HomeSection.vue'
import StacksCarousel from '~/components/sections/StacksCarousel.vue'
import ProjectsSection from '~/components/sections/ProjectsSection.vue'
import ContactSection from '~/components/sections/ContactSection.vue'
</script>

<template>
  <div class="w-full">
    <!-- 1. Home (Cards Spotify, GitHub, LinkedIn + Sobre mim com idade dinâmica) -->
    <HomeSection />

    <!-- Faixa contínua de linguagens passando automaticamente da direita para a esquerda -->
    <StacksCarousel />

    <!-- 3. Projetos Principais (3 Cards) -->
    <ProjectsSection />

    <!-- 4. Contact Me (Texto + Localização + 2 Buttons sem action) -->
    <ContactSection />
  </div>
</template>
