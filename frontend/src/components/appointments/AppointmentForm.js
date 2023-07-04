import React, { useEffect, useState } from 'react';
import GenericForm from "../shared/GenericForm";
import { fetchInternalTypeByFormType } from "../../api/internalTypeApi";
import { AppointmentClientField } from './AppointmentClientField';
import { tr } from 'date-fns/locale';

export default function AppointmentForm() {
  const formType = 'appointment';
  const [internalTypes, setInternalTypes] = useState({});
  const name = { firstName: false, lastName: false }
  useEffect(() => {
    fetchInternalTypeByFormType(formType).then(({ internalTypes }) => {
      const data = {}
      for (const { implementation, name } of internalTypes) {
        data[name] = { implementation }
      }
      console.log('appointment internalTypes', data);
      setInternalTypes(data);
    });
  }, []);

  const handleRenderField = ({ required, id, type, implementation, content, _id }, index, fields, handleChange, step) => {
    console.log('handleRenderField', { required, id, type, implementation, content, _id, index, fields, step });
    if (implementation.optionsFromClass === ":Client") {
      console.log('handleRenderField', {required, id, type, implementation, content, _id});
      return <AppointmentClientField
        handleChange={handleChange} 
        clientFieldId={internalTypes.clientForAppointment.implementation._id}
        step = {step}
      />
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
