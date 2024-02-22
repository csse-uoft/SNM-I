import React, {useEffect, useState} from 'react';
import GenericForm from "../shared/GenericForm";
import { useParams } from "react-router-dom";
import {fetchInternalTypeByFormType} from "../../api/internalTypeApi";
import {ClientAndNeedOccurrenceField} from "../serviceProvision/ClientAndNeedOccurrenceField";
import {ServiceAndOccurrenceAndNeedSatisfierField} from "../serviceProvision/ServiceAndOccurrenceAndNeedSatisfierField";

export default function ServiceRegistrationForm() {

  const formType = 'serviceRegistration';

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
                                           clientFieldId={internalTypes.clientForServiceRegistration._id}
                                           needOccFieldId={internalTypes.needOccurrenceForServiceRegistration._id}/>
    } else if (implementation.optionsFromClass?.endsWith("#ServiceOccurrence")) {
      const serviceOccurrenceFieldId = internalTypes.serviceOccurrenceForServiceRegistration._id;

      if (!serviceOccurrenceFieldId) {
        return <Box minWidth={"350px"}><Loading message=""/></Box>;
      }

      // Render Service & Service Occurrence & Need Satisfier
      return <ServiceAndOccurrenceAndNeedSatisfierField
        handleChange={handleChange} fields={fields}
        serviceOccurrenceFieldId={serviceOccurrenceFieldId}
        fixedServiceId={serviceOrProgramId}/>
    } else if (implementation.optionsFromClass?.endsWith("#NeedOccurrence")) {
      return "";
    }
  }
  return (
    <GenericForm name={'serviceRegistration'} mainPage={'/serviceRegistrations'} onRenderField={handleRenderField}/>
  );
};
