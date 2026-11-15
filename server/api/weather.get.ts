import { defineEventHandler, getQuery } from 'h3'

export interface WeatherResponse {
  city: string
  country: string
  temperature: number
  conditionText: string
  conditionType: 'sunny' | 'rainy' | 'cloudy'
  humidity: number
  windKph: number
  isFallbackLocation: boolean
  source: 'google-weather-api' | 'simulated-fallback'
}

const SAO_PAULO_COORDS = {
  lat: -23.5505,
  lon: -46.6333
}

function classifyCondition(typeStr: string = '', textStr: string = ''): 'sunny' | 'rainy' | 'cloudy' {
  const combined = `${typeStr} ${textStr}`.toUpperCase()
  if (
    combined.includes('RAIN') ||
    combined.includes('SHOWER') ||
    combined.includes('THUNDER') ||
    combined.includes('STORM') ||
    combined.includes('DRIZZLE') ||
    combined.includes('CHUVA') ||
    combined.includes('TEMPESTADE') ||
    combined.includes('GAROA')
  ) {
    return 'rainy'
  }
  if (
    combined.includes('CLEAR') ||
    combined.includes('SUN') ||
    combined.includes('SOL') ||
    combined.includes('LIMPO')
  ) {
    return 'sunny'
  }
  return 'cloudy'
}

export default defineEventHandler(async (event): Promise<WeatherResponse> => {
  const query = getQuery(event)
  const rawLat = Number(query.lat)
  const rawLon = Number(query.lon)
  const isFallbackLocation = query.fallback === 'true' || Number.isNaN(rawLat) || Number.isNaN(rawLon)

  const lat = isFallbackLocation ? SAO_PAULO_COORDS.lat : rawLat
  const lon = isFallbackLocation ? SAO_PAULO_COORDS.lon : rawLon
  const cityLabel = typeof query.city === 'string' && query.city.trim().length > 0
    ? query.city.trim()
    : isFallbackLocation
      ? 'São Paulo, SP'
      : 'Localização Atual'

  const apiKey = process.env.GOOGLE_WEATHER_API_KEY

  // Integração oficial Google Maps Platform Weather API
  // Endpoint: https://weather.googleapis.com/v1/currentConditions:lookup
  if (apiKey && apiKey.trim().length > 0) {
    try {
      const url = new URL('https://weather.googleapis.com/v1/currentConditions:lookup')
      url.searchParams.set('key', apiKey.trim())
      url.searchParams.set('location.latitude', String(lat))
      url.searchParams.set('location.longitude', String(lon))
      url.searchParams.set('languageCode', 'pt-BR')
      url.searchParams.set('unitsSystem', 'METRIC')

      const res = await fetch(url.toString())
      if (res.ok) {
        const data = await res.json() as Record<string, any>
        const temp = Math.round(data?.temperature?.degrees ?? 24)
        const conditionText = data?.weatherCondition?.description?.text ?? 'Ensolarado'
        const rawType = data?.weatherCondition?.type ?? 'CLEAR'
        const conditionType = classifyCondition(rawType, conditionText)

        return {
          city: cityLabel,
          country: 'Brasil',
          temperature: temp,
          conditionText,
          conditionType,
          humidity: data?.relativeHumidity ?? 62,
          windKph: Math.round(data?.wind?.speed?.value ?? 14),
          isFallbackLocation,
          source: 'google-weather-api'
        }
      }
    } catch {
      // Continua para o fallback abaixo caso ocorra erro de rede ou chave inválida
    }
  }

  // Fallback simulado pronto para uso enquanto a chave GOOGLE_WEATHER_API_KEY não for adicionada ao .env
  const forcedMode = typeof query.mode === 'string' ? query.mode : undefined
  const hour = new Date().getHours()
  const isSunnyDefault = forcedMode ? forcedMode === 'sunny' : (hour >= 7 && hour <= 18)

  if (forcedMode === 'rainy' || !isSunnyDefault) {
    return {
      city: cityLabel,
      country: 'Brasil',
      temperature: 19,
      conditionText: 'Chuva Leve',
      conditionType: 'rainy',
      humidity: 84,
      windKph: 18,
      isFallbackLocation,
      source: 'simulated-fallback'
    }
  }

  return {
    city: cityLabel,
    country: 'Brasil',
    temperature: 26,
    conditionText: 'Ensolarado',
    conditionType: 'sunny',
    humidity: 54,
    windKph: 12,
    isFallbackLocation,
    source: 'simulated-fallback'
  }
})
