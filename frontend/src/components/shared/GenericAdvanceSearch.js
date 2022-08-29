import React, {useCallback, useEffect, useState} from 'react';
import {Button, Container, Divider, Grid, IconButton, ListItem, Paper, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import GeneralField from "./fields/GeneralField";
import {Delete as DeleteIcon} from "@mui/icons-material";
import {fetchCharacteristics} from "../../api/characteristicApi";
import {Loading} from "./index";
import {Picker} from "../settings/components/Pickers";
import {fetchClients} from "../../api/clientApi";
import {AlertDialog} from "./Dialogs";
import {fetchForAdvancedSearch} from "../../api/advancedSearchApi";


export default function GenericAdvanceSearch({name, homepage}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [characteristics, setCharacteristics] = useState({});
  const [characteristicOptions, setCharacteristicOptions] = useState({});
  const [selectedCharacteristicId, setSelectedCharacteristicId] = useState('');
  const [usedCharacteristicIds, setUsedCharacteristicIds] = useState([]);
  const [searched, setSearched] = useState(false);
  const [searchConditions, setSearchConditions] = useState({});
  const [searchResults, setSearchResults] = useState({});
  const [alertDialog, setAlertDialog] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    Promise.all([
      // Fetch characteristics
      // TODO: make fetch generic by {name}
      fetchForAdvancedSearch(name, 'characteristic').then(({data}) => {
        const characteristics = {};
        const options = {};
        for (const characteristic of data) {
          characteristics[characteristic.id] = characteristic;
          options[characteristic.id] = `${characteristic.implementation.label}`
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
    // TODO: Add advance search backend.
    // const {data, success} = await advancedSearchGeneric(name, searchConditions)
    const {data, success} = await fetchClients();
    if (success) {
      setSearchResults(data);
      setSearched(true);
    } else {
      setAlertDialog(true);
    }
  }

  const handleSubmit = () => {
    setLoading(true);
    if (findResult()) {
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

        <Typography sx={{fontFamily: 'Georgia', fontSize: '150%'}}>
          Advance Search for {name} based on characteristics.
        </Typography>
        <Typography sx={{fontFamily: 'Georgia', fontSize: '150%'}}>
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

        {usedCharacteristicIds.map((option) =>
          <Grid container spacing={4}>
            <Grid item xs={4}>
              <Typography sx={{fontFamily: 'Georgia', fontSize: '130%', paddingTop: '30px'}}>
                {characteristics[option].implementation.label}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{color: 'darkblue', fontFamily: 'Georgia', fontSize: '130%', paddingTop: '30px'}}>
                enter condition:
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <GeneralField onChange={e => searchConditions[option] = e.target.value}/>
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
        {searched ?
          <Container sx={{p: 2}} variant={'outlined'}>
            <Typography sx={{fontFamily: 'Georgia', fontSize: '150%'}}>
              Search Results is listed below.
            </Typography>
            {searchResults.map((singleResult) =>
              <Grid container spacing={3} sx={{marginTop: '10px'}}>
                <Grid item xs={4}>
                  <ListItem sx={{display: 'list-item', fontSize: '150%'}}>
                    {name}: {singleResult.firstName} {singleResult.lastName}
                  </ListItem>
                </Grid>
                <Grid item xs={4} sx={{marginTop: '5px'}}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      navigate(`/${name}s/${singleResult._id}`)
                    }}>
                    Go to {singleResult.firstName} {singleResult.lastName}'s detailed page.
                  </Button>
                </Grid>
              </Grid>
            )}
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