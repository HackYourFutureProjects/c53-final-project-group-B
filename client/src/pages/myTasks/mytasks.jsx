import { useState, useEffect, useContext } from "react";
import useFetch from "../../hooks/useFetch.js";
import CardMyTask from "../../components/CardMyTask.jsx";
import styles from "./myTasks.module.css";
import { UserContext } from "../../context/UserContext.js";
import { AnimatePresence, motion } from "framer-motion";

const MyTaskList = () => {
  const { user } = useContext(UserContext);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState(
    user?.role === "client" ? "posted" : "accepted",
  ); // default tab
  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    "/tasks/my-tasks",
    (data) => setTasks(data.tasks),
  );

  useEffect(() => {
    performFetch();
    return () => cancelFetch();
  }, []);

  if (isLoading) {
    return <div>Loading available tasks...</div>;
  }
  if (error) {
    return <div>Error loading available tasks: {error}</div>;
  }

  // Filter tasks based on activeTab
  const filteredTasks = tasks.filter((task) => task.status === activeTab);

  return (
    <div className={styles.container}>
      {user?.role === "client" ? <h1>My Deliveries</h1> : <h1>My Tasks</h1>}

      {/* Tabs for status */}
      <div className={styles.tabContainer}>
        {[
          ...(user?.role === "client" ? ["requested"] : []),
          ...(user?.role === "client" ? ["posted"] : []),
          "accepted",
          "in-progress",
          "completed",
          ...(user?.role === "client" ? ["cancelled"] : []),
          ...(user?.role === "client" ? ["expired"] : []),
        ].map((status) => (
          <button
            key={status}
            className={`${styles.tab} ${
              activeTab === status ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={styles.tasksScrollContainer}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={styles.tabContent}
          >
            {filteredTasks.length === 0 ? (
              <p className={styles.empty}>
                No tasks with status `{activeTab}`.
              </p>
            ) : (
              <div className={styles.list}>
                {filteredTasks.map((task) => (
                  <CardMyTask
                    key={task._id}
                    refreshMyTasks={performFetch}
                    task={task}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyTaskList;
