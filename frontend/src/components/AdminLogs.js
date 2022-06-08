import React, { useEffect, useState } from 'react';
// redux
import { fetchAdminLogs } from '../api/mockedApi/adminLog';
import { Container } from "@mui/material";
import { Link, Loading, DataTable } from "./shared";

function object_url(contentType, objectId) {
  if (contentType === 'Person') {
    return `/clients/${objectId}`
  } else if (contentType === 'EligibilityCriteria') {
    return `/eligibility-criteria/${objectId}`
  }
  return `/${contentType.toLowerCase()}s/${objectId}`
}

const columns = [
  {
    label: 'Time',
    body: ({action_time}) => new Date(action_time).toLocaleString()
  },
  {
    label: 'Username',
    body: ({user}) =>  <Link color to={`/users/${user.id}`}>
      {user.username}
    </Link>
  },
  {
    label: 'Action',
    body: ({action, object_id, object_repr}) => {
      return (
        <span>
            {action + ' '}
          <Link color to={object_url(object_repr, object_id)}>
              {object_id}
            </Link>
          </span>
      )
    }
  },
  {
    label: 'Message',
    body: ({change_message: msg}) => {
      if (msg) {
        try {
          msg = JSON.parse(msg);
          if (msg.reason != null)
            return 'Reason: ' + msg.reason;
        } catch (e) {
        }
      }
      return 'N/A';
    }
  }
];

export default function AdminLogs() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchAdminLogs().then(data => {
      setData(data);
      setLoading(false);
    });
  }, []);

  if (loading)
    return <Loading message={`Loading admin logs...`}/>;

  return (
    <Container>
      <DataTable
        title={"Admin Logs"}
        data={data}
        columns={columns}
        idField="id"
      />
    </Container>
  );
}
