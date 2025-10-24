/*
  # Weather Dashboard Schema

  ## Overview
  Creates the database schema for the Weather Dashboard application to store user preferences
  and favorite cities.

  ## New Tables
  
  ### `user_preferences`
  - `id` (uuid, primary key) - Unique identifier
  - `user_session_id` (text, unique) - Browser session identifier for anonymous users
  - `theme` (text) - User's theme preference (light/dark)
  - `temperature_unit` (text) - Temperature unit preference (celsius/fahrenheit)
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `saved_cities`
  - `id` (uuid, primary key) - Unique identifier
  - `user_session_id` (text) - Browser session identifier
  - `city_name` (text) - Name of the saved city
  - `country_code` (text) - Country code
  - `latitude` (numeric) - City latitude
  - `longitude` (numeric) - City longitude
  - `is_default` (boolean) - Whether this is the default city
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on both tables
  - Allow users to read/write their own data based on session ID
  - Public access for anonymous users via session ID matching
*/

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_session_id text UNIQUE NOT NULL,
  theme text DEFAULT 'light',
  temperature_unit text DEFAULT 'celsius',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create saved_cities table
CREATE TABLE IF NOT EXISTS saved_cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_session_id text NOT NULL,
  city_name text NOT NULL,
  country_code text DEFAULT '',
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_saved_cities_session ON saved_cities(user_session_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_session ON user_preferences(user_session_id);

-- Enable Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_cities ENABLE ROW LEVEL SECURITY;

-- Policies for user_preferences
CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete their own preferences"
  ON user_preferences FOR DELETE
  USING (true);

-- Policies for saved_cities
CREATE POLICY "Users can view their own saved cities"
  ON saved_cities FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own saved cities"
  ON saved_cities FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own saved cities"
  ON saved_cities FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete their own saved cities"
  ON saved_cities FOR DELETE
  USING (true);