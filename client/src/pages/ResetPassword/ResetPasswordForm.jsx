import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ResetPasswordForm.module.css";

const ResetPasswordForm = () => {
  const { userId, token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    if (!newPassword) return "Please enter a new password";
    if (newPassword.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(newPassword) || !/\d/.test(newPassword))
      return "Password must include an uppercase letter and a number";
    if (newPassword !== confirmPassword) return "Passwords do not match";
    return null;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const validationError = validate();
    if (validationError) return setError(validationError);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/auth/reset-password/${userId}/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Password reset successfully");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h2 className={styles.title}>Create a new password</h2>
        <p className={styles.subtitle}>
          Choose a strong password and confirm it.
        </p>
        <form onSubmit={handleSubmit}>
          <label className={styles.label}>New password</label>
          <div className={styles.passwordWrapper}>
            <input
              className={styles.input}
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              className={styles.showPasswordBtn}
              onClick={() => setShowNew((s) => !s)}
              aria-label="Toggle new password visibility"
              aria-pressed={showNew}
            >
              {showNew ? "Hide" : "Show"}
            </button>
          </div>

          <label className={styles.label}>Confirm password</label>
          <div className={styles.passwordWrapper}>
            <input
              className={styles.input}
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className={styles.showPasswordBtn}
              onClick={() => setShowConfirm((s) => !s)}
              aria-label="Toggle confirm password visibility"
              aria-pressed={showConfirm}
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {message && <div className={styles.message}>{message}</div>}

          <button
            className={styles.submitBtn}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Set new password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
