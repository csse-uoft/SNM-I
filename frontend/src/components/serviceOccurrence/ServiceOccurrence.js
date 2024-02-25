import React, {useEffect, useState} from 'react';
import GenericForm from "../shared/GenericForm";
import {fetchInternalTypeByFormType} from "../../api/internalTypeApi";
import {ServiceAndNeedSatisfierField} from "./ServiceAndNeedSatisfierField";
import FieldGroup from '../shared/FieldGroup';

export default function ServiceOccurrenceForm() {
  const formType = 'serviceOccurrence';

  const [internalTypes, setInternalTypes] = useState({});
  useEffect(() => {
    fetchInternalTypeByFormType(formType).then(({internalTypes}) => {
      const data = {}
      for (const {implementation, name, _id} of internalTypes) {
        data[name] = {implementation, _id}
      }
      setInternalTypes(data);
      console.log('serviceOccurrence internalTypes', data);
    });
  }, []);
  const handleRenderField = ({required, id, type, implementation, content, _id}, index, fields, handleChange,step) => {
    if (implementation.optionsFromClass?.endsWith("#Service")) {
      // Render Service & Service Occurrence & Need Satisfier
      return <ServiceAndNeedSatisfierField
        handleChange={handleChange} fields={fields}
        serviceFieldId={internalTypes.serviceForServiceOccurrence._id}
        needSatisfierFieldId={internalTypes.needSatisfierForServiceOccurrence._id}/>

    } else if (implementation.optionsFromClass?.endsWith('#NeedSatisfier')) {
      return "";
    } else if (implementation.label === 'Capacity') {
      return <FieldGroup component={implementation.fieldType.type} key={`${type}_${id}`}
                         label={implementation.label} required={required} inputProps={{min: 0}}
                         value={fields[`${type}_${id}`]} onChange={handleChange(`${type}_${id}`)}/>;
    }
  }

  return (
    <GenericForm name={formType} mainPage={'/serviceOccurrences'} onRenderField={handleRenderField}/>
  );
};