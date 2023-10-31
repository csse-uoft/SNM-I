import React, {useEffect, useState} from 'react';
import GenericForm from "../shared/GenericForm";
import { useParams } from "react-router-dom";
import {fetchInternalTypeByFormType} from "../../api/internalTypeApi";
import {ClientAndNeedOccurrenceField} from "../serviceProvision/ClientAndNeedOccurrenceField";
import {ProgramAndOccurrenceAndNeedSatisfierField} from "../programProvision/ProgramAndOccurrenceAndNeedSatisfierField";

export default function ProgramRegistrationForm() {

  const formType = 'programRegistration';

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
  const handleRenderField = ({required, id, type, implementation, content, serviceOrProgramId}, index, fields, handleChange) => {
    console.log(implementation)
    if (implementation.optionsFromClass?.endsWith("Client")) {
      // Render client & need occurrence
      return <ClientAndNeedOccurrenceField handleChange={handleChange} fields={fields}
                                           clientFieldId={internalTypes.clientForProgramRegistration._id}
                                           needOccFieldId={internalTypes.needOccurrenceForProgramRegistration._id}/>
    } else if (implementation.optionsFromClass?.endsWith("ProgramOccurrence")) {
      const programOccurrenceFieldId = internalTypes.programOccurrenceForProgramRegistration._id;

      if (!programOccurrenceFieldId) {
        return <Box minWidth={"350px"}><Loading message=""/></Box>;
      }

      // Render Program & Program Occurrence & Need Satisfier
      return <ProgramAndOccurrenceAndNeedSatisfierField
        handleChange={handleChange} fields={fields}
        programOccurrenceFieldId={programOccurrenceFieldId}
        fixedProgram={'http://snmi#program_' + serviceOrProgramId}/>
    } else if (implementation.optionsFromClass?.endsWith("NeedOccurrence")) {
      return "";
    }
  }
  return (
    <GenericForm name={'programRegistration'} mainPage={'/programRegistrations'} onRenderField={handleRenderField}/>
  );
};
