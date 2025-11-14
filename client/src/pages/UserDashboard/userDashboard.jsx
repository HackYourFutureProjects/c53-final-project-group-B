import styles from "./userDashboard.module.css";
import Sidebar from "../../components/SideBar.jsx";
import { UserContext } from "../../context/UserContext.js";
import { useContext, useState } from "react";
import MyTaskList from "../myTasks/mytasks.jsx";
import CouriersList from "../../components/Couriers.jsx";
import TaskList from "../../components/taskList.jsx";

const UserDashboardLayout = () => {
  const { user } = useContext(UserContext);
  const [section, setSection] = useState("home");
  const renderSection = () => {
    if (section === "home") {
      return user.role === "client" ? <CouriersList /> : <TaskList />;
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
