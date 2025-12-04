import styles from "./userDashboard.module.css";
import Sidebar from "../../components/Sidebar.jsx";
import { useState } from "react";
import MyTaskList from "../myTasks/mytasks.jsx";
import MyRequestedTasks from "../myTasks/myRequestedTasks.jsx";
import CouriersList from "../../components/Couriers.jsx";
import HomeSection from "../../components/homeSection.jsx";
import Profile from "../Profile/Profile.jsx";
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
          setSidebarOpen(false); // Close sidebar on mobile after selection
        }}
        active={section}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className={styles.content}>
        <AnimatePresence mode="wait">
          <motion.div
            key={section}
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
            style={{ height: "100%" }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default UserDashboardLayout;
