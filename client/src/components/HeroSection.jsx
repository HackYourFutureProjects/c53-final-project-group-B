import { useContext, useState, useEffect, useMemo } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import styles from "./HeroSection.module.css";
import { Link } from "react-router-dom";
import hoverboardUrl from "../assets/lottie/John and the haverboard.lottie";
import bicycleUrl from "../assets/lottie/Delivery Guy on Bicycle, Cycle, and Bike.lottie";
import deliveredUrl from "../assets/lottie/Order delivered.lottie";
import { UserContext } from "../context/UserContext";

const HeroSection = () => {
  const { user } = useContext(UserContext);
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);

  const animations = useMemo(
    () => [hoverboardUrl, bicycleUrl, deliveredUrl],
    [],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimationIndex(
        (prevIndex) => (prevIndex + 1) % animations.length,
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [animations]);

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>Your Delivery, Done by Anyone.</h1>
        <p className={styles.description}>
          We connect anyone who needs something delivered with couriers ready to
          help. Fast, flexible, and fair — powered by your community.
        </p>
        <div className={styles.buttons}>
          {!user && (
            <Link to="/register" className={styles.getStartedBtn}>
              Get Started
            </Link>
          )}
        </div>
      </div>

      <div className={styles.animation}>
        <div className={styles.lottieWrapper}>
          <DotLottieReact
            src={animations[currentAnimationIndex]}
            loop
            autoplay
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
