import styles from "./userDashboard.module.css";
import Sidebar from "../../components/Sidebar.jsx";
import { useState } from "react";
import MyTaskList from "../myTasks/mytasks.jsx";
import MyRequestedTasks from "../myTasks/myRequestedTasks.jsx";
import CouriersList from "../../components/Couriers.jsx";
import HomeSection from "../../components/homeSection.jsx";
import Profile from "../Profile/Profile.jsx";

const UserDashboardLayout = () => {
  const [section, setSection] = useState("home");
  const renderSection = () => {
    if (section === "home") {
      return <HomeSection />;
    }
    if (section === "tasks") {
      return <MyTaskList />;
    }
    if (section === "myTasks") {
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
      <Sidebar onChangeSection={setSection} active={section} />
      <main className={styles.content}>{renderSection()}</main>
    </div>
  );
};

export default UserDashboardLayout;
