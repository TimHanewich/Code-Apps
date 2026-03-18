import { useState, useEffect, useCallback } from "react";
import type { Launch, LaunchResponse } from "../types";

const API_URL = "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=12&mode=list";

interface UseLaunchesResult {
  launches: Launch[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  refetch: () => void;
}

export function useLaunches(): UseLaunchesResult {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchLaunches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data: LaunchResponse = await res.json();
      setLaunches(data.results);
      setTotalCount(data.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch launches");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLaunches();
  }, [fetchLaunches]);

  return { launches, loading, error, totalCount, refetch: fetchLaunches };
}
