import React, {useEffect, useState} from 'react';
import GenericForm from "../shared/GenericForm";
import {fetchInternalTypeByFormType} from "../../api/internalTypeApi";
import {ServiceAndNeedSatisfierField} from "./ServiceAndNeedSatisfierField";
import {fetchCharacteristics} from '../../api/characteristicApi';
import {CapacityField} from '../shared/CapacityField';

export default function ServiceOccurrenceForm() {
  const formType = 'serviceOccurrence';

  const [characteristics, setCharacteristics] = useState({});
  useEffect(() => {
    fetchCharacteristics().then(characteristics => {
      const data = {};
      for (const {implementation, name, _id} of characteristics.data) {
        data[name] = {implementation, _id}
      }
      setCharacteristics(data);
    });
  }, []);

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
      return <CapacityField fields={fields} handleChange={handleChange}
                            capacityFieldId={characteristics['Capacity']._id} />;
    } else if (implementation.label === 'Occupancy') {
      return ''; // Not editable by the user
    }
  }

  return (
    <GenericForm name={formType} mainPage={'/serviceOccurrences'} onRenderField={handleRenderField}/>
  );
};