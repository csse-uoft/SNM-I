import React, {useEffect, useState} from "react";
import {Add as AddIcon, Delete as DeleteIcon} from '@mui/icons-material'
import {Box, Button, CircularProgress, Divider, Grid, IconButton, Paper, TextField, Typography} from "@mui/material";
import SelectField from "./SelectField";
import Dropdown from "./MultiSelectField";
import {escapeString, escapeRegExp} from "../../../helpers/formulaHelpers";
import {useEligibilityAPIs} from "../../../api/eligibilityApi";
import FieldGroup from "../FieldGroup";
import {useDebounceEffect} from "../hooks/useDebounce";

const FieldTypes = {
  TextField: 'TextField',
  NumberField: 'NumberField',
  BooleanRadioField: 'BooleanRadioField',

  DateField: 'DateField',
  DateTimeField: 'DateTimeField',
  TimeField: 'TimeField',

  MultiSelectField: 'MultiSelectField',
  SingleSelectField: 'SingleSelectField',
  RadioSelectField: 'RadioSelectField',
}

const ArrayOps = {
  ANY_IN: 'Any In',
  ALL_IN: 'All In (Subset of)',
  INCLUDES_ALL: 'Includes All',
  INCLUDES_ANY: 'Includes Any',
  EQUALS: '=='
}

const compareOps = ['<', '>', '<=', '>=', '=='];
const arrayOps = Object.values(ArrayOps);
const stringOps = ['==', 'match'];
const booleanOps = ['==']


/**
 *
 * @param {{label: string, namel: string, description: string, fieldType: string, options: {}}} characteristic
 */
function getConfigByCharacteristic(characteristic) {
  const config = {
    label: characteristic.label,
    description: characteristic.description,
    operators: compareOps,
    type: characteristic.fieldType,
    options: characteristic.options || []
  }
  switch (characteristic.fieldType) {
    case FieldTypes.TextField:
      config.operators = stringOps;
      config.toFormula = (left, operator, right) => {
        if (operator === "==") {
          return `${left} == ${escapeString(right)}`
        } else if (operator === "match") {
          // Pass the regex as a string
          return `StringMatch(${left}, ${escapeString(right)})`
        } else {
          throw Error("Should not reach here: " + operator)
        }
      }
      break;
    case FieldTypes.BooleanRadioField:
      config.operators = booleanOps;
      config.options = {
        true: 'True',
        false: 'False'
      }
      break;

    case FieldTypes.RadioSelectField:
    case FieldTypes.SingleSelectField:
      config.operators = ['=='];
      break;
    case FieldTypes.MultiSelectField:
      config.operators = arrayOps;
      config.toFormula = (left, operator, right) => {
        const rightAsArray = `[${right.map(s => escapeString(s)).join(', ')}]`;
        if (operator === ArrayOps.ANY_IN) {
          return `ArrayIncludesAny(${rightAsArray}, ${left})`
        } else if (operator === ArrayOps.ALL_IN) {
          return `ArrayIncludesAll(${rightAsArray}, ${left})`
        }  else if (operator === ArrayOps.INCLUDES_ANY) {
          return `ArrayIncludesAny(${left}, ${rightAsArray})`
        }  else if (operator === ArrayOps.INCLUDES_ALL) {
          return `ArrayIncludesAll(${left}, ${rightAsArray})`
        } else if (operator === '==') {
          return `ArrayEquals(${left}, ${rightAsArray})`
        } else {
          throw Error("Should not reach here: " + operator)
        }
      }
      break;
  }
  return config;
}

function getFormatter(type) {
  let formatter;
  if ([FieldTypes.DateField, FieldTypes.TimeField, FieldTypes.DateTimeField].includes(type)) {
    formatter = v => Number(new Date(v));
  } else if (type === FieldTypes.BooleanRadioField) {
    formatter = v => v === 'True';
  } else if (type === FieldTypes.NumberField) {
    formatter = v => Number(v);
  } else if (type === FieldTypes.MultiSelectField) {
    formatter = v => `[${v.map(s => escapeString(s)).join(', ')}]`;
  } else {
    // text field, single select
    formatter = v => escapeString(v);
  }
  return formatter;
}

/**
 *
 * @param {[leftOperand: string, operator: string, rightOperand: string]} value
 * @param handleChange
 * @param fields
 * @param onDelete
 * @returns {JSX.Element}
 * @constructor
 */
export function CustomEligibilityField({value, handleChange, fields, onDelete}) {

  const [state, setState] = useState({
    ...(value[0] ? getConfigByCharacteristic(fields[value[0]]) : {}),
    operator: value[1] ?? '',
  });

  const handleLeftOperandChange = e => {
    const leftOperand = e.target.value;
    const changes = {leftOperand, rightOperand: ''};

    const config = getConfigByCharacteristic(fields[leftOperand]);

    const ops = config.operators;
    if (!ops.includes(value[1])) {
      changes.operator = ops[0];
      setState(state => ({...state, operator: ops[0], ...config}));
    } else {
      setState(state => ({...state, ...config}));
    }
    handleChange(changes);
    value[2] = undefined;
  }

  let rightOperandComponent;
  if (state.type) {
    rightOperandComponent = <FieldGroup component={state.type} label={"Right Operand"} required
                                        options={state.options} value={value[2] || undefined}
                                        onChange={e => handleChange({rightOperand: e.target.value})}/>;
  }
  return (
    <div style={{padding: 20}}>
      {/*<Grid container direction="row" spacing={1}>*/}
      {/*  <Grid item>*/}
      <Grid container alignItems='center' justifyContent='flex-start'>
        <Grid item>
          <SelectField
            controlled
            options={Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v.label])) || {}}
            value={value[0] || null}
            label="Field"
            onChange={handleLeftOperandChange}/>
        </Grid>
        <Grid item>
          <IconButton onClick={onDelete} size="large" sx={{mt: 2}} color="secondary">
            <DeleteIcon/>
          </IconButton>
        </Grid>
      </Grid>
      {/*</Grid>*/}
      {/*<Grid item>*/}
      {state.operators?.length &&
        <SelectField
          controlled
          sx={{maxWidth: 60}}
          options={state.operators || {}}
          label="Operator"
          value={state.operator || state.operators[0] || null}
          onChange={e => {
            const operator = e.target.value;
            setState(state => ({...state, operator}));
            handleChange({operator});
          }}/>
      }
      {/*</Grid>*/}
      {/*<Grid item>*/}
      {rightOperandComponent}
      {/*</Grid>*/}

      {/*</Grid>*/}
    </div>
  )
}


export default function EligibilityField({value: defaultValue, required, onChange, label, disabled}) {
  /**
   * @type {[{condition_clauses: [field_name, clauses: [{left_operand, right_operand, operator}]]}]}
   **/
  const [value, setValue] = useState(defaultValue?.formulaJSON || []);
  const [description, setDescription] = useState(defaultValue?.description || '');
  const [fields, setFields] = useState({});
  const [loading, setLoading] = useState(true);

  const {fetchEligibilityConfig} = useEligibilityAPIs();

  useDebounceEffect(() => {
    if (loading) {
      return;
    }
    const eligibility = {
      formula: '',
      formulaJSON: value.map(disjunctions => disjunctions.map(([a, b, c]) => [a, b, c])),
      description,
    }
    let formula = [];
    for (const disjunctions of value) {
      let inner = [];
      for (const [left, operator, right] of disjunctions) {
        if (left == null || right == null) continue;
        const config = getConfigByCharacteristic(fields[left]);
        const formatter = getFormatter(config.type);
        if (config.toFormula) {
          inner.push(config.toFormula(left, operator, right));
        } else {
          inner.push(`${left} ${operator} ${formatter(right)}`);
        }
      }
      if (inner.length > 0) formula.push(inner.join(' && '));
    }
    eligibility.formula = formula.join(' || ');
    console.log(eligibility)
    onChange({target: {value: eligibility}});
  }, [value], 200);

  useEffect(() => {
    fetchEligibilityConfig().then(({data}) => {
      setFields(data);
      setLoading(false);
    })
  }, []);

  const handleFieldChange = clause => ({leftOperand, operator, rightOperand}) => {
    clause[0] = leftOperand ?? clause[0];
    clause[1] = operator ?? clause[1];
    clause[2] = rightOperand ?? clause[2];
    setValue(value => ([...value]));
  };

  const handleAddField = idx => () => {
    setValue(value => {
      value[idx].push([undefined, '==', undefined, new Date().getTime()]);
      onChange({target: {value}});
      return [...value];
    })
  };

  const handleAddCondition = () => {
    setValue(value => {
      value.push([]);
      onChange({target: {value}});
      return [...value];
    })
  };

  const handleRemoveField = (conditionIdx, fieldIdx) => () => {
    setValue(value => {
      value[conditionIdx].splice(fieldIdx, 1);
      onChange({target: {value}});
      return [...value]
    })
  };

  const handleRemoveCondition = (conditionIdx) => () => {
    setValue(value => {
      value.splice(conditionIdx, 1);
      onChange({target: {value}});
      return [...value]
    })
  };

  const conditionComponents = [];
  if (!loading) {
    for (let conditionIdx = 0; conditionIdx < value.length; conditionIdx++) {
      const condition = value[conditionIdx];
      const field_components = [];
      conditionComponents.push(field_components);

      for (let fieldIdx = 0; fieldIdx < condition.length; fieldIdx++) {
        const [leftOperand, operator, rightOperand, key] = condition[fieldIdx];
        field_components.push(
          <Grid item xs={12} key={key || fieldIdx}>
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
  }

  if (loading) {
    return <Paper variant="outlined" sx={{mt: 3, mb: 3, p: 2.5, borderRadius: 2}}>
      <Typography variant="h5">
        <CircularProgress color="inherit" size={20}/>
      </Typography>
    </Paper>
  }

  return (
    <Paper variant="outlined" sx={{mt: 3, mb: 3, p: 2.5, borderRadius: 2}}>
      <Typography variant="h5">
        {label} {required ? '*' : ''}
      </Typography>
      <TextField
        label="Eligibility Description"
        sx={{mt: '16px', minWidth: 350}}
        defaultValue={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Box sx={{pb: 1}}/>

      {conditionComponents.map((field_components, idx) =>
        <Paper variant="outlined" key={idx}>
          <Grid container>
            {field_components}
            <Grid item xs={12}>
              <Button
                onClick={handleRemoveCondition(idx)}
                style={{margin: 12, float: 'right'}}
                variant="outlined"
                // color="default"
                startIcon={<DeleteIcon/>}
              >
                Remove
              </Button>
              <Button
                style={{margin: 12, float: 'right'}}
                variant="outlined"
                // color="default"
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
        // color="default"
        onClick={handleAddCondition}
        startIcon={<AddIcon/>}
      >
        OR
      </Button>
    </Paper>
  )
}