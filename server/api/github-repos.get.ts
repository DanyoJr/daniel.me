import { defineEventHandler } from 'h3'
import { me, type ProjectItem } from '../../app/data/me'

interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  topics?: string[]
  fork: boolean
  archived?: boolean
  pushed_at: string
  updated_at: string
  stargazers_count: number
}

const CARD_GRADIENTS = [
  'from-[#FE5101]/35 via-black/20 to-[#FE5101]/10',
  'from-black/30 via-[#FE5101]/25 to-white/10',
  'from-[#FE5101]/40 via-[#FE5101]/15 to-black/25'
]

export interface GitHubReposResponse {
  projects: ProjectItem[]
  source: 'github-api' | 'fallback'
}

export default defineEventHandler(async (): Promise<GitHubReposResponse> => {
  const username = me.githubUsername
  const onlyConfigured = me.githubProjectsConfig?.onlyConfiguredProjects ?? true
  const ignoreSet = new Set(
    (me.githubProjectsConfig?.ignoreRepos || ['DanyoJr']).map(r => r.toLowerCase())
  )
  const maxProjects = me.githubProjectsConfig?.maxProjects ?? 6

  // Mapa de metadados locais configurados em me.ts
  const localMetaByRepo = new Map<string, ProjectItem>()
  for (const item of me.projects) {
    const key = (item.repoName || item.title || item.id).toLowerCase()
    localMetaByRepo.set(key, item)
  }

  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'daniel-me-portfolio'
    }

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=pushed&per_page=100`,
      { headers }
    )

    if (res.ok) {
      const repos = (await res.json()) as GitHubRepo[]
      const repoByName = new Map<string, GitHubRepo>()
      for (const r of repos) {
        repoByName.set(r.name.toLowerCase(), r)
      }

      if (onlyConfigured) {
        // Usa a lista e ordem definidas em me.projects, enriquecendo com dados da API do GitHub
        const projects: ProjectItem[] = me.projects
          .filter(item => !ignoreSet.has((item.repoName || item.title || item.id).toLowerCase()))
          .map((local, index) => {
            const key = (local.repoName || local.title || local.id).toLowerCase()
            const repo = repoByName.get(key)
            const language = local.language || repo?.language || 'Code'
            const topics = local.tags?.length
              ? local.tags
              : (Array.isArray(repo?.topics) && repo.topics.length > 0 ? repo.topics : [language])

            return {
              id: String(repo?.id || local.id),
              repoName: repo?.name || local.repoName || local.title,
              title: local.title || repo?.name || local.id,
              subtitle: local.subtitle || (repo?.language ? `Repositório • ${repo.language}` : 'Repositório GitHub'),
              description:
                local.description ||
                (repo?.description && repo.description.trim()) ||
                `Projeto desenvolvido em ${language} disponível no GitHub.`,
              tags: topics,
              highlight: local.highlight || (local.liveUrl ? 'Live Deploy' : language),
              language,
              repoUrl: local.repoUrl || repo?.html_url,
              liveUrl: local.liveUrl,
              gradient: local.gradient || CARD_GRADIENTS[index % CARD_GRADIENTS.length]!
            }
          })

        return {
          projects: maxProjects > 0 ? projects.slice(0, maxProjects) : projects,
          source: 'github-api'
        }
      }

      const filtered = repos
        .filter(repo => !repo.fork && !repo.archived && !ignoreSet.has(repo.name.toLowerCase()))
        .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())

      const sliced = maxProjects > 0 ? filtered.slice(0, maxProjects) : filtered

      const projects: ProjectItem[] = sliced.map((repo, index) => {
        const local = localMetaByRepo.get(repo.name.toLowerCase())
        const language = local?.language || repo.language || 'Code'
        const topics = local?.tags?.length
          ? local.tags
          : (Array.isArray(repo.topics) && repo.topics.length > 0 ? repo.topics : [language])

        const liveUrl = local
          ? local.liveUrl
          : (repo.homepage && repo.homepage.trim() !== '' && !repo.homepage.includes('github.com/')
              ? repo.homepage.trim()
              : undefined)

        return {
          id: String(repo.id || repo.name),
          repoName: repo.name,
          title: local?.title || repo.name,
          subtitle: local?.subtitle || (repo.language ? `Repositório • ${repo.language}` : 'Repositório GitHub'),
          description:
            local?.description ||
            (repo.description && repo.description.trim()) ||
            `Projeto desenvolvido em ${language} disponível no GitHub.`,
          tags: topics,
          highlight: local?.highlight || (liveUrl ? 'Live Deploy' : language),
          language,
          repoUrl: local?.repoUrl || repo.html_url,
          liveUrl,
          gradient: local?.gradient || CARD_GRADIENTS[index % CARD_GRADIENTS.length]!
        }
      })

      if (projects.length > 0) {
        return {
          projects,
          source: 'github-api'
        }
      }
    }
  } catch {
    // Em caso de falha de rede ou rate limit, utiliza o fallback configurado em me.ts
  }

  return {
    projects: me.projects,
    source: 'fallback'
  }
})
