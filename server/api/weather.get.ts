import { createError, defineEventHandler, getQuery } from 'h3'

export interface WeatherResponse {
  city: string
  country: string
  temperature: number
  conditionText: string
  conditionType: 'sunny' | 'rainy' | 'cloudy'
  humidity: number
  windKph: number
  source: 'open-meteo'
}

interface OpenMeteoCurrentResponse {
  current?: {
    temperature_2m?: number
    relative_humidity_2m?: number
    wind_speed_10m?: number
    weather_code?: number
    is_day?: number
  }
}

function mapWmoWeatherCode(code: number, isDay: boolean = true): {
  conditionText: string
  conditionType: 'sunny' | 'rainy' | 'cloudy'
} {
  switch (code) {
    case 0:
      return {
        conditionText: isDay ? 'Ensolarado' : 'Céu Limpo',
        conditionType: 'sunny'
      }
    case 1:
      return {
        conditionText: isDay ? 'Predom. Ensolarado' : 'Predom. Limpo',
        conditionType: 'sunny'
      }
    case 2:
      return {
        conditionText: 'Parcialmente Nublado',
        conditionType: 'cloudy'
      }
    case 3:
      return {
        conditionText: 'Nublado',
        conditionType: 'cloudy'
      }
    case 45:
    case 48:
      return {
        conditionText: 'Neblina',
        conditionType: 'cloudy'
      }
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return {
        conditionText: 'Garoa',
        conditionType: 'rainy'
      }
    case 61:
      return {
        conditionText: 'Chuva Leve',
        conditionType: 'rainy'
      }
    case 63:
      return {
        conditionText: 'Chuva Moderada',
        conditionType: 'rainy'
      }
    case 65:
    case 66:
    case 67:
      return {
        conditionText: 'Chuva Forte',
        conditionType: 'rainy'
      }
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return {
        conditionText: 'Neve',
        conditionType: 'rainy'
      }
    case 80:
    case 81:
    case 82:
      return {
        conditionText: 'Pancadas de Chuva',
        conditionType: 'rainy'
      }
    case 95:
    case 96:
    case 99:
      return {
        conditionText: 'Tempestade',
        conditionType: 'rainy'
      }
    default:
      return {
        conditionText: isDay ? 'Ensolarado' : 'Céu Limpo',
        conditionType: 'sunny'
      }
  }
}

export default defineEventHandler(async (event): Promise<WeatherResponse> => {
  const query = getQuery(event)
  const lat = Number(query.lat)
  const lon = Number(query.lon)

  if (query.lat === undefined || query.lon === undefined || Number.isNaN(lat) || Number.isNaN(lon)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Coordenadas de localização (lat e lon) são obrigatórias.'
    })
  }

  const cityLabel =
    typeof query.city === 'string' && query.city.trim().length > 0
      ? query.city.trim()
      : 'Localização Atual'

  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', String(lat))
  url.searchParams.set('longitude', String(lon))
  url.searchParams.set(
    'current',
    'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day'
  )
  url.searchParams.set('timezone', 'auto')

  const res = await fetch(url.toString())
  if (!res.ok) {
    throw createError({
      statusCode: res.status,
      statusMessage: 'Falha ao consultar a API Open-Meteo.'
    })
  }

  const data = (await res.json()) as OpenMeteoCurrentResponse
  const current = data?.current

  if (!current || typeof current.temperature_2m !== 'number') {
    throw createError({
      statusCode: 502,
      statusMessage: 'Dados de temperatura indisponíveis na resposta da Open-Meteo.'
    })
  }

  const isDay = current.is_day !== 0
  const { conditionText, conditionType } = mapWmoWeatherCode(current.weather_code ?? 0, isDay)

  return {
    city: cityLabel,
    country: 'Brasil',
    temperature: Math.round(current.temperature_2m),
    conditionText,
    conditionType,
    humidity: Math.round(current.relative_humidity_2m ?? 0),
    windKph: Math.round(current.wind_speed_10m ?? 0),
    source: 'open-meteo'
  }
})
