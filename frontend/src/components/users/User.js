import React, { useEffect, useState } from 'react';
import TR from '../shared/TR'
import { fetchUser } from '../../api/userApi'
import { useParams } from "react-router";
import { Link, Loading } from "../shared";
import { Container, Paper, Table, Typography, TableBody, Button } from "@mui/material";

export default function User() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  const {id} = useParams();
  useEffect(() => {
    fetchUser(id).then(user => {
      setUser(user);
      setLoading(false);
    });
  }, [id]);

//  if (loading)
//    return <Loading message={`Loading user...`}/>;

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
              value={user.first_name}
            />
            <TR
              title="Last Name"
              value={user.last_name}
            />
            <TR
              title="Username"
              value={user.username}
            />
            <TR
              title="Email"
              value={user.email}
            />
            <TR
              title="Role"
              value={user.is_superuser ? 'Admin' : 'User'}
            />
            <TR
              title="Phone Number"
              value={user.primary_phone_number}
            />
            <TR
              title="Alternative Phone Number"
              value={user.alt_phone_number}
            />
          </TableBody>
        </Table>
      </Paper>
    </Container>
  )
}
