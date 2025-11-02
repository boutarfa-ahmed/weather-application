import './daily-forecast.css';
import getWeatherIcon from './get-weather-icon';

export default function DailyForecast({ daily, unitSystem }) {
  if (!daily) return null;

  const tempUnit = unitSystem === "metric" ? "°C" : "°F";

  return (
    <section className="daily-forecast">
      <h2>Daily forecast</h2>
      <div className="forecast-grid">
        {daily.time.map((day, i) => (
          <div className="forecast-card" key={day}>
            <p className="day-name">
              {new Date(day).toLocaleDateString("en-US", { weekday: "short" })}
            </p>
            
            <div className="weather-icon">
              {getWeatherIcon(daily.weather_code?.[i])}
            </div>
            
            <p className="temperature">
              <span>{Math.round(daily.temperature_2m_max[i])}{tempUnit}</span>
              <span>{Math.round(daily.temperature_2m_min[i])}{tempUnit}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}