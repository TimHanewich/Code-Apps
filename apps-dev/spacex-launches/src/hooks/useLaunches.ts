import { useState, useEffect } from "react";
import type { Launch, Rocket, Launchpad } from "../types";

interface UseLaunchesResult {
  launches: Launch[];
  rockets: Map<string, Rocket>;
  launchpads: Map<string, Launchpad>;
  loading: boolean;
  error: string | null;
}

export function useLaunches(): UseLaunchesResult {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [rockets, setRockets] = useState<Map<string, Rocket>>(new Map());
  const [launchpads, setLaunchpads] = useState<Map<string, Launchpad>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        const [launchRes, rocketRes, padRes] = await Promise.all([
          fetch("https://api.spacexdata.com/v4/launches/upcoming", {
            signal: controller.signal,
          }),
          fetch("https://api.spacexdata.com/v4/rockets", {
            signal: controller.signal,
          }),
          fetch("https://api.spacexdata.com/v4/launchpads", {
            signal: controller.signal,
          }),
        ]);

        if (!launchRes.ok) throw new Error("Failed to fetch launches");
        if (!rocketRes.ok) throw new Error("Failed to fetch rockets");
        if (!padRes.ok) throw new Error("Failed to fetch launchpads");

        const launchData: Launch[] = await launchRes.json();
        const rocketData: Rocket[] = await rocketRes.json();
        const padData: Launchpad[] = await padRes.json();

        const sorted = launchData.sort((a, b) => a.date_unix - b.date_unix);
        setLaunches(sorted);

        const rocketMap = new Map<string, Rocket>();
        for (const r of rocketData) rocketMap.set(r.id, r);
        setRockets(rocketMap);

        const padMap = new Map<string, Launchpad>();
        for (const p of padData) padMap.set(p.id, p);
        setLaunchpads(padMap);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError((err as Error).message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    return () => controller.abort();
  }, []);

  return { launches, rockets, launchpads, loading, error };
}
