// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// Import the adminAuth from firebase-admin.js
const { adminAuth } = require('./firebase-admin.js');

// Function to update the user's password
async function changeUserPassword(uid, newPassword) {
  try {
    const userRecord = await adminAuth.updateUser(uid, {
      password: newPassword,
    });
    console.log('Successfully updated user password for:', userRecord.email);
  } catch (error) {
    console.error('Error updating user password:', error);
  }
}

// Call the function with the user's UID and the new password
// IMPORTANT: Replace these values with the actual UID and desired password
changeUserPassword('Sggz9AHJcxTi0hEwVzjg0vK5dbk1', 'moticstemporary');
