import React, {useEffect, useState} from 'react';
import GenericForm from "../shared/GenericForm";
import {fetchCharacteristics} from "../../api/characteristicApi";
import {fetchInternalTypeByFormType} from "../../api/internalTypeApi";
import {ShareabilityField} from "../shared/ShareabilityField";

export default function ProviderForm() {
  const formType = 'service';

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
    console.log(implementation)
    if (implementation.label === "Shareability") {
      const shareabilityFieldId = characteristics['Shareability']?._id;
      const partnerOrganizationsFieldId = internalTypes.partnerOrganizationForService._id;

      if (!shareabilityFieldId || !partnerOrganizationsFieldId) {
        return <Box minWidth={"350px"}><Loading message=""/></Box>;
      }

      return <ShareabilityField handleChange={handleChange} fields={fields}
                                shareabilityFieldId={shareabilityFieldId}
                                partnerOrganizationsFieldId={partnerOrganizationsFieldId}/>;
    } else if (implementation.label === "Partner Organization") {
      return "";
    }
  }

  return (
    <GenericForm name={formType} mainPage={'/services'} onRenderField={handleRenderField}/>
  );
};
