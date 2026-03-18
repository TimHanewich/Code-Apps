import { useState, useMemo } from "react";
import { useLaunches } from "./hooks/useLaunches";
import LaunchCard from "./components/LaunchCard";
import "./App.css";

function App() {
  const { launches, rockets, launchpads, loading, error } = useLaunches();
  const [search, setSearch] = useState("");
  const [rocketFilter, setRocketFilter] = useState("all");

  const uniqueRockets = useMemo(() => {
    const ids = new Set(launches.map((l) => l.rocket));
    return [...ids]
      .map((id) => rockets.get(id))
      .filter(Boolean)
      .sort((a, b) => a!.name.localeCompare(b!.name));
  }, [launches, rockets]);

  const filtered = useMemo(() => {
    return launches.filter((l) => {
      const matchesSearch = l.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesRocket =
        rocketFilter === "all" || l.rocket === rocketFilter;
      return matchesSearch && matchesRocket;
    });
  }, [launches, search, rocketFilter]);

  return (
    <div className="app">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-block">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <div>
              <h1>SpaceX Launch Dashboard</h1>
              <p className="subtitle">Upcoming missions tracker</p>
            </div>
          </div>
          {!loading && !error && (
            <div className="stats">
              <div className="stat">
                <span className="stat-value">{launches.length}</span>
                <span className="stat-label">Upcoming</span>
              </div>
              <div className="stat">
                <span className="stat-value">
                  {new Set(launches.map((l) => l.rocket)).size}
                </span>
                <span className="stat-label">Vehicles</span>
              </div>
              <div className="stat">
                <span className="stat-value">
                  {new Set(launches.map((l) => l.launchpad)).size}
                </span>
                <span className="stat-label">Launchpads</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="dashboard-main">
        {loading && (
          <div className="loading">
            <div className="spinner" />
            <p>Loading launch manifest…</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>⚠️ {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="controls">
              <div className="search-wrapper">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21L16.65 16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search missions…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />
              </div>
              <select
                value={rocketFilter}
                onChange={(e) => setRocketFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Vehicles</option>
                {uniqueRockets.map(
                  (r) =>
                    r && (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    )
                )}
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="empty">
                <p>No launches match your filters.</p>
              </div>
            ) : (
              <>
                {/* Featured next launch */}
                <section className="next-launch-section">
                  <h2 className="section-title">Next Launch</h2>
                  <LaunchCard
                    launch={filtered[0]}
                    rocket={rockets.get(filtered[0].rocket)}
                    launchpad={launchpads.get(filtered[0].launchpad)}
                    featured
                  />
                </section>

                {filtered.length > 1 && (
                  <section className="all-launches-section">
                    <h2 className="section-title">
                      All Upcoming ({filtered.length - 1} more)
                    </h2>
                    <div className="launch-grid">
                      {filtered.slice(1).map((launch) => (
                        <LaunchCard
                          key={launch.id}
                          launch={launch}
                          rocket={rockets.get(launch.rocket)}
                          launchpad={launchpads.get(launch.launchpad)}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </>
        )}
      </main>

      <footer className="dashboard-footer">
        <p>
          Data from{" "}
          <a href="https://github.com/r-spacex/SpaceX-API" target="_blank" rel="noopener noreferrer">
            SpaceX-API
          </a>{" "}
          · Built with React + Vite
        </p>
      </footer>
    </div>
  );
}

export default App;
