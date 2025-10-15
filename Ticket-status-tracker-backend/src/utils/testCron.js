import { triggerStatusProgression, getCronStatus } from '../jobs/cronScheduler.js';

/**
 * Test script for the cron system
 * Run this to manually trigger status progression and check system status
 */
const testCronSystem = async () => {
  console.log('Testing Cron System...\n');

  try {
    // Get current cron status
    console.log('Current Cron Status:');
    const status = await getCronStatus();
    console.log(JSON.stringify(status, null, 2));
    console.log('\n');

    // Manually trigger status progression
    console.log('Manually triggering status progression...');
    await triggerStatusProgression();
    
    console.log('\nTest completed successfully!');

  } catch (error) {
    console.error('Test failed:', error.message);
  }
};

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testCronSystem();
}

export default testCronSystem;
