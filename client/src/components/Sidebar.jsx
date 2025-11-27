import styles from "./Sidebar.module.css";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Sidebar = ({ onChangeSection, active }) => {
  const { user } = useContext(UserContext);
  const isClient = user?.role === "client";

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.logo}>CourierGo</h2>

      <nav className={styles.nav}>
        <button
          className={`${styles.navItem} ${active === "home" ? styles.active : ""}`}
          onClick={() => onChangeSection("home")}
        >
          {isClient ? "Request a Delivery" : "Home"}
        </button>

        <button
          className={`${styles.navItem} ${active === "tasks" ? styles.active : ""}`}
          onClick={() => onChangeSection("tasks")}
        >
          {isClient ? "My Orders" : "Tasks"}
        </button>

        {!isClient && (
          <button
            className={`${styles.navItem} ${active === "myTasks" ? styles.active : ""}`}
            onClick={() => onChangeSection("myTasks")}
          >
            My Tasks
          </button>
        )}

        <button
          className={`${styles.navItem} ${active === "profile" ? styles.active : ""}`}
          onClick={() => onChangeSection("profile")}
        >
          Profile
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
