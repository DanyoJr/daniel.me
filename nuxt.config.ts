import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  telemetry: false,
  modules: ['shadcn-nuxt', 'motion-v/nuxt'],

  css: ['~/assets/css/tailwind.css'],

  app: {
    head: {
      title: 'Daniel Yoneshige Junior | Full Stack Developer & Support Technician',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Portfólio de Daniel Yoneshige Junior — Full Stack Developer & Support Technician' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  vite: {
    plugins: [
      tailwindcss()
    ]
  },

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui'
  }
})