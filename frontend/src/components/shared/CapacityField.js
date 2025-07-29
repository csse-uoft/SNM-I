import React from "react";
import {useState} from "react";
import SelectField from "../shared/fields/SelectField";
import {Fade} from "@mui/material";
import FieldGroup from "./FieldGroup";

export function CapacityField({fields, handleChange, capacityFieldId}) {
  const capacityFieldKey = `characteristic_${capacityFieldId}`;
  const [isCapacityLimited, setIsCapacityLimited] = useState(typeof fields[capacityFieldKey] !== 'undefined'
                                                             ? 'Yes' : 'No');

  const handleChangeCapacity = e => {
    const value = e.target.value;
    setIsCapacityLimited(value);

    // if the new isCapacityLimited value is No, unset the inner field
    if (value === 'No') {
      handleChange(capacityFieldKey)(null);
    }
  }

  return <>
    <SelectField key={capacityFieldKey} label="Is Capacity Limited?" required value={isCapacityLimited}
                 options={['Yes', 'No']} onChange={e => handleChangeCapacity(e)}/>
    {isCapacityLimited === "Yes"
      ? <Fade in={isCapacityLimited === "Yes"}>
        <div>
          <FieldGroup component={'NumberField'} key={capacityFieldKey}
                      label={'Capacity'} required inputProps={{min: 0}}
                      value={fields[capacityFieldKey]} onChange={handleChange(capacityFieldKey)}/>
        </div>
      </Fade>
      : null
    }
  </>
}
