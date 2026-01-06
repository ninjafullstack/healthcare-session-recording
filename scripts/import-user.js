// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const crypto = require('crypto');

// Source project configuration (where we're importing FROM)
const sourceApp = initializeApp(
  {
    credential: cert({
      projectId: process.env.SOURCE_FIREBASE_PROJECT_ID,
      clientEmail: process.env.SOURCE_FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.SOURCE_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  },
  'source'
);

// Destination project configuration (where we're importing TO)
const destApp = initializeApp(
  {
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  },
  'destination'
);

// Get Auth instances for both apps
const sourceAuth = getAuth(sourceApp);
const destAuth = getAuth(destApp);

/**
 * Convert base64 string to Buffer
 * @param {string} base64String - Base64 encoded string
 * @returns {Buffer} Decoded buffer
 */
function base64ToBuffer(base64String) {
  return Buffer.from(base64String, 'base64');
}

/**
 * Import a specific user from source to destination Firebase project
 * @param {string} uid - The user ID to import
 */
async function importUser(uid) {
  try {
    // 1. Get the user from source project
    const userRecord = await sourceAuth.getUser(uid);

    // Log user details for verification
    console.log('Source user details:', {
      uid: userRecord.uid,
      email: userRecord.email,
      providers: userRecord.providerData.map((provider) => provider.providerId),
      emailVerified: userRecord.emailVerified,
      disabled: userRecord.disabled,
      customClaims: userRecord.customClaims,
      hasPasswordHash: !!userRecord.passwordHash,
      hasPasswordSalt: !!userRecord.passwordSalt,
    });

    // 2. Get the password hash parameters from source project
    // Note: You need to get these values from Firebase Console > Authentication > Users
    // and add them to your .env.local file
    const hashConfig = {
      hash: {
        algorithm: 'SCRYPT',
        key: base64ToBuffer(process.env.SOURCE_HASH_KEY),
        saltSeparator: base64ToBuffer(process.env.SOURCE_SALT_SEPARATOR || ''),
        rounds: parseInt(process.env.SOURCE_HASH_ROUNDS || '8'),
        memoryCost: parseInt(process.env.SOURCE_HASH_MEMORY_COST || '14'),
      },
    };

    // Log hash configuration (excluding sensitive data)
    console.log('Hash configuration:', {
      algorithm: hashConfig.hash.algorithm,
      rounds: hashConfig.hash.rounds,
      memoryCost: hashConfig.hash.memoryCost,
      hasKey: !!hashConfig.hash.key,
      hasSaltSeparator: !!hashConfig.hash.saltSeparator,
    });

    // 3. Prepare user data for import
    const userToImport = {
      uid: userRecord.uid,
      email: userRecord.email,
      emailVerified: userRecord.emailVerified,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      disabled: userRecord.disabled,
      metadata: {
        lastSignInTime: userRecord.metadata.lastSignInTime,
        creationTime: userRecord.metadata.creationTime,
      },
      // Convert password hash and salt to Buffer if they exist
      passwordHash: userRecord.passwordHash ? base64ToBuffer(userRecord.passwordHash) : undefined,
      passwordSalt: userRecord.passwordSalt ? base64ToBuffer(userRecord.passwordSalt) : undefined,
      customClaims: userRecord.customClaims,
      // Ensure email/password provider is present
      providerData: [
        {
          providerId: 'password',
          displayName: userRecord.displayName,
          email: userRecord.email,
          photoURL: userRecord.photoURL,
          uid: userRecord.uid,
        },
        // Keep any existing providers that aren't password
        ...userRecord.providerData
          .filter((provider) => provider.providerId !== 'password')
          .map((provider) => ({
            providerId: provider.providerId,
            displayName: provider.displayName,
            email: provider.email,
            phoneNumber: provider.phoneNumber,
            photoURL: provider.photoURL,
            uid: provider.uid,
          })),
      ],
    };

    // Log import data (excluding sensitive information)
    console.log('User data to import:', {
      uid: userToImport.uid,
      email: userToImport.email,
      hasPasswordHash: !!userToImport.passwordHash,
      hasPasswordSalt: !!userToImport.passwordSalt,
      providers: userToImport.providerData.map((p) => p.providerId),
    });

    // 4. Import the user
    const result = await destAuth.importUsers([userToImport], hashConfig);

    if (result.errors.length > 0) {
      console.error('Error importing user:', result.errors[0]);
      return false;
    }

    // 5. Verify the import by fetching the user from destination
    const importedUser = await destAuth.getUser(uid);
    console.log('Successfully imported user:', {
      uid: importedUser.uid,
      email: importedUser.email,
      providers: importedUser.providerData.map((provider) => provider.providerId),
      emailVerified: importedUser.emailVerified,
      disabled: importedUser.disabled,
      customClaims: importedUser.customClaims,
      hasPasswordHash: !!importedUser.passwordHash,
      hasPasswordSalt: !!importedUser.passwordSalt,
    });

    return true;
  } catch (error) {
    console.error('Error during user import:', error);
    if (error.code === 'auth/invalid-credential') {
      console.error('Invalid credential error. Please check:');
      console.error('1. Source hash parameters are correct');
      console.error('2. Password hash and salt are properly encoded');
      console.error('3. User has a valid password hash in source project');
    }
    return false;
  }
}

// Usage example (uncomment and modify with actual UID)
importUser('JRTftM85h5hiGKGdhJzCUVLPVE02')
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Import failed:', error);
    process.exit(1);
  });
