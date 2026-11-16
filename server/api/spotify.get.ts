import { defineEventHandler } from 'h3'
import { me } from '../../app/data/me'

export interface SpotifyTrackResponse {
  isPlaying: boolean
  title: string
  artist: string
  album: string
  albumArt: string
  songUrl: string
  source: 'spotify-api' | 'fallback'
}

export default defineEventHandler(async (): Promise<SpotifyTrackResponse> => {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN

  if (clientId && clientSecret && refreshToken) {
    try {
      const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
      const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        })
      })

      if (tokenRes.ok) {
        const tokenData = await tokenRes.json() as { access_token?: string }
        const accessToken = tokenData.access_token

        if (accessToken) {
          // 1. Verifica se há música tocando agora
          const nowPlayingRes = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: { Authorization: `Bearer ${accessToken}` }
          })

          if (nowPlayingRes.status === 200) {
            const song = await nowPlayingRes.json() as Record<string, any>
            if (song?.item) {
              return {
                isPlaying: Boolean(song.is_playing),
                title: song.item.name,
                artist: song.item.artists?.map((a: any) => a.name).join(', ') || 'Spotify Artist',
                album: song.item.album?.name || '',
                albumArt: song.item.album?.images?.[0]?.url || '',
                songUrl: song.item.external_urls?.spotify || 'https://open.spotify.com',
                source: 'spotify-api'
              }
            }
          }

          // 2. Caso não esteja tocando agora, busca a última música reproduzida
          const recentRes = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
            headers: { Authorization: `Bearer ${accessToken}` }
          })

          if (recentRes.ok) {
            const recentData = await recentRes.json() as Record<string, any>
            const track = recentData?.items?.[0]?.track
            if (track) {
              return {
                isPlaying: false,
                title: track.name,
                artist: track.artists?.map((a: any) => a.name).join(', ') || 'Spotify Artist',
                album: track.album?.name || '',
                albumArt: track.album?.images?.[0]?.url || '',
                songUrl: track.external_urls?.spotify || 'https://open.spotify.com',
                source: 'spotify-api'
              }
            }
          }
        }
      }
    } catch {
      // Usa fallback do me.ts caso a API falhe
    }
  }

  return {
    ...me.spotifyFallback,
    source: 'fallback'
  }
})
