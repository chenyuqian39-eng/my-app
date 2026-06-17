const API_KEY = 'fbb454d48cff79884ce33823d356e03fafeec7299aa5923e7295f2b889bd6745'
const BASE_URL = 'https://www.weatherau.io/api/v1'
const NEWS_API_KEY = 'b19388cd2c284d549fb16a4220a3624e'
const NEWS_BASE_URL = 'https://newsapi.org/v2'

async function request(path) {
    const response = await fetch(`${BASE_URL}${path}`, {
        method: 'GET',
        headers: {
            'X-API-Key': API_KEY,
        },
    })

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
    }

    return response.json()
}

export async function getCityInfo(coords, currentCityName) {
    const preferredCityName = normalizeCityName(currentCityName)
    const nearestCityName = getNearestCapitalName(coords)
    const cityNames = [...new Set([preferredCityName, nearestCityName].filter(Boolean))]

    for (const cityName of cityNames) {
        try {
            const result = await request(`/forecast/${encodeURIComponent(cityName)}`)
            const cityData = result.data

            if (cityData?.forecasts?.length) {
                return {
                    cityName,
                    coords,
                    data: cityData,
                    raw: result,
                }
            }
        } catch (error) {
            console.log(`Unable to get forecast for ${cityName}`, error)
        }
    }

    const result = await request('/forecast/capitals')
    const fallbackCityName = getNearestCapitalName(coords, Object.keys(result.data || {}))
    const cityData = result.data?.[fallbackCityName]

    return {
        cityName: fallbackCityName,
        coords,
        data: cityData || null,
        raw: result,
    }
}

export async function getThreeDays(coords) {
    const cityInfo = await getCityInfo(coords)
    const forecast = cityInfo.data?.forecast || cityInfo.data || []

    return Array.isArray(forecast) ? forecast.slice(0, 3) : forecast
}

export async function getIndics(coords) {
    const cityInfo = await getCityInfo(coords)

    return cityInfo.data?.indices || cityInfo.data?.indics || null
}

export async function getNewsList(category = 'general') {
    if (NEWS_API_KEY === 'YOUR_NEWSAPI_KEY') {
        throw new Error('请先在 utils/api.js 里填写你的 NewsAPI key')
    }

    const safeCategory = category === 'top' ? 'general' : category
    const topHeadlinesUrl = `${NEWS_BASE_URL}/top-headlines?country=au&category=${safeCategory}&pageSize=20&apiKey=${NEWS_API_KEY}`
    const topHeadlines = await requestNews(topHeadlinesUrl)

    if (topHeadlines.length) {
        return topHeadlines
    }

    const everythingUrl = `${NEWS_BASE_URL}/everything?q=Australia&language=en&sortBy=publishedAt&pageSize=20&apiKey=${NEWS_API_KEY}`
    return requestNews(everythingUrl)
}

export const getNewsLIst = getNewsList

async function requestNews(url) {
    const response = await fetch(url)
    const result = await response.json()

    if (!response.ok || result.status !== 'ok') {
        throw new Error(result.message || `News request failed: ${response.status}`)
    }

    return result.articles || []
}

function getNearestCapitalName(coords, availableCityNames = []) {
    if (!coords) {
        return 'Canberra'
    }

    const allCapitals = [
        { name: 'Canberra', latitude: -35.2809, longitude: 149.13 },
        { name: 'Sydney', latitude: -33.8688, longitude: 151.2093 },
        { name: 'Melbourne', latitude: -37.8136, longitude: 144.9631 },
        { name: 'Brisbane', latitude: -27.4698, longitude: 153.0251 },
        { name: 'Adelaide', latitude: -34.9285, longitude: 138.6007 },
        { name: 'Perth', latitude: -31.9523, longitude: 115.8613 },
        { name: 'Hobart', latitude: -42.8821, longitude: 147.3272 },
        { name: 'Darwin', latitude: -12.4634, longitude: 130.8456 },
    ]
    const capitals = availableCityNames.length
        ? allCapitals.filter(capital => availableCityNames.includes(capital.name))
        : allCapitals

    const nearest = capitals.reduce((best, capital) => {
        const distance = getDistance(coords, capital)
        return distance < best.distance ? { name: capital.name, distance } : best
    }, { name: 'Canberra', distance: Number.POSITIVE_INFINITY })

    return nearest.name
}

function getDistance(from, to) {
    const latitudeDiff = Number(from.latitude) - to.latitude
    const longitudeDiff = Number(from.longitude) - to.longitude

    return Math.sqrt(latitudeDiff ** 2 + longitudeDiff ** 2)
}

function normalizeCityName(cityName) {
    if (!cityName) {
        return ''
    }

    return String(cityName).trim()
}
