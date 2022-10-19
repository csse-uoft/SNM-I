import React from 'react';
import GenericForm from "../shared/GenericForm";
import { useParams } from "react-router-dom";

export default function ServiceOccurrenceForm() {
  return (
    <GenericForm name={'serviceOccurrence'} mainPage={'/serviceOccurrences'}/>
  );
};