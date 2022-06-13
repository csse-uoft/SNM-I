import React, { useContext } from 'react';
import { Link } from './shared'

// redux
import { useSelector } from 'react-redux';

import { Container, Button } from "@mui/material";
import { Edit, Create, People, ViewHeadline as Log, CheckCircleOutline as Criteria } from "@mui/icons-material";
import { UserContext } from "../context";

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
    return <span>"You don't have the permission to view this page."</span>;

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

      <NavButton to={`/eligibility-criteria`} icon={<Criteria/>}
                 text="Manage Eligibility Criteria"/>

      <NavButton to={'/settings/manage-fields'} icon={<Edit/>}
                 text="Manage Client/Provider Fields"/>

      <NavButton to={'/questions'} icon={<Edit/>}
                 text="Manage Questions"/>

      <NavButton to={'/users/reset-password'} icon={<Edit/>}
                 text="Reset Password"/>

    </Container>
  )
}

export default Dashboard;
