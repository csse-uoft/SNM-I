import React from 'react';

export const defaultUserContext = {
  id:'',
  isAdmin: '',
  displayName: '',
  givenName:'',
  familyName:'',
  email: '',
  altEmail:'',
  countryCode:null,
  areaCode:null,
  phoneNumber:null,
  errorMessage:[],
  expiresAt: 0,
  anyUnreadNotifications: false,
}

export const getUserContext = () => {
  const context = {...defaultUserContext};
  const json = localStorage.getItem('userContext');

  if (json) {
    Object.assign(context, JSON.parse(json));
  }
  if (context.expiresAt <= new Date()) {
    return defaultUserContext;
  } else {
    return context;
  }
}

export const UserContext = React.createContext(defaultUserContext);
