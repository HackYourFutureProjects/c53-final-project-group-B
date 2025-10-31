import { Link } from "react-router-dom";
import Card from "../../components/Card";
import styles from "./ClientHome.module.css";

// Mock data then gonna change to real API data
const mockCouriers = [
  { id: 1, name: "Hussein B.", distanceKm: 2.4, rating: 4.8 },
  { id: 2, name: "Anna D.", distanceKm: 4.1, rating: 4.5 },
  { id: 3, name: "Paul J.", distanceKm: 5.2, rating: 4.6 },
];

const mockTasks = [
  { id: "T-201", title: "Deliver docs to Zaandam", status: "posted" },
  { id: "T-202", title: "Pick up parcel", status: "accepted" },
];

const ClientHome = () => {
  return (
    <main className={styles.wrapper}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Your deliveries</h1>
          <p className={styles.subtitle}>
            Post a new delivery or track the ones you already created.
          </p>
        </div>
        <Link to="/client/tasks" className={styles.linkBtn}>
          View all tasks
        </Link>
      </header>

      <div className={styles.grid}>
        {/* 1. Create delivery */}
        <Card
          title="Create delivery"
          action={
            <button type="button" className={styles.primaryBtn}>
              + New delivery
            </button>
          }
        >
          <p>Publish a task with pickup and dropoff locations.</p>
          <p className={styles.hint}>
            Later we can add price, distance and courier preferences.
          </p>
        </Card>

        {/* 2. Available couriers */}
        <Card title="Available couriers near you">
          <ul className={styles.list}>
            {mockCouriers.map((c) => (
              <li key={c.id} className={styles.listItem}>
                <div>
                  <p className={styles.listTitle}>{c.name}</p>
                  <p className={styles.listMeta}>
                    {c.distanceKm} km • ⭐ {c.rating}
                  </p>
                </div>
                <button type="button" className={styles.smallBtn}>
                  Request
                </button>
              </li>
            ))}
          </ul>
          <p className={styles.note}>
            Distance / sorting will use user location (to be added).
          </p>
        </Card>

        {/* 3. My last tasks */}
        <Card
          title="My tasks"
          action={
            <Link to="/client/tasks" className={styles.smallLink}>
              View all
            </Link>
          }
        >
          <ul className={styles.list}>
            {mockTasks.map((t) => (
              <li key={t.id} className={styles.listItem}>
                <div>
                  <p className={styles.listTitle}>{t.title}</p>
                  <span className={`${styles.status} ${styles[t.status]}`}>
                    {t.status}
                  </span>
                </div>
                <Link to="/client/tasks" className={styles.smallLink}>
                  Open
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </main>
  );
};

export default ClientHome;
