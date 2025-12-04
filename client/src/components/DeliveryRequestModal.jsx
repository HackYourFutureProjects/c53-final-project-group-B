import { useState, useContext } from "react";
import { createPortal } from "react-dom";
import { UserContext } from "../context/UserContext";
import Select from "react-select";
import styles from "./DeliveryRequestModal.module.css";
import { toast } from "react-toastify";

const DeliveryRequestModal = ({ courier, onClose, onSuccess }) => {
  const { token } = useContext(UserContext);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    taskType: courier.taskTypes?.[0]
      ? {
          value: courier.taskTypes[0],
          label:
            courier.taskTypes[0].charAt(0).toUpperCase() +
            courier.taskTypes[0].slice(1),
        }
      : { value: "delivery", label: "Delivery" },
    pickupLocation: "",
    dropoffLocation: "",
    price: "",
    acceptDeadLineMinutes: 5,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const taskTypeOptions = courier.taskTypes?.map((type) => ({
    value: type,
    label: type.charAt(0).toUpperCase() + type.slice(1),
  })) || [{ value: "delivery", label: "Delivery" }];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue =
      name === "acceptDeadLineMinutes" ? parseInt(value, 10) : value;
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
    // Clear error for this field
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
      const response = await fetch("/api/tasks/make-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          taskType: formData.taskType.value,
          price: parseFloat(formData.price),
          requestedTo: courier._id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Failed to request delivery");
      }

      toast.success("Delivery request sent successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to send delivery request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Request Delivery from {courier.name}</h2>
          <button className={styles.closeButton} onClick={onClose}>
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
            <label htmlFor="taskAcceptanceTime">Task acceptance time</label>
            <select
              id="acceptDeadLineMinutes"
              name="acceptDeadLineMinutes"
              value={formData.acceptDeadLineMinutes}
              onChange={handleChange}
            >
              {[5, 10, 15].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
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
              onClick={onClose}
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
              {isSubmitting ? "Sending Request..." : "Send Request"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};

export default DeliveryRequestModal;
