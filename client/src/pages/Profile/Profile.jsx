import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { fetchWithRefresh } from "../../util/fetchWithRefresh";
import styles from "./Profile.module.css";
import { toast } from "react-toastify";
import { BiShow, BiHide } from "react-icons/bi";

const Profile = () => {
  const { token, setToken, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profilePicture: "",
  });
  const [courierSettings, setCourierSettings] = useState({
    taskTypes: [],
    maxDistance: "",
    minPrice: "",
    isAvailable: true,
  });
  const [paymentData, setPaymentData] = useState({
    cardHolderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardType: "",
  });
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetchWithRefresh(
        "/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        token,
        setToken,
      );

      if (response.status === 401) {
        logout();
        navigate("/login");
        return;
      }

      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          address: data.user.address || "",
          profilePicture: data.user.profilePicture || "",
        });
        setPreviewImage(data.user.profilePicture || "");

        if (data.user.role === "courier") {
          setCourierSettings({
            taskTypes: data.user.taskTypes || [],
            maxDistance: data.user.maxDistance || "",
            minPrice: data.user.minPrice || "",
            isAvailable: data.user.isAvailable ?? true,
          });
        }

        if (data.user.paymentMethod) {
          setPaymentData({
            cardHolderName: data.user.paymentMethod.cardHolderName || "",
            cardNumber: data.user.paymentMethod.cardNumber || "",
            expiryDate: data.user.paymentMethod.expiryDate || "",
            cvv: "",
            cardType: data.user.paymentMethod.cardType || "",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCourierSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourierSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTaskTypeChange = (taskType) => {
    setCourierSettings((prev) => {
      const taskTypes = prev.taskTypes.includes(taskType)
        ? prev.taskTypes.filter((t) => t !== taskType)
        : [...prev.taskTypes, taskType];
      return { ...prev, taskTypes };
    });
  };
  const handleChangePassword = async () => {
    setPasswordError("");

    if (!passwordData.oldPassword || !passwordData.newPassword) {
      setPasswordError("Both old and new passwords are required.");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetchWithRefresh(
        "/api/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword,
          }),
        },
        token,
        setToken,
      );

      const data = await res.json();

      if (!data.success) {
        setPasswordError(data.msg || "Failed to change password");
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setIsSaving(false);

        return;
      }

      toast.success("Password updated successfully ✔");

      logout();

      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);

      navigate("/login");
    } catch (err) {
      console.error(err);
      setPasswordError("Error changing password");
    }

    setIsSaving(false);
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      const cleaned = value.replace(/\s/g, "");
      const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
      setPaymentData((prev) => ({ ...prev, [name]: formatted }));

      if (cleaned.startsWith("4")) {
        setPaymentData((prev) => ({ ...prev, cardType: "Visa" }));
      } else if (cleaned.startsWith("5")) {
        setPaymentData((prev) => ({ ...prev, cardType: "Mastercard" }));
      } else if (cleaned.startsWith("3")) {
        setPaymentData((prev) => ({ ...prev, cardType: "American Express" }));
      }
    } else if (name === "expiryDate") {
      const cleaned = value.replace(/\D/g, "");
      const formatted = cleaned.match(/.{1,2}/g)?.join("/") || cleaned;
      setPaymentData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setPaymentData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData((prev) => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePersonalInfo = async () => {
    setIsSaving(true);
    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        profilePicture: formData.profilePicture,
      };

      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(data.msg || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCourierSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskTypes: courierSettings.taskTypes,
          maxDistance: courierSettings.maxDistance
            ? parseFloat(courierSettings.maxDistance)
            : null,
          minPrice: courierSettings.minPrice
            ? parseFloat(courierSettings.minPrice)
            : null,
          isAvailable: courierSettings.isAvailable,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        toast.success("Courier settings updated successfully!");
      } else {
        toast.error(data.msg || "Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Error updating settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePayment = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentMethod: {
            cardHolderName: paymentData.cardHolderName,
            cardNumber: paymentData.cardNumber,
            expiryDate: paymentData.expiryDate,
            cardType: paymentData.cardType,
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        toast.success("Payment method updated successfully!");
        setPaymentData((prev) => ({ ...prev, cvv: "" }));
      } else {
        toast.error(data.msg || "Failed to update payment method");
      }
    } catch (error) {
      console.error("Error updating payment method:", error);
      toast.error("Error updating payment method");
    } finally {
      setIsSaving(false);
    }
  };
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  if (!user) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.profileImageSection}>
          <div className={styles.profileImageWrapper}>
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile"
                className={styles.profileImage}
              />
            ) : (
              <div className={styles.profileImagePlaceholder}>
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <label className={styles.uploadButton}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className={styles.fileInput}
              />
              📷
            </label>
          </div>
        </div>
        <div className={styles.profileInfo}>
          <h1 className={styles.profileName}>{user.name}</h1>
          <p className={styles.profileRole}>
            {user.role === "courier" ? "🚚 Courier" : "📦 Client"}
          </p>
          {user.role === "courier" && (
            <div className={styles.trustScore}>
              <span className={styles.star}>⭐</span>
              <span>
                Trust Score:{" "}
                {user.trustScore > 0 ? user.trustScore.toFixed(1) : "New"}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.tabContainer}>
        <button
          className={`${styles.tab} ${activeTab === "personal" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("personal")}
        >
          Personal Information
        </button>
        <button
          className={`${styles.tab} ${activeTab === "payment" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("payment")}
        >
          Payment Methods
        </button>
        {user.role === "courier" && (
          <button
            className={`${styles.tab} ${activeTab === "courier" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("courier")}
          >
            Courier Settings
          </button>
        )}
        <button
          className={`${styles.tab} ${activeTab === "security" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("security")}
        >
          Security
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === "personal" && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Personal Information</h2>
              {!isEditing ? (
                <button
                  className={styles.editButton}
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              ) : (
                <div className={styles.buttonGroup}>
                  <button
                    className={styles.cancelButton}
                    onClick={() => {
                      setIsEditing(false);
                      fetchUserProfile();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.saveButton}
                    onClick={handleSavePersonalInfo}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className={styles.input}
                />
                <small className={styles.helpText}>
                  Email cannot be changed
                </small>
              </div>

              <div className={styles.formGroup}>
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={styles.input}
                  placeholder="+31 6 12345678"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={styles.input}
                  placeholder="Amsterdam, Netherlands"
                />
              </div>
            </div>

            <div className={styles.accountStats}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Member Since</span>
                <span className={styles.statValue}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Account Status</span>
                <span className={styles.statValue}>
                  {user.isVerified ? "✅ Verified" : "⏳ Pending"}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "payment" && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Payment Methods</h2>
            </div>

            <div className={styles.paymentForm}>
              <div className={styles.formGroup}>
                <label>Card Holder Name</label>
                <input
                  type="text"
                  name="cardHolderName"
                  value={paymentData.cardHolderName}
                  onChange={handlePaymentChange}
                  className={styles.input}
                  placeholder="John Doe"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Card Number</label>
                <div className={styles.cardInputWrapper}>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={handlePaymentChange}
                    className={styles.input}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                  {paymentData.cardType && (
                    <span className={styles.cardType}>
                      {paymentData.cardType}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={paymentData.expiryDate}
                    onChange={handlePaymentChange}
                    className={styles.input}
                    placeholder="MM/YY"
                    maxLength="5"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>CVV</label>
                  <input
                    type="password"
                    name="cvv"
                    value={paymentData.cvv}
                    onChange={handlePaymentChange}
                    className={styles.input}
                    placeholder="123"
                    maxLength="4"
                  />
                </div>
              </div>

              <div className={styles.securityNote}>
                <span className={styles.lockIcon}>🔒</span>
                <span>
                  Your payment information is encrypted and secure. We only
                  store the last 4 digits of your card.
                </span>
              </div>

              <button
                className={styles.saveButton}
                onClick={handleSavePayment}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Payment Method"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "courier" && user.role === "courier" && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Courier Settings</h2>
            </div>

            <div className={styles.courierSettings}>
              <div className={styles.formGroup}>
                <label className={styles.switchLabel}>
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={courierSettings.isAvailable}
                    onChange={handleCourierSettingsChange}
                    className={styles.switch}
                  />
                  <span>Available for tasks</span>
                </label>
              </div>

              <div className={styles.formGroup}>
                <label>Task Types I Accept</label>
                <div className={styles.checkboxGroup}>
                  {["delivery", "shopping", "small job"].map((type) => (
                    <label key={type} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={courierSettings.taskTypes.includes(type)}
                        onChange={() => handleTaskTypeChange(type)}
                      />
                      <span>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Maximum Distance (km)</label>
                  <input
                    type="number"
                    name="maxDistance"
                    value={courierSettings.maxDistance}
                    onChange={handleCourierSettingsChange}
                    className={styles.input}
                    placeholder="e.g., 50"
                    min="0"
                  />
                  <small className={styles.helpText}>
                    Leave empty for no limit
                  </small>
                </div>

                <div className={styles.formGroup}>
                  <label>Minimum Price (€)</label>
                  <input
                    type="number"
                    name="minPrice"
                    value={courierSettings.minPrice}
                    onChange={handleCourierSettingsChange}
                    className={styles.input}
                    placeholder="e.g., 10"
                    min="0"
                    step="0.01"
                  />
                  <small className={styles.helpText}>
                    Leave empty for no minimum
                  </small>
                </div>
              </div>

              <button
                className={styles.saveButton}
                onClick={handleSaveCourierSettings}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Security Settings</h2>
            </div>

            {!showPasswordForm ? (
              <div className={styles.securitySection}>
                <div className={styles.securityItem}>
                  <div>
                    <h3 className={styles.securityTitle}>Change Password</h3>
                    <p className={styles.securityDescription}>
                      Update your password to keep your account secure.
                    </p>
                  </div>

                  <button
                    className={styles.secondaryButton}
                    onClick={() => setShowPasswordForm(true)}
                  >
                    Change Password
                  </button>
                </div>

                <div className={styles.securityItem}>
                  <div>
                    <h3 className={styles.securityTitle}>
                      Two-Factor Authentication
                    </h3>
                    <p className={styles.securityDescription}>
                      Add an extra layer of security to your account.
                    </p>
                  </div>
                  <button className={styles.secondaryButton}>Enable 2FA</button>
                </div>

                <div className={styles.securityItem}>
                  <div>
                    <h3 className={styles.securityTitle}>Email Verification</h3>
                    <p className={styles.securityDescription}>
                      Status:{" "}
                      {user.isVerified ? "✅ Verified" : "⏳ Not Verified"}
                    </p>
                  </div>

                  {!user.isVerified && (
                    <button className={styles.secondaryButton}>
                      Resend Verification Email
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.section}>
                <h2>Change Password</h2>

                <div className={styles.formGroup}>
                  <label htmlFor="oldPassword">Old Password</label>
                  <div className={styles.passwordWrapper}>
                    <input
                      type={showOldPassword ? "text" : "password"}
                      name="oldPassword"
                      value={passwordData.oldPassword}
                      onChange={handlePasswordChange}
                      className={styles.input}
                    />
                    {passwordData.oldPassword && (
                      <button
                        type="button"
                        aria-label="Toggle password visibility"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className={styles.showPasswordBtn}
                      >
                        {showOldPassword ? <BiShow /> : <BiHide />}
                      </button>
                    )}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="newPassword">New Password</label>
                  <div className={styles.passwordWrapper}>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={styles.input}
                    />
                    {passwordData.newPassword && (
                      <button
                        type="button"
                        aria-label="Toggle password visibility"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className={styles.showPasswordBtn}
                      >
                        {showNewPassword ? <BiShow /> : <BiHide />}
                      </button>
                    )}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <div className={styles.passwordWrapper}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={styles.input}
                    />
                    {passwordData.confirmPassword && (
                      <button
                        type="button"
                        aria-label="Toggle password visibility"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className={styles.showPasswordBtn}
                      >
                        {showConfirmPassword ? <BiShow /> : <BiHide />}
                      </button>
                    )}
                  </div>
                </div>

                {passwordError && (
                  <p className={styles.errorMessage}>{passwordError}</p>
                )}

                <div className={styles.buttonGroup}>
                  <button
                    className={styles.cancelButton}
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordError("");
                    }}
                  >
                    Back
                  </button>

                  <button
                    className={styles.saveButton}
                    disabled={isSaving}
                    onClick={handleChangePassword}
                  >
                    {isSaving ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
