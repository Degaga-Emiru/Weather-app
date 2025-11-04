import { Star, Trash2, MapPin } from 'lucide-react';
import { SavedCity } from '../services/supabaseClient';
//savedCities pages that stores the favorite Cities
interface SavedCitiesProps {
  cities: SavedCity[];
  onCitySelect: (lat: number, lon: number) => void;
  onCityRemove: (cityId: string) => void;
  onSetDefault: (cityId: string) => void;
  isDark: boolean;
}

export const SavedCities = ({
  cities,
  onCitySelect,
  onCityRemove,
  onSetDefault,
  isDark,
}: SavedCitiesProps) => {
  if (cities.length === 0) {
    return null;
  }

  return (
    <div className={`rounded-2xl p-6 shadow-xl backdrop-blur-sm ${isDark ? 'bg-gray-800/80' : 'bg-white/80'}`}>
      <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        <MapPin className="w-5 h-5" />
        Saved Cities
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cities.map((city) => (
          <div
            key={city.id}
            className={`rounded-lg p-4 flex items-center justify-between gap-3 transition-all hover:shadow-md ${
              isDark ? 'bg-gray-700/60' : 'bg-gray-100'
            }`}
          >
            <button
              onClick={() => onCitySelect(city.latitude, city.longitude)}
              className="flex-1 text-left"
            >
              <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {city.city_name}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {city.country_code}
              </p>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onSetDefault(city.id)}
                className={`p-1.5 rounded transition-colors ${
                  city.is_default
                    ? 'text-yellow-400'
                    : isDark
                    ? 'text-gray-500 hover:text-yellow-400'
                    : 'text-gray-400 hover:text-yellow-500'
                }`}
                aria-label={city.is_default ? 'Default city' : 'Set as default'}
                title={city.is_default ? 'Default city' : 'Set as default'}
              >
                <Star className={`w-4 h-4 ${city.is_default ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => onCityRemove(city.id)}
                className={`p-1.5 rounded transition-colors ${
                  isDark
                    ? 'text-gray-500 hover:text-red-400'
                    : 'text-gray-400 hover:text-red-500'
                }`}
                aria-label="Remove city"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
