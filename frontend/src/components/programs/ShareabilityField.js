import {useEffect, useState} from "react";
import SelectField from "../shared/fields/SelectField";
import {Box, Fade} from "@mui/material";

export function ShareabilityField({fields, handleChange, shareabilityFieldId}) {
  const shareabilityFieldKey = `characteristic_${shareabilityFieldId}`;

  const [selectedShareability, setSelectedShareability] = useState(fields[shareabilityFieldKey]);

  const handleChangeShareability = key => (e) => {
    const value = e.target.value;
    setSelectedShareability(value);
    handleChange(key)(e);
  }

  const options = {
    "Shareable with partner organizations": 'Shareable with partner organizations',
    "Shareable with all organizations": 'Shareable with all organizations',
    "Not shareable": "Not shareable"
  };

  return <>
    <SelectField key={shareabilityFieldKey} label="Shareability" required value={fields[shareabilityFieldKey]}
                 options={options} onChange={handleChangeShareability(shareabilityFieldKey)}/>
  </>
}
