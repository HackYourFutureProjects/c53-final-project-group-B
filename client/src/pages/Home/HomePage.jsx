import HeroSection from "../../components/HeroSection";
import HowItWorksSection from "../../components/HowItWorksSection";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const { token } = useContext(UserContext);
  if (token) {
    navigate("/user-dashboard");
  }
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
    </>
  );
};

export default HomePage;
