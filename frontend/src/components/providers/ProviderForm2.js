import React, {useEffect, useState} from 'react';
import {Loading} from "../shared";
import GenericForm from "../shared/GenericForm";
import {fetchCharacteristics} from "../../api/characteristicApi";
import {Box} from "@mui/material";
import {useParams} from "react-router-dom";
import {PartnerOrganizationField} from "./PartnerOrganizationField";

export default function ProviderForm() {
  const {formType} = useParams();

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
    if (formType === 'organization') {
      if (implementation.label === "Partner Organization?") {
        const isPartnerFieldId = characteristics['Partner Organization?']?._id;
        const endpointUrlFieldId = characteristics['Endpoint URL']?._id;
        const endpointPortFieldId = characteristics['Endpoint Port Number']?._id;
        const apiKeyFieldId = characteristics['API Key']?._id;

        if (!isPartnerFieldId || !endpointUrlFieldId || !endpointPortFieldId || !apiKeyFieldId) {
          return <Box minWidth={"350px"}><Loading message=""/></Box>;
        }

        return <PartnerOrganizationField handleChange={handleChange} fields={fields}
                                         isPartnerFieldId={isPartnerFieldId}
                                         endpointUrlFieldId={endpointUrlFieldId}
                                         endpointPortFieldId={endpointPortFieldId}
                                         apiKeyFieldId={apiKeyFieldId}/>;
      } else if (["Endpoint URL", "Endpoint Port Number", "API Key"].includes(implementation.label)) {
        return "";
      }
    }
  }

  return (
    <GenericForm name={formType} mainPage={'/providers'} isProvider onRenderField={handleRenderField}/>
  );
};
