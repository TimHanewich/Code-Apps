import type { Launch } from "../types";
import { StatusBadge } from "./StatusBadge";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='220' fill='%231a1b23'%3E%3Crect width='400' height='220'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%234b5563' font-size='14' font-family='system-ui'%3ENo Image%3C/text%3E%3C/svg%3E";

export function LaunchCard({ launch }: { launch: Launch }) {
  const rocketName =
    launch.rocket?.configuration?.full_name ||
    launch.rocket?.configuration?.name ||
    "Unknown Rocket";

  return (
    <article className="launch-card">
      <div className="launch-card-img">
        <img
          src={launch.image ?? PLACEHOLDER_IMG}
          alt={launch.name}
          loading="lazy"
        />
        {launch.webcast_live && <span className="live-badge">● LIVE</span>}
      </div>

      <div className="launch-card-body">
        <div className="launch-card-header">
          <StatusBadge status={launch.status} />
          {launch.probability != null && (
            <span className="probability">{launch.probability}%</span>
          )}
        </div>

        <h3 className="launch-card-title">{launch.name}</h3>

        <div className="launch-card-meta">
          <div className="meta-row">
            <span className="meta-icon">🚀</span>
            <span>{rocketName}</span>
          </div>
          <div className="meta-row">
            <span className="meta-icon">📅</span>
            <span>{formatDate(launch.net)}</span>
          </div>
          <div className="meta-row">
            <span className="meta-icon">📍</span>
            <span>{launch.pad?.location?.name ?? "Unknown Location"}</span>
          </div>
          {launch.mission && (
            <div className="meta-row">
              <span className="meta-icon">🎯</span>
              <span>
                {launch.mission.type}
                {launch.mission.orbit ? ` · ${launch.mission.orbit.abbrev}` : ""}
              </span>
            </div>
          )}
        </div>

        {launch.mission?.description && (
          <p className="launch-card-desc">{launch.mission.description}</p>
        )}

        <div className="launch-card-footer">
          <span className="provider">{launch.launch_service_provider?.name ?? "Unknown Provider"}</span>
          {launch.weather_concerns && (
            <span className="weather" title={launch.weather_concerns}>⛅ Weather concern</span>
          )}
        </div>
      </div>
    </article>
  );
}
