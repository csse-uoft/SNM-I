import React from 'react';

export const defaultUserContext = {
  id:'',
  email: '',
  altEmail:'',
  isAdmin: '',
  displayName: '',
  givenName:'',
  familyName:'',
  countryCode:null,
  areaCode:null,
  phoneNumber:null,
}

export const getUserContext = () => {
  const context = {...defaultUserContext};
  const json = localStorage.getItem('userContext');

  if (json) {
    Object.assign(context, JSON.parse(json));
  }
  return context;
}

export const UserContext = React.createContext(defaultUserContext);
