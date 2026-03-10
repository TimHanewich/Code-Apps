import type { WantedPerson } from "../types";
import "./WantedCard.css";

interface WantedCardProps {
  person: WantedPerson;
  onClick: (person: WantedPerson) => void;
}

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='350' fill='%23222'%3E%3Crect width='300' height='350' fill='%23111'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23555' font-size='18'%3ENo Photo%3C/text%3E%3C/svg%3E";

export default function WantedCard({ person, onClick }: WantedCardProps) {
  const imgSrc = person.images?.[0]?.thumb || person.images?.[0]?.original || PLACEHOLDER_IMG;
  const hasReward = person.reward_max && person.reward_max > 0;
  const hasWarning = !!person.warning_message;
  const subjects = person.subjects?.join(", ") ?? "";

  return (
    <button className="wanted-card" onClick={() => onClick(person)} type="button">
      {hasWarning && <div className="card-warning-badge">⚠ ARMED & DANGEROUS</div>}
      {hasReward && (
        <div className="card-reward-badge">
          REWARD up to ${person.reward_max!.toLocaleString()}
        </div>
      )}
      <div className="card-image-wrapper">
        <img
          src={imgSrc}
          alt={person.title}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = PLACEHOLDER_IMG;
          }}
        />
      </div>
      <div className="card-body">
        <h3 className="card-title">{person.title}</h3>
        {subjects && <span className="card-subject">{subjects}</span>}
        {person.sex && (
          <div className="card-meta">
            {[person.sex, person.race_raw, person.age_range].filter(Boolean).join(" · ")}
          </div>
        )}
      </div>
    </button>
  );
}
