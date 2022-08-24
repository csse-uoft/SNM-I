import React from 'react';
import {Container, createTheme, Paper, Typography, TypographyVariant} from "@mui/material";
import {useNavigate} from "react-router-dom";


export default function GenericSearch({name, homepage}) {
  const navigate = useNavigate();

  return(
    <Container>
      <Paper sx={{p: 2}} variant={'outlined'}>
        <Typography sx={{fontFamily: 'Georgia', fontSize: '150%'}}>
          Welcome, you are here trying to search for a {name}, am I correct?
        </Typography>
        <Typography sx={{fontFamily: 'Georgia', fontSize: '150%'}}>
          Please choose from the list below for your filter.
        </Typography>

      </Paper>

    </Container>
  )
}