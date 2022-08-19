import React, { useEffect, useState } from 'react';
import GeneralField from './fields/GeneralField';
import SelectField from './fields/SelectField';
import { provinceOptions } from '../../store/defaults';
import { Divider, Box, Typography, Grid, TextField, FormControl, Paper, Autocomplete } from "@mui/material";
import { getInstancesInClass } from "../../api/dynamicFormApi";
import { createFilterOptions } from '@mui/material/Autocomplete';

export default function AddressField({value: defaultValue, required, onChange, label}) {

  const [state, setState] = useState(defaultValue || {});

  const [options, setOptions] = useState({streetType: {}, streetDirection: {}, state: {}});

  const filterOptions = createFilterOptions({
    ignoreAccents: false,
    matchFrom: 'start'
  });

  useEffect(() => {
    getInstancesInClass('ic:StreetType')
      .then(streetType => {
        setOptions(options => ({...options, streetType}));
      });
    getInstancesInClass('ic:StreetDirection')
      .then(streetDirection => {
        setOptions(options => ({...options, streetDirection}));
      });
    getInstancesInClass('schema:State')
      .then(state => {
        setOptions(options => ({...options, state}));
      });
  }, []);

  const handleChange = name => (e, value) => {
    state[name] = value ?? e.target.value;
    onChange(state);
  }

  return (
    <Paper variant="outlined" sx={{mt: 3, mb: 3, p: 2.5, borderRadius: 2}}>
      <Typography variant="h5">{label} {required ? '*' : ''}</Typography>

      <Grid container columnSpacing={2}>
        <Grid item xs={3}>
          <TextField
            sx={{mt: 2}}
            fullWidth
            label="Unit/Apt/Suit #"
            type="text"
            value={state.aptNumber}
            onChange={handleChange('unitNumber')}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            sx={{mt: 2}}
            fullWidth
            label="Street number"
            type="text"
            value={state.aptNumber}
            onChange={handleChange('streetNumber')}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            sx={{mt: 2}}
            fullWidth
            label="Street name"
            type="text"
            value={state.streetAddress}
            onChange={handleChange('streetName')}
            required={required}
          />
        </Grid>
        <Grid item xs={6}>
          <Autocomplete
            sx={{mt: 2}}
            options={Object.keys(options.streetType)}
            getOptionLabel={(key) => options.streetType[key]}
            fullWidth
            value={state.streetAddress}
            onChange={handleChange('streetType')}
            filterOptions={filterOptions}
            renderInput={(params) => <TextField {...params} label="Street type"/>}
            loading={Object.keys(options.streetType).length === 0}
          />
        </Grid>
        <Grid item xs={6}>
          <Autocomplete
            sx={{mt: 2}}
            options={Object.keys(options.streetDirection)}
            getOptionLabel={(key) => options.streetDirection[key]}
            fullWidth
            value={state.streetDirection}
            onChange={handleChange('streetDirection')}
            filterOptions={filterOptions}
            renderInput={(params) => <TextField {...params} label="Street direction"/>}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            sx={{mt: 2}}
            fullWidth
            label="City"
            type="text"
            value={state.city}
            onChange={handleChange('city')}
            required={required}
          />
        </Grid>
        <Grid item xs={6}>
          <Autocomplete
            sx={{mt: 2}}
            options={Object.keys(options.state)}
            getOptionLabel={(key) => options.state[key]}
            fullWidth
            value={state.state}
            onChange={handleChange('state')}
            filterOptions={filterOptions}
            renderInput={(params) => <TextField {...params} label="Province"/>}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            sx={{mt: '16px'}}
            fullWidth
            label="Postal Code"
            type="text"
            value={state.postalCode}
            onChange={handleChange('postalCode')}
            required={required}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
