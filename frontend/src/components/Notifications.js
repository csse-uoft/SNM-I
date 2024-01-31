import React, { useContext, useEffect, useMemo, useState } from 'react';
import { DataTable, Link, Loading } from './shared';
import { fetchNotifications, updateNotification } from '../api/notificationApi';
import { Container, Fade, Tooltip } from '@mui/material';
import { MarkEmailRead, MarkEmailUnread } from '@mui/icons-material';
import { UserContext } from '../context';

const TYPE = 'notifications';

const columnsWithoutOptions = [
  {
    label: 'Name',
    body: ({_id, name}) => {
      return <Link color to={`/${TYPE}/${_id}`}>{name}</Link>;
    },
    sortBy: ({name}) => name,
  },
  {
    label: 'Status',
    body: ({isRead}) => {
      return isRead ? "Read" : "Unread";
    },
    sortBy: ({isRead}) => isRead,
  },
  {
    label: 'Datetime',
    body: ({datetime}) => {
      return new Date(datetime).toLocaleString();
    },
    sortBy: ({datetime}) => {
      return Number(new Date(datetime));
    },
  },
];

export default function Notifications() {
  const userContext = useContext(UserContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const title = 'Notifications';

  const fetchData = async () => {
    const notifications = (await fetchNotifications()).notifications;
    userContext.updateUser({
      ...userContext,
      anyUnreadNotifications: notifications.filter(notification => !notification.isRead).length > 0
    });

    const data = [];
    for (const notification of notifications) {
      const notificationData = {_id: notification._id};
      if (notification.name)
        notificationData.name = notification.name;
        if (notification.description)
          notificationData.description = notification.description;
          if (notification.datetime)
            notificationData.datetime = notification.datetime;
      if (notification.hasOwnProperty('isRead'))
        notificationData.isRead = notification.isRead;

      data.push(notificationData);
    }
    return data;
  };

  useEffect(() => {
    fetchData().then(data => {
      setData(data);
      setLoading(false);
    });
  }, []);

  const onChangeIsRead = async (_id) => {
    const notification = data.find(notification => notification._id == _id);
    await updateNotification(_id, {...notification, isRead: !notification.isRead});
    fetchData().then(data => setData(data));
  }

  const columns = useMemo(() => {
    return [
      ...columnsWithoutOptions,
      {
        label: ' ',
        body: ({_id}) => {
          const notification = data.find(notification => notification._id == _id);
          if (notification.isRead)
            return <Tooltip title="Mark as unread">
                <MarkEmailUnread fontSize="small" onClick={() => onChangeIsRead(_id)}/>
              </Tooltip>
          else
            return <Tooltip title="Mark as read">
            <MarkEmailRead fontSize="small" onClick={() => onChangeIsRead(_id)}/>
          </Tooltip>
        }
      },
    ]
  }, [columnsWithoutOptions, data]);

  if (loading)
    return <Loading message={`Loading ${title}...`}/>;

  return (
    <Fade in>
      <Container maxWidth="xl">
        <DataTable
          columns={columns}
          data={data}
          title={title}
          defaultOrderBy={columnsWithoutOptions[1].sortBy} // sort by status
        />
      </Container>
    </Fade>
  )
}
