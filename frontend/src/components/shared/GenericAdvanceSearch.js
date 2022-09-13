import React, {useCallback, useEffect, useState} from 'react';
import {Button, Container, Divider, Grid, IconButton, ListItem, Paper, Table, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {Delete as DeleteIcon} from "@mui/icons-material";
import {DataTable, Link, Loading} from "./index";
import {Picker} from "../settings/components/Pickers";
import {AlertDialog} from "./Dialogs";
import {advancedSearchGeneric, fetchForAdvancedSearch} from "../../api/advancedSearchApi";
import SearchConditionField from "./SearchConditionField";

/**
 * This is the frontend for Generic Advanced Search.
 * @param name
 * @param homepage
 * @returns {JSX.Element}
 * @constructor
 */

export default function GenericAdvanceSearch({name, homepage}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [characteristics, setCharacteristics] = useState({});
  const [characteristicOptions, setCharacteristicOptions] = useState({});
  const [selectedCharacteristicId, setSelectedCharacteristicId] = useState('');
  const [usedCharacteristicIds, setUsedCharacteristicIds] = useState([]);
  const [searched, setSearched] = useState(false);
  const [searchConditions, setSearchConditions] = useState({});
  const [searchTypes, setSearchTypes] = useState({});
  const [searchResults, setSearchResults] = useState({});
  const [alertDialog, setAlertDialog] = useState(false);
  const [dynamicOptions, setDynamicOptions] = useState({});
  const [errors, setErrors] = useState({});
  const [column, setColumn] = useState([]);

  useEffect(() => {
    Promise.all([
      // Fetch characteristics
      fetchForAdvancedSearch(name, 'characteristic').then(({data}) => {
        const characteristics = {};
        const options = {};
        for (const characteristic of data) {
          characteristics[characteristic._id] = characteristic;
          options[characteristic._id] = `${characteristic.name}`
        }
        setCharacteristics(characteristics);
        setCharacteristicOptions(options);
      })
    ]).then(() => {
      setLoading(false);
    }).catch(e => {
      if (e.json) {
        setErrors(e.json);
      }
      setLoading(false);
    });
  }, [searchResults]);

  // This is the handle for adding characteristics to the
  // UsedCharacteristicsIds object.
  const handleAddCharacteristic = useCallback(() => {
    setUsedCharacteristicIds(used => [...used, selectedCharacteristicId])
  }, [selectedCharacteristicId])


  // search generic for getting certain clients.
  // If success, will parse the data in searchResults,
  // If not success, will pop up the 'no result' alert dialog.
  const findResult = async () => {
    setSearchResults({});
    setSearchTypes({});
    const {data, success} = await advancedSearchGeneric(name, 'characteristic', {searchConditions, searchTypes});
    if (success) {
      setSearchResults(data);
      setSearched(true);
      setSearchConditions({});
    } else {
      setAlertDialog(true);
    }
  }

  // This is onChange handle for search conditions (i.e. string, phone number...) except number range.
  // It updates search Conditions and searchTypes.
  const handleOnChange = option => (e) => {
    searchConditions[option] = e.target.value;
    searchTypes[option] = characteristics[option].implementation.fieldType.type;
  }

  // This is onChange handle for entering the min value of the range
  // It updates searchConditions and searchTypes.
  const handleOnChangeMin = option => (e) => {
    if (searchConditions[option] === undefined) {
      searchConditions[option] = {min: e.target.value};
    } else {
      searchConditions[option]['min'] = e.target.value;
    }
    searchTypes[option] = characteristics[option].implementation.fieldType.type;
  }

  // This is onChange handle for entering the max value of the range
  // It updates searchConditions and searchTypes.
  const handleOnChangeMax = option => (e) => {
    if (searchConditions[option] === undefined) {
      searchConditions[option] = {max: e.target.value};
    } else {
      searchConditions[option]['max'] = e.target.value;
    }
    searchTypes[option] = characteristics[option].implementation.fieldType.type;
  }

  // This is the onChange handle for submit.
  // Reach here if clicked "submit for advance search"
  const handleSubmit = () => {
    setLoading(true);
    setSearched(false);
    if (findResult()) {

      // this is the column for search results
      // currently is hardcoded for displaying First Name and Last Name.
      const column = [
        {
          label: 'First Name',
          body: ({firstName, _id}) => {
            return <Link color to={`/${name}s/${_id}`}>{firstName}</Link>
          }
        },
        {
          label: 'Last Name',
          body: ({lastName}) => {
            return lastName;
          }
        },
      ]
      setColumn(column);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }

  if (loading)
    return <Loading/>

  return (
    <Container>

      <Paper sx={{p: 2}} variant={'outlined'}>
        <Button sx={{marginBottom: '20px', marginRight: '20px'}}
                variant="contained"
                color="primary"
                onClick={() => {
                  navigate(`/${name}s`)
                }}>
          Back to {name} Listing Page
        </Button>

        <Typography sx={{fontSize: '150%'}}>
          Advance Search for {name} based on characteristics.
        </Typography>
        <Typography sx={{fontSize: '150%'}}>
          You can choose as many characteristics as you want by selecting from the list.
        </Typography>
        <Divider sx={{pt: 2}}/>

        {/*This is the dropdown bar letting you choose from the list*/}
        <Grid sx={{pt: 2}}>
          <Picker
            label={"characteristic"}
            onChange={setSelectedCharacteristicId}
            options={characteristicOptions}
            usedOptionKeys={usedCharacteristicIds}
            onAdd={handleAddCharacteristic}
          />
        </Grid>

        {/*This is a map between all characteristics and generating */}
        {/*search condition fields*/}
        {usedCharacteristicIds.map((option) => {
          const fieldType = characteristics[option].implementation.fieldType.type;
          const {label, optionsFromClass} = characteristics[option].implementation;
          // let fieldOptions;
          // if (optionsFromClass) {
          //   fieldOptions = dynamicOptions[optionsFromClass] || {};
          // } else if (characteristics[option].implementation.options) {
          //   fieldOptions = {};
          //   characteristics[option].implementation.options.forEach(op => fieldOptions[op.iri] = op.label);
          // }

          if (fieldType === "NumberField") {
            return(
              <Grid container spacing={4}>
                <Grid item xs={4}>
                  <Typography sx={{fontSize: '130%', paddingTop: '30px'}}>
                    {characteristics[option].name}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{color: 'darkblue', fontSize: '130%', paddingTop: '30px'}}>
                    enter condition:
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <SearchConditionField
                    key={`${option}_min`}
                    label={`inclusive minimum`}
                    // options={fieldOptions}
                    component={fieldType}
                    onChange={handleOnChangeMin(option)}/>
                  <SearchConditionField
                    key={`${option}_max`}
                    label={`inclusive maximum`}
                    // options={fieldOptions}
                    component={fieldType}
                    onChange={handleOnChangeMax(option)}/>
                </Grid>
                <Grid item xs={0.5}>
                  <IconButton
                    sx={{marginTop: '25px'}}
                    onClick={() => {
                      const currIds = usedCharacteristicIds;
                      const index = currIds.indexOf(option);
                      if (index > -1) {
                        currIds.splice(index, 1);
                      }
                      setUsedCharacteristicIds([...currIds]);
                    }}>
                    <DeleteIcon/>
                  </IconButton>
                </Grid>
              </Grid>)
          } else {
            return(
              <Grid container spacing={4}>
                <Grid item xs={4}>
                  <Typography sx={{fontSize: '130%', paddingTop: '30px'}}>
                    {characteristics[option].name}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{color: 'darkblue', fontSize: '130%', paddingTop: '30px'}}>
                    enter condition:
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <SearchConditionField
                    key={`${option}`}
                    label={label}
                    // options={fieldOptions}
                    component={fieldType}
                    onChange={handleOnChange(option)}/>
                </Grid>
                <Grid item xs={0.5}>
                  <IconButton
                    sx={{marginTop: '25px'}}
                    onClick={() => {
                      const currIds = usedCharacteristicIds;
                      const index = currIds.indexOf(option);
                      if (index > -1) {
                        currIds.splice(index, 1);
                      }
                      setUsedCharacteristicIds([...currIds]);
                    }}>
                    <DeleteIcon/>
                  </IconButton>
                </Grid>
              </Grid>)
          }
        })}

        <Divider sx={{pt: 2}}/>

        <Button sx={{marginTop: '20px'}}
                variant="contained"
                color="primary"
                onClick={handleSubmit}>
          Submit for Advance Search
        </Button>

        {/*display search result below*/}
        {(searched && (searchResults !== {})) ?
          <Container sx={{p: 2}} variant={'outlined'}>

            <DataTable
              title={`List of ${name}s matched the conditions`}
              data={searchResults}
              columns={column}
              // options={options}
            />
          </Container>
          : <div/>}

        {/*This is a pop-up alert for no result when no result is found*/}
        <AlertDialog dialogTitle={"No Result"}
                     dialogContentText={`No ${name} is found based on your search condition.`}
                     buttons={[<Button onClick={() => setAlertDialog(false)}
                                       key={'confirm'}>{'confirm'}</Button>]}
                     open={alertDialog}/>

      </Paper>
    </Container>
  )
}