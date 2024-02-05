import {useEffect, useState} from "react";
import {Loading} from "../shared";
import {getPartnerOrganizations} from "../../api/partnerOrganization";
import SelectField from "../shared/fields/SelectField";
import MultiSelectField from "../shared/fields/MultiSelectField";
import {Fade} from "@mui/material";
import {getInstancesInClass} from "../../api/dynamicFormApi";

export function ShareabilityField({fields, handleChange, shareabilityFieldId, partnerOrganizationsFieldId}) {
  const shareabilityFieldKey = `characteristic_${shareabilityFieldId}`;
  const partnerOrganizationsFieldKey = `internalType_${partnerOrganizationsFieldId}`;

  const [selectedShareability, setSelectedShareability] = useState(fields[shareabilityFieldKey]);
  const [dynamicOptions, setDynamicOptions] = useState({});
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [loadingShareabilities, setLoadingShareabilities] = useState(true);

  const handleChangeShareability = key => (e) => {
    const value = e.target.value;
    setSelectedShareability(value);
    handleChange(key)(e);

    // if the new selectedShareability value is not "Shareable with all organizations", unset the inner field
    if (dynamicOptions[":Shareability"][value] !== "Shareable with all organizations") {
      handleChange(partnerOrganizationsFieldKey)({target: {value: []}});
    }
  }

  useEffect(() => {
    getPartnerOrganizations()
      .then(options => setDynamicOptions(prev => ({...prev, ":Organization": options})))
      .then(() => setLoadingPartners(false));
  }, []);

  useEffect(() => {
    getInstancesInClass(':Shareability')
      .then(options => setDynamicOptions(prev => ({...prev, ":Shareability": options})))
      .then(() => setLoadingShareabilities(false));
  }, []);

  if (loadingPartners || loadingShareabilities) {
    return <Loading />
  }

  return <>
    <SelectField key={shareabilityFieldKey} label="Shareability" required value={fields[shareabilityFieldKey]}
                 options={dynamicOptions[":Shareability"] || {}} onChange={handleChangeShareability(shareabilityFieldKey)}/>
    {dynamicOptions[":Shareability"][selectedShareability] === "Shareable with partner organizations" ?
      <Fade in={dynamicOptions[":Shareability"][selectedShareability] === "Shareable with partner organizations"}>
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
