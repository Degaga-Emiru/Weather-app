//SearchBar files that help for searching city
import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { searchCities, CitySearchResult } from '../services/weatherService';

interface SearchBarProps {
  onCitySelect: (city: string, lat: number, lon: number) => void;
  isDark: boolean;
}

export const SearchBar = ({ onCitySelect, isDark }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CitySearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        try {
          const results = await searchCities(query);
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Search error:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (city: CitySearchResult) => {
    onCitySelect(city.name, city.lat, city.lon);
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    } else if (query.trim()) {
      onCitySelect(query, 0, 0);
      setQuery('');
    }
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a city..."
            className={`w-full pl-10 pr-10 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              isDark
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            aria-label="Search for a city"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setShowSuggestions(false);
              }}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div className={`absolute top-full mt-2 w-full rounded-lg shadow-lg overflow-hidden z-50 ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <ul>
              {suggestions.map((city, index) => (
                <li key={`${city.lat}-${city.lon}-${index}`}>
                  <button
                    type="button"
                    onClick={() => handleSelect(city)}
                    className={`w-full text-left px-4 py-3 hover:bg-opacity-80 transition-colors ${
                      isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {city.name}
                    </div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {city.state ? `${city.state}, ${city.country}` : city.country}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
