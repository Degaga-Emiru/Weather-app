import { useState, useEffect } from 'react';
import { Moon, Sun, ThermometerSun, MapPin, Heart, Calendar, Clock } from 'lucide-react';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { ForecastCard } from './components/ForecastCard';
import { WeatherMap } from './components/WeatherMap';
import { SavedCities } from './components/SavedCities';
import {
  getCurrentWeather,
  getCurrentWeatherByCoords,
  getForecast,
  getForecastByCoords,
  WeatherData,
  ForecastDay,
} from './services/weatherService';
import {
  getUserPreferences,
  saveUserPreferences,
  getSavedCities,
  addSavedCity,
  removeSavedCity,
  setDefaultCity,
  SavedCity,
} from './services/supabaseClient';
import { getWeatherBackground, formatLocalTime } from './utils/weatherUtils';

const DEFAULT_CITY = 'Addis Ababa';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [unit, setUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [savedCities, setSavedCities] = useState<SavedCity[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const loadPreferences = async () => {
      const prefs = await getUserPreferences();
      if (prefs) {
        setIsDark(prefs.theme === 'dark');
        setUnit(prefs.temperature_unit);
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(prefersDark);
      }
    };

    loadPreferences();
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    saveUserPreferences({ theme: isDark ? 'dark' : 'light', temperature_unit: unit });
  }, [isDark, unit]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);

      try {
        const cities = await getSavedCities();
        setSavedCities(cities);

        const defaultCity = cities.find(city => city.is_default);

        if (defaultCity) {
          await loadWeatherByCoords(defaultCity.latitude, defaultCity.longitude);
        } else {
          await loadWeather(DEFAULT_CITY);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load weather data');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const loadWeather = async (city: string) => {
    setLoading(true);
    setError(null);

    try {
      const [weatherData, forecastData] = await Promise.all([
        getCurrentWeather(city),
        getForecast(city),
      ]);

      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

  const loadWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);

    try {
      const [weatherData, forecastData] = await Promise.all([
        getCurrentWeatherByCoords(lat, lon),
        getForecastByCoords(lat, lon),
      ]);

      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = async (city: string, lat: number, lon: number) => {
    if (lat !== 0 && lon !== 0) {
      await loadWeatherByCoords(lat, lon);
    } else {
      await loadWeather(city);
    }
  };

  const handleSaveCity = async () => {
    if (!weather) return;

    try {
      const existingCity = savedCities.find(
        city => city.city_name === weather.city && city.country_code === weather.country
      );

      if (existingCity) {
        setError('City already saved');
        setTimeout(() => setError(null), 3000);
        return;
      }

      await addSavedCity(weather.city, weather.country, weather.lat, weather.lon, savedCities.length === 0);
      const cities = await getSavedCities();
      setSavedCities(cities);
    } catch (err) {
      setError('Failed to save city');
    }
  };

  const handleRemoveCity = async (cityId: string) => {
    try {
      await removeSavedCity(cityId);
      const cities = await getSavedCities();
      setSavedCities(cities);
    } catch (err) {
      setError('Failed to remove city');
    }
  };

  const handleSetDefault = async (cityId: string) => {
    try {
      await setDefaultCity(cityId);
      const cities = await getSavedCities();
      setSavedCities(cities);
    } catch (err) {
      setError('Failed to set default city');
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const toggleUnit = () => {
    setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  if (loading && !weather) {
    return <LoadingSpinner />;
  }

  const backgroundGradient = weather ? getWeatherBackground(weather.main, isDark) : '';

  return (
    <div className={`min-h-screen transition-colors duration-500 bg-gradient-to-br ${backgroundGradient || (isDark ? 'from-gray-800 to-gray-900' : 'from-blue-400 to-cyan-300')}`}>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <header className="mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full backdrop-blur-sm ${isDark ? 'bg-gray-800/60' : 'bg-white/60'}`}>
                <ThermometerSun className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Weather Dashboard
                </h1>
                {weather && (
                  <div className={`flex items-center gap-4 mt-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-lg font-semibold">{weather.city}, {weather.country}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <SearchBar onCitySelect={handleCitySelect} isDark={isDark} />

              {weather && (
                <button
                  onClick={handleSaveCity}
                  className={`p-3 rounded-lg transition-all hover:scale-110 backdrop-blur-sm ${
                    isDark ? 'bg-gray-800/60 hover:bg-gray-800/80 text-pink-400' : 'bg-white/60 hover:bg-white/80 text-pink-600'
                  }`}
                  aria-label="Save city"
                  title="Save city to favorites"
                >
                  <Heart className="w-6 h-6" />
                </button>
              )}

              <button
                onClick={toggleUnit}
                className={`px-4 py-3 rounded-lg font-semibold transition-all hover:scale-105 backdrop-blur-sm ${
                  isDark ? 'bg-gray-800/60 hover:bg-gray-800/80 text-white' : 'bg-white/60 hover:bg-white/80 text-gray-900'
                }`}
                aria-label="Toggle temperature unit"
              >
                °{unit === 'celsius' ? 'C' : 'F'}
              </button>

              <button
                onClick={toggleTheme}
                className={`p-3 rounded-lg transition-all hover:scale-110 backdrop-blur-sm ${
                  isDark ? 'bg-gray-800/60 hover:bg-gray-800/80' : 'bg-white/60 hover:bg-white/80'
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-6 h-6 text-yellow-400" />
                ) : (
                  <Moon className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {weather && (
            <div className={`flex items-center gap-6 mt-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">
                  {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-medium">
                  {formatLocalTime(weather.timezone)}
                </span>
              </div>
            </div>
          )}
        </header>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/90 text-white backdrop-blur-sm">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {loading && weather && (
          <div className="mb-6 p-4 rounded-lg bg-blue-500/90 text-white backdrop-blur-sm flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="font-medium">Loading weather data...</p>
          </div>
        )}

        {weather && (
          <div className="space-y-6">
            <CurrentWeather weather={weather} unit={unit} isDark={isDark} />

            {forecast.length > 0 && (
              <div className={`rounded-2xl p-6 shadow-xl backdrop-blur-sm ${isDark ? 'bg-gray-800/80' : 'bg-white/80'}`}>
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  5-Day Forecast
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {forecast.map((day, index) => (
                    <ForecastCard key={index} forecast={day} unit={unit} isDark={isDark} />
                  ))}
                </div>
              </div>
            )}

            <WeatherMap lat={weather.lat} lon={weather.lon} city={weather.city} isDark={isDark} />

            {savedCities.length > 0 && (
              <SavedCities
                cities={savedCities}
                onCitySelect={loadWeatherByCoords}
                onCityRemove={handleRemoveCity}
                onSetDefault={handleSetDefault}
                isDark={isDark}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
