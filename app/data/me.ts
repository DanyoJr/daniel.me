export interface ProjectItem {
  id: string
  repoName?: string
  title: string
  subtitle: string
  description: string
  tags: string[]
  highlight: string
  language?: string
  repoUrl?: string
  liveUrl?: string
  gradient: string
}

export const me = {
  nome: 'Daniel Yoneshige Junior',
  nascimento: '2005-06-28',
  education: {
    completed: [] as string[],
    current: ['Análise e Desenvolvimento de Sistemas']
  },
  work: {
    role: 'Analista de Suporte Técnico',
    company: 'Layers Education'
  },
  hobbies: ['xadrez', 'hollow knight', 'cubo mágico'],
  interests: ['Full Stack', 'infraestrutura'],
  stack: [
    'JavaScript',
    'TypeScript',
    'Vue.js',
    'Nuxt.js',
    'Node.js',
    'Docker',
    'Git',
    'MongoDB',
    'Kotlin'
  ],

  // Informações complementares para os cards da Home, Projetos e Contato
  role: 'Desenvolvedor Web Full-Stack',
  githubUsername: 'DanyoJr',
  contact: {
    email: 'danielyoneshigejunior@gmail.com',
    linkedin: 'linkedin.com/in/daniel-yoneshige-junior-147363299',
    linkedinUrl: 'https://linkedin.com/in/daniel-yoneshige-junior-147363299',
    githubUrl: 'https://github.com/DanyoJr',
    location: 'Santo André, SP — Brasil'
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
    repositories: 13,
    followers: 48,
    avatarUrl: 'https://avatars.githubusercontent.com/u/124712587?v=4'
  },

  githubProjectsConfig: {
    // Se true, exibe apenas os repositórios listados abaixo em `me.projects` (na mesma ordem).
    // Se false, busca todos os repositórios públicos do GitHub exceto os de `ignoreRepos`.
    onlyConfiguredProjects: true,
    // Repositórios que não devem aparecer na listagem de projetos (ex: README do perfil)
    ignoreRepos: ['DanyoJr', 'portfolio_legacy', 'daniel.me'],
    // Quantidade máxima de projetos exibidos na seção (0 = todos)
    maxProjects: 6
  },

  linkedinCard: {
    headline: '',
    educationBadge: 'Análise e Desenvolvimento de Sistemas',
    status: ''
  },

  projects: [
    {
      id: 'beautyHub',
      repoName: 'beautyHub',
      title: 'beautyHub',
      subtitle: 'Aplicação Web • Nuxt/Vue',
      description: 'Plataforma web desenvolvida para o agendamento de serviços na área de beleza',
      tags: ['vue', 'TypeScript', 'Frontend', 'Nuxt'],
      highlight: 'Web App',
      language: 'Vue',
      repoUrl: 'https://github.com/DanyoJr/beautyHub',
      liveUrl: 'https://beautyhub-xi.vercel.app',
      gradient: 'from-[#FE5101]/35 via-black/20 to-[#FE5101]/10'
    },
    {
      id: 'jiraLike',
      repoName: 'jiraLike',
      title: 'jiraLike',
      subtitle: 'Gestão de Tarefas & Projetos • Kotlin',
      description: 'Sistema inspirado no Jira para gerenciamento ágil de projetos, quadros e tarefas desenvolvido em Kotlin.',
      tags: ['Kotlin', 'Backend', 'Architecture'],
      highlight: 'Kotlin App',
      language: 'Kotlin',
      repoUrl: 'https://github.com/DanyoJr/jiraLike',
      gradient: 'from-black/30 via-[#FE5101]/25 to-white/10'
    },
    {
      id: 'liceuxp',
      repoName: 'liceuxp',
      title: 'liceuxp',
      subtitle: 'Plataforma Web • Vue',
      description: 'Aplicação web moderna construída com ecossistema Vue.js para simular um var automatico integrado com o Gemini.',
      tags: ['Vue', 'JavaScript', 'Web'],
      highlight: 'Live Deploy',
      language: 'Vue',
      repoUrl: 'https://github.com/DanyoJr/liceuxp',
      gradient: 'from-[#FE5101]/40 via-[#FE5101]/15 to-black/25'
    },
    {
      id: 'redoil',
      repoName: 'redoil',
      title: 'redoil',
      subtitle: 'Projeto Acadêmico • HTML/CSS',
      description: 'Projeto de faculdade com objetivo de fazer uma aplicação de coleta sustentável de óleo',
      tags: ['HTML', 'CSS', 'Web'],
      highlight: 'University Project',
      language: 'HTML',
      repoUrl: 'https://github.com/DanyoJr/redoil',
      gradient: 'from-black/30 via-[#FE5101]/25 to-white/10'
    },
    {
      id: 'user-api',
      repoName: 'user-api',
      title: 'user-api',
      subtitle: 'API REST • Node.js & JavaScript',
      description: 'Serviço de backend e API para gerenciamento, autenticação e operações de usuários.',
      tags: ['JavaScript', 'Node.js', 'REST API', 'MongoDB'],
      highlight: 'Backend API',
      language: 'JavaScript',
      repoUrl: 'https://github.com/DanyoJr/user-api',
      gradient: 'from-[#FE5101]/40 via-[#FE5101]/15 to-black/25'
    }
  ] as ProjectItem[]
}

export function defineAge(birthDateStr: string = me.nascimento): number {
  const date = new Date()
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
