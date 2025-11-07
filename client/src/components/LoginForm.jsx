import { useState, useContext } from "react";
import styles from "./LoginForm.module.css";
import { UserContext } from "../context/UserContext.js";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useContext(UserContext);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("✅ Login success", { email, password });
      login(email, password);
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

      <div className={styles.actions}>
        <label className={styles.rememberMe}>
          <input type="checkbox" /> Save password
        </label>
        <a href="/reset-password" className={styles.forgotLink}>
          Forgot password?
        </a>
      </div>

      <button type="submit" className={styles.submitBtn}>
        Log In
      </button>

      <p className={styles.footerText}>
        No account yet? <a href="/signup">Sign up</a>
      </p>
    </form>
  );
};

export default LoginForm;
