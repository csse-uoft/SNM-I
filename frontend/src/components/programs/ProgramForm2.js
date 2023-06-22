import React from 'react';
import GenericForm from "../shared/GenericForm";
import { useParams } from "react-router-dom";

export default function ProviderForm() {
  return (
    <GenericForm name={'program'} mainPage={'/programs'}/>
  );
};
