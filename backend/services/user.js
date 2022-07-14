const Hashing = require("../utils/hashing");
const {GDBOrganizationModel, GDBUserAccountModel, GDBSecurityQuestion, GDBPersonModel} = require('../models');

async function createUserAccount(data) {
  const {
    primaryEmail, secondaryEmail, password, displayName, organizationId, primaryContact,
  } = data;

  const {hash, salt} = await Hashing.hashPassword(password);

  const userAccount = GDBUserAccountModel({
    primaryEmail,
    secondaryEmail,
    primaryContact,
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
    expirationDate: expirationDate,
    status: "pending"
  });

  await userAccount.save();
  return userAccount;
}

async function updateUserPassword(email, newPassword) {
  const userAccount = await GDBUserAccountModel.findOne({primaryEmail: email});
  const {hash, salt} = await Hashing.hashPassword(newPassword);
  userAccount.hash = hash;
  userAccount.salt = salt;
  await userAccount.save();
  const saved = await Hashing.validatePassword(newPassword, userAccount.hash, userAccount.salt);
  return {saved, userAccount}
}



async function updateUserAccount(email, updatedData) {
  const userAccount = await GDBUserAccountModel.findOne({primaryEmail: email});
  await userAccount.populate('primaryContact.telephone');

  const {securityQuestions, status, givenName, familyName, countryCode,
    areaCode, phoneNumber, altEmail} = updatedData
  if (securityQuestions){
    const answer1 = await Hashing.hashPassword(securityQuestions[3]);
    const securityQuestion1 = {
      question: securityQuestions[0],
      hash: answer1.hash,
      salt: answer1.salt
    }
    const answer2 = await Hashing.hashPassword(securityQuestions[4]);
    const securityQuestion2 = {
      question: securityQuestions[1],
      hash: answer2.hash,
      salt: answer2.salt
    }
    const answer3 = await Hashing.hashPassword(securityQuestions[5]);
    const securityQuestion3 = {
      question: securityQuestions[2],
      hash: answer3.hash,
      salt: answer3.salt
    }
    userAccount.securityQuestions = [securityQuestion1, securityQuestion2, securityQuestion3]

  }
  if(status){
    userAccount.status = status
  }
  // add more if needed TODO
  if(givenName) {
    if (!userAccount.primaryContact) {
      userAccount.primaryContact = {};
    }
    userAccount.primaryContact.givenName = givenName;
  }

  if(familyName) {
    userAccount.primaryContact.familyName = familyName;
  }

  if(countryCode) {
    if (!userAccount.primaryContact.telephone) {
      userAccount.primaryContact.telephone={};
    }
    userAccount.primaryContact.telephone.countryCode = countryCode;
  }

  if(areaCode) {
    userAccount.primaryContact.telephone.areaCode = areaCode;
  }

  if(phoneNumber) {
    userAccount.primaryContact.telephone.phoneNumber = phoneNumber;
  }

  if(altEmail) {
    userAccount.secondaryEmail = altEmail;
  }

  await userAccount.save();
  console.log(userAccount)
  return userAccount;
}

async function findUserAccountByEmail(email) {
  const userAccount = await GDBUserAccountModel.findOne(
    {primaryEmail: email},
    {populates: ['primaryContact.telephone', 'organization']}
  );
  return userAccount;
}

async function findUserAccountById(id) {
  const userAccount = await GDBUserAccountModel.findOne(
    {_id: id},
    {populates: ['primaryContact.telephone', 'organization']}
  );
  return userAccount;
}

/**
 * Check if this email belongs to a user
 * @param email
 * @returns {Promise<number>}
 * return 0 if the email not belongs to anyone
 * return 1 if the email belongs to a permanent user
 * return 2 if the email belongs to a temporary user
 */
async function isEmailExists(email) {
  const userAccount = await findUserAccountByEmail(email);
  if(!!userAccount){
    if(userAccount.status === 'pending'){
      return 2
    }else{
      return 1
    }
  }else{
    return 0
  }
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
      status: "permanent",
      primaryContact: {
        givenName: 'Super',
        familyName: 'Admin',
        telephone: {
          countryCode: 1,
          areaCode: 647,
          phoneNumber: 5726356,},
      },
      hash,
      salt,
    });

    await userAccount.save();
  }

}


module.exports = {
  createUserAccount, updateUserAccount, findUserAccountByEmail, validateCredentials, initUserAccounts, isEmailExists,
  createTemporaryUserAccount, updateUserPassword, findUserAccountById
};
