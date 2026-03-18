import type { WantedPerson } from "../types";
import "./WantedDetail.css";

interface WantedDetailProps {
  person: WantedPerson;
  onClose: () => void;
}

function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

function formatHeight(inches: number | null): string {
  if (!inches) return "";
  const ft = Math.floor(inches / 12);
  const rem = inches % 12;
  return `${ft}'${rem}"`;
}

export default function WantedDetail({ person, onClose }: WantedDetailProps) {
  const imgSrc = person.images?.[0]?.large || person.images?.[0]?.original || "";
  const hasReward = person.reward_max && person.reward_max > 0;

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="detail-close" onClick={onClose} type="button">
          ✕
        </button>

        <div className="detail-content">
          <div className="detail-left">
            {imgSrc ? (
              <img src={imgSrc} alt={person.title} className="detail-image" />
            ) : (
              <div className="detail-no-image">No Photo Available</div>
            )}
            {person.images.length > 1 && (
              <div className="detail-thumbnails">
                {person.images.slice(1, 5).map((img, i) => (
                  <img key={i} src={img.thumb || img.original} alt={img.caption || ""} />
                ))}
              </div>
            )}
          </div>

          <div className="detail-right">
            {person.subjects && (
              <div className="detail-subjects">
                {person.subjects.map((s) => (
                  <span key={s} className="detail-subject-tag">
                    {s}
                  </span>
                ))}
              </div>
            )}

            <h2 className="detail-title">{person.title}</h2>

            {person.warning_message && (
              <div className="detail-warning">⚠ {person.warning_message}</div>
            )}

            {hasReward && (
              <div className="detail-reward">
                💰 Reward: up to ${person.reward_max!.toLocaleString()}
                {person.reward_text && <p>{stripHtml(person.reward_text)}</p>}
              </div>
            )}

            {person.aliases && person.aliases.length > 0 && (
              <div className="detail-field">
                <strong>Aliases:</strong> {person.aliases.join(", ")}
              </div>
            )}

            <div className="detail-grid">
              {person.sex && (
                <div className="detail-field">
                  <strong>Sex</strong>
                  <span>{person.sex}</span>
                </div>
              )}
              {person.race_raw && (
                <div className="detail-field">
                  <strong>Race</strong>
                  <span>{person.race_raw}</span>
                </div>
              )}
              {person.age_range && (
                <div className="detail-field">
                  <strong>Age</strong>
                  <span>{person.age_range}</span>
                </div>
              )}
              {person.hair && (
                <div className="detail-field">
                  <strong>Hair</strong>
                  <span>{person.hair}</span>
                </div>
              )}
              {person.eyes && (
                <div className="detail-field">
                  <strong>Eyes</strong>
                  <span>{person.eyes}</span>
                </div>
              )}
              {person.height_min && (
                <div className="detail-field">
                  <strong>Height</strong>
                  <span>{formatHeight(person.height_min)}{person.height_max && person.height_max !== person.height_min ? ` - ${formatHeight(person.height_max)}` : ""}</span>
                </div>
              )}
              {person.weight && (
                <div className="detail-field">
                  <strong>Weight</strong>
                  <span>{person.weight}</span>
                </div>
              )}
              {person.build && (
                <div className="detail-field">
                  <strong>Build</strong>
                  <span>{person.build}</span>
                </div>
              )}
              {person.complexion && (
                <div className="detail-field">
                  <strong>Complexion</strong>
                  <span>{person.complexion}</span>
                </div>
              )}
              {person.nationality && (
                <div className="detail-field">
                  <strong>Nationality</strong>
                  <span>{person.nationality}</span>
                </div>
              )}
              {person.place_of_birth && (
                <div className="detail-field">
                  <strong>Place of Birth</strong>
                  <span>{person.place_of_birth}</span>
                </div>
              )}
              {person.languages && (
                <div className="detail-field">
                  <strong>Languages</strong>
                  <span>{person.languages.join(", ")}</span>
                </div>
              )}
            </div>

            {person.scars_and_marks && (
              <div className="detail-section">
                <strong>Scars & Marks:</strong>
                <p>{stripHtml(person.scars_and_marks)}</p>
              </div>
            )}

            {person.caution && (
              <div className="detail-section detail-caution">
                <strong>Caution:</strong>
                <p>{stripHtml(person.caution)}</p>
              </div>
            )}

            {person.details && (
              <div className="detail-section">
                <strong>Details:</strong>
                <p>{stripHtml(person.details)}</p>
              </div>
            )}

            {person.remarks && (
              <div className="detail-section">
                <strong>Remarks:</strong>
                <p>{stripHtml(person.remarks)}</p>
              </div>
            )}

            <a href={person.url} target="_blank" rel="noopener noreferrer" className="detail-fbi-link">
              View on FBI.gov →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
