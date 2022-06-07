const Hashing = require("../utils/hashing");
const {GDBOrganizationModel, GDBUserAccountModel} = require('../models');

async function createUserAccount(data) {
  const {
    email, notificationEmail, password, displayName, organizationId, primaryContact
  } = data;

  const {hash, salt} = await Hashing.hashPassword(password);

  const userAccount = GDBUserAccountModel({
    email,
    notificationEmail,
    hash,
    salt,
  });

  if (primaryContact) {
    userAccount.primaryContact = {
      familyName: primaryContact.familyName,
      givenName: primaryContact.givenName,
    }
  }

  await userAccount.save();
  return userAccount;
}

// Example:
// createUserAccount({
//   primaryEmail: '1@test.com',
//   secondaryEmail: '2@test.com',
//   password: '123',
//   primaryContact: {
//     familyName: 'Lyu',
//     givenName: 'Dishu'
//   },
// })


async function updateUserAccount(email, updatedData) {
  const userAccount = await GDBUserAccountModel.findOne({email});
  Object.assign(userAccount, updatedData);
  await updatedData.save();
  return userAccount;
}

async function findUserAccountByEmail(email) {
  const userAccount = await GDBUserAccountModel.findOne(
    {email},
    {populates: ['primaryContact', 'organization']}
  );
  return userAccount;
}

async function validateCredentials(email, password) {
  const userAccount = await GDBUserAccountModel.findOne({email});
  const validated = await Hashing.validatePassword(password, userAccount.hash, userAccount.salt);
  return {validated, userAccount};
}

/**
 * Check if the database contains at least one user account.
 * If not, create a default user account.
 * @return {Promise<void>}
 */
async function initUserAccounts() {
  const account = await GDBUserAccountModel.findOne({});

  // No account in the database
  if (!account) {
    const {hash, salt} = await Hashing.hashPassword('admin');

    const userAccount = GDBUserAccountModel({
      primaryEmail: 'admin@snmi.ca',
      secondaryEmail: 'admin2@snmi.ca',
      role: 'admin',
      displayName: 'Admin',
      hash,
      salt,
    });

    await userAccount.save();
  }

}


module.exports = {
  createUserAccount, updateUserAccount, findUserAccountByEmail, validateCredentials, initUserAccounts
};
