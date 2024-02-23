import React, {useEffect, useState} from 'react';
import GenericForm from "../shared/GenericForm";
import {fetchInternalTypeByFormType} from "../../api/internalTypeApi";
import {ClientAndNeedOccurrenceField} from "./ClientAndNeedOccurrenceField";
import {ServiceAndOccurrenceAndNeedSatisfierField} from "./ServiceAndOccurrenceAndNeedSatisfierField";


export default function ServiceProvisionForm() {

  const formType = 'serviceProvision';

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
    if (implementation.optionsFromClass?.endsWith("#Client")) {
      // Render client & need occurrence
      return <ClientAndNeedOccurrenceField handleChange={handleChange} fields={fields}
                                           clientFieldId={internalTypes.clientForServiceProvision._id}
                                           needOccFieldId={internalTypes.needOccurrenceForServiceProvision._id}/>
    } else if (implementation.optionsFromClass?.endsWith("#Service")) {
      const serviceFieldId = internalTypes.serviceForServiceProvision._id;
      const serviceOccurrenceFieldId = internalTypes.serviceOccurrenceForServiceProvision._id;
      const needSatisfierFieldId = internalTypes.needSatisfierForServiceProvision._id;

      if (!serviceFieldId || !serviceOccurrenceFieldId || !needSatisfierFieldId) {
        return <Box minWidth={"350px"}><Loading message=""/></Box>;
      }

      // Render Service & Service Occurrence & Need Satisfier
      return <ServiceAndOccurrenceAndNeedSatisfierField
        handleChange={handleChange} fields={fields}
        serviceFieldId={serviceFieldId}
        serviceOccurrenceFieldId={serviceOccurrenceFieldId}
        needSatisfierFieldId={needSatisfierFieldId}/>

    } else if (implementation.optionsFromClass?.endsWith('#NeedOccurrence')) {
      return "";
    } else if (implementation.optionsFromClass?.endsWith('#ServiceOccurrence')) {
      return "";
    }
  }

  return (
    <GenericForm name={formType} mainPage={'/serviceProvisions'} onRenderField={handleRenderField}/>
  );
};
