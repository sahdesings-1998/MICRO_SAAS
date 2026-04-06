import cron from "node-cron";
import { processAllMembersOverdueStatus } from "../services/memberStatusService.js";

let scheduledJobs = [];

/**
 * Initialize member status automation scheduler
 * Runs daily at 2:00 AM (timezone of server)
 */
export const initializeMemberStatusScheduler = () => {
  try {
    // Schedule task: Every day at 2:00 AM
    const job = cron.schedule("0 2 * * *", async () => {
      console.log("[Scheduler] Starting member status automation...");

      try {
        await processAllMembersOverdueStatus();
        console.log("[Scheduler] Member status automation completed successfully");
      } catch (error) {
        console.error("[Scheduler] Member status automation failed:", error.message);
        // Continue running even if one execution fails
      }
    });

    scheduledJobs.push({
      name: "memberStatusAutomation",
      job,
      schedule: "0 2 * * * (2:00 AM daily)",
      status: "active"
    });

    console.log("[Scheduler] Member status automation initialized - runs daily at 2:00 AM");

    return job;
  } catch (error) {
    console.error("[Scheduler] Failed to initialize member status automation:", error.message);
    throw error;
  }
};

/**
 * Get all active scheduled jobs
 */
export const getScheduledJobs = () => {
  return scheduledJobs.map(({ name, schedule, status }) => ({
    name,
    schedule,
    status
  }));
};

/**
 * Stop all scheduled jobs
 */
export const stopAllSchedulers = () => {
  scheduledJobs.forEach(({ job }) => {
    job.stop();
  });
  scheduledJobs = [];
  console.log("[Scheduler] All schedulers stopped");
};

/**
 * Restart a specific scheduler
 */
export const restartScheduler = (jobName) => {
  const jobIndex = scheduledJobs.findIndex(j => j.name === jobName);
  if (jobIndex !== -1) {
    scheduledJobs[jobIndex].job.start();
    console.log(`[Scheduler] Restarted: ${jobName}`);
  }
};

export default {
  initializeMemberStatusScheduler,
  getScheduledJobs,
  stopAllSchedulers,
  restartScheduler
};
