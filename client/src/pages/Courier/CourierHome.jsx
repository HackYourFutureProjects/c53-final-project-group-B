import { useEffect, useState } from "react";
import styles from "./CourierHome.module.css";

// Mock data only; no backend calls
const MOCK_PARCELS = [
  { id: 101, title: "Docs to Zaandam", distanceKm: 2.4, fee: 8 },
  { id: 102, title: "Pick up parcel at AH XL", distanceKm: 4.9, fee: 7.5 },
  { id: 103, title: "Groceries to Distelweg", distanceKm: 1.8, fee: 6 },
];

const CourierHome = () => {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate async load
  useEffect(() => {
    const t = setTimeout(() => {
      setParcels(MOCK_PARCELS);
      setLoading(false);
    }, 350);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>New Delivery Task</h1>
      </header>

      <section className={styles.twoPane}>
        {/* Left: same map placeholder */}
        <div className={styles.mapBox}>
          <button className={styles.geoBtn} aria-label="Use my location">
            📍
          </button>
          <div className={styles.mapPin}>📌</div>
          <button
            type="button"
            className={styles.addBtn}
            onClick={() => alert("Start is disabled in mock")}
          >
            Add Task
          </button>
        </div>

        {/* Right: Available Parcels list */}
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Available Parcels</h2>

          {loading && <p className={styles.note}>Loading…</p>}

          {!loading && (
            <ul className={styles.parcelList}>
              {parcels.map((p) => (
                <li key={p.id} className={styles.parcelCard}>
                  <div className={styles.colorBar} />
                  <div className={styles.parcelBody}>
                    <div className={styles.parcelTitle}>{p.title}</div>
                    <div className={styles.parcelMeta}>
                      <span>{p.distanceKm} km</span>
                      {typeof p.fee === "number" && <span>€{p.fee}</span>}
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.acceptBtn}
                    onClick={() => alert(`Accept ${p.id}`)}
                  >
                    Accept
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </section>
    </main>
  );
};

export default CourierHome;
