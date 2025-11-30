import HeroSection from "../../components/HeroSection";
import HowItWorksSection from "../../components/HowItWorksSection";
import { useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const { token } = useContext(UserContext);
  useEffect(() => {
    if (token) {
      navigate("/user-dashboard");
    }
  }, [token, navigate]);
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
    </>
  );
};

export default HomePage;
