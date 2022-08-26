import React from 'react';
import GenericAdvanceSearch from "../shared/GenericAdvanceSearch";

export default function ClientSearch() {
  return (
    <GenericAdvanceSearch name={'client'} mainPage={'/clients'}/>
  );
};