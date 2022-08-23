import SelectField from "../../shared/fields/SelectField";
import React, { useCallback, useEffect, useState } from "react";
import { Grid, Button } from "@mui/material";

export function Picker({onChange, options, usedOptionKeys, onAdd, disabledAdd, label}) {

  const [value, setValue] = useState('');
  const [displayOptions, setDisplayOptions] = useState([]);

  useEffect(() => {
    const displayOptions = {...options};
    usedOptionKeys.forEach(key => delete displayOptions[key]);
    setDisplayOptions(displayOptions)
  }, [options, usedOptionKeys])

  const handleChange = useCallback((e) => {
    const value = e.target.value
    setValue(value);
    onChange(value)
  }, [onChange]);

  const handleAdd = useCallback(() => {
    setValue('');
    onAdd();
  }, [onAdd]);

  return (
    <Grid container alignItems="flex-end" spacing={2}>
      <Grid item xs={10}>
        <SelectField
          label={"Choose " + label}
          value={value}
          onChange={handleChange}
          options={displayOptions}
          noDefaultStyle
          formControlProps={{fullWidth: true}}
          noEmpty
          controlled
        />
      </Grid>
      <Grid item sm={2}>
        <Button variant="outlined" color="primary" onClick={handleAdd}
                disabled={disabledAdd}>
          Add
        </Button>
      </Grid>
    </Grid>
  )
}