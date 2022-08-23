import React from 'react';
import GenericForm from "../shared/GenericForm";
import { useParams } from "react-router-dom";

export default function ProviderForm() {
  const {formType} = useParams();
  return (
    <GenericForm name={formType} mainPage={'/providers'}/>
  );
};
