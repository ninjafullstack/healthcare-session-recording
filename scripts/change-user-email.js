// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// Import the adminAuth from firebase-admin.js
const { adminAuth } = require('./firebase-admin.js');

// Function to update the user's email
async function changeUserEmail(uid, newEmail) {
  try {
    const userRecord = await adminAuth.updateUser(uid, {
      email: newEmail,
    });
  } catch (error) {
    console.error('Error updating user:', error);
  }
}

// Call the function with the user's UID and the new email
changeUserEmail('7tXuWXynR3QrVBwuddALz9u8xMC2', 'business@shearmanpodiatry.co.uk');
