import React, { useState } from 'react';
import { Button, FormLabel } from '@material-ui/core';
import { FieldsWrapper } from "./index";
import LocationFieldGroup from "./LocationFieldGroup";
import { defaultLocationFields } from "../../constants/default_fields";
import makeStyles from '@material-ui/styles/makeStyles';
import { Alert } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  button: {
    margin: '10px 0',
  }
}));

function LocationFields({index, location, handleRemove, required, errMsg = {}}) {
  // A way to achieve forceUpdate()
  const [state, update] = useState(true);
  const forceUpdate = () => update(!state);

  const handleChange = name => e => {
    location[name] = e.target.value;
  };

  return (
    <div style={{paddingBottom: 10}}>
      <FormLabel component="legend">
        Other address #{index + 1 + '  '}
        <Button
          onClick={e => {
            handleRemove(index);
            forceUpdate();
          }}
          color="secondary"
        >
          Remove
        </Button>
      </FormLabel>
      <FieldsWrapper key="main_address">
        <LocationFieldGroup
          address={location}
          handleChange={handleChange}
          required={required}
          errMsg={errMsg}
        />
      </FieldsWrapper>
    </div>
  )
}

export default function OtherLocationsFields({otherLocations, clientId, required, errMsg = {}}) {
  const classes = useStyles();
  // A way to achieve forceUpdate()
  const [state, update] = useState(otherLocations);
  const forceUpdate = () => update(!state);

  const handleAdd = () => {
    otherLocations.push({...defaultLocationFields});
    forceUpdate();
  };

  const handleRemove = (index) => {
    console.log('remove', index, otherLocations[index])
    otherLocations.splice(index, 1);
    forceUpdate();
  };

  return (
    <div>
      {errMsg && typeof errMsg === 'string' &&
        <Alert severity="error">{errMsg}</Alert>}
      {otherLocations.map((location, index) => {
        return (
          <LocationFields
            key={index}
            index={index}
            location={location}
            clientId={clientId}
            handleRemove={handleRemove}
            required={required}
            size={otherLocations.length}
            errMsg = {errMsg[index]}
          />
        )
      })}
      <Button className={classes.button} onClick={handleAdd} variant="outlined">
        Add other address
      </Button>

    </div>
  );
}
