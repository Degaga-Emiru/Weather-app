import { ForecastDay } from '../services/weatherService';
import { formatTemperature, formatDate, capitalizeWords } from '../utils/weatherUtils';

interface ForecastCardProps {
  forecast: ForecastDay;
  unit: 'celsius' | 'fahrenheit';
  isDark: boolean;
}

export const ForecastCard = ({ forecast, unit, isDark }: ForecastCardProps) => {
  const iconUrl = `https://openweathermap.org/img/wn/${forecast.icon}@2x.png`;

  return (
    <div className={`rounded-xl p-4 text-center transition-all hover:scale-105 backdrop-blur-sm ${
      isDark ? 'bg-gray-800/60 hover:bg-gray-800/80' : 'bg-white/60 hover:bg-white/80'
    } shadow-lg`}>
      <p className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {formatDate(forecast.date)}
      </p>
      <img
        src={iconUrl}
        alt={forecast.description}
        className="w-16 h-16 mx-auto"
      />
      <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {capitalizeWords(forecast.description)}
      </p>
      <div className={`flex justify-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        <span className="font-bold">{formatTemperature(forecast.temp_max, unit)}</span>
        <span className="opacity-60">{formatTemperature(forecast.temp_min, unit)}</span>
      </div>
    </div>
  );
};
