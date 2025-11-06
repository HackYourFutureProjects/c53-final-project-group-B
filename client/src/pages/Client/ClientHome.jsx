import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./ClientHome.module.css";

// Mock data only; no backend calls
const MOCK_DRIVERS = [
  {
    id: 1,
    name: "John Doe",
    rating: 4.8,
    distanceKm: 6.4,
    vehicle: "Car",
    avatarUrl: "",
  },
  {
    id: 2,
    name: "John Smith",
    rating: 4.2,
    distanceKm: 5.8,
    vehicle: "Motorbike",
    avatarUrl: "",
  },
  {
    id: 3,
    name: "Alex S.",
    rating: 4.9,
    distanceKm: 3.1,
    vehicle: "Bike",
    avatarUrl: "",
  },
];

const ClientHome = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate async load
  useEffect(() => {
    const t = setTimeout(() => {
      setDrivers(MOCK_DRIVERS);
      setLoading(false);
    }, 350);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>New Delivery Task</h1>
        <Link to="/client/tasks" className={styles.linkBtn}>
          My tasks
        </Link>
      </header>

      <section className={styles.twoPane}>
        {/* Left: map placeholder with big Add button */}
        <div className={styles.mapBox}>
          <button className={styles.geoBtn} aria-label="Use my location">
            📍
          </button>
          <div className={styles.mapPin}>📌</div>
          <button
            type="button"
            className={styles.addBtn}
            onClick={() => alert("Open Create Delivery flow")}
          >
            Add Task
          </button>
        </div>

        {/* Right: Available Drivers list */}
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Available Drivers</h2>

          {loading && <p className={styles.note}>Loading…</p>}

          {!loading && (
            <ul className={styles.driverList}>
              {drivers.map((d) => (
                <li key={d.id} className={styles.driverCard}>
                  <img
                    className={styles.avatar}
                    src={d.avatarUrl || "https://i.pravatar.cc/80?img=5"}
                    alt={d.name}
                  />
                  <div className={styles.driverBody}>
                    <div className={styles.driverName}>{d.name}</div>
                    <div className={styles.driverMeta}>
                      <span>⭐ {d.rating}</span>
                      <span>{d.distanceKm} km</span>
                      <span>{d.vehicle}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </section>
    </main>
  );
};

export default ClientHome;
