<script setup lang="ts">
// Background inspirado na arte em ondas da imagem de referência, adaptável ao Light e Dark mode
</script>

<template>
  <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-slate-100 dark:bg-[#050818] transition-colors duration-700">
    <!-- Filtro SVG global para refração Liquid Glass -->
    <svg class="hidden" aria-hidden="true">
      <defs>
        <filter id="liquid-glass-refraction" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015"
            numOctaves="2"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="12"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>

    <!-- Ondas vetoriais inspiradas no print de referência -->
    <svg
      class="absolute inset-0 h-full w-full object-cover opacity-85 dark:opacity-95 transition-opacity duration-700"
      viewBox="0 0 1440 900"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bgBase" x1="0" y1="0" x2="1440" y2="900" gradientUnits="userSpaceOnUse">
          <stop offset="0%" class="stop-color-[#e0e7ff] dark:stop-color-[#040924]" stop-color="#040924" />
          <stop offset="50%" class="stop-color-[#c7d2fe] dark:stop-color-[#0a1647]" stop-color="#0a1647" />
          <stop offset="100%" class="stop-color-[#ddd6fe] dark:stop-color-[#090d2a]" stop-color="#090d2a" />
        </linearGradient>

        <linearGradient id="waveCyan" x1="150" y1="0" x2="850" y2="900" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.65" />
          <stop offset="50%" stop-color="#2563eb" stop-opacity="0.45" />
          <stop offset="100%" stop-color="#4f46e5" stop-opacity="0.7" />
        </linearGradient>

        <linearGradient id="waveBlueRibbon" x1="950" y1="0" x2="450" y2="900" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.55" />
          <stop offset="55%" stop-color="#6366f1" stop-opacity="0.45" />
          <stop offset="100%" stop-color="#a855f7" stop-opacity="0.35" />
        </linearGradient>

        <linearGradient id="waveGoldCorner" x1="850" y1="550" x2="1440" y2="900" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#eab308" stop-opacity="0.75" />
          <stop offset="100%" stop-color="#ca8a04" stop-opacity="0.45" />
        </linearGradient>
      </defs>

      <!-- Camada base -->
      <rect width="1440" height="900" fill="url(#bgBase)" class=" opacity-25 dark:opacity-100" />

      <!-- Faixa diagonal turquesa/azul à esquerda -->
      <path
        d="M-120 -80 C 120 180, 260 520, 560 960 L 180 960 C -40 620, -140 310, -220 -80 Z"
        fill="url(#waveCyan)"
      />

      <!-- Fita curva central translúcida (como no print) -->
      <path
        d="M1040 -60 C 900 280, 740 540, 460 960 L 660 960 C 900 580, 1080 280, 1240 -60 Z"
        fill="url(#waveBlueRibbon)"
      />

      <!-- Curva dourada/amarela no canto inferior direito (igual à referência) -->
      <path
        d="M860 940 C 980 680, 1220 560, 1520 620 L 1520 960 Z"
        fill="url(#waveGoldCorner)"
      />
    </svg>

    <!-- Brilhos difusos (Mesh Glows) para enriquecer a refração do Liquid Glass -->
    <div class="absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-cyan-500/25 dark:bg-cyan-500/20 blur-[120px]" />
    <div class="absolute top-1/3 left-1/2 -translate-x-1/2 h-[30rem] w-[36rem] rounded-full bg-indigo-500/20 dark:bg-blue-600/25 blur-[140px]" />
    <div class="absolute -bottom-32 -right-16 h-[26rem] w-[28rem] rounded-full bg-amber-400/30 dark:bg-yellow-500/25 blur-[120px]" />
  </div>
</template>
