import './hourly-forecast.css';
import getWeatherIcon from './get-weather-icon';
import { useState } from 'react';

export default function HourlyForecast({ hourly, daily, unitSystem }) {
  if (!hourly || !daily) return null;

  const [selectedDay, setSelectedDay] = useState(0);
  const tempUnit = unitSystem === "metric" ? "°C" : "°F";

  // Function bech tjib el hourly data mte3 nhar m3ayyen
  const getHourlyDataForDay = (dayIndex) => {
    const selectedDate = daily.time[dayIndex];
    const hourlyData = [];

    hourly.time.forEach((time, i) => {
      const hourDate = time.split('T')[0]; // Extract date part (YYYY-MM-DD)
      
      if (hourDate === selectedDate) {
        const hour = new Date(time).getHours();
        hourlyData.push({
          time: hour,
          temp: hourly.temperature_2m[i],
          weatherCode: hourly.weather_code[i],
          precipitation: hourly.precipitation_probability?.[i] || 0
        });
      }
    });

    return hourlyData;
  };

  const hourlyDataForSelectedDay = getHourlyDataForDay(selectedDay);

  // Format hour display (3 PM, 4 PM, etc.)
  const formatHour = (hour) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  return (
    <section className='hourly-forecast'>
      <div className="hourly-header">
        <h2>Hourly forecast</h2>
        <select 
          value={selectedDay} 
          onChange={(e) => setSelectedDay(Number(e.target.value))}
          className="day-selector"
        >
          {daily.time.map((day, i) => (
            <option key={i} value={i}>
              {new Date(day).toLocaleDateString("en-US", { weekday: "long" })}
            </option>
          ))}
        </select>
      </div>

      <div className='hourly-forecast-grid'>
        {hourlyDataForSelectedDay.map((hour, i) => (
          <div className='hourly-card' key={i}>
            <div className='hour-icon-time'>
                <div className="hour-icon">
                  {getWeatherIcon(hour.weatherCode)}
                </div>
                <p className="hour-time">{formatHour(hour.time)}</p>
            </div> 
            <p className="hour-temp">
              {Math.round(hour.temp)}{tempUnit}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}