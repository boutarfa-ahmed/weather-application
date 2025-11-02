import overcast from '../assets/images/icon-overcast.webp';
import partly_cloudy from '../assets/images/icon-partly-cloudy.webp';
import rain from '../assets/images/icon-rain.webp';
import snow from '../assets/images/icon-snow.webp';
import storm from '../assets/images/icon-storm.webp';
import sunny from '../assets/images/icon-sunny.webp';
import drizzle from '../assets/images/icon-drizzle.webp';
import fog from '../assets/images/icon-fog.webp';

export default function getWeatherIcon(code) {
  // Clear sky
  if (code === 0) return <img src={sunny} alt="sunny" className="weather-icon-img" />;
  
  // Mainly clear, partly cloudy
  if (code === 1 || code === 2) return <img src={partly_cloudy} alt="partly cloudy" className="weather-icon-img" />;
  
  // Overcast
  if (code === 3) return <img src={overcast} alt="overcast" className="weather-icon-img" />;
  
  // Fog
  if (code === 45 || code === 48) return <img src={fog} alt="fog" className="weather-icon-img" />;
  
  // Drizzle
  if (code >= 51 && code <= 57) return <img src={drizzle} alt="drizzle" className="weather-icon-img" />;
  
  // Rain
  if (code >= 61 && code === 67) return <img src={rain} alt="rain" className="weather-icon-img" />;
  
  // Snow
  if (code >= 71 && code <= 77) return <img src={snow} alt="snow" className="weather-icon-img" />;
  
  // Rain showers
  if (code >= 80 && code <= 82) return <img src={rain} alt="rain" className="weather-icon-img" />;
  
  // Snow showers
  if (code === 85 || code === 86) return <img src={snow} alt="snow" className="weather-icon-img" />;
  
  // Thunderstorm
  if (code >= 95 && code <= 99) return <img src={storm} alt="thunderstorm" className="weather-icon-img" />;
  
  // Default
  return <img src={partly_cloudy} alt="weather" className="weather-icon-img" />;
}