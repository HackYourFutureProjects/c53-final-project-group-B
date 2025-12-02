import styles from "./Sidebar.module.css";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { CgMenuLeft } from "react-icons/cg";

const Sidebar = ({ onChangeSection, active, isOpen, onToggle }) => {
  const { user } = useContext(UserContext);
  const isClient = user?.role === "client";

  return (
    <>
      {/* Mobile toggle button */}
      <button className={styles.mobileToggle} onClick={onToggle}>
        <CgMenuLeft size={30} />
      </button>

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <h2 className={styles.logo}>CourierGo</h2>

        <nav className={styles.nav}>
          <button
            className={`${styles.navItem} ${active === "home" ? styles.active : ""}`}
            onClick={() => onChangeSection("home")}
          >
            {isClient ? "Request a Delivery" : "Home"}
          </button>

          <button
            className={`${styles.navItem} ${active === "myTasks" ? styles.active : ""}`}
            onClick={() => onChangeSection("myTasks")}
          >
            {isClient ? "My Orders" : "My Tasks"}
          </button>

          {!isClient && (
            <button
              className={`${styles.navItem} ${active === "Requests" ? styles.active : ""}`}
              onClick={() => onChangeSection("Requests")}
            >
              Requests
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
    </>
  );
};

export default Sidebar;
