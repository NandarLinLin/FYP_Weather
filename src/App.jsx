import { useEffect, useState } from 'react'
import { Search, RefreshCcw, ArrowRight } from 'lucide-react'
import WeatherCard from './components/WeatherCard'
import ForecastCard from './components/ForecastCard'
import WeatherChart from './components/WeatherChart'
import { useWeather } from './hooks/useWeather'

const HISTORY_KEY = 'weatherDashboardSearchHistory'
const MAX_HISTORY = 6

export default function App() {
  const {
    city,
    weather,
    forecast,
    hourly,
    units,
    loading,
    error,
    searchCity,
    toggleUnits,
    refresh,
  } = useWeather()

  const [query, setQuery] = useState(city)
  const [searchHistory, setSearchHistory] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    setQuery(city)
  }, [city])

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(HISTORY_KEY, JSON.stringify(searchHistory))
  }, [searchHistory])

  const handleSearch = (event) => {
    event.preventDefault()
    const nextCity = query.trim()
    if (!nextCity) return

    searchCity(nextCity)
    setSearchHistory((previous) => {
      const normalized = previous.filter(
        (item) => item.toLowerCase() !== nextCity.toLowerCase(),
      )
      return [nextCity, ...normalized].slice(0, MAX_HISTORY)
    })
  }

  const temperatureUnit = units === 'metric' ? '°C' : '°F'

  return (
    <div
      className="min-h-screen bg-white text-gray-900"
      style={{
        backgroundImage:
          'radial-gradient(circle at top left, rgba(255,255,255,1), rgba(255,215,0,0.95) 35%, rgba(255,165,0,1) 100%)',
      }}
    >
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-10">
        <header className="rounded-[2rem] border border-gray-200 bg-white/70 p-6 shadow-[0_30px_90px_rgba(255,165,0,0.32)] backdrop-blur-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-gray-500">Weather Dashboard</p>
              <h1 className="mt-3 text-3xl font-semibold text-gray-900 sm:text-4xl">
                Sunny Forecast
              </h1>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={toggleUnits}
                className="inline-flex items-center gap-2 rounded-3xl border border-gray-200 bg-orange-50 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:border-orange-300 hover:bg-orange-100"
              >
                {units === 'metric' ? 'Switch to °F' : 'Switch to °C'}
              </button>
              <button
                type="button"
                onClick={refresh}
                className="inline-flex items-center gap-2 rounded-3xl border border-gray-200 bg-orange-50 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:border-orange-300 hover:bg-orange-100"
              >
                <RefreshCcw size={16} />
                Refresh
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-gray-200 bg-white/75 p-6 shadow-[0_30px_70px_rgba(255,165,0,0.24)] backdrop-blur-2xl">
              <p className="text-sm uppercase tracking-[0.35em] text-gray-500">Search history</p>
              <h2 className="mt-3 text-2xl font-semibold text-gray-900">Recent Cities</h2>
              <div className="mt-6 space-y-3">
                {searchHistory.length > 0 ? (
                  searchHistory.map((entry) => (
                    <button
                      key={entry}
                      type="button"
                      onClick={() => {
                        setQuery(entry)
                        searchCity(entry)
                      }}
                      className="flex w-full items-center justify-between rounded-3xl border border-gray-200 bg-orange-50 px-4 py-4 text-left text-gray-900 transition hover:border-orange-300 hover:bg-orange-100"
                    >
                      <span>{entry}</span>
                      <ArrowRight size={16} className="text-gray-400" />
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No history yet. Search a city to begin.</p>
                )}
              </div>
            </section>

            <section className="rounded-[2rem] border border-gray-200 bg-white/75 p-6 shadow-[0_30px_70px_rgba(255,165,0,0.24)] backdrop-blur-2xl">
              <p className="text-sm uppercase tracking-[0.35em] text-gray-500">Weather highlights</p>
              <h2 className="mt-3 text-2xl font-semibold text-gray-900">Today at a glance</h2>
              <div className="mt-6 grid gap-4 text-sm text-gray-700">
                <div className="rounded-3xl bg-orange-50 p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Humidity</p>
                  <p className="mt-2 text-xl font-semibold text-gray-900">{weather ? `${weather.humidity}%` : '--'}</p>
                </div>
                <div className="rounded-3xl bg-orange-50 p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Wind</p>
                  <p className="mt-2 text-xl font-semibold text-gray-900">{weather ? `${weather.windSpeed} m/s` : '--'}</p>
                </div>
                <div className="rounded-3xl bg-orange-50 p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Pressure</p>
                  <p className="mt-2 text-xl font-semibold text-gray-900">{weather ? `${weather.pressure} hPa` : '--'}</p>
                </div>
                <div className="rounded-3xl bg-orange-50 p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Sunrise / Sunset</p>
                  <p className="mt-2 text-xl font-semibold text-gray-900">
                    {weather?.sunrise ? weather.sunrise.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '--'} / {weather?.sunset ? weather.sunset.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '--'}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-gray-200 bg-white/75 p-6 shadow-[0_30px_70px_rgba(255,165,0,0.24)] backdrop-blur-2xl">
              <p className="text-sm uppercase tracking-[0.35em] text-gray-500">Quick controls</p>
              <div className="mt-6 space-y-3 text-sm text-gray-700">
                <p>
                  Current city:
                  <span className="ml-2 font-semibold text-gray-900">{weather?.city || city}</span>
                </p>
                <p>
                  Units:
                  <span className="ml-2 font-semibold text-gray-900">{temperatureUnit}</span>
                </p>
                <p>
                  Status:
                  <span className="ml-2 font-semibold text-gray-900">
                    {loading ? 'Loading…' : 'Ready'}
                  </span>
                </p>
              </div>
            </section>
          </aside>

          <main className="space-y-6">
            <section className="rounded-[2rem] border border-gray-200 bg-white/75 p-6 shadow-[0_30px_70px_rgba(255,165,0,0.24)] backdrop-blur-2xl">
              <form onSubmit={handleSearch} className="grid gap-4 sm:grid-cols-[1fr_auto]">
                <label className="relative block">
                  <span className="sr-only">Search city</span>
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search city, e.g. Singapore"
                    className="w-full rounded-3xl border border-gray-200 bg-orange-50 px-12 py-4 text-base text-gray-900 outline-none transition duration-200 focus:border-orange-400 focus:bg-orange-100 focus:ring-2 focus:ring-orange-400/20"
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-3xl bg-orange-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-orange-400"
                >
                  Search
                </button>
              </form>

              {error ? (
                <div className="mt-4 rounded-3xl border border-red-500/20 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              ) : null}
            </section>

            <div className="grid gap-6">
              <WeatherCard
                city={weather?.city || city}
                temperature={weather ? `${weather.temperature}` : '--'}
                unit={temperatureUnit}
                description={weather?.description || 'Fetching weather...'}
              />

              <WeatherChart data={hourly} unit={temperatureUnit} />
            </div>

            <section className="rounded-[2rem] border border-gray-200 bg-white/75 p-6 shadow-[0_30px_70px_rgba(255,165,0,0.24)] backdrop-blur-2xl">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-gray-500">5-day forecast</p>
                  <h2 className="mt-1 text-2xl font-semibold text-gray-900">Coming up</h2>
                </div>
                <span className="rounded-full bg-orange-50 px-4 py-2 text-xs uppercase tracking-[0.35em] text-gray-700">
                  {temperatureUnit}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {forecast.length > 0
                  ? forecast.map((item) => (
                      <ForecastCard
                        key={item.day}
                        day={item.day}
                        highTemp={`${item.tempMax}${temperatureUnit}`}
                        lowTemp={`${item.tempMin}${temperatureUnit}`}
                        precipitation={item.precipitationProbability}
                      />
                    ))
                  : Array.from({ length: 5 }).map((_, index) => (
                      <ForecastCard key={index} day="---" highTemp="--" lowTemp="--" />
                    ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}
