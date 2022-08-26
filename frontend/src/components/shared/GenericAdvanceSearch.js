import React, {useCallback, useEffect, useState} from 'react';
import {Button, Container, Divider, Grid, IconButton, Paper, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import GeneralField from "./fields/GeneralField";
import {Delete as DeleteIcon} from "@mui/icons-material";
import {fetchCharacteristics} from "../../api/characteristicApi";
import {Loading} from "./index";
import {Picker} from "../settings/components/Pickers";


export default function GenericAdvanceSearch({name, homepage}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [characteristics, setCharacteristics] = useState({});
  const [characteristicOptions, setCharacteristicOptions] = useState({});
  const [selectedCharacteristicId, setSelectedCharacteristicId] = useState('');
  const [usedCharacteristicIds, setUsedCharacteristicIds] = useState([]);
  const [searchConditions, setSearchConditions] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    Promise.all([
      // Fetch characteristics
      // make fetch generic by {name}
      fetchCharacteristics().then(({data}) => {
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
  }, []);

  useEffect( () => {

    },[])

  console.log('characteristicOptions', characteristicOptions)

  const handleAddCharacteristic = useCallback(() => {
    setUsedCharacteristicIds(used => [...used, selectedCharacteristicId])
  }, [selectedCharacteristicId])


  const handleSubmit = () => {
    console.log(searchConditions);
    // search generic for getting
    // setLoading(true);
  }

  if (loading)
    return <Loading/>

  return (
    <Container>
      <Paper sx={{p: 2}} variant={'outlined'}>
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
                  setUsedCharacteristicIds(currIds);
                  console.log(usedCharacteristicIds);
                }}>
                <DeleteIcon/>
              </IconButton>
            </Grid>
          </Grid>
        )}

        <Divider sx={{pt: 2}}/>

        <Button sx={{marginTop: '20px', marginRight: '20px'}}
                variant="contained"
                color="primary"
                onClick={() => {
                  navigate(`/${name}s`)
                }}>
          Back to {name} Listing Page
        </Button>

        <Button sx={{marginTop: '20px'}}
                variant="contained"
                color="primary"
                onClick={handleSubmit}>
          Submit for Advance Search
        </Button>


      </Paper>

    </Container>
  )
}