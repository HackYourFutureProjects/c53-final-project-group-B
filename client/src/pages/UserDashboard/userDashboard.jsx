import styles from "./userDashboard.module.css";
import Sidebar from "../../components/Sidebar.jsx";
import { useState } from "react";
import MyTaskList from "../myTasks/mytasks.jsx";
import CouriersList from "../../components/Couriers.jsx";
import HomeSection from "../../components/homeSection.jsx";

const UserDashboardLayout = () => {
  const [section, setSection] = useState("home");
  const renderSection = () => {
    if (section === "home") {
      return <HomeSection />;
    }
    if (section === "myTasks") {
      return <MyTaskList />;
    }
    if (section === "couriers") {
      return <CouriersList />;
    }
    return null;
  };
  return (
    <div className={styles.dashboard}>
      <Sidebar onChangeSection={setSection} active={section} />
      <main className={styles.content}>{renderSection()}</main>
    </div>
  );
};

export default UserDashboardLayout;
