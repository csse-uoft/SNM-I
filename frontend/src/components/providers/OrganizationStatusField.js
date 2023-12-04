import {useEffect, useState} from "react";
import FieldGroup from "../shared/FieldGroup";
import SelectField from "../shared/fields/SelectField";

export function OrganizationStatusField({
                  fields,
                  statusFieldId,
                  endpointUrlFieldId,
                  endpointPortFieldId,
                  apiKeyFieldId,
                  handleChange
                }) {
  const statusFieldKey = `characteristic_${statusFieldId}`;
  const endpointUrlFieldKey = `characteristic_${endpointUrlFieldId}`;
  const endpointPortFieldKey = `characteristic_${endpointPortFieldId}`;
  const apiKeyFieldKey = `characteristic_${apiKeyFieldId}`;

  const [status, setStatus] = useState(fields[statusFieldKey] === undefined ? null : fields[statusFieldKey]);

  const handleChangeStatus = key => (e) => {
    const value = e.target.value;
    setStatus(value);
    handleChange(key)(e);

    // if the new status value is not 'Partner' or 'Home', unset the three inner fields
    if (!(["Partner", "Home"].includes(value))) {
      handleChange(endpointUrlFieldKey)({target: {value: ''}});
      handleChange(endpointPortFieldKey)({target: {value: ''}});
      handleChange(apiKeyFieldKey)({target: {value: ''}});
    }
  }

  const options = {
    "Home": "Home",
    "Partner": "Partner",
    "Other": "Other",
  };

  return <>
    <SelectField key={statusFieldKey} label="Organization Status" required value={fields[statusFieldKey]}
                 options={options} onChange={handleChangeStatus(statusFieldKey)}/>
    {fields[statusFieldKey] === "Partner" ?
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
    {fields[statusFieldKey] === "Home" ?
      <div>
        <FieldGroup component={'TextField'} key={apiKeyFieldKey}
                    label="API Key" required value={fields[apiKeyFieldKey]}
                    onChange={handleChange(apiKeyFieldKey)}/>
      </div>
      : null
    }
  </>
}
