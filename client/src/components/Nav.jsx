import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import styles from "./Nav.module.css";
import { PiPackageFill } from "react-icons/pi";
import TEST_ID from "./Nav.testid";
import { UserContext } from "../context/UserContext";

const Nav = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);

  const toggleMenu = () => setOpen((prev) => !prev);

  const handleHomeClick = (e) => {
    // If already on home page, smooth scroll to top
    if (location.pathname === "/") {
      e.preventDefault();
      window.history.pushState(null, "", "/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    // If on another page, let the Link navigate normally

    // Close mobile menu if open
    setOpen(false);
  };

  const handleHowItWorksClick = (e) => {
    e.preventDefault();

    // If not on home page, navigate to home first with hash
    if (location.pathname !== "/") {
      navigate("/#how-it-works");
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById("how-it-works");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      // Already on home page, update hash and scroll
      window.history.pushState(null, "", "#how-it-works");
      const element = document.getElementById("how-it-works");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    // Close mobile menu if open
    setOpen(false);
  };

  return (
    <nav className={styles.nav}>
      {/* Left: logo + Droppit + main links */}
      <div className={styles.navBrand}>
        <Link
          to="/"
          className={styles.logo}
          data-testid="nav-brand"
          onClick={handleHomeClick}
        >
          <PiPackageFill className={styles.logoIcon} /> Droppit
        </Link>

        <ul className={`${styles.navLinks} ${open ? styles.open : ""}`}>
          <li>
            <Link
              to="/"
              className={styles.navLinksLink}
              data-testid={TEST_ID.linkToHome}
              onClick={handleHomeClick}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/how-it-works"
              className={styles.navLinksLink}
              onClick={handleHowItWorksClick}
            >
              How it works
            </Link>
          </li>
          {/* Mobile buttons inside hamburger menu */}
          <li className={styles.mobileButtonsContainer}>
            {!isLoginPage &&
              (user ? (
                <button
                  className={styles.loginBtn}
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" className={styles.loginBtn}>
                  Login
                </Link>
              ))}
          </li>
        </ul>
      </div>

      {/* Right: buttons (desktop only) */}
      <div className={styles.navButtons}>
        {!isLoginPage &&
          (user ? (
            <button
              className={styles.loginBtn}
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className={styles.loginBtn}>
              Login
            </Link>
          ))}
      </div>

      {/* Hamburger toggle */}
      <button
        className={styles.navToggle}
        onClick={toggleMenu}
        data-testid={TEST_ID.menuToggle}
        aria-label="Toggle navigation"
      >
        ☰
      </button>
    </nav>
  );
};

export default Nav;
