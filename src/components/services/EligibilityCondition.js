import React, { useEffect, useState } from 'react';
import { Paper, TextField, Grid, Button, IconButton } from "@material-ui/core";
import SelectField from "../shared/fields/SelectField";
import { Add as AddIcon, Delete as DeleteIcon } from '@material-ui/icons'

import { fetchFormulaFields } from "../../api/formulaApi";
import { escapeList, escapeString, titleCase, unescapeList, unescapeString } from "../../helpers/formulaHelpers";
import { eligibilityConditionConfigs, TYPE, defaultConfig, eligibilityConditionHideItems } from "./conditionConfig";
import { educationLevelOptions } from "../../store/defaults";
import MultiSelectField from "../shared/fields/MultiSelectField";


export function CustomEligibilityField({value, handleChange, fields, onDelete}) {

  const [state, setState] = useState({
    operator: value[1] || '', // duplicate state
    ...(eligibilityConditionConfigs[value[0]] || defaultConfig)
  });

  const handleLeftOperandChange = e => {
    const leftOperand = e.target.value;
    const changes = {leftOperand, rightOperand: ''};

    const config = eligibilityConditionConfigs[leftOperand] || defaultConfig;

    const ops = config.operators;
    if (!ops.includes(value[1])) {
      changes.operator = ops[0];
      setState(state => ({...state, operator: ops[0], ...config}));
    } else {
      setState(state => ({...state, ...config}));
    }
    handleChange(changes);
    value[2] = '';
  };
  let rightOperand;
  if (state.type === TYPE.STRING) {
    rightOperand =
      <TextField
        style={{marginLeft: 20}}
        label="Right Operand"
        defaultValue={unescapeString(value[2])}
        onChange={e => handleChange({rightOperand: escapeString(e.target.value)})}/>;
  } else if (state.type === TYPE.NUMBER) {
    rightOperand =
      <TextField
        style={{marginLeft: 20}}
        label="Right Operand"
        defaultValue={typeof + value[2] === "number" ? value[2] : 0}
        onChange={e => handleChange({rightOperand: e.target.value})}/>;
  } else if (state.type === TYPE.LIST && state.multipleSelect) {
    rightOperand =
      <MultiSelectField
        label="Right Operand"
        options={state.options}
        value={unescapeList(value[2]) || []} // warning: this is a list
        onChange={e => handleChange({rightOperand: escapeList(e.target.value)})}
        noDefaultStyle
      />
  } else if (state.type === TYPE.LIST && !state.multipleSelect) {
    rightOperand =
      <SelectField
        style={{marginRight: 20}}
        noEmpty
        noDefaultStyle
        options={state.options}
        value={value[2]} // warning: this is a string
        label="Right Operand"
        onChange={e => handleChange({rightOperand: e.target.value})}/>
  } else {
    rightOperand = 'Not implemented';
  }

  return (
    <div style={{padding: 20}}>
      <Grid container direction="row" spacing={1}>
        <SelectField
          style={{marginRight: 20}}
          noEmpty
          noDefaultStyle
          options={fields}
          value={value[0]}
          label="Field"
          onChange={handleLeftOperandChange}/>
        <SelectField
          style={{width: 60}}
          noEmpty
          noDefaultStyle
          options={state.operators}
          label="Operator"
          value={state.operator}
          controlled
          onChange={e => {
            const operator = e.target.value;
            setState(state => ({...state, operator}));
            handleChange({operator});
          }}/>
        {rightOperand}
        <IconButton onClick={onDelete}>
          <DeleteIcon/>
        </IconButton>
      </Grid>
    </div>
  )
}

export default function EligibilityCondition({value: originalValue, formValChange}) {
  /**
   * @type {[{condition_clauses: [field_name, clauses: [{left_operand, right_operand, operator}]]}]}
   **/
  const [value, setValue] = useState(originalValue);

  const [fields, setFields] = useState({});

  useEffect(() => {
    fetchFormulaFields().then(({fields, dynamic_fields, functions}) => {
      const fieldsObj = {};
      console.log(fields)
      fields.forEach(field => {
        if (!eligibilityConditionHideItems.includes(field))
          fieldsObj[field] = titleCase(field)
      });
      setFields(fieldsObj);
    })
  }, []);

  const handleFieldChange = clause => ({leftOperand, operator, rightOperand}) => {
    clause[0] = leftOperand || clause[0];
    clause[1] = operator === undefined ? clause[1] : operator;
    clause[2] = rightOperand || clause[2];
  };

  const handleAddField = idx => () => {
    setValue(value => {
      value[idx].push(['age', '==', '']);
      formValChange({target: {value}});
      return [...value];
    })
  };

  const handleAddCondition = () => {
    setValue(value => {
      value.push([]);
      formValChange({target: {value}});
      return [...value];
    })
  };

  const handleRemoveField = (conditionIdx, fieldIdx) => () => {
    setValue(value => {
      value[conditionIdx].splice(fieldIdx, 1);
      formValChange({target: {value}});
      return [...value]
    })
  };

  const handleRemoveCondition = (conditionIdx) => () => {
    setValue(value => {
      value.splice(conditionIdx, 1);
      formValChange({target: {value}});
      return [...value]
    })
  };

  const conditionComponents = [];
  for (let conditionIdx = 0; conditionIdx < value.length; conditionIdx++) {
    const condition = value[conditionIdx];
    const field_components = [];
    conditionComponents.push(field_components);

    for (let fieldIdx = 0; fieldIdx < condition.length; fieldIdx++) {
      const [leftOperand, operator, rightOperand] = condition[fieldIdx];
      field_components.push(
        <Grid item xs={12} key={fieldIdx}>
          <CustomEligibilityField
            value={condition[fieldIdx]}
            handleChange={handleFieldChange(condition[fieldIdx])}
            fields={fields}
            onDelete={handleRemoveField(conditionIdx, fieldIdx)}
          />
        </Grid>
      )

    }
  }

  return (
    <div>
      {conditionComponents.map((field_components, idx) =>
        <Paper variant="outlined" key={idx}>
          <Grid container>
            {field_components}
            <Grid item xs={12}>
              <Button
                onClick={handleRemoveCondition(idx)}
                style={{margin: 12, float: 'right'}}
                variant="contained"
                color="default"
                startIcon={<DeleteIcon/>}
              >
                Remove
              </Button>
              <Button
                style={{margin: 12, float: 'right'}}
                variant="contained"
                color="default"
                startIcon={<AddIcon/>}
                onClick={handleAddField(idx)}
              >
                And
              </Button>
            </Grid>
          </Grid>
        </Paper>)}
      <Button
        style={{margin: 12}}
        variant="contained"
        color="default"
        onClick={handleAddCondition}
        startIcon={<AddIcon/>}
      >
        OR
      </Button>
    </div>
  )
}
