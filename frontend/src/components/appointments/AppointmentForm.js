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

  /*
  * This function is used to render the field
  * It will check if the implementation is from client, if yes then it will render the AppointmentClientField
  * It will also check if the implementation is last name or first name, if yes then it will not render the field (to make sure that the corresponding text field is not rendered)
  */
  const handleRenderField = ({ required, id, type, implementation, content, _id }, index, fields, handleChange) => {
    if (implementation.optionsFromClass?.endsWith("#Client")) {
      return <AppointmentClientField
        handleChange={handleChange}
        clientFieldId={internalTypes.clientForAppointment._id}
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
