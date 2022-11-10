import React from 'react';
import GenericForm from "../shared/GenericForm";
import { useParams } from "react-router-dom";

export default function ServiceRegistrationForm() {
  return (
    <GenericForm name={'serviceRegistration'} mainPage={'/serviceRegistrations'}/>
  );
};