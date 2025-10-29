//this is weather utills files 
export const celsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9) / 5 + 32;
};

export const formatTemperature = (temp: number, unit: 'celsius' | 'fahrenheit'): string => {
  const value = unit === 'fahrenheit' ? celsiusToFahrenheit(temp) : temp;
  return `${Math.round(value)}°${unit === 'celsius' ? 'C' : 'F'}`;
};

export const formatTime = (timestamp: number, timezone: number): string => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toUTCString().slice(-12, -7);
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

export const formatLocalTime = (timezone: number): string => {
  const now = Date.now();
  const localTime = new Date(now + timezone * 1000);
  return localTime.toUTCString().slice(-12, -4);
};

export const getWeatherBackground = (weatherMain: string, isDark: boolean): string => {
  const baseClasses = isDark ? 'from-gray-800 to-gray-900' : '';

  switch (weatherMain.toLowerCase()) {
    case 'clear':
      return isDark ? 'from-blue-900 to-gray-900' : 'from-blue-400 to-cyan-300';
    case 'clouds':
      return isDark ? 'from-gray-700 to-gray-900' : 'from-gray-400 to-gray-300';
    case 'rain':
    case 'drizzle':
      return isDark ? 'from-gray-800 to-blue-900' : 'from-blue-600 to-gray-500';
    case 'thunderstorm':
      return isDark ? 'from-gray-900 to-slate-900' : 'from-gray-700 to-slate-600';
    case 'snow':
      return isDark ? 'from-blue-900 to-slate-800' : 'from-blue-200 to-slate-200';
    case 'mist':
    case 'fog':
    case 'haze':
      return isDark ? 'from-gray-700 to-gray-800' : 'from-gray-300 to-gray-400';
    default:
      return isDark ? 'from-gray-800 to-gray-900' : 'from-blue-300 to-cyan-200';
  }
};

export const metersToKilometers = (meters: number): string => {
  return `${(meters / 1000).toFixed(1)} km`;
};

export const capitalizeWords = (str: string): string => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
