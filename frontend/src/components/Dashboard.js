import React from 'react';
import { Link } from './shared'

// redux
import { useSelector } from 'react-redux';

import { Container, Button } from "@material-ui/core";
import { Edit, Create, People, ViewHeadline as Log, CheckCircleOutline as Criteria} from "@material-ui/icons";
import makeStyles from '@material-ui/styles/makeStyles';

const useStyles = makeStyles(() => ({
  container: {
    paddingTop: 80,
    textAlign: 'center',
    maxWidth: 600,
  },
  button: {
    width: 400,
    height: 50,
    textTransform: 'none',
    margin: 5,
  }
}));

function NavButton({to, text, icon}) {
  const classes = useStyles();
  return (
    <Link to={to}>
      <Button
        variant="outlined"
        className={classes.button}
        startIcon={icon}
        size="large">
        {text}
      </Button>
    </Link>
  );
}

function Dashboard() {
  const classes = useStyles();
  const {isLoggedin, currentUser, organization} = useSelector(state => state.auth);
  if (!isLoggedin || !currentUser.is_admin)
    return <span>"You don't have the permission to view this page."</span>;

  return (
    <Container className={classes.container}>

      {!organization.id &&
      <NavButton to={{pathname: '/providers/organization/new', state: {status: 'Home Agency'}}}
                 text="Create organization profile for home agency" icon={<Create/>}/>}

      {organization.id &&
      <NavButton to={`/provider/${organization.id}/edit/organization`} icon={<Edit/>}
                 text="Edit organization profile for home agency"/>}

      <NavButton to={`/users`} icon={<People/>}
                 text="Manage Users"/>

      <NavButton to={`/admin-logs`} icon={<Log/>}
                 text="Admin Logs"/>

      <NavButton to={`/eligibility-criteria`} icon={<Criteria/>}
                 text="Manage Eligibility criteria"/>

      <NavButton to={'/settings/manage-fields'} icon={<Edit/>}
                 text="Manage Client/Provider Fields"/>

      <NavButton to={'/questions'} icon={<Edit/>}
                 text="Manage Questions"/>

    </Container>
  )
}

export default Dashboard;
