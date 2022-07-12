import React, { useEffect, useState } from 'react';
import TR from '../shared/TR'
import {fetchUser, getProfile, getUserProfileById} from '../../api/userApi'
import { useParams } from "react-router";
import { Link, Loading } from "../shared";
import { Container, Paper, Table, Typography, TableBody, Button } from "@mui/material";
import {userProfileFields} from "../../constants/userProfileFields";

export default function User() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const {id} = useParams();
  const [form, setForm] = useState({});
  const profileForm = {
    givenName: '',
    familyName: '',
    telephone: null,
    email: '',
    altEmail: '',
  }
  useEffect(() => {
    getUserProfileById(id).then(user => {
      setForm(user);
      setLoading(false);
    });
  }, [id]);

 if (loading)
   return <Loading message={`Loading user...`}/>;

  console.log(user)
  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        User profile
      </Typography>
      <Link to={`/users/${id}/edit`}>
        <Button color="primary" variant="contained" style={{marginBottom: 12}}>
          Edit
        </Button>
      </Link>

      <Paper elevation={4}>
        <Table>
          <TableBody>
            <TR
              title="First Name"
              value={user.givenName}
            />
            <TR
              title="Last Name"
              value={user.familyName}
            />
            <TR
              title="Username"
              value={user.email}
            />
            <TR
              title="altEmail"
              value={user.altEmail}
            />
            <TR
              title="Role"
              value={user.isSuperuser ? 'Admin' : 'User'}
            />
            <TR
              title="Phone Number"
              value={user.primary_phone_number}
            />
          </TableBody>
        </Table>
      </Paper>
    </Container>
  )
}
