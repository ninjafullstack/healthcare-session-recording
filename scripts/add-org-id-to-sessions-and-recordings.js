// eslint-disable-next-line @typescript-eslint/no-require-imports
const { adminDb } = require('./firebase-admin.js');

async function moveOrgToSeparateCollection() {
  const usersWithOrganisations = (
    await adminDb.collection('users').where('organisationRef', '!=', null).get()
  ).docs;

  let totalProcessedSessions = 0;
  let totalProcessedUsers = 0;

  for (const user of usersWithOrganisations) {
    console.log(`Processing: ${totalProcessedUsers}/${usersWithOrganisations.length}`);
    const userData = user.data();
    const { organisationRef } = userData;

    if (!organisationRef || !organisationRef.id) {
      continue;
    }
    totalProcessedUsers++;

    const userSessions = (await adminDb.collection(`users/${user.id}/sessions`).get()).docs;
    for (const session of userSessions) {
      await session.ref.update({ organisationId: organisationRef.id });
      totalProcessedSessions++;
    }
  }

  console.log({
    totalProcessedSessions,
    total: usersWithOrganisations.length,
    totalProcessedUsers,
  });
}

moveOrgToSeparateCollection();
