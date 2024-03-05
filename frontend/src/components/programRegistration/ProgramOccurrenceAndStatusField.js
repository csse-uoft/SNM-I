import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {fetchInternalTypeByFormType} from "../../api/internalTypeApi";
import {ProgramAndOccurrenceAndNeedSatisfierField} from "../programProvision/ProgramAndOccurrenceAndNeedSatisfierField";
import {fetchCharacteristics} from '../../api/characteristicApi';
import {getInstancesInClass} from '../../api/dynamicFormApi';
import {fetchSingleGeneric} from '../../api/genericDataApi';
import {Box, Fade} from '@mui/material';
import {Loading} from '../shared';
import SelectField from '../shared/fields/SelectField';

export default function ProgramOccurrenceAndStatusField({handleChange, fields, serviceOrProgramId, formType}) {
  const {id} = useParams();
  const mode = id ? 'edit' : 'new';
  const [characteristics, setCharacteristics] = useState(null);
  const [internalTypes, setInternalTypes] = useState(null);
  const [allStatusOptions, setAllStatusOptions] = useState(null);
  const programOccurrenceFieldId = internalTypes?.programOccurrenceForProgramRegistration._id;
  const programOccKey = `internalType_${programOccurrenceFieldId}`;
  const statusFieldKey = `characteristic_${characteristics?.['Registration Status']._id}`;
  const [selectedProgramOcc, setSelectedProgramOcc] = useState(null);
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
    setSelectedProgramOcc(fields[programOccKey]);
  }, [internalTypes])

  useEffect(() => {
    if (!selectedProgramOcc || !allStatusOptions || !characteristics) return;
    fetchSingleGeneric('programOccurrence', selectedProgramOcc.split('_')[1])
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
          fetchSingleGeneric('programRegistration', id)
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
  }, [selectedProgramOcc]);

  if (!characteristics || !internalTypes || !statusOptions) {
    return <Box minWidth={"350px"}><Loading message=""/></Box>;
  }

  return <>
    {/* Render Program & Program Occurrence & Need Satisfier */}
    <ProgramAndOccurrenceAndNeedSatisfierField
      handleChange={handleChange} fields={fields}
      programOccurrenceFieldId={programOccurrenceFieldId}
      fixedProgramId={serviceOrProgramId}
      changeProgramOcc={value => setSelectedProgramOcc(value)}/>
    {!!selectedProgramOcc ?
      <Fade in={!!selectedProgramOcc}>
        <div>
          <SelectField key={statusFieldKey} label="Registration Status" required value={fields[statusFieldKey]}
            options={statusOptions} onChange={handleChange(statusFieldKey)}/>
        </div>
      </Fade>
      : null
    }
  </>
}