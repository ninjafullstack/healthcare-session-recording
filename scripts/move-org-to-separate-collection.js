const { adminDb } = require('./firebase-admin.js');

async function moveOrgToSeparateCollection() {
  const usersWithOrganisations = (
    await adminDb.collection('users').where('organisation', '!=', null).get()
  ).docs;

  let emptyTotal = 0;
  let createdOrgsTotal = 0;
  const newOrganisationsIds = [];
  let totalProcessedUsers = 0;

  for (const user of usersWithOrganisations) {
    console.log(`Processing: ${totalProcessedUsers}/${usersWithOrganisations.length}`);
    totalProcessedUsers++;
    const userData = user.data();
    const { organisation } = userData;

    if (!organisation || !organisation.id) {
      emptyTotal++;
      continue;
    }

    const getExistingOrganisation = async () =>
      await adminDb.doc(`organisations/${organisation.id}`).get();

    const getOrCreateOrganisation = async () => {
      const existingOrganisation = await getExistingOrganisation();
      if (existingOrganisation.exists) {
        return existingOrganisation;
      }
      await adminDb.doc(`organisations/${organisation.id}`).set(organisation);
      newOrganisationsIds.push(organisation.id);
      createdOrgsTotal++;
      return await getExistingOrganisation();
    };

    const organisationDoc = await getOrCreateOrganisation();

    const isMember = !organisation.role || organisation.role === 'member';
    const isAdmin = organisation.role && organisation.role === 'owner';

    await organisationDoc.ref.collection('members').add({
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      role: isAdmin ? 'admin' : 'member',
      status: 'active',
      addedByUser: user.id,
      invitedAt: new Date(),
      allowResendInvitationAt: new Date(),
      resendAttempts: 0,
    });

    await adminDb.doc(`users/${user.id}`).update({
      ...(isMember ? { memberOfOrganisationId: organisationDoc.id } : {}),
      ...(isAdmin ? { adminOfOrganisationId: organisationDoc.id } : {}),
      organisationRef: organisationDoc.ref,
    });
  }

  console.log({
    emptyTotal,
    total: usersWithOrganisations.length,
    createdOrgsTotal,
    newOrganisationsIds,
  });
}

moveOrgToSeparateCollection();
