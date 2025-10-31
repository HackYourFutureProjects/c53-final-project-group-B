import styles from "./ClientTasks.module.css";

const mockTasks = [
  { id: "T-201", title: "Deliver docs to Zaandam", status: "posted" },
  { id: "T-202", title: "Pick up parcel", status: "accepted" },
  { id: "T-203", title: "Bring groceries", status: "completed" },
];

const ClientTasks = () => {
  const handleCancel = (taskId) => {
    // TODO: call backend: PATCH /tasks/:id/cancel
    console.log("Cancel task", taskId);
  };

  return (
    <main className={styles.wrapper}>
      <h1 className={styles.title}>My tasks</h1>
      <p className={styles.subtitle}>
        All delivery requests you created. You can cancel only if it&apos;s
        still posted.
      </p>

      <div className={styles.table}>
        <div className={styles.headerRow}>
          <span>Title</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {mockTasks.map((task) => (
          <div key={task.id} className={styles.row}>
            <span className={styles.cellMain}>{task.title}</span>
            <span className={`${styles.status} ${styles[task.status]}`}>
              {task.status}
            </span>
            <span>
              {task.status === "posted" ? (
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => handleCancel(task.id)}
                >
                  Cancel
                </button>
              ) : (
                <button type="button" className={styles.viewBtn}>
                  View
                </button>
              )}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ClientTasks;
