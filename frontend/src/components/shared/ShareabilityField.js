import {useEffect, useState} from "react";
import {Loading} from "../shared";
import {getPartnerOrganizations} from "../../api/partnerOrganization";
import SelectField from "../shared/fields/SelectField";
import MultiSelectField from "../shared/fields/MultiSelectField";
import {Box, Fade} from "@mui/material";

export function ShareabilityField({fields, handleChange, shareabilityFieldId, partnerOrganizationsFieldId}) {
  const shareabilityFieldKey = `characteristic_${shareabilityFieldId}`;
  const partnerOrganizationsFieldKey = `internalType_${partnerOrganizationsFieldId}`;

  const [selectedShareability, setSelectedShareability] = useState(fields[shareabilityFieldKey] || "Not shareable");
  const [dynamicOptions, setDynamicOptions] = useState({});
  const [loading, setLoading] = useState(true);

  const handleChangeShareability = key => (e) => {
    const value = e.target.value;
    setSelectedShareability(value);
    handleChange(key)(e);

    // if the new selectedShareability value is not "Shareable with all organizations", unset the inner field
    if (value !== "Shareable with all organizations") {
      handleChange(partnerOrganizationsFieldKey)({target: {value: []}});
    }
  }

  useEffect(() => {
    getPartnerOrganizations()
      .then(options => setDynamicOptions(prev => ({...prev, ":Organization": options})))
      .then(() => setLoading(false));
  }, []);

  const options = {
    "Shareable with partner organizations": 'Shareable with partner organizations',
    "Shareable with all organizations": 'Shareable with all organizations',
    "Not shareable": "Not shareable"
  };

  if (loading) {
    return <Loading />
  }

  return <>
    <SelectField key={shareabilityFieldKey} label="Shareability" required value={fields[shareabilityFieldKey]}
                 options={options} onChange={handleChangeShareability(shareabilityFieldKey)}/>
    {selectedShareability === "Shareable with partner organizations" ?
      <Fade in={selectedShareability === "Shareable with partner organizations"}>
        <div>
          <MultiSelectField key={partnerOrganizationsFieldKey} label="Partner organizations to share with" required
                            value={fields[partnerOrganizationsFieldKey]} options={dynamicOptions[":Organization"] || {}}
                            onChange={handleChange(partnerOrganizationsFieldKey)} controlled/>
        </div>
      </Fade>
      : null
    }
  </>
}
