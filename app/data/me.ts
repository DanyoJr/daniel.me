export interface StackItem {
  id: string
  name: string
  category: string
  description: string
  color: string
  accentBg: string
  level: string
}

export interface ProjectItem {
  id: string
  title: string
  subtitle: string
  description: string
  tags: string[]
  highlight: string
  repoUrl?: string
  liveUrl?: string
  gradient: string
}

export const me = {
  nome: 'Daniel Yoneshige Junior',
  nascimento: '2005-06-28',
  education: {
    completed: ['Análise e Desenvolvimento de Sistemas'],
    current: ['']
  },
  hobbies: ['xadrez', 'hollow knight', 'rubik-cube'],
  interests: ['Full Stack Development', 'WebDevelopment', 'Infraestructure', 'MongoDB'],
  stack: ['mongodb', 'typescript', 'vue', 'nuxt', 'javascript'],

  // Informações complementares para os cards da Home, Projetos e Contato
  role: 'Desenvolvedor Web Full-Stack',
  githubUsername: 'yoneshige',
  contact: {
    email: 'daniel.yoneshige@email.com',
    linkedin: 'linkedin.com/in/daniel-yoneshige',
    linkedinUrl: 'https://linkedin.com/in/daniel-yoneshige',
    githubUrl: 'https://github.com/yoneshige',
    location: 'São Paulo, SP — Brasil'
  },

  spotifyFallback: {
    isPlaying: false,
    title: 'City of Tears (Hollow Knight OST)',
    artist: 'Christopher Larkin',
    album: 'Hollow Knight (Original Soundtrack)',
    albumArt: '',
    songUrl: 'https://open.spotify.com'
  },

  githubFallback: {
    repositories: 24,
    followers: 48,
    avatarUrl: ''
  },

  linkedinCard: {
    headline: 'Full Stack Developer • Vue / Nuxt / TypeScript / MongoDB',
    educationBadge: 'Análise e Desenvolvimento de Sistemas',
    status: 'Open to networking & opportunities'
  },

  stacksDetailed: [
    {
      id: 'mongodb',
      name: 'MongoDB',
      category: 'Database & NoSQL',
      description: 'Modelagem de documentos orientada a performance, Aggregation Pipelines, indexação avançada e escalabilidade horizontal.',
      color: '#10B981',
      accentBg: 'from-emerald-500/25 to-teal-500/10',
      level: 'Core Stack'
    },
    {
      id: 'nuxt',
      name: 'Nuxt',
      category: 'Full-Stack Framework',
      description: 'Arquitetura SSR/SPA híbrida, Server Routes (Nitro), otimização de SEO, auto-imports e alta performance no ecossistema Vue.',
      color: '#00DC82',
      accentBg: 'from-green-500/25 to-emerald-500/10',
      level: 'Core Stack'
    },
    {
      id: 'vue',
      name: 'Vue.js',
      category: 'Frontend Architecture',
      description: 'Composition API, reatividade granular, componentes modulares, animações fluidas e interfaces elegantes centradas no usuário.',
      color: '#42B883',
      accentBg: 'from-teal-500/25 to-cyan-500/10',
      level: 'Core Stack'
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      category: 'Type-Safe Language',
      description: 'Tipagem estática ponta a ponta (frontend e backend), contratos seguros de API, manutenibilidade e arquitetura limpa.',
      color: '#3B82F6',
      accentBg: 'from-blue-500/25 to-indigo-500/10',
      level: 'Core Stack'
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      category: 'Web Runtime & ESNext',
      description: 'Domínio profundo de assincronismo, Event Loop, manipulação de DOM, Web APIs modernas e otimização em tempo de execução.',
      color: '#F59E0B',
      accentBg: 'from-amber-500/25 to-yellow-500/10',
      level: 'Core Stack'
    }
  ] as StackItem[],

  projects: [
    {
      id: 'project-1',
      title: 'Nexus Cloud & Infra Monitor',
      subtitle: 'Monitoramento e Telemetria Full-Stack',
      description: 'Plataforma web em tempo real para acompanhamento de serviços, métricas de infraestrutura e logs estruturados armazenados em clusters MongoDB.',
      tags: ['Nuxt', 'Vue', 'TypeScript', 'MongoDB'],
      highlight: 'Real-Time Analytics',
      gradient: 'from-purple-500/30 via-indigo-500/20 to-blue-500/20'
    },
    {
      id: 'project-2',
      title: 'KnightChess Engine UI',
      subtitle: 'Plataforma Interativa de Xadrez & Puzzles',
      description: 'Aplicação reativa de análise de partidas e resolução tática com sincronização de estado rápida, histórico em banco documental e interface minimalista.',
      tags: ['Vue', 'TypeScript', 'JavaScript', 'MongoDB'],
      highlight: 'Interactive WebApp',
      gradient: 'from-emerald-500/30 via-teal-500/20 to-cyan-500/20'
    },
    {
      id: 'project-3',
      title: 'Pulse API Gateway & Workspace',
      subtitle: 'Gerenciador de Projetos e Automação Web',
      description: 'Ecossistema modular para gestão de deploys, integrações de APIs externas e dashboards customizáveis com foco em UX e velocidade.',
      tags: ['Nuxt', 'TypeScript', 'MongoDB', 'Tailwind'],
      highlight: 'Full-Stack Architecture',
      gradient: 'from-amber-500/30 via-orange-500/20 to-rose-500/20'
    }
  ] as ProjectItem[]
}

export function defineAge(birthDateStr: string = me.nascimento): number {
  const date = new Date()
  // Parse YYYY-MM-DD safely in local time so timezone offsets don't shift the day
  const parts = birthDateStr.split('-').map(Number)
  const nasc = parts.length === 3
    ? new Date(parts[0]!, parts[1]! - 1, parts[2]!)
    : new Date(birthDateStr)

  let idade = date.getFullYear() - nasc.getFullYear()
  const aniversarioAindaNaoChegou =
    date.getMonth() < nasc.getMonth() ||
    (date.getMonth() === nasc.getMonth() && date.getDate() < nasc.getDate())

  if (aniversarioAindaNaoChegou) {
    idade--
  }
  return idade
}

export const age = defineAge()
