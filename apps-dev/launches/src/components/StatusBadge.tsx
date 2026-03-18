import type { LaunchStatus } from "../types";

const STATUS_COLORS: Record<number, { bg: string; color: string }> = {
  1: { bg: "rgba(34,197,94,0.15)", color: "#22c55e" },   // Go
  2: { bg: "rgba(234,179,8,0.15)", color: "#eab308" },    // TBD
  3: { bg: "rgba(59,130,246,0.15)", color: "#3b82f6" },    // Success
  4: { bg: "rgba(239,68,68,0.15)", color: "#ef4444" },     // Failure
  5: { bg: "rgba(168,85,247,0.15)", color: "#a855f7" },    // Hold
  6: { bg: "rgba(239,68,68,0.15)", color: "#ef4444" },     // In Flight
  7: { bg: "rgba(107,114,128,0.15)", color: "#6b7280" },   // Partial Failure
  8: { bg: "rgba(234,179,8,0.15)", color: "#eab308" },     // TBC
};

const DEFAULT_COLOR = { bg: "rgba(107,114,128,0.15)", color: "#6b7280" };

export function StatusBadge({ status }: { status: LaunchStatus }) {
  const colors = STATUS_COLORS[status.id] ?? DEFAULT_COLOR;

  return (
    <span
      className="status-badge"
      style={{ background: colors.bg, color: colors.color }}
      title={status.description}
    >
      {status.abbrev}
    </span>
  );
}
