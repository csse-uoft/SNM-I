import React, { useEffect, useState } from 'react';
import GenericForm from "../shared/GenericForm";
import { fetchInternalTypeByFormType } from "../../api/internalTypeApi";
import { AppointmentClientField } from './AppointmentClientField';
import { tr } from 'date-fns/locale';

export default function AppointmentForm() {
  const formType = 'appointment';
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

  const handleRenderField = ({ required, id, type, implementation, content, _id }, index, fields, handleChange, step) => {
    if (implementation.optionsFromClass === ":Client") {
      return <AppointmentClientField
        handleChange={handleChange} 
        clientFieldId={internalTypes.clientForAppointment._id}
        step = {step}
        fields={fields}
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
