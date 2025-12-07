import { useState, useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import { UserContext } from "../context/UserContext";
import Select from "react-select";
import styles from "./DeliveryRequestModal.module.css";
import { toast } from "react-toastify";

const GeneralDeliveryModal = ({ onClose, onSuccess }) => {
  const { token } = useContext(UserContext);
  const STORAGE_KEY = "generalDeliveryDraft";
  const STORAGE_EXPIRY = 10 * 60 * 1000;

  const getInitialFormData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { data, timestamp } = JSON.parse(saved);
        if (Date.now() - timestamp < STORAGE_EXPIRY) {
          return data;
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error("Error loading draft:", error);
    }
    return {
      title: "",
      description: "",
      taskType: { value: "delivery", label: "Delivery" },
      pickupLocation: "",
      dropoffLocation: "",
      price: "",
      acceptDeadLineMinutes: { value: 5, label: "5 minutes" },
    };
  };

  const [formData, setFormData] = useState(getInitialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const saveToLocalStorage = () => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            data: formData,
            timestamp: Date.now(),
          }),
        );
      } catch (error) {
        console.error("Error saving draft:", error);
      }
    };

    const timeoutId = setTimeout(saveToLocalStorage, 500);
    return () => clearTimeout(timeoutId);
  }, [formData, STORAGE_KEY]);

  const hasFormData = () => {
    return (
      formData.title.trim() !== "" ||
      formData.description.trim() !== "" ||
      formData.pickupLocation.trim() !== "" ||
      formData.dropoffLocation.trim() !== "" ||
      formData.price.trim() !== ""
    );
  };

  const handleClose = () => {
    if (hasFormData()) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Your progress will be saved for 10 minutes. Do you want to close?",
      );
      if (confirmClose) {
        onClose();
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
      onClose();
    }
  };

  const handleOverlayClick = () => {
    handleClose();
  };

  const taskTypeOptions = [
    { value: "delivery", label: "Delivery" },
    { value: "shopping", label: "Shopping" },
    { value: "smalljob", label: "Small Job" },
  ];

  const acceptanceTimeOptions = [
    { value: 5, label: "5 minutes" },
    { value: 10, label: "10 minutes" },
    { value: 15, label: "15 minutes" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.pickupLocation.trim()) {
      newErrors.pickupLocation = "Pickup location is required";
    }

    if (!formData.dropoffLocation.trim()) {
      newErrors.dropoffLocation = "Dropoff location is required";
    }

    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price <= 0) {
      newErrors.price = "Please enter a valid price";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          taskType: formData.taskType.value,
          pickupLocation: formData.pickupLocation,
          dropoffLocation: formData.dropoffLocation,
          price: parseFloat(formData.price),
          acceptDeadLineMinutes: formData.acceptDeadLineMinutes.value,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Failed to create delivery request");
      }

      localStorage.removeItem(STORAGE_KEY);
      toast.success("Delivery request posted successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to post delivery request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Post General Delivery Request</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Deliver package to office"
              className={errors.title ? styles.errorInput : ""}
            />
            {errors.title && (
              <span className={styles.errorText}>{errors.title}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide details about the delivery..."
              rows="3"
              className={errors.description ? styles.errorInput : ""}
            />
            {errors.description && (
              <span className={styles.errorText}>{errors.description}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="taskType">Delivery Type *</label>
            <Select
              id="taskType"
              name="taskType"
              value={formData.taskType}
              onChange={(selectedOption) =>
                setFormData((prev) => ({ ...prev, taskType: selectedOption }))
              }
              options={taskTypeOptions}
              className={styles.select}
              classNamePrefix="react-select"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="pickupLocation">Pickup Location *</label>
            <input
              id="pickupLocation"
              name="pickupLocation"
              type="text"
              value={formData.pickupLocation}
              onChange={handleChange}
              placeholder="e.g., Amsterdam Central Station"
              className={errors.pickupLocation ? styles.errorInput : ""}
            />
            {errors.pickupLocation && (
              <span className={styles.errorText}>{errors.pickupLocation}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dropoffLocation">Dropoff Location *</label>
            <input
              id="dropoffLocation"
              name="dropoffLocation"
              type="text"
              value={formData.dropoffLocation}
              onChange={handleChange}
              placeholder="e.g., Rotterdam Port"
              className={errors.dropoffLocation ? styles.errorInput : ""}
            />
            {errors.dropoffLocation && (
              <span className={styles.errorText}>{errors.dropoffLocation}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="taskAcceptanceTime">Task Acceptance Time</label>
            <Select
              id="acceptDeadLineMinutes"
              name="acceptDeadLineMinutes"
              value={formData.acceptDeadLineMinutes}
              onChange={(selectedOption) =>
                setFormData((prev) => ({
                  ...prev,
                  acceptDeadLineMinutes: selectedOption,
                }))
              }
              options={acceptanceTimeOptions}
              className={styles.select}
              classNamePrefix="react-select"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="price">Price Offer (€) *</label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g., 25.00"
              className={errors.price ? styles.errorInput : ""}
            />
            {errors.price && (
              <span className={styles.errorText}>{errors.price}</span>
            )}
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Posting Request..." : "Post Request"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};

export default GeneralDeliveryModal;
