import React, {useContext} from 'react';
import {Link} from './shared'

import {Container, Button, Typography} from "@mui/material";
import {Edit, Create, People, ViewHeadline as Log, CheckCircleOutline as Criteria} from "@mui/icons-material";
import {UserContext} from "../context";

function NavButton({to, text, icon, disabled}) {
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
        disabled={disabled}
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

      <NavButton to={`/admin-logs`} icon={<Log/>} disabled
                 text="Admin Logs"/>

      {/*<NavButton to={`/eligibility-criteria`} icon={<Criteria/>}*/}
      {/*           text="Manage Eligibility Criteria"/>*/}

      <NavButton to={'/characteristics'} icon={<Edit/>}
                 text="Manage Characteristics"/>

      <NavButton to={'/questions'} icon={<Edit/>}
                 text="Manage Questions"/>

      <NavButton to={'/needs'} icon={<Edit/>}
                 text="Manage Needs"/>

      <NavButton to={'/need sayisfyers'} icon={<Edit/>}
                 text="Manage Need Sayisfyers"/>

      <NavButton to={'/settings/manage-forms/client'} icon={<Edit/>}
                 text="Manage Forms"/>


    </Container>
  )
}

export default Dashboard;
