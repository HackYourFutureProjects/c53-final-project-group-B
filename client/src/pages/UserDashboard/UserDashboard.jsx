import { useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import MyTaskList from "../myTasks/MyTasks.jsx";
import MyRequestedTasks from "../myTasks/myRequestedTasks.jsx";
import CouriersList from "../../components/Couriers.jsx";
import HomeSection from "../../components/HomeSection.jsx";
import Profile from "../Profile/Profile.jsx";
import styles from "./UserDashboard.module.css";
import { AnimatePresence, motion } from "framer-motion";

const UserDashboardLayout = () => {
  const [section, setSection] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const renderSection = () => {
    if (section === "home") {
      return <HomeSection />;
    }
    if (section === "myTasks") {
      return <MyTaskList />;
    }
    if (section === "Requests") {
      return <MyRequestedTasks />;
    }
    if (section === "couriers") {
      return <CouriersList />;
    }
    if (section === "profile") {
      return <Profile />;
    }
    return null;
  };
  return (
    <div className={styles.dashboard}>
      <Sidebar
        onChangeSection={(sec) => {
          setSection(sec);
          setSidebarOpen(false);
        }}
        active={section}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className={styles.content}>
        <AnimatePresence mode="wait">
          <motion.div
            key={section}
            className={styles.motionContainer}
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 180,
                damping: 20,
                mass: 0.9,
                opacity: { duration: 0.25 },
              },
            }}
            exit={{
              opacity: 0,
              y: -15,
              scale: 0.97,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default UserDashboardLayout;
