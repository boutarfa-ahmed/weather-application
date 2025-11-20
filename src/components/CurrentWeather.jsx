import './current-weather.css'
import getWeatherIcon from './get-weather-icon';

export default function CurrentWeather({ weather, selectedUnits, location, hourly }) {
  if (!weather || !hourly) {
    return <p>Loading current weather...</p>;
  }

  const { 
    temperature, 
    windspeed, 
    
    weathercode,
    time 
  } = weather;

  const tempUnit = selectedUnits.temperature === 'celsius' ? '°C' : '°F';
  const windUnit = selectedUnits.wind;
  const percUnit = selectedUnits.precipitation;

  // Get current hour index
  const currentTime = new Date(time).toISOString().slice(0, 13) + ":00";
  const currentIndex = hourly.time.findIndex(t => t === currentTime);

  // Get real data from hourly forecast for current time
  const feelsLike = currentIndex >= 0 ? Math.round(hourly.apparent_temperature[currentIndex]) : Math.round(temperature - 2);
  const humidity = currentIndex >= 0 ? Math.round(hourly.relative_humidity_2m[currentIndex]) : 46;
  const precipitation = currentIndex >= 0 ? hourly.precipitation[currentIndex] : 0;

  // Format date
  const now = new Date();
  const dateOptions = { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  };
  const formattedDate = now.toLocaleDateString('en-US', dateOptions);

  return (
    <section className="current-weather">
      {/* Main Card */}
      <div className="weather-card">
        <div className="weather-card__header">
          <div className="location-info">
            <h3 className="location-name">{location || "Loading..."}</h3>
            <p className="current-date">{formattedDate}</p>
          </div>
          <div className="temperature-display">
            <span className="weather-icon-head">{getWeatherIcon(weathercode)}</span>
            <span className="temp-main">{Math.round(temperature)}{tempUnit}</span>
          </div>
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="weather-details-grid">
        <div className="detail-card">
          <p className="detail-label">Feels Like</p>
          <p className="detail-value">{feelsLike}{tempUnit}</p>
        </div>
        
        <div className="detail-card">
          <p className="detail-label">Humidity</p>
          <p className="detail-value">{humidity}%</p>
        </div>
        
        <div className="detail-card">
          <p className="detail-label">Wind</p>
          <p className="detail-value">{Math.round(windspeed)} {windUnit}</p>
        </div>
        
        <div className="detail-card">
          <p className="detail-label">Precipitation</p>
          <p className="detail-value">{precipitation.toFixed(1)} {percUnit}</p>
        </div>
      </div>
    </section>
  );
}