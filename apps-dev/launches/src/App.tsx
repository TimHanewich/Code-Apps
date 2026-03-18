import "./App.css";
import { useLaunches } from "./hooks/useLaunches";
import { LaunchCard } from "./components/LaunchCard";
import { Countdown } from "./components/Countdown";

function App() {
  const { launches, loading, error, totalCount, refetch } = useLaunches();

  const nextLaunch = launches.find(
    (l) => new Date(l.net).getTime() > Date.now()
  );

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-content">
          <h1>🚀 Launch Dashboard</h1>
          <p className="subtitle">
            Tracking <strong>{totalCount}</strong> upcoming launches worldwide
          </p>
        </div>
      </header>

      {nextLaunch && (
        <section className="next-launch">
          <div className="next-launch-inner">
            <span className="next-launch-label">Next Launch</span>
            <h2 className="next-launch-name">{nextLaunch.name}</h2>
            <Countdown target={nextLaunch.net} />
          </div>
        </section>
      )}

      <main className="main">
        {loading && (
          <div className="state-msg">
            <div className="spinner" />
            <p>Loading upcoming launches…</p>
          </div>
        )}

        {error && (
          <div className="state-msg error">
            <p>⚠️ {error}</p>
            <button className="btn" onClick={refetch}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="launch-grid">
            {launches.map((launch) => (
              <LaunchCard key={launch.id} launch={launch} />
            ))}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>
          Data from{" "}
          <a
            href="https://thespacedevs.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            The Space Devs
          </a>{" "}
          · Launch Library 2 API
        </p>
      </footer>
    </div>
  );
}

export default App;
