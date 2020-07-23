import React, { useEffect, useState } from 'react';
// redux
import { fetchAdminLogs } from '../api/adminLogApi';

import MUIDataTable from "mui-datatables";
import { Container } from "@material-ui/core";
import { Link, Loading } from "./shared";

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
    name: 'action_time',
    label: 'Time',
    options: {
      customBodyRender: time => {
        return new Date(time).toLocaleString();
      }
    }
  },
  {
    name: 'user',
    label: 'Username',
    options: {
      customBodyRender: user => {
        return (
          <Link color to={`/users/${user.id}`}>
            {user.username}
          </Link>
        )
      }
    }
  },
  {
    name: 'object_id',
    options: {
      sort: false,
      viewColumns: false,
      display: 'excluded',
      searchable: false,
      filter: false,
    }
  },
  {
    name: 'object_repr',
    options: {
      sort: false,
      viewColumns: false,
      display: 'excluded',
      searchable: false,
      filter: false,
    }
  },
  {
    name: 'action',
    label: 'Action',
    options: {
      customBodyRender: (action, {rowData}) => {
        const objectId = rowData[2];
        const objectRepr = rowData[3];
        return (
          <span>
            {action + ' '}
            <Link color to={object_url(objectRepr, objectId)}>
              {objectId}
            </Link>
          </span>
        )
      }
    }
  },
  {
    name: 'change_message',
    label: 'Message',
    options: {
      customBodyRender: msg => {
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
      <MUIDataTable
        title={"Admin Logs"}
        data={data}
        columns={columns}
        options={{
          selectableRows: 'none',
          responsive: 'scrollMaxHeight',
        }}
      />
    </Container>
  );
}
