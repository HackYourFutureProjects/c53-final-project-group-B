import styles from "./HowItWorksSection.module.css";
import { FiPackage, FiUsers, FiCheckCircle } from "react-icons/fi";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <FiPackage />,
      title: "Post Your Delivery",
      description:
        "Create a delivery request with pickup and drop-off details. Set your price and timeline.",
    },
    {
      icon: <FiUsers />,
      title: "Get Matched",
      description:
        "Local couriers in your community see your request and can accept the delivery job.",
    },
    {
      icon: <FiCheckCircle />,
      title: "Confirm & Rate",
      description:
        "Receive your delivery, confirm completion, and rate your courier to build trust.",
    },
  ];

  return (
    <section id="how-it-works" className={styles.howItWorks}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <p className={styles.sectionSubtitle}>
          Simple, fast, and community-driven delivery in three easy steps
        </p>

        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <div key={index} className={styles.stepCard}>
              <div className={styles.stepNumber}>{index + 1}</div>
              <div className={styles.stepIcon}>{step.icon}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
