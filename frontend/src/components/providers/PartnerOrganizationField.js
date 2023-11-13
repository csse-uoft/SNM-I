import {useEffect, useState} from "react";
import FieldGroup from '../shared/FieldGroup';

export function PartnerOrganizationField({
                  fields,
                  isPartnerFieldId,
                  endpointUrlFieldId,
                  endpointPortFieldId,
                  apiKeyFieldId,
                  handleChange
                }) {
  const isPartnerFieldKey = `characteristic_${isPartnerFieldId}`;
  const endpointUrlFieldKey = `characteristic_${endpointUrlFieldId}`;
  const endpointPortFieldKey = `characteristic_${endpointPortFieldId}`;
  const apiKeyFieldKey = `characteristic_${apiKeyFieldId}`;

  const [isPartner, setIsPartner] = useState(fields[isPartnerFieldKey] || false);

  const handleChangeIsPartner = key => (e) => {
    const value = e.target.value;
    setIsPartner(value);
    handleChange(key)(e);

    // if the new isPartner value is false, unset the three inner fields
    if (!value) {
      handleChange(endpointUrlFieldKey)({target: {value: ''}});
      handleChange(endpointPortFieldKey)({target: {value: ''}});
      handleChange(apiKeyFieldKey)({target: {value: ''}});
    }
  }

  return <>
    <FieldGroup component={'BooleanRadioField'} key={isPartnerFieldKey}
                label="Partner Organization?" required value={fields[isPartnerFieldKey]}
                onChange={handleChangeIsPartner(isPartnerFieldKey)} controlled/>
    {isPartner ?
      <div>
        <FieldGroup component={'TextField'} key={endpointUrlFieldKey}
                    label="Endpoint URL" required value={fields[endpointUrlFieldKey]}
                    onChange={handleChange(endpointUrlFieldKey)}/>
        <FieldGroup component={'NumberField'} key={endpointPortFieldKey}
                    label="Endpoint Port Number" required value={fields[endpointPortFieldKey]}
                    onChange={handleChange(endpointPortFieldKey)}/>
        <FieldGroup component={'TextField'} key={apiKeyFieldKey}
                    label="API Key" required value={fields[apiKeyFieldKey]}
                    onChange={handleChange(apiKeyFieldKey)}/>
      </div>
      : null
    }
  </>
}
