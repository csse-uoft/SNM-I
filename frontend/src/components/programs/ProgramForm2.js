import React, {useEffect, useState} from 'react';
import GenericForm from "../shared/GenericForm";
import {fetchCharacteristics} from "../../api/characteristicApi";
import {ShareabilityField} from "../programs/ShareabilityField";

export default function ProviderForm() {
  const formType = 'program';

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

  const handleRenderField = ({required, id, type, implementation, content, _id}, index, fields, handleChange) => {
    console.log(implementation)
    console.log(fields)
    if (implementation.label === "Shareability") {
      const shareabilityFieldId = characteristics['Shareability']?._id;

      if (!shareabilityFieldId) {
        return <Box minWidth={"350px"}><Loading message=""/></Box>;
      }

      return <ShareabilityField handleChange={handleChange} fields={fields}
                                shareabilityFieldId={shareabilityFieldId}/>;
    }
  }

  return (
    <GenericForm name={formType} mainPage={'/programs'} onRenderField={handleRenderField}/>
  );
};
