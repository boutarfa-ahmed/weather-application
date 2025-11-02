import { useState, useEffect, useContext } from "react";
import { UnitsContext } from "./context/UnitsContext";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import DailyForecast from "./components/DailyForecast";
import ErrorScreen from "./components/ErrorScreen";
import HourlyForecast from './components/HourlyForecast';
import "./index.css";
import "./App.css";

function App() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [lastCoords, setLastCoords] = useState(null);
  const [location, setLocation] = useState("");

  const { unitSystem } = useContext(UnitsContext);

  async function fetchWeather(lat, lon, cityName = "") {
    setIsLoading(true);
    setError(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,weather_code,precipitation_probability,precipitation,apparent_temperature,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,weather_code&timezone=auto${
        unitSystem === "imperial"
          ? "&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch"
          : "&temperature_unit=celsius&windspeed_unit=kmh&precipitation_unit=mm"
      }`;
      const res = await fetch(url);
      const data = await res.json();
      console.log(data);
      setWeather(data);
      setLastCoords({ lat, lon });
      
      // If city name provided, use it, otherwise reverse geocode
      if (cityName) {
        setLocation(cityName);
      } else {
        // Reverse geocode using Nominatim (OpenStreetMap)
        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'WeatherApp/1.0'
              }
            }
          );
          const geoData = await geoRes.json();
          
          if (geoData && geoData.address) {
            const city = geoData.address.city || 
                        geoData.address.town || 
                        geoData.address.village || 
                        geoData.address.county ||
                        "Unknown City";
            const country = geoData.address.country || "Unknown Country";
            setLocation(`${city}, ${country}`);
          } else {
            setLocation("Your Location");
          }
        } catch (err) {
          console.error("Reverse geocoding error:", err);
          setLocation("Your Location");
        }
      }
    } catch (err) {
      setError("API error");
    } finally {
      setIsLoading(false);
    }
  }

  async function searchCity(lat, lon, locationName = "") {
    // If coordinates provided directly (from suggestion click)
    if (lat && lon) {
      fetchWeather(lat, lon, locationName);
      return;
    }

    // Otherwise search by query
    if (!query.trim()) return;
    try {
      setIsLoading(true);
      setError(null);
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${query}`
      );
      const geoData = await geoRes.json();
      if (!geoData.results?.length) throw new Error("City not found");
      const { latitude, longitude, name, country } = geoData.results[0];
      
      fetchWeather(latitude, longitude, `${name}, ${country}`);
    } catch (err) {
      setError("City not found");
    } finally {
      setIsLoading(false);
    }
  }

  // Refetch when unit system changes
  useEffect(() => {
    if (lastCoords) {
      fetchWeather(lastCoords.lat, lastCoords.lon, location);
    }
  }, [unitSystem]);

  // Initial load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeather(pos.coords.latitude, pos.coords.longitude);
        },
        () => fetchWeather(36.8065, 10.1815, "Tunis, Tunisia")
      );
    } else {
      fetchWeather(36.8065, 10.1815, "Tunis, Tunisia");
    }
  }, []);

  if (error) {
    return (
      <>
        <Header />
        <ErrorScreen
          message={error}
          onRetry={() => {
            setError(null);
            if (lastCoords) {
              fetchWeather(lastCoords.lat, lastCoords.lon, location);
            } else {
              window.location.reload();
            }
          }}
          isLoading={isLoading}
        />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="weather-main">
        <h1>How's the sky looking today?</h1>
        <SearchBar query={query} setQuery={setQuery} onSearch={searchCity} />
        <div className="layout-main">
          {isLoading && <p>Loading...</p>}
          {weather && !isLoading && (
            <>
            <div className="left-side">
              <CurrentWeather 
                weather={weather.current_weather} 
                unitSystem={unitSystem}
                location={location}
                hourly={weather.hourly}
              />
              <DailyForecast daily={weather.daily} unitSystem={unitSystem} />
            </div>
            <div className="right-side">
              <HourlyForecast 
                hourly={weather.hourly} 
                daily={weather.daily} 
                unitSystem={unitSystem} 
              />
            </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default App;