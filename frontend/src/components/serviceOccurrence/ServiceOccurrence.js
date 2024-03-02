import React, {useEffect, useState} from 'react';
import GenericForm from "../shared/GenericForm";
import {fetchInternalTypeByFormType} from "../../api/internalTypeApi";
import {ServiceAndNeedSatisfierField} from "./ServiceAndNeedSatisfierField";
import FieldGroup from '../shared/FieldGroup';
import {fetchCharacteristics} from '../../api/characteristicApi';
import {getInstancesInClass} from '../../api/dynamicFormApi';
import {Box} from '@mui/material';
import {Loading} from '../shared';
import SelectField from '../shared/fields/SelectField';

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

  const [statusOptions, setStatusOptions] = useState(null);
  useEffect(() => {
    getInstancesInClass(':OccurrenceStatus')
      .then(options => setStatusOptions(options));
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
    } else if (implementation.label === 'Occupancy') {
      return ''; // Not editable by the user
    } else if (implementation.label === "Occurrence Status") {
      const statusFieldKey = `characteristic_${characteristics['Occurrence Status']?._id}`;
      if (!statusFieldKey || !statusOptions) {
        return <Box minWidth={"350px"}><Loading message=""/></Box>;
      }

      return <SelectField key={statusFieldKey} label="Occurrence Status" required value={fields[statusFieldKey]}
        options={statusOptions} onChange={handleChange(statusFieldKey)}/>;
    }
  }

  return (
    <GenericForm name={formType} mainPage={'/serviceOccurrences'} onRenderField={handleRenderField}/>
  );
};