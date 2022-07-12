import React, {useContext} from 'react';
import {Link} from './shared'

import {Container, Button, Typography} from "@mui/material";
import {Edit, Create, People, ViewHeadline as Log, CheckCircleOutline as Criteria} from "@mui/icons-material";
import {UserContext} from "../context";

function NavButton({to, text, icon}) {
  return (
    <Link to={to}>
      <Button
        sx={{
          width: 300,
          height: 100,
          textTransform: 'none',
          margin: 1,
          color: '#535353'
        }}
        color="inherit"
        variant="outlined"
        startIcon={icon}
        size="large">
        {text}
      </Button>
    </Link>
  );
}

function Dashboard() {
  const userContext = useContext(UserContext);

  if (!userContext.isAdmin)
    return (
      <Container>
        {/*<Typography color={'primary'} variant="h4">*/}
        {/*  {(userContext.givenName && userContext.familyName) ? ('Dear ' + userContext.givenName + '' + userContext.familyName + ":") :*/}
        {/*    ('Dear ' + userContext.email + ':')}*/}
        {/*</Typography>*/}
        <Typography
          color={'black'}
          variant="h2"
          marginLeft={'5%'}
          marginTop={'20%'}>
          {'Welcome to Social Needs Market Place!'}
        </Typography>

      </Container>)

  return (
    <Container maxWidth="md" sx={{
      paddingTop: 8,
      textAlign: 'center',
    }}>

      {/*{!organization.id &&*/}
      {/*  <NavButton to={{pathname: '/providers/organization/new', state: {status: 'Home Agency'}}}*/}
      {/*             text="Create Organization Profile for Home Agency" icon={<Create/>}/>}*/}

      {/*{organization.id &&*/}
      {/*  <NavButton to={`/provider/${organization.id}/edit/organization`} icon={<Edit/>}*/}
      {/*             text="Edit Organization Profile for Home Agency"/>}*/}

      <NavButton to={`/users`} icon={<People/>}
                 text="Manage Users"/>

      <NavButton to={`/admin-logs`} icon={<Log/>}
                 text="Admin Logs"/>

      {/*<NavButton to={`/eligibility-criteria`} icon={<Criteria/>}*/}
      {/*           text="Manage Eligibility Criteria"/>*/}

      <NavButton to={'/settings/manage-fields'} icon={<Edit/>}
                 text="Manage Client/Provider Fields"/>

      <NavButton to={'/questions'} icon={<Edit/>}
                 text="Manage Questions"/>


    </Container>
  )
}

export default Dashboard;
