import React, { useEffect, useState } from 'react';
import GenericForm from "../shared/GenericForm";
import { fetchInternalTypeByFormType } from "../../api/internalTypeApi";
// Using the component from `Appointment` to render the client field
// This simplifies the code and makes no difference in performance
import { AppointmentClientField } from '../appointments/AppointmentClientField';

export default function ClientAssessmentForm() {

  const formType = 'clientAssessment';
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

  const handleRenderField = ({ required, id, type, implementation, content, _id }, index, fields, handleChange) => {
    // If the field is not required and the user has not filled it, do not render it
    if (implementation === undefined) {
      return "";
    }
    if (implementation.optionsFromClass?.endsWith("#Client")) {
      // Using the component from `Appointment`
      return <AppointmentClientField
        handleChange={handleChange}
        clientFieldId={internalTypes.clientForClientAssessment._id}
        fields={fields}
      />
    } else if (implementation.label === "Last Name") {
      return "";
    } else if (implementation.label === "First Name") {
      return "";
    }
  }

  return (
    <GenericForm name={formType} mainPage={'/clientAssessment'} onRenderField={handleRenderField} />
  );

};
