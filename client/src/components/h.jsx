import styles from "./HowItWorksSection.module.css";
// We don't need react-icons for this new design, so we remove this line:
// import { FiPackage, FiUsers, FiCheckCircle } from "react-icons/fi";

// Import your images here (replace these placeholders with actual paths)
// The images should correspond to: 1. Planning/Writing, 2. Exercise/Moving, 3. Meditation/Calm
import imagePlanAhead from "../assets/anirudh-KmQbT4FQvGQ-unsplash.jpg"; // Replace with your image path
import imageGetMoving from "../assets/anirudh-KmQbT4FQvGQ-unsplash.jpg"; // Replace with your image path
import imageFindCalm from "../assets/anirudh-KmQbT4FQvGQ-unsplash.jpg"; // Replace with your image path

const HowItWorksSection = () => {
  const steps = [
    {
      // icon: <FiPackage />, // Removed icon
      image: imagePlanAhead, // Added image path
      title: "Plan Ahead", // Changed title to match image
      description:
        "Write down 3 key tasks you want to accomplish today before checking your phone.", // Changed description to match image
    },
    {
      // icon: <FiUsers />, // Removed icon
      image: imageGetMoving, // Added image path
      title: "Get Moving", // Changed title to match image
      description:
        "Do a short workout, stretch, or walk to activate your energy and improve your focus.", // Changed description to match image
    },
    {
      // icon: <FiCheckCircle />, // Removed icon
      image: imageFindCalm, // Added image path
      title: "Find Calm", // Changed title to match image
      description:
        "Spend a few quiet minutes meditating, journaling, or just breathing mindfully before diving into work.", // Changed description to match image
    },
  ];

  return (
    <section id="how-it-works" className={styles.howItWorks}>
      <div className={styles.container}>
        {/* Changed heading text to match the image */}
        <h2 className={styles.sectionTitle}>
          3 Simple Steps to Start Your Day Productively
        </h2>
        {/* Changed subtitle text to match the image */}
        <p className={styles.sectionSubtitle}>
          Boost your focus and energy from the moment you wake up with these
          easy daily habits.
        </p>

        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <div key={index} className={styles.stepCard}>
              {/* Card content structure changed */}
              <div className={styles.textContainer}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <div className={styles.stepNumber}>{index + 1}</div>
              </div>

              <p className={styles.stepDescription}>{step.description}</p>

              {/* Added image element */}
              <div className={styles.stepImageWrapper}>
                <img
                  src={step.image}
                  alt={step.title}
                  className={styles.stepImage}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
