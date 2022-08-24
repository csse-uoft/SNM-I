import React from 'react';
import GenericSearch from "../shared/GenericSearch";

export default function ClientSearch() {
  return (
    <GenericSearch name={'client'} mainPage={'/clients'}/>
  );
};