import React, {useEffect, useState} from 'react';
import GenericForm from "../shared/GenericForm";
import {useParams} from "react-router-dom";
import {fetchInternalTypeByFormType} from "../../api/internalTypeApi";
import {ClientAndNeedOccurrenceField} from "../serviceProvision/ClientAndNeedOccurrenceField";
import {ServiceAndOccurrenceAndNeedSatisfierField} from "../serviceProvision/ServiceAndOccurrenceAndNeedSatisfierField";
import {ProgramAndOccurrenceAndNeedSatisfierField} from "../programProvision/ProgramAndOccurrenceAndNeedSatisfierField";
import {fetchCharacteristics} from '../../api/characteristicApi';
import {Box} from '@mui/material';
import {Loading} from '../shared';
import SelectField from '../shared/fields/SelectField';
import {getInstancesInClass} from '../../api/dynamicFormApi';

export default function ReferralForm() {
  const formType = 'referral';

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
    getInstancesInClass(':ReferralStatus')
      .then(options => setStatusOptions(options));
  }, []);

  const handleRenderField = ({required, id, type, implementation, content, serviceOrProgramId}, index, fields, handleChange) => {
    console.log(implementation)
    if (implementation.optionsFromClass?.endsWith("#Client")) {
      // Render client & need occurrence
      return <ClientAndNeedOccurrenceField handleChange={handleChange} fields={fields}
                                           clientFieldId={internalTypes.clientForReferral._id}
                                           needOccFieldId={internalTypes.needOccurrenceForReferral._id}/>
    } else if (implementation.optionsFromClass?.endsWith("#Service")) {
      const serviceFieldId = internalTypes.serviceForReferral._id;
      const serviceOccurrenceFieldId = internalTypes.serviceOccurrenceForReferral._id;

      if (!serviceFieldId || !serviceOccurrenceFieldId) {
        return <Box minWidth={"350px"}><Loading message=""/></Box>;
      }

      // Render Service & Service Occurrence & Need Satisfier
      return <ServiceAndOccurrenceAndNeedSatisfierField
        handleChange={handleChange} fields={fields}
        serviceFieldId={serviceFieldId}
        serviceOccurrenceFieldId={serviceOccurrenceFieldId}
        fixedServiceId={serviceOrProgramId}/>
    } else if (implementation.optionsFromClass?.endsWith("#Client")) {
      // Render client & need occurrence
      return <ClientAndNeedOccurrenceField handleChange={handleChange} fields={fields}
                                           clientFieldId={internalTypes.clientForReferral._id}
                                           needOccFieldId={internalTypes.needOccurrenceForReferral._id}/>
    } else if (implementation.optionsFromClass?.endsWith("#Program")) {
      const programFieldId = internalTypes.programForReferral._id;
      const programOccurrenceFieldId = internalTypes.programOccurrenceForReferral._id;

      if (!programFieldId || !programOccurrenceFieldId) {
        return <Box minWidth={"350px"}><Loading message=""/></Box>;
      }

      // Render Program & Program Occurrence & Need Satisfier
      return <ProgramAndOccurrenceAndNeedSatisfierField
        handleChange={handleChange} fields={fields}
        programFieldId={programFieldId}
        programOccurrenceFieldId={programOccurrenceFieldId}
        fixedProgramId={serviceOrProgramId}/>
    } else if (implementation.label === "Referral Status") {
      const statusFieldKey = `characteristic_${characteristics['Referral Status']._id}`;
      if (!statusFieldKey || !statusOptions) {
        return <Box minWidth={"350px"}><Loading message=""/></Box>;
      }

      return <SelectField key={statusFieldKey} label="Referral Status" required value={fields[statusFieldKey]}
        options={statusOptions} onChange={handleChange(statusFieldKey)}/>;
    } else if (implementation.optionsFromClass?.endsWith("#NeedOccurrence")) {
      return "";
    } else if (implementation.optionsFromClass?.endsWith("#ServiceOccurrence")) {
      return "";
    } else if (implementation.optionsFromClass?.endsWith("#ProgramOccurrence")) {
      return "";
    }
  }
  return (
    <GenericForm name={'referral'} mainPage={'/referrals'} onRenderField={handleRenderField}/>
  );
};
