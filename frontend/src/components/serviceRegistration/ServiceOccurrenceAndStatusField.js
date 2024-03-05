import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {fetchInternalTypeByFormType} from "../../api/internalTypeApi";
import {ServiceAndOccurrenceAndNeedSatisfierField} from "../serviceProvision/ServiceAndOccurrenceAndNeedSatisfierField";
import {fetchCharacteristics} from '../../api/characteristicApi';
import {getInstancesInClass} from '../../api/dynamicFormApi';
import {fetchSingleGeneric} from '../../api/genericDataApi';
import {Box, Fade} from '@mui/material';
import {Loading} from '../shared';
import SelectField from '../shared/fields/SelectField';

export default function ServiceOccurrenceAndStatusField({handleChange, fields, serviceOrProgramId, formType}) {
  const {id} = useParams();
  const mode = id ? 'edit' : 'new';
  const [characteristics, setCharacteristics] = useState(null);
  const [internalTypes, setInternalTypes] = useState(null);
  const [allStatusOptions, setAllStatusOptions] = useState(null);
  const serviceOccurrenceFieldId = internalTypes?.serviceOccurrenceForServiceRegistration._id;
  const serviceOccKey = `internalType_${serviceOccurrenceFieldId}`;
  const statusFieldKey = `characteristic_${characteristics?.['Registration Status']._id}`;
  const [selectedServiceOcc, setSelectedServiceOcc] = useState(null);
  const [statusOptions, setstatusOptions] = useState(null);

  useEffect(() => {
    fetchCharacteristics().then(characteristics => {
      const data = {};
      for (const {implementation, name, _id} of characteristics.data) {
        data[name] = {implementation, _id}
      }
      setCharacteristics(data);
    });
  }, []);

  useEffect(() => {
    fetchInternalTypeByFormType(formType).then(({internalTypes}) => {
      const data = {}
      for (const {implementation, name, _id} of internalTypes) {
        data[name] = {implementation, _id}
      }
      setInternalTypes(data);
    });
  }, []);

  useEffect(() => {
    getInstancesInClass(':RegistrationStatus')
      .then(options => setAllStatusOptions(options));
  }, []);

  useEffect(() => {
    setSelectedServiceOcc(fields[serviceOccKey]);
  }, [internalTypes])

  useEffect(() => {
    if (!selectedServiceOcc || !allStatusOptions || !characteristics) return;
    fetchSingleGeneric('serviceOccurrence', selectedServiceOcc.split('_')[1])
      .then(occ => {
        const occupancy = occ.data[`characteristic_${characteristics['Occupancy']._id}`];
        const capacity = occ.data[`characteristic_${characteristics['Capacity']._id}`];
        const hasCapacity = (capacity == null) || (occupancy < capacity);

        const registeredUri = Object.keys(allStatusOptions).find(uri => allStatusOptions[uri] === 'Registered');
        const notRegisteredUri = Object.keys(allStatusOptions).find(uri => allStatusOptions[uri] === 'Not registered');
        const waitlistedUri = Object.keys(allStatusOptions).find(uri => allStatusOptions[uri] === 'Waitlisted');

        let options = {};
        if (mode === 'new') {
          if (hasCapacity) {
            options[registeredUri] = 'Register immediately';
            options[notRegisteredUri] = 'Save without registering';
          } else {
            options[waitlistedUri] = 'Waitlist';
            options[notRegisteredUri] = 'Save without waitlisting';
          }
          setstatusOptions(options);
        } else {
          fetchSingleGeneric('serviceRegistration', id)
            .then(reg => {
              const status = reg.data[`characteristic_${characteristics['Registration Status']._id}`];
              if (status === 'Registered') {
                options[registeredUri] = 'Remain registered';
                options[notRegisteredUri] = 'Unregister';
              } else if (status === 'Waitlisted') {
                options[waitlistedUri] = 'Remain waitlisted';
                options[notRegisteredUri] = 'Withdraw from waitlist';
              } else {
                // If updating a not-registered registration, options are the same as when creating a new registration
                if (hasCapacity) {
                  options[registeredUri] = 'Register immediately';
                  options[notRegisteredUri] = 'Save without registering';
                } else {
                  options[waitlistedUri] = 'Waitlist';
                  options[notRegisteredUri] = 'Save without waitlisting';
                }
              }
              setstatusOptions(options);
            });
        }
      });
  }, [selectedServiceOcc]);

  if (!characteristics || !internalTypes || !statusOptions) {
    return <Box minWidth={"350px"}><Loading message=""/></Box>;
  }

  return <>
    {/* Render Service & Service Occurrence & Need Satisfier */}
    <ServiceAndOccurrenceAndNeedSatisfierField
      handleChange={handleChange} fields={fields}
      serviceOccurrenceFieldId={serviceOccurrenceFieldId}
      fixedServiceId={serviceOrProgramId}
      changeServiceOcc={value => setSelectedServiceOcc(value)}/>
    {!!selectedServiceOcc ?
      <Fade in={!!selectedServiceOcc}>
        <div>
          <SelectField key={statusFieldKey} label="Registration Status" required value={fields[statusFieldKey]}
            options={statusOptions} onChange={handleChange(statusFieldKey)}/>
        </div>
      </Fade>
      : null
    }
  </>
}