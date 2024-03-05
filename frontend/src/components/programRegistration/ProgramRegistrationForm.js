import React, {useEffect, useState} from 'react';
import GenericForm from "../shared/GenericForm";
import {fetchInternalTypeByFormType} from "../../api/internalTypeApi";
import {ClientAndNeedOccurrenceField} from "../serviceProvision/ClientAndNeedOccurrenceField";
import ProgramOccurrenceAndStatusField from './ProgramOccurrenceAndStatusField';

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
    if (implementation.optionsFromClass?.endsWith("#Client")) {
      // Render client & need occurrence
      return <ClientAndNeedOccurrenceField handleChange={handleChange} fields={fields}
                                           clientFieldId={internalTypes.clientForProgramRegistration._id}
                                           needOccFieldId={internalTypes.needOccurrenceForProgramRegistration._id}/>
    } else if (implementation.optionsFromClass?.endsWith("#ProgramOccurrence")) {
      return <ProgramOccurrenceAndStatusField handleChange={handleChange} fields={fields}
                                              serviceOrProgramId={serviceOrProgramId} formType={formType}/>;
    } else if (implementation.optionsFromClass?.endsWith("#NeedOccurrence")) {
      return "";
    } else if (implementation.label === "Registration Status") {
      return '';
    }
  }
  return (
    <GenericForm name={'programRegistration'} mainPage={'/programRegistrations'} onRenderField={handleRenderField}/>
  );
};
