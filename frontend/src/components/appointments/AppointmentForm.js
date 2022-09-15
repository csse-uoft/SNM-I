import React from 'react';
import GenericForm from "../shared/GenericForm";

export default function AppointmentForm() {
  return (
    <GenericForm name={'appointment'} mainPage={'/appointments'}/>
  );
};
