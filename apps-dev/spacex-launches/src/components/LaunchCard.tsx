import type { Launch, Rocket, Launchpad } from "../types";
import CountdownTimer from "./CountdownTimer";

interface LaunchCardProps {
  launch: Launch;
  rocket?: Rocket;
  launchpad?: Launchpad;
  featured?: boolean;
}

function formatDate(dateUtc: string, precision: string): string {
  const date = new Date(dateUtc);
  switch (precision) {
    case "hour":
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      });
    case "day":
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    case "month":
      return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    default:
      return date.toLocaleDateString("en-US", { year: "numeric" });
  }
}

export default function LaunchCard({
  launch,
  rocket,
  launchpad,
  featured,
}: LaunchCardProps) {
  const patchImg = launch.links.patch.small || launch.links.patch.large;
  const coreCount = launch.cores.length;
  const isHeavy = coreCount > 1;

  return (
    <article className={`launch-card ${featured ? "featured" : ""}`}>
      <div className="card-header">
        <div className="patch-container">
          {patchImg ? (
            <img src={patchImg} alt={`${launch.name} patch`} className="patch" />
          ) : (
            <div className="patch-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
          )}
        </div>
        <div className="card-title-block">
          <h3 className="card-title">{launch.name}</h3>
          <span className="flight-number">Flight #{launch.flight_number}</span>
        </div>
      </div>

      {featured && <CountdownTimer targetDate={launch.date_utc} />}

      <div className="card-details">
        <div className="detail-row">
          <span className="detail-icon">📅</span>
          <div>
            <span className="detail-label">Date</span>
            <span className="detail-value">
              {formatDate(launch.date_utc, launch.date_precision)}
              {launch.tbd && <span className="badge tbd">TBD</span>}
              {launch.net && <span className="badge net">NET</span>}
            </span>
          </div>
        </div>

        <div className="detail-row">
          <span className="detail-icon">🚀</span>
          <div>
            <span className="detail-label">Vehicle</span>
            <span className="detail-value">
              {rocket?.name || "Unknown"}{" "}
              {isHeavy && <span className="badge heavy">Heavy</span>}
            </span>
          </div>
        </div>

        <div className="detail-row">
          <span className="detail-icon">📍</span>
          <div>
            <span className="detail-label">Launchpad</span>
            <span className="detail-value">
              {launchpad?.name || "Unknown"}
              {launchpad?.locality && (
                <span className="detail-sub">{launchpad.locality}</span>
              )}
            </span>
          </div>
        </div>

        {launch.payloads.length > 0 && (
          <div className="detail-row">
            <span className="detail-icon">📦</span>
            <div>
              <span className="detail-label">Payloads</span>
              <span className="detail-value">{launch.payloads.length}</span>
            </div>
          </div>
        )}

        {launch.crew.length > 0 && (
          <div className="detail-row">
            <span className="detail-icon">👨‍🚀</span>
            <div>
              <span className="detail-label">Crew</span>
              <span className="detail-value">{launch.crew.length} members</span>
            </div>
          </div>
        )}
      </div>

      {launch.details && (
        <p className="card-description">{launch.details}</p>
      )}

      <div className="card-footer">
        <div className="core-info">
          {launch.cores.map((core, i) => (
            <span
              key={i}
              className={`core-badge ${core.reused ? "reused" : "new"}`}
            >
              {core.reused ? "♻️ Reused" : "✨ New"}{" "}
              {core.flight && `(Flight ${core.flight})`}
            </span>
          ))}
        </div>
        <div className="card-links">
          {launch.links.webcast && (
            <a href={launch.links.webcast} target="_blank" rel="noopener noreferrer" className="link-btn">
              ▶ Webcast
            </a>
          )}
          {launch.links.reddit.campaign && (
            <a href={launch.links.reddit.campaign} target="_blank" rel="noopener noreferrer" className="link-btn">
              💬 Reddit
            </a>
          )}
          {launch.links.wikipedia && (
            <a href={launch.links.wikipedia} target="_blank" rel="noopener noreferrer" className="link-btn">
              📖 Wiki
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
