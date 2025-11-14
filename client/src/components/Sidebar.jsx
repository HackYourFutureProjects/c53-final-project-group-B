import styles from "./SideBar.module.css";

const Sidebar = ({ onChangeSection, active }) => {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.logo}>CourierGo</h2>

      <nav className={styles.nav}>
        <button
          className={`${styles.navItem} ${active === "home" ? styles.active : ""}`}
          onClick={() => onChangeSection("home")}
        >
          Home
        </button>

        <button
          className={`${styles.navItem} ${active === "myTasks" ? styles.active : ""}`}
          onClick={() => onChangeSection("myTasks")}
        >
          My Tasks
        </button>

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
