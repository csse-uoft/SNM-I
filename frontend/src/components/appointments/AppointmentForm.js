import React, { useEffect, useState } from 'react';
import GenericForm from "../shared/GenericForm";
import { fetchInternalTypeByFormType } from "../../api/internalTypeApi";
import { AppointmentClientField } from './AppointmentClientField';
import { tr } from 'date-fns/locale';
import { fetchCharacteristics } from '../../api/characteristicApi';
import { getInstancesInClass } from '../../api/dynamicFormApi';
import { Box } from '@mui/material';
import { Loading } from '../shared';
import SelectField from '../shared/fields/SelectField';

export default function AppointmentForm() {
  const formType = 'appointment';

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
    fetchInternalTypeByFormType(formType).then(({ internalTypes }) => {
      const data = {}
      for (const { implementation, name, _id } of internalTypes) {
        data[name] = { implementation, _id }
      }
      setInternalTypes(data);
    });
  }, []);

  const [statusOptions, setStatusOptions] = useState(null);
  useEffect(() => {
    getInstancesInClass(':AppointmentStatus')
      .then(options => setStatusOptions(options));
  }, []);

  /*
  * This function is used to render the field
  * It will check if the implementation is from client, if yes then it will render the AppointmentClientField
  * It will also check if the implementation is last name or first name, if yes then it will not render the field (to make sure that the corresponding text field is not rendered)
  */
  const handleRenderField = ({ required, id, type, implementation, content, _id }, index, fields, handleChange) => {
    if ([":Client", "http://snmi#Client"].includes(implementation.optionsFromClass)) {
      return <AppointmentClientField
        handleChange={handleChange} 
        clientFieldId={internalTypes.clientForAppointment._id}
        fields={fields}
      />
    } else if (implementation.label === "Appointment Status") {
      const statusFieldKey = `characteristic_${characteristics['Appointment Status']._id}`;
      if (!statusFieldKey || !statusOptions) {
        return <Box minWidth={"350px"}><Loading message=""/></Box>;
      }

      return <SelectField key={statusFieldKey} label="Appointment Status" required value={fields[statusFieldKey]}
        options={statusOptions} onChange={handleChange(statusFieldKey)}/>;
    }else if (implementation.label === "Last Name") {
      return "";
    }else if (implementation.label === "First Name") {
      return "";
    }
  }

  


  return (
    <GenericForm name={formType} mainPage={'/appointments'} onRenderField={handleRenderField} />
  );
};
