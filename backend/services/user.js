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
    status: "temporary"
  });

  await userAccount.save();
  return userAccount;
}

async function updateUserPassword(email, newPassword) {
  const userAccount = await GDBUserAccountModel.findOne({primaryEmail: email});
  const {hash, salt} = await Hashing.hashPassword(newPassword);
  userAccount.hash = hash
  userAccount.salt = salt
  await userAccount.save()
  const saved = true
  return {saved, userAccount}
}



async function updateUserAccount(email, updatedData) {
  const userAccount = await GDBUserAccountModel.findOne({primaryEmail: email}, {populates: ['primaryContact.telephone']});
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
    userAccount.primaryContact.givenName = givenName;
  }

  if(familyName) {
    userAccount.primaryContact.familyName = familyName;
  }

  if(countryCode) {
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
      primaryContact: {
        givenName: 'Christina',
        familyName: 'Aquafina',
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
  createTemporaryUserAccount, updateUserPassword
};
