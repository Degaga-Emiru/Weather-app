# 🌦️ Weather Dashboard

A modern and responsive **Weather Dashboard** built using **React (TypeScript)**, **Tailwind CSS**, and the **OpenWeather API**.  
It allows users to search for any city worldwide and view detailed weather information, including temperature, humidity, wind speed, and forecasts — all in real-time.

---

## 🚀 Features

- 🌍 Search weather data for **any city worldwide**
- 📍 **Default city**: Addis Ababa, Ethiopia
- 🌡️ Real-time **temperature, humidity, and wind speed**
- 🕓 Displays **current, hourly, and daily** forecasts
- 🎨 **Responsive UI** designed with Tailwind CSS
- 🌙 **Dark mode** support
- ⚡ Built with **React + TypeScript** for type safety and performance
- 🧠 Fetches data from **OpenWeather API**
- 🧭 Error handling for invalid city names or network issues

---

## 🧰 Tech Stack

| Technology | Description |
|-------------|-------------|
| ⚛️ React (TypeScript) | Frontend framework |
| 🎨 Tailwind CSS | Styling and responsive design |
| 🌦️ OpenWeather API | Real-time weather data |
| 🔧 Vite / Create React App | Build tool (depending on your setup) |
| 🔒 Axios / Fetch | API requests |

---

## 🏗️ Installation & Setup

Follow these steps to run the project locally 👇

```bash
# 1️⃣ Clone the repository
git clone https://github.com/Degaga-Emiru/Weather-app.git

# 2️⃣ Navigate into the project folder
cd Weather-app/project

# 3️⃣ Install dependencies
npm install

# 4️⃣ Add your OpenWeather API Key
# Create a .env file in the root directory and add:
VITE_WEATHER_API_KEY=your_openweather_api_key

# 5️⃣ Run the development server
npm run dev

# 6️⃣ Build for production
npm run build
