import cron from "node-cron";
import Task from "../models/tasks.js";
import transporter from "../util/mail.js";
cron.schedule("*/5 * * * *", async () => {
  try {
    const now = new Date();
    const tasksToExpire = await Task.find({
      status: { $in: ["posted", "requested"] },
      expiredAt: { $lte: now },
    }).populate("createdBy", "email name");
    for (const task of tasksToExpire) {
      if (task.createdBy?.email) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: task.createdBy.email,
          subject: "Task Expired Notification",
          text: `Dear ${task.createdBy.name},\n\nYour task titled "${task.title}" has expired as it was not accepted within the specified deadline. The task has been moved to expired status. You can find it in your dashboard.\n\nThank you for using our service.\n\nBest regards,\nDelivery Service Team`,
        });
      }
      task.status = "expired";
      await task.save();
    }
  } catch {
    // Handle errors if necessary
  }
});
