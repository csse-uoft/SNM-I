import React, {useEffect, useState} from 'react';
import GenericForm from "../shared/GenericForm";
import {fetchInternalTypeByFormType} from "../../api/internalTypeApi";
import {ServiceAndNeedSatisfierField} from "../serviceOccurrence/ServiceAndNeedSatisfierField";

export default function ServiceWaitlistForm() {
  const formType = 'serviceWaitlist';

  const [internalTypes, setInternalTypes] = useState({});
  useEffect(() => {
    fetchInternalTypeByFormType(formType).then(({internalTypes}) => {
      const data = {}
      for (const {implementation, name, _id} of internalTypes) {
        data[name] = {implementation, _id}
      }
      setInternalTypes(data);
      console.log('serviceWaitlist internalTypes', data);
    });
  }, []);

  return (
    <GenericForm name={formType} mainPage={'/serviceWaitlists'}/>
  );
};