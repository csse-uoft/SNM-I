import React, {useEffect, useState} from 'react';
import GenericForm from "../shared/GenericForm";
import {fetchInternalTypeByFormType} from "../../api/internalTypeApi";
import {ClientAndNeedOccurrenceField} from "../serviceProvision/ClientAndNeedOccurrenceField";
import {ServiceAndOccurrenceAndNeedSatisfierField} from "../serviceProvision/ServiceAndOccurrenceAndNeedSatisfierField";
import {fetchCharacteristics} from '../../api/characteristicApi';
import {getInstancesInClass} from '../../api/dynamicFormApi';
import {Box} from '@mui/material';
import {Loading} from '../shared';
import SelectField from '../shared/fields/SelectField';

export default function ServiceRegistrationForm() {

  const formType = 'serviceRegistration';

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
    });
  }, []);

  const [statusOptions, setStatusOptions] = useState(null);
  useEffect(() => {
    getInstancesInClass(':RegistrationStatus')
      .then(options => setStatusOptions(options));
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
    } else if (implementation.label === "Registration Status") {
      const statusFieldKey = `characteristic_${characteristics['Registration Status']._id}`;
      if (!statusFieldKey || !statusOptions) {
        return <Box minWidth={"350px"}><Loading message=""/></Box>;
      }

      return <SelectField key={statusFieldKey} label="Registration Status" required value={fields[statusFieldKey]}
        options={statusOptions} onChange={handleChange(statusFieldKey)}/>;
    }
  }
  return (
    <GenericForm name={'serviceRegistration'} mainPage={'/serviceRegistrations'} onRenderField={handleRenderField}/>
  );
};
