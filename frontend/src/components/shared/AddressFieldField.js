import React, { useEffect, useState } from 'react';
import { Autocomplete, CircularProgress, Grid, Paper, TextField, Typography } from "@mui/material";
import { getInstancesInClass } from "../../api/dynamicFormApi";
import { createFilterOptions } from '@mui/material/Autocomplete';


const filterOptions = createFilterOptions({
  ignoreAccents: false,
  matchFrom: 'start'
});

function LoadingAutoComplete({label, options, property, state, onChange}) {
  const loading = Object.keys(options[property]).length === 0;
  return (
    <Autocomplete
      sx={{mt: 2}}
      options={Object.keys(options[property])}
      getOptionLabel={(key) => options[property][key]}
      fullWidth
      value={loading ? null : state[property]}
      onChange={onChange(property)}
      filterOptions={filterOptions}
      renderInput={(params) =>
        <TextField
          {...params}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
          label={label}
        />
      }
      loading={loading}
    />
  );
}

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
  };

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
            value={state.unitNumber}
            onChange={handleChange('unitNumber')}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            sx={{mt: 2}}
            fullWidth
            label="Street number"
            type="text"
            value={state.streetNumber}
            onChange={handleChange('streetNumber')}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            sx={{mt: 2}}
            fullWidth
            label="Street name"
            type="text"
            value={state.streetName}
            onChange={handleChange('streetName')}
            required={required}
          />
        </Grid>
        <Grid item xs={6}>
          <LoadingAutoComplete
            label="Street type"
            options={options}
            property={'streetType'}
            state={state}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <LoadingAutoComplete
            label="Street direction"
            options={options}
            property={'streetDirection'}
            state={state}
            onChange={handleChange}
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
          <LoadingAutoComplete
            label="Province"
            options={options}
            property={'state'}
            state={state}
            onChange={handleChange}
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
