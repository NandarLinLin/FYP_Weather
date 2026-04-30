import { useCallback, useEffect, useState } from 'react';

const STORAGE_CITY_KEY = 'weatherDashboardLastCity';
const STORAGE_UNITS_KEY = 'weatherDashboardUnits';
const OPENWEATHERMAP_API_KEY =
  import.meta.env.VITE_WEATHER_API_KEY || import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
const OPENWEATHERMAP_BASE = 'https://api.openweathermap.org/data/2.5';

const formatWeather = (data) => {
  const weather = data.weather?.[0] || {};
  return {
    city: data.name,
    country: data.sys?.country,
    description: weather.description || 'Unknown',
    temperature: Math.round(data.main?.temp ?? 0),
    feelsLike: Math.round(data.main?.feels_like ?? 0),
    humidity: data.main?.humidity ?? 0,
    pressure: data.main?.pressure ?? 0,
    windSpeed: data.wind?.speed ?? 0,
    icon: weather.icon ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png` : null,
    sunrise: data.sys?.sunrise ? new Date(data.sys.sunrise * 1000) : null,
    sunset: data.sys?.sunset ? new Date(data.sys.sunset * 1000) : null,
    timestamp: data.dt ? new Date(data.dt * 1000) : null,
  };
};

const formatForecast = (data) => {
  const days = {};

  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toISOString().slice(0, 10);
    const weather = item.weather?.[0] || {};

    if (!days[dayKey]) {
      days[dayKey] = {
        date,
        tempMin: item.main?.temp_min ?? 0,
        tempMax: item.main?.temp_max ?? 0,
        description: weather.description || 'Unknown',
        icon: weather.icon ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png` : null,
        pop: item.pop ?? 0,
      };
    } else {
      days[dayKey].tempMin = Math.min(days[dayKey].tempMin, item.main?.temp_min ?? days[dayKey].tempMin);
      days[dayKey].tempMax = Math.max(days[dayKey].tempMax, item.main?.temp_max ?? days[dayKey].tempMax);
      if (item.dt > days[dayKey].date.getTime() / 1000 && weather.icon) {
        days[dayKey].description = weather.description || days[dayKey].description;
        days[dayKey].icon = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
      }
    }
  });

  return Object.values(days)
    .slice(0, 5)
    .map((item) => ({
      day: item.date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
      tempMin: Math.round(item.tempMin),
      tempMax: Math.round(item.tempMax),
      description: item.description,
      icon: item.icon,
      precipitationProbability: Math.round((item.pop ?? 0) * 100),
    }));
};

const formatHourly = (data) => {
  return data.list.slice(0, 16).map((item) => {
    const date = new Date(item.dt * 1000);
    return {
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true,
      }),
      temp: Math.round(item.main?.temp ?? 0),
      description: item.weather?.[0]?.description || 'Forecast',
    };
  });
};

const getStoredValue = (key, fallback) => {
  if (typeof window === 'undefined') {
    return fallback;
  }
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
};

const getStoredCity = () => getStoredValue(STORAGE_CITY_KEY, 'New York');
const getStoredUnits = () => getStoredValue(STORAGE_UNITS_KEY, 'metric');

const buildUrl = (path, params) => {
  const search = new URLSearchParams({ ...params, appid: OPENWEATHERMAP_API_KEY }).toString();
  return `${OPENWEATHERMAP_BASE}/${path}?${search}`;
};

export function useWeather() {
  const [city, setCity] = useState(getStoredCity);
  const [units, setUnits] = useState(getStoredUnits);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(STORAGE_CITY_KEY, city);
  }, [city]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(STORAGE_UNITS_KEY, units);
  }, [units]);

  const fetchWeather = useCallback(async () => {
    if (!city) {
      setError('Please enter a city name.');
      setWeather(null);
      setForecast([]);
      return;
    }

    if (!OPENWEATHERMAP_API_KEY) {
      setError('OpenWeatherMap API key is not configured. Set VITE_WEATHER_API_KEY in .env.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(buildUrl('weather', { q: city, units })),
        fetch(buildUrl('forecast', { q: city, units })),
      ]);

      const currentData = await currentResponse.json();
      const forecastData = await forecastResponse.json();

      if (!currentResponse.ok) {
        throw new Error(currentData.message || 'Failed to fetch current weather.');
      }
      if (!forecastResponse.ok) {
        throw new Error(forecastData.message || 'Failed to fetch forecast.');
      }

      setWeather(formatWeather(currentData));
      setForecast(formatForecast(forecastData));
      setHourly(formatHourly(forecastData));
    } catch (fetchError) {
      setWeather(null);
      setForecast([]);
      setHourly([]);
      setError(fetchError.message || 'Unable to load weather data.');
    } finally {
      setLoading(false);
    }
  }, [city, units]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather, refreshIndex]);

  const searchCity = useCallback((newCity) => {
    setCity(newCity.trim());
  }, []);

  const toggleUnits = useCallback(() => {
    setUnits((current) => (current === 'metric' ? 'imperial' : 'metric'));
  }, []);

  const refresh = useCallback(() => {
    setRefreshIndex((value) => value + 1);
  }, []);

  return {
    city,
    weather,
    forecast,
    hourly,
    units,
    loading,
    error,
    searchCity,
    setCity,
    toggleUnits,
    refresh,
  };
}
