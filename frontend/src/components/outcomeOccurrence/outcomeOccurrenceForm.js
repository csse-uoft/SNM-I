import React, {useEffect, useState} from 'react';
import GenericForm from "../shared/GenericForm";
import {fetchInternalTypeByFormType} from "../../api/internalTypeApi";

export default function OutcomeOccurrenceForm() {
  const formType = 'outcomeOccurrence';

  const [internalTypes, setInternalTypes] = useState({});
  useEffect(() => {
    fetchInternalTypeByFormType(formType).then(({internalTypes}) => {
      const data = {}
      for (const {implementation, name, _id} of internalTypes) {
        data[name] = {implementation, _id}
      }
      setInternalTypes(data);
    });
  }, []);
  const handleRenderField = ({required, id, type, implementation, content, _id}, index, fields, handleChange) => {
    console.log(implementation)
    if (implementation.optionsFromClass === ':occurrenceOf') {
      return "";
    }
  }

  return (
    <GenericForm name={formType} mainPage={'/outcomeOccurrences'} onRenderField={handleRenderField}/>
  );
};
