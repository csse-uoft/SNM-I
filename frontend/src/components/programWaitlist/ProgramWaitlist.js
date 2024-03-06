import React, {useEffect, useState} from 'react';
import GenericForm from "../shared/GenericForm";
import {fetchInternalTypeByFormType} from "../../api/internalTypeApi";
import {ProgramAndNeedSatisfierField} from "../programOccurrence/ProgramAndNeedSatisfierField";

export default function ProgramWaitlistForm() {
  const formType = 'programWaitlist';

  const [internalTypes, setInternalTypes] = useState({});
  useEffect(() => {
    fetchInternalTypeByFormType(formType).then(({internalTypes}) => {
      const data = {}
      for (const {implementation, name, _id} of internalTypes) {
        data[name] = {implementation, _id}
      }
      setInternalTypes(data);
      console.log('programWaitlist internalTypes', data);
    });
  }, []);

  return (
    <GenericForm name={formType} mainPage={'/programWaitlists'}/>
  );
};