const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'demo';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export interface WeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  description: string;
  icon: string;
  main: string;
  wind_speed: number;
  visibility: number;
  sunrise: number;
  sunset: number;
  timezone: number;
  city: string;
  country: string;
  lat: number;
  lon: number;
  dt: number;
}

export interface ForecastDay {
  date: number;
  temp_min: number;
  temp_max: number;
  description: string;
  icon: string;
  main: string;
}

export interface CitySearchResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export const searchCities = async (query: string): Promise<CitySearchResult[]> => {
  try {
    const response = await fetch(
      `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to search cities');
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching cities:', error);
    throw error;
  }
};

export const getCurrentWeather = async (city: string): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('City not found');
      }
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();

    return {
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      temp_min: data.main.temp_min,
      temp_max: data.main.temp_max,
      pressure: data.main.pressure,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      main: data.weather[0].main,
      wind_speed: data.wind.speed,
      visibility: data.visibility,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      timezone: data.timezone,
      city: data.name,
      country: data.sys.country,
      lat: data.coord.lat,
      lon: data.coord.lon,
      dt: data.dt,
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
};

export const getCurrentWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();

    return {
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      temp_min: data.main.temp_min,
      temp_max: data.main.temp_max,
      pressure: data.main.pressure,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      main: data.weather[0].main,
      wind_speed: data.wind.speed,
      visibility: data.visibility,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      timezone: data.timezone,
      city: data.name,
      country: data.sys.country,
      lat: data.coord.lat,
      lon: data.coord.lon,
      dt: data.dt,
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
};

export const getForecast = async (city: string): Promise<ForecastDay[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch forecast data');
    }

    const data = await response.json();

    const dailyForecasts: { [key: string]: any[] } = {};

    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = [];
      }
      dailyForecasts[date].push(item);
    });

    const forecasts: ForecastDay[] = Object.entries(dailyForecasts)
      .slice(0, 5)
      .map(([_, items]) => {
        const temps = items.map(item => item.main.temp);
        const middayItem = items[Math.floor(items.length / 2)];

        return {
          date: middayItem.dt,
          temp_min: Math.min(...temps),
          temp_max: Math.max(...temps),
          description: middayItem.weather[0].description,
          icon: middayItem.weather[0].icon,
          main: middayItem.weather[0].main,
        };
      });

    return forecasts;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};

export const getForecastByCoords = async (lat: number, lon: number): Promise<ForecastDay[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch forecast data');
    }

    const data = await response.json();

    const dailyForecasts: { [key: string]: any[] } = {};

    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = [];
      }
      dailyForecasts[date].push(item);
    });

    const forecasts: ForecastDay[] = Object.entries(dailyForecasts)
      .slice(0, 5)
      .map(([_, items]) => {
        const temps = items.map(item => item.main.temp);
        const middayItem = items[Math.floor(items.length / 2)];

        return {
          date: middayItem.dt,
          temp_min: Math.min(...temps),
          temp_max: Math.max(...temps),
          description: middayItem.weather[0].description,
          icon: middayItem.weather[0].icon,
          main: middayItem.weather[0].main,
        };
      });

    return forecasts;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};

export const getWeatherIconUrl = (icon: string): string => {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
};
