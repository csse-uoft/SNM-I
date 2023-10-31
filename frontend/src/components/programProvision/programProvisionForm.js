import React, {useEffect, useState} from 'react';
import GenericForm from "../shared/GenericForm";
import {fetchInternalTypeByFormType} from "../../api/internalTypeApi";
import {ClientAndNeedOccurrenceField} from "../serviceProvision/ClientAndNeedOccurrenceField";
import {ProgramAndOccurrenceAndNeedSatisfierField} from "./ProgramAndOccurrenceAndNeedSatisfierField";


export default function ProgramProvisionForm() {

  const formType = 'programProvision';

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
    if (implementation.optionsFromClass === ":Client") {
      // Render client & need occurrence
      return <ClientAndNeedOccurrenceField handleChange={handleChange} fields={fields}
                                           clientFieldId={internalTypes.clientForProgramProvision._id}
                                           needOccFieldId={internalTypes.needOccurrenceForProgramProvision._id}/>
    } else if (implementation.optionsFromClass === ":Program") {
      const programFieldId = internalTypes.programForProgramProvision._id;
      const programOccurrenceFieldId = internalTypes.programOccurrenceForProgramProvision._id
      const needSatisfierFieldId = internalTypes.needSatisfierForProgramProvision._id;

      if (!programFieldId || !programOccurrenceFieldId || !needSatisfierFieldId) {
        return <Box minWidth={"350px"}><Loading message=""/></Box>;
      }

      // Render Program & Program Occurrence & Need Satisfier
      return <ProgramAndOccurrenceAndNeedSatisfierField
        handleChange={handleChange} fields={fields}
        programFieldId={programFieldId}
        programOccurrenceFieldId={programOccurrenceFieldId}
        needSatisfierFieldId={needSatisfierFieldId}/>

    } else if (implementation.optionsFromClass === ':NeedOccurrence') {
      return "";
    } else if (implementation.optionsFromClass === ':ProgramOccurrence') {
      return "";
    }
  }

  return (
    <GenericForm name={formType} mainPage={'/programProvisions'} onRenderField={handleRenderField}/>
  );
};
