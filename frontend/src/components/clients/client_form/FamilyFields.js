import React, { useState } from 'react';
import GeneralField from '../../shared/fields/GeneralField'
import SelectField from '../../shared/fields/SelectField'
import { genderOptions, familyRelationshipOptions } from '../../../store/defaults.js';
import { Paper, Button, FormLabel } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles(theme => ({
  root: {},
  paper: {
    position: 'relative',
    paddingLeft: 28,
    paddingBottom: 20,
    marginBottom: 20,
    width: 380,
  }
}));

function FamilyMemberFields({index, clientId, member, handleRemoveFamily, errMsg = {}}) {
  const classes = useStyles();

  const handleChangeMember = name => e => {
    member.person[name] = e.target.value;
  };

  // What does this mean?
  const disabled = clientId && member.person.id === clientId;
  return (
    <div className={classes.root}>
      <FormLabel component="legend">
        Family Member #{index + 1 + '  '}
        <Button
          disabled={disabled}
          onClick={e => handleRemoveFamily(index)}
          color="secondary"
        >
          Remove
        </Button>
      </FormLabel>
      <Paper variant="outlined" className={classes.paper}>
        <GeneralField
          type="text"
          onChange={handleChangeMember('first_name')}
          value={member.person.first_name}
          label="First name"
          disabled={disabled}
          error={!!errMsg['first_name']}
          helperText={errMsg['first_name']}
        />
        <GeneralField
          type="text"
          value={member.person.last_name}
          onChange={handleChangeMember('last_name')}
          label="Last name"
          disabled={disabled}
          error={!!errMsg['last_name']}
          helperText={errMsg['last_name']}
        />
        <GeneralField
          type="date"
          value={member.person.birth_date}
          onChange={handleChangeMember('birth_date')}
          label="Birth date"
          disabled={disabled}
          error={!!errMsg['birth_date']}
          helperText={errMsg['birth_date']}
        />
        <SelectField
          options={genderOptions}
          value={member.person.gender}
          onChange={handleChangeMember('gender')}
          label="Gender"
          disabled={disabled}
          error={!!errMsg['gender']}
          helperText={errMsg['gender']}
        />
        <SelectField
          options={familyRelationshipOptions}
          value={member.relationship}
          onChange={e => member.relationship = e.target.value}
          label={(clientId && member.person.id === clientId) ? 'Self' : 'Relationship'}
          disabled={disabled}
          error={!!errMsg['relationship']}
          helperText={errMsg['relationship']}
        />
      </Paper>
    </div>
  )
}

export default function FamilyFields({family, clientId, errMsg = {}}) {
  // A way to achieve forceUpdate()
  const [state, update] = useState(true);
  const forceUpdate = () => update(!state);

  const handleAddFamily = () => {
    family.members.push({
      person: {
        first_name: '',
        last_name: '',
        birth_date: null,
        gender: ''
      },
      relationship: ''
    });
    forceUpdate();
  };

  const handleRemoveFamily = (index) => {
    family.members.splice(index, 1);
    forceUpdate();
  };

  return (
    <div>
      {errMsg && typeof errMsg === 'string' &&
        <Alert severity="error">{errMsg}</Alert>}
      {family.members.map((member, index) => {
        return (
          <FamilyMemberFields
            key={index}
            index={index}
            member={member}
            clientId={clientId}
            handleRemoveFamily={handleRemoveFamily}
            errMsg = {errMsg[index]}
          />
        )
      })}
      <Button onClick={handleAddFamily} variant="outlined">
        Add Family Member
      </Button>
    </div>
  );
}
