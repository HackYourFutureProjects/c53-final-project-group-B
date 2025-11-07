import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RequestResetPassword.module.css";

const RequestResetPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!email) return setError("Please enter your email");
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/request-reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "If the account exists, an email was sent.");
        setTimeout(() => navigate("/login"), 2500);
      } else {
        setError(data.message || "Failed to request password reset");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to request password reset");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h2 className={styles.title}>Reset your password</h2>
        <p className={styles.subtitle}>
          Enter the email address for your account and we will send a link to
          reset your password.
        </p>
        <form onSubmit={handleSubmit}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          {error && <div className={styles.error}>{error}</div>}
          {message && <div className={styles.message}>{message}</div>}

          <button
            className={styles.submitBtn}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send reset email"}
          </button>

          <div className={styles.note}>
            If you do not receive an email, check your spam or junk folder.
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestResetPassword;
