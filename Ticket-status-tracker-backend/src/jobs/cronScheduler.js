import cron from 'node-cron';
import { statusProgressionHandler, getStatusProgressionStats } from './statusProgressionCron.js';

let statusProgressionJob = null;

/**
 * Initialize and start the cron scheduler
 * Sets up the status progression job to run every minute
 */
export const initializeCronScheduler = () => {
  try {
    console.log('Initializing cron scheduler...');

    // Schedule status progression job to run every minute
    statusProgressionJob = cron.schedule('* * * * *', async () => {
      console.log('Running status progression job...');
      await statusProgressionHandler();
    }, {
      scheduled: false,
      timezone: 'UTC'
    });

    // Start the job
    statusProgressionJob.start();
    
    console.log('Status progression cron job scheduled (every minute)');
    
    return true;

  } catch (error) {
    console.error('Error initializing cron scheduler:', error.message);
    return false;
  }
};

/**
 * Stop the cron scheduler
 */
export const stopCronScheduler = () => {
  try {
    if (statusProgressionJob) {
      statusProgressionJob.stop();
      statusProgressionJob.destroy();
      statusProgressionJob = null;
      console.log('Cron scheduler stopped');
    }
  } catch (error) {
    console.error('Error stopping cron scheduler:', error.message);
  }
};

/**
 * Get cron job status and statistics
 * @returns {Promise<Object>} - Status and statistics
 */
export const getCronStatus = async () => {
  try {
    const isRunning = statusProgressionJob ? statusProgressionJob.running : false;
    
    const stats = await getStatusProgressionStats();
    
    return {
      isRunning,
      jobName: 'Status Progression',
      schedule: 'Every minute (* * * * *)',
      stats
    };

  } catch (error) {
    console.error('Error getting cron status:', error.message);
    return {
      isRunning: false,
      error: error.message
    };
  }
};

/**
 * Manually trigger status progression (for testing)
 */
export const triggerStatusProgression = async () => {
  try {
    console.log('Manually triggering status progression...');
    await statusProgressionHandler();
    console.log('Manual status progression completed');
  } catch (error) {
    console.error('Error in manual status progression:', error.message);
  }
};

export default {
  initializeCronScheduler,
  stopCronScheduler,
  getCronStatus,
  triggerStatusProgression
};
