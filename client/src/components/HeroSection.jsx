import { useContext } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import styles from "./HeroSection.module.css";
import { Link } from "react-router-dom";
import dotlottieUrl from "../assets/lottie/John and the haverboard.lottie";
import { UserContext } from "../context/UserContext";

const HeroSection = () => {
  const { user } = useContext(UserContext);

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
            <Link to="/sign-up" className={styles.getStartedBtn}>
              Get Started
            </Link>
          )}
        </div>
      </div>

      <div className={styles.animation}>
        <DotLottieReact src={dotlottieUrl} loop autoplay />
      </div>
    </section>
  );
};

export default HeroSection;
