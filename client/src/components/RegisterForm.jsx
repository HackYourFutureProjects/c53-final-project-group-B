import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./RegisterForm.module.css";
import { UserContext } from "../context/UserContext";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [serverSuccess, setServerSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Courier preferences
  const [taskType, setTaskType] = useState([]);
  const [maxDistance, setMaxDistance] = useState("");
  const [minPrice, setMinPrice] = useState("");

  const { register } = useContext(UserContext);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

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

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Role validation
    if (!role) {
      newErrors.role = "Please select a role";
    }

    // Phone validation (optional but validate format if provided)
    if (phone && !/^\+?[\d\s-()]+$/.test(phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTaskTypeChange = (type) => {
    setTaskType((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    setServerSuccess(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // If courier role and no task types selected, pass undefined to use backend default (all types)
      const taskTypeValue =
        role === "courier" && taskType.length === 0 ? undefined : taskType;

      const result = await register(
        name,
        email,
        password,
        role,
        phone || undefined,
        taskTypeValue,
        maxDistance || undefined,
        minPrice || undefined,
      );

      if (result.success) {
        setServerSuccess(result.message);
        // Clear form
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setRole("");
        setPhone("");
        setTaskType([]);
        setMaxDistance("");
        setMinPrice("");
        setErrors({});

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setServerError(result.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setServerError("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Create an Account</h2>
      <p className={styles.subtitle}>Join our delivery community!</p>

      <div className={styles.inputGroup}>
        <label>Name *</label>
        <input
          type="text"
          placeholder="Your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={errors.name ? styles.errorInput : ""}
        />
        {errors.name && <span className={styles.error}>{errors.name}</span>}
      </div>

      <div className={styles.inputGroup}>
        <label>Email *</label>
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
        <label>Phone</label>
        <input
          type="tel"
          placeholder="+3 0612345678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={errors.phone ? styles.errorInput : ""}
        />
        {errors.phone && <span className={styles.error}>{errors.phone}</span>}
      </div>

      <div className={styles.inputGroup}>
        <label>Password *</label>
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

      <div className={styles.inputGroup}>
        <label>Confirm Password *</label>
        <div className={styles.passwordWrapper}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={errors.confirmPassword ? styles.errorInput : ""}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className={styles.showPasswordBtn}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.confirmPassword && (
          <span className={styles.error}>{errors.confirmPassword}</span>
        )}
      </div>

      <div className={styles.inputGroup}>
        <label>I want to register as *</label>
        <div className={styles.roleSelector}>
          <label className={styles.roleOption}>
            <input
              type="radio"
              name="role"
              value="client"
              checked={role === "client"}
              onChange={(e) => setRole(e.target.value)}
            />
            <span className={styles.roleLabel}>Client</span>
            <span className={styles.roleDescription}>
              I need items delivered
            </span>
          </label>
          <label className={styles.roleOption}>
            <input
              type="radio"
              name="role"
              value="courier"
              checked={role === "courier"}
              onChange={(e) => setRole(e.target.value)}
            />
            <span className={styles.roleLabel}>Courier</span>
            <span className={styles.roleDescription}>
              I want to deliver items
            </span>
          </label>
        </div>
        {errors.role && <span className={styles.error}>{errors.role}</span>}
      </div>

      {role === "courier" && (
        <div className={styles.preferencesSection}>
          <h3 className={styles.preferencesTitle}>Courier Preferences</h3>
          <p className={styles.preferencesSubtitle}>
            Help us match you with the right tasks
          </p>

          <div className={styles.inputGroup}>
            <label>Task Types</label>
            <p className={styles.fieldNote}>
              Select task types you prefer (leave empty for all types)
            </p>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxOption}>
                <input
                  type="checkbox"
                  checked={taskType.includes("shopping")}
                  onChange={() => handleTaskTypeChange("shopping")}
                />
                <span>Shopping</span>
              </label>
              <label className={styles.checkboxOption}>
                <input
                  type="checkbox"
                  checked={taskType.includes("delivery")}
                  onChange={() => handleTaskTypeChange("delivery")}
                />
                <span>Delivery</span>
              </label>
              <label className={styles.checkboxOption}>
                <input
                  type="checkbox"
                  checked={taskType.includes("small job")}
                  onChange={() => handleTaskTypeChange("small job")}
                />
                <span>Small Job</span>
              </label>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Maximum Distance (km)</label>
            <input
              type="number"
              placeholder="e.g., 10"
              value={maxDistance}
              onChange={(e) => setMaxDistance(e.target.value)}
              min="0"
              step="0.1"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Minimum Price (€)</label>
            <input
              type="number"
              placeholder="e.g., 5"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
        </div>
      )}

      {serverError && <div className={styles.serverError}>{serverError}</div>}
      {serverSuccess && (
        <div className={styles.serverSuccess}>{serverSuccess}</div>
      )}

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating Account..." : "Register"}
      </button>

      <p className={styles.footerText}>
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </form>
  );
};

export default RegisterForm;
