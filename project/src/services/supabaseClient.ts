import { createClient } from '@supabase/supabase-js';
//this contains the SupbaseClients files  that most important have for this app
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('weather_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('weather_session_id', sessionId);
  }
  return sessionId;
};

export interface SavedCity {
  id: string;
  city_name: string;
  country_code: string;
  latitude: number;
  longitude: number;
  is_default: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  temperature_unit: 'celsius' | 'fahrenheit';
}

export const getUserPreferences = async (): Promise<UserPreferences | null> => {
  const sessionId = getSessionId();
  const { data, error } = await supabase
    .from('user_preferences')
    .select('theme, temperature_unit')
    .eq('user_session_id', sessionId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching preferences:', error);
    return null;
  }

  return data as UserPreferences | null;
};

export const saveUserPreferences = async (preferences: UserPreferences): Promise<void> => {
  const sessionId = getSessionId();

  const { error } = await supabase
    .from('user_preferences')
    .upsert({
      user_session_id: sessionId,
      theme: preferences.theme,
      temperature_unit: preferences.temperature_unit,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_session_id'
    });

  if (error) {
    console.error('Error saving preferences:', error);
    throw error;
  }
};

export const getSavedCities = async (): Promise<SavedCity[]> => {
  const sessionId = getSessionId();
  const { data, error } = await supabase
    .from('saved_cities')
    .select('*')
    .eq('user_session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching saved cities:', error);
    return [];
  }

  return data as SavedCity[];
};

export const addSavedCity = async (
  cityName: string,
  countryCode: string,
  latitude: number,
  longitude: number,
  isDefault: boolean = false
): Promise<void> => {
  const sessionId = getSessionId();

  if (isDefault) {
    await supabase
      .from('saved_cities')
      .update({ is_default: false })
      .eq('user_session_id', sessionId);
  }

  const { error } = await supabase
    .from('saved_cities')
    .insert({
      user_session_id: sessionId,
      city_name: cityName,
      country_code: countryCode,
      latitude,
      longitude,
      is_default: isDefault,
    });

  if (error) {
    console.error('Error adding saved city:', error);
    throw error;
  }
};

export const removeSavedCity = async (cityId: string): Promise<void> => {
  const { error } = await supabase
    .from('saved_cities')
    .delete()
    .eq('id', cityId);

  if (error) {
    console.error('Error removing saved city:', error);
    throw error;
  }
};

export const setDefaultCity = async (cityId: string): Promise<void> => {
  const sessionId = getSessionId();

  await supabase
    .from('saved_cities')
    .update({ is_default: false })
    .eq('user_session_id', sessionId);

  const { error } = await supabase
    .from('saved_cities')
    .update({ is_default: true })
    .eq('id', cityId);

  if (error) {
    console.error('Error setting default city:', error);
    throw error;
  }
};
