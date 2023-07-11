import React from 'react';
import GenericForm from "../shared/GenericForm";
import { useParams } from "react-router-dom";

export default function ProgramRegistrationForm() {
  return (
    <GenericForm name={'programRegistration'} mainPage={'/programRegistrations'}/>
  );
};
