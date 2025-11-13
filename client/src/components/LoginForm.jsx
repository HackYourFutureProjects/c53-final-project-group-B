import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import styles from "./LoginForm.module.css";
import { UserContext } from "../context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(password) || !/\d/.test(password)) {
      newErrors.password =
        "Password must include a number and an uppercase letter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        // If the user was redirected to login from a protected route, go back there
        const from = location.state?.from;
        if (from && from.pathname) {
          navigate(from.pathname, { replace: true });
          return;
        }

        // Otherwise, default to role-based dashboard
        const role = result.user?.role;
        if (role === "client") {
          navigate("/client-dashboard");
        } else if (role === "courier") {
          navigate("/courier-dashboard");
        } else {
          navigate("/");
        }
      } else {
        // Show server provided message (e.g. invalid credentials or not verified)
        setServerError(result.message || "Login failed");
        if (result.needVerification) {
          // Optionally guide the user to verification page — keep them on login and show message
          // You could navigate to a verification flow if available: navigate('/verify')
        }
      }
    } catch (err) {
      console.error(err);
      setServerError("Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Welcome Back</h2>
      <p className={styles.subtitle}>Let&apos;s log you in!</p>

      <div className={styles.inputGroup}>
        <label>Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={errors.email ? styles.errorInput : ""}
        />
        {errors.email && <span className={styles.error}>{errors.email}</span>}
      </div>

      <div className={styles.inputGroup}>
        <label>Password</label>
        <div className={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? styles.errorInput : ""}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.showPasswordBtn}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.password && (
          <span className={styles.error}>{errors.password}</span>
        )}
      </div>

      {serverError && <div className={styles.serverError}>{serverError}</div>}

      <div className={styles.actions}>
        <label className={styles.rememberMe}>
          <input type="checkbox" /> Save password
        </label>
        <Link to="/reset-password" className={styles.forgotLink}>
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Logging in..." : "Log In"}
      </button>

      <p className={styles.footerText}>
        No account yet? <a href="/register">Register</a>
      </p>
    </form>
  );
};

export default LoginForm;
