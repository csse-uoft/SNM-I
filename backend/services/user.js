const Hashing = require("../utils/hashing");
const {GDBOrganizationModel, GDBUserAccountModel} = require('../models');

async function createUserAccount(data) {
  const {
    primaryEmail, secondaryEmail, password, displayName, organizationId, primaryContact
  } = data;

  const {hash, salt} = await Hashing.hashPassword(password);

  const userAccount = GDBUserAccountModel({
    primaryEmail,
    secondaryEmail,
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

async function createTemporaryUserAccount(data) {
  const {
    email, is_superuser, expirationDate
  } = data;


  const userAccount = GDBUserAccountModel({
    primaryEmail: email,
    role: is_superuser? 'admin': 'regular',
    expirationDate

  });

  await userAccount.save();
  return userAccount;
}


async function updateUserAccount(email, updatedData) {
  const userAccount = await GDBUserAccountModel.findOne({primaryEmail: email});
  Object.assign(userAccount, updatedData);
  await updatedData.save();
  return userAccount;
}

async function findUserAccountByEmail(email) {
  const userAccount = await GDBUserAccountModel.findOne(
    {primaryEmail: email},
    {populates: ['primaryContact', 'organization']}
  );
  return userAccount;
}

async function isEmailExists(email) {
  const userAccount = await findUserAccountByEmail(email);
  return !!userAccount
}



async function validateCredentials(email, password) {
  const userAccount = await GDBUserAccountModel.findOne({primaryEmail: email});
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
  createUserAccount, updateUserAccount, findUserAccountByEmail, validateCredentials, initUserAccounts, isEmailExists
};
