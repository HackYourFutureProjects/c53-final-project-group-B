import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import styles from "./Nav.module.css";
import { PiPackageFill } from "react-icons/pi";
import TEST_ID from "./Nav.testid";

const Nav = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  const toggleMenu = () => setOpen((prev) => !prev);

  return (
    <nav className={styles.nav}>
      {/* Left: logo + Droppit + main links */}
      <div className={styles.navBrand}>
        <Link to="/" className={styles.logo} data-testid="nav-brand">
          <PiPackageFill className={styles.logoIcon} /> Droppit
        </Link>

        <ul className={`${styles.navLinks} ${open ? styles.open : ""}`}>
          <li>
            <Link
              to="/"
              className={styles.navLinksLink}
              data-testid={TEST_ID.linkToHome}
            >
              Home
            </Link>
          </li>
          <li>
            <Link to="/how-it-works" className={styles.navLinksLink}>
              How it works
            </Link>
          </li>
          <li>
            <Link to="/client" className={styles.navLinksLink}>
              Client
            </Link>
          </li>
          {/* Mobile buttons inside hamburger menu */}
          <li className={styles.mobileButtonsContainer}>
            {!isLoginPage && ( //hide Login if already on /login
              <Link to="/login" className={styles.loginBtn}>
                Login
              </Link>
            )}
            <Link to="/get-started" className={styles.getStartedBtn}>
              Get Started
            </Link>
          </li>
        </ul>
      </div>

      {/* Right: buttons (desktop only) */}
      <div className={styles.navButtons}>
        {!isLoginPage && ( // ✅ hide Login if already on /login
          <Link to="/login" className={styles.loginBtn}>
            Login
          </Link>
        )}
        <Link to="/get-started" className={styles.getStartedBtn}>
          Get Started
        </Link>
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
