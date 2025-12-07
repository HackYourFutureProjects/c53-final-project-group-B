import styles from "./Sidebar.module.css";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { CgMenuLeft } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ onChangeSection, active, isOpen, onToggle }) => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const isClient = user?.role === "client";

  const handleLogout = () => {
    logout();
    navigate("/login");
    onToggle();
  };

  return (
    <>
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
            {isClient ? "Home" : "Home"}
          </button>

          <button
            className={`${styles.navItem} ${active === "myTasks" ? styles.active : ""}`}
            onClick={() => onChangeSection("myTasks")}
          >
            {isClient ? "My Deliveries" : "My Tasks"}
          </button>

          {!isClient && (
            <button
              className={`${styles.navItem} ${active === "Requests" ? styles.active : ""}`}
              onClick={() => onChangeSection("Requests")}
            >
              My Requested Tasks
            </button>
          )}

          <button
            className={`${styles.navItem} ${active === "profile" ? styles.active : ""}`}
            onClick={() => onChangeSection("profile")}
          >
            My Profile
          </button>

          <button className={styles.navItem} onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
