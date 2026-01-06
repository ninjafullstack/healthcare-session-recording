// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// Import the adminAuth from firebase-admin.js
const { adminAuth } = require('./firebase-admin.js');

async function verifyUserEmail(uid) {
  try {
    await adminAuth.updateUser(uid, { emailVerified: true });
    console.log(`✅ Successfully verified email for user: ${uid}`);
    return true;
  } catch (error) {
    console.error('❌ Error verifying user email:', error);
    return false;
  }
}

// Replace with the actual user UID
const userUid = 'T8xyOCVGskOcrqNCVZn6kI4tZL53';

// Execute the function
async function main() {
  console.log(`🔄 Attempting to verify email for user: ${userUid}`);
  const success = await verifyUserEmail(userUid);
  process.exit(success ? 0 : 1);
}

// Run the script
main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
