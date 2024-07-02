import React, {useEffect, useState} from 'react';
import GenericForm from "../shared/GenericForm";
import {fetchInternalTypeByFormType} from "../../api/internalTypeApi";
import {ProgramAndNeedSatisfierField} from "./ProgramAndNeedSatisfierField";

export default function ProgramOccurrenceForm() {
  const formType = 'programOccurrence';

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
    if (implementation.optionsFromClass?.endsWith("#Program") ) {
      // Render Program & Program Occurrence & Need Satisfier
      return <ProgramAndNeedSatisfierField
        handleChange={handleChange} fields={fields}
        programFieldId={internalTypes.programForProgramOccurrence._id}
        needSatisfierFieldId={internalTypes.needSatisfierForProgramOccurrence._id}/>

    } else if (implementation.optionsFromClass?.endsWith('#NeedSatisfier')) {
      return "";
    }
  }

  return (
    <GenericForm name={formType} mainPage={'/programOccurrences'} onRenderField={handleRenderField}/>
  );
};
