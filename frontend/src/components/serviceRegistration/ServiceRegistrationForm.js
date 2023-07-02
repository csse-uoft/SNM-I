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
  const handleRenderField = ({required, id, type, implementation, content, _id}, index, fields, handleChange) => {
    console.log(implementation)
    if (implementation.optionsFromClass === ":Client") {
      // Render client & need occurrence
      return <ClientAndNeedOccurrenceField handleChange={handleChange} fields={fields}
                                           clientFieldId={internalTypes.clientForServiceProvision._id}
                                           needOccFieldId={internalTypes.needOccurrenceForServiceProvision._id}/>
    } else if (implementation.optionsFromClass === ":ServiceOccurrence") {
      // Render Service & Service Occurrence & Need Satisfier
      return <ServiceAndOccurrenceAndNeedSatisfierField
        handleChange={handleChange} fields={fields}
        serviceFieldId={internalTypes.serviceForServiceProvision._id}
        serviceOccurrenceFieldId={internalTypes.serviceOccurrenceForServiceProvision._id}
        needSatisfierFieldId={internalTypes.needSatisfierForServiceProvision._id}/>

    }
  }

  return (
    <GenericForm name={'serviceRegistration'} mainPage={'/serviceRegistrations'}/>
  );
};