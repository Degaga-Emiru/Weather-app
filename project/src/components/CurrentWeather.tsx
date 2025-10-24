import { WeatherData } from '../services/weatherService';
import { formatTemperature, formatTime, metersToKilometers, capitalizeWords } from '../utils/weatherUtils';
import { Droplets, Wind, Eye, Gauge, Sunrise, Sunset } from 'lucide-react';

interface CurrentWeatherProps {
  weather: WeatherData;
  unit: 'celsius' | 'fahrenheit';
  isDark: boolean;
}

export const CurrentWeather = ({ weather, unit, isDark }: CurrentWeatherProps) => {
  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@4x.png`;

  return (
    <div className={`rounded-2xl p-8 shadow-xl backdrop-blur-sm ${isDark ? 'bg-gray-800/80' : 'bg-white/80'}`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <img
            src={iconUrl}
            alt={weather.description}
            className="w-32 h-32 drop-shadow-lg"
          />
          <div>
            <h2 className={`text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {formatTemperature(weather.temp, unit)}
            </h2>
            <p className={`text-xl mt-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {capitalizeWords(weather.description)}
            </p>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Feels like {formatTemperature(weather.feels_like, unit)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <Droplets className="w-6 h-6" />
            <div>
              <p className="text-sm opacity-75">Humidity</p>
              <p className="text-lg font-semibold">{weather.humidity}%</p>
            </div>
          </div>

          <div className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <Wind className="w-6 h-6" />
            <div>
              <p className="text-sm opacity-75">Wind Speed</p>
              <p className="text-lg font-semibold">{weather.wind_speed} m/s</p>
            </div>
          </div>

          <div className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <Eye className="w-6 h-6" />
            <div>
              <p className="text-sm opacity-75">Visibility</p>
              <p className="text-lg font-semibold">{metersToKilometers(weather.visibility)}</p>
            </div>
          </div>

          <div className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <Gauge className="w-6 h-6" />
            <div>
              <p className="text-sm opacity-75">Pressure</p>
              <p className="text-lg font-semibold">{weather.pressure} hPa</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`flex items-center justify-around mt-8 pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          <Sunrise className="w-6 h-6 text-orange-400" />
          <div>
            <p className="text-sm opacity-75">Sunrise</p>
            <p className="text-lg font-semibold">{formatTime(weather.sunrise, weather.timezone)}</p>
          </div>
        </div>

        <div className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          <Sunset className="w-6 h-6 text-orange-600" />
          <div>
            <p className="text-sm opacity-75">Sunset</p>
            <p className="text-lg font-semibold">{formatTime(weather.sunset, weather.timezone)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
