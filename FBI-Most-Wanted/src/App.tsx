import { useCallback, useEffect, useRef, useState } from "react";
import type { WantedApiResponse, WantedPerson } from "./types";
import WantedCard from "./components/WantedCard";
import WantedDetail from "./components/WantedDetail";
import "./App.css";

const API_BASE = "https://api.fbi.gov/wanted/v1/list";
const PAGE_SIZE = 20;

function App() {
  const [items, setItems] = useState<WantedPerson[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<WantedPerson | null>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const gridRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async (pg: number, query: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: pg.toString(),
        pageSize: PAGE_SIZE.toString(),
      });
      if (query.trim()) params.set("title", query.trim());

      const res = await fetch(`${API_BASE}?${params}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data: WantedApiResponse = await res.json();
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(page, search);
  }, [page, search, fetchData]);

  // Close modal with Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSearch = (value: string) => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setPage(1);
      setSearch(value);
    }, 400);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const goToPage = (pg: number) => {
    setPage(pg);
    gridRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <span className="fbi-badge">FBI</span>
            <div>
              <h1>Most Wanted</h1>
              <p className="header-subtitle">
                {total.toLocaleString()} records from the FBI Wanted API
              </p>
            </div>
          </div>
          <div className="search-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by name..."
              className="search-input"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="app-main" ref={gridRef}>
        {loading && (
          <div className="loading">
            <div className="spinner" />
            <span>Loading...</span>
          </div>
        )}

        {error && (
          <div className="error-banner">
            <span>⚠ {error}</span>
            <button onClick={() => fetchData(page, search)}>Retry</button>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="empty-state">No results found.</div>
        )}

        {!loading && items.length > 0 && (
          <>
            <div className="wanted-grid">
              {items.map((person) => (
                <WantedCard
                  key={person.uid}
                  person={person}
                  onClick={setSelected}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  disabled={page <= 1}
                  onClick={() => goToPage(page - 1)}
                  className="page-btn"
                >
                  ← Prev
                </button>
                <span className="page-info">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => goToPage(page + 1)}
                  className="page-btn"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {selected && (
        <WantedDetail person={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

export default App;
