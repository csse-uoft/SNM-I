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
  const handleRenderField = ({required, id, type, implementation, content, _id}, index, fields, handleChange) => {
    console.log(implementation)
    if (implementation.optionsFromClass === ":Client") {
      // Render client & need occurrence
      return <ClientAndNeedOccurrenceField handleChange={handleChange} fields={fields}
                                           clientFieldId={internalTypes.clientForProgramRegistration._id}
                                           needOccFieldId={internalTypes.needOccurrenceForProgramRegistration._id}/>
    } else if (implementation.optionsFromClass === ":ProgramOccurrence") {
      // Render Program & Program Occurrence & Need Satisfier
      return <ProgramAndOccurrenceAndNeedSatisfierField
        handleChange={handleChange} fields={fields}
        programFieldId={internalTypes.programForProgramRegistration._id}
        programOccurrenceFieldId={internalTypes.programOccurrenceForProgramRegistration._id}
        needSatisfierFieldId={internalTypes.needSatisfierForProgramRegistration._id}/>

    } else if (implementation.optionsFromClass === ':NeedOccurrence') {
      return "";
    }
  }

  return (
    <GenericForm name={'programRegistration'} mainPage={'/programRegistrations'}/>
  );
};
