import React, {useCallback, useEffect, useState} from 'react';
import {Button, Container, Divider, Grid, IconButton, ListItem, Paper, Table, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import GeneralField from "./fields/GeneralField";
import {Delete as DeleteIcon} from "@mui/icons-material";
import {DataTable, Link, Loading} from "./index";
import {Picker} from "../settings/components/Pickers";
import {fetchClients} from "../../api/clientApi";
import {AlertDialog} from "./Dialogs";
import {advancedSearchGeneric, fetchForAdvancedSearch} from "../../api/advancedSearchApi";
import SearchConditionField from "./SearchConditionField";


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

  const handleAddCharacteristic = useCallback(() => {
    setUsedCharacteristicIds(used => [...used, selectedCharacteristicId])
  }, [selectedCharacteristicId])


  // search generic for getting certain clients
  const findResult = async () => {
    console.log(searchConditions, searchTypes)
    setSearchResults({});
    setSearchTypes({});
    const {data, success} = await advancedSearchGeneric(name, 'characteristic', {searchConditions, searchTypes});
    console.log('search results: ', data)
    if (success) {
      setSearchResults(data);
      setSearched(true);
    } else {
      setAlertDialog(true);
    }
  }

  const handleOnChange = option => (e) => {
    if (characteristics[option].implementation.fieldType.type === "NumberField") {

    } else if (characteristics[option].implementation.fieldType.type !== "NumberField") {
      searchConditions[option] = e.target.value;
      searchTypes[option] = characteristics[option].implementation.fieldType.type;
    }
  }

  const handleSubmit = () => {
    setLoading(true);
    setSearched(false);
    if (findResult()) {
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

  const options = {
    enhancedTableToolBar: false,
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

        <Grid sx={{pt: 2}}>
          <Picker
            label={"characteristic"}
            onChange={setSelectedCharacteristicId}
            options={characteristicOptions}
            usedOptionKeys={usedCharacteristicIds}
            onAdd={handleAddCharacteristic}
          />
        </Grid>

        {/*adding comments*/}
        {usedCharacteristicIds.map((option) =>
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
              {/*<GeneralField*/}
              {/*  type="phoneNumber"*/}
              {/*  onChange={e => searchConditions[option] = e.target.value}/>*/}

              <SearchConditionField
                component={characteristics[option].implementation.fieldType.type}
                onChange={handleOnChange(option)}/>
                {/*onChange={e => searchConditions[option] = e.target.value}/>*/}
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
          </Grid>
        )}

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
              options={options}
            />

            {/*{searchResults.map((singleResult) =>*/}
            {/*  <Grid container spacing={3} sx={{marginTop: '10px'}}>*/}
            {/*    <Grid item xs={3}>*/}
            {/*      <ListItem sx={{display: 'list-item', fontSize: '150%'}}>*/}
            {/*        {name}: {singleResult.firstName} {singleResult.lastName}*/}
            {/*      </ListItem>*/}
            {/*    </Grid>*/}

            {/*    <Grid item xs={4} sx={{marginTop: '5px'}}>*/}
            {/*      <Button*/}
            {/*        variant="outlined"*/}
            {/*        color="primary"*/}
            {/*        onClick={() => {*/}
            {/*          navigate(`/${name}s/${singleResult._id}`)*/}
            {/*        }}>*/}
            {/*        Go to {singleResult.firstName} {singleResult.lastName}'s detailed page.*/}
            {/*      </Button>*/}
            {/*    </Grid>*/}
            {/*  </Grid>*/}
            {/*)}*/}
          </Container>
          : <div/>}

        <AlertDialog dialogTitle={"No Result"}
                     dialogContentText={`No ${name} is found based on your search condition.`}
                     buttons={[<Button onClick={() => setAlertDialog(false)}
                                       key={'confirm'}>{'confirm'}</Button>]}
                     open={alertDialog}/>

      </Paper>
    </Container>
  )
}