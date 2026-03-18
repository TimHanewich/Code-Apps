import type { HourlyWeather, DailyWeather } from '../types';
import {
  getDayRunScores,
  findBestHour,
  formatHour,
  getWeatherInfo,
} from '../utils';

interface Props {
  hourly: HourlyWeather;
  daily: DailyWeather;
}

export default function BestTimeToRun({ hourly, daily }: Props) {
  const todayScores = getDayRunScores(
    hourly,
    daily.sunrise[0],
    daily.sunset[0],
    daily.time[0]
  );
  const tomorrowScores =
    daily.time.length > 1
      ? getDayRunScores(
          hourly,
          daily.sunrise[1],
          daily.sunset[1],
          daily.time[1]
        )
      : [];

  const bestToday = findBestHour(todayScores);
  const bestTomorrow = findBestHour(tomorrowScores);

  if (!bestToday) return null;

  const todayWeather = getWeatherInfo(bestToday.weatherCode);
  const isGreatDay = bestToday.total >= 60;

  return (
    <div className="best-time-card">
      <h3 className="section-title">🏃 Best Time to Run</h3>

      <div className="best-time-today">
        <div
          className="score-badge-lg"
          style={{ backgroundColor: bestToday.color }}
        >
          {bestToday.total}
        </div>

        <div className="best-time-info">
          {isGreatDay ? (
            <>
              <span className="best-time-label">{bestToday.label}!</span>
              <span className="best-time-hour">
                {formatHour(bestToday.time)} Today
              </span>
            </>
          ) : (
            <>
              <span className="best-time-label">Not ideal today</span>
              <span className="best-time-hour">
                Best option: {formatHour(bestToday.time)}
              </span>
            </>
          )}
        </div>

        <div className="best-time-conditions">
          <span>
            {todayWeather.icon} {Math.round(bestToday.temperature)}°F
          </span>
          <span>💨 {Math.round(bestToday.windSpeed)} mph</span>
          <span>突 {Math.round(bestToday.windGusts)} mph gusts</span>
          <span>🌧️ {bestToday.precipProbability}% rain</span>
        </div>
      </div>

      {bestTomorrow && (
        <div className="best-time-tomorrow">
          <span
            className="score-badge-sm"
            style={{ backgroundColor: bestTomorrow.color }}
          >
            {bestTomorrow.total}
          </span>
          <span className="tomorrow-text">
            Tomorrow: {formatHour(bestTomorrow.time)} —{' '}
            {Math.round(bestTomorrow.temperature)}°F, {bestTomorrow.label}
          </span>
        </div>
      )}
    </div>
  );
}
