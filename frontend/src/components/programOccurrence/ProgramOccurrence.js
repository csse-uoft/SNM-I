import React, {useEffect, useState} from 'react';
import GenericForm from "../shared/GenericForm";
import {fetchInternalTypeByFormType} from "../../api/internalTypeApi";
import {ProgramAndNeedSatisfierField} from "./ProgramAndNeedSatisfierField";
import {fetchCharacteristics} from '../../api/characteristicApi';
import {CapacityField} from '../shared/CapacityField';

export default function ProgramOccurrenceForm() {
  const formType = 'programOccurrence';

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

  const handleRenderField = ({required, id, type, implementation, content, _id}, index, fields, handleChange) => {
    if (implementation.optionsFromClass?.endsWith("#Program") ) {
      // Render Program & Program Occurrence & Need Satisfier
      return <ProgramAndNeedSatisfierField
        handleChange={handleChange} fields={fields}
        programFieldId={internalTypes.programForProgramOccurrence._id}
        needSatisfierFieldId={internalTypes.needSatisfierForProgramOccurrence._id}/>

    } else if (implementation.optionsFromClass?.endsWith('#NeedSatisfier')) {
      return "";
    } else if (implementation.label === 'Capacity') {
      return <CapacityField fields={fields} handleChange={handleChange}
                            capacityFieldId={characteristics['Capacity']._id} />;
    } else if (implementation.label === 'Occupancy') {
      return ''; // Not editable by the user
    }
  }

  return (
    <GenericForm name={formType} mainPage={'/programOccurrences'} onRenderField={handleRenderField}/>
  );
};
