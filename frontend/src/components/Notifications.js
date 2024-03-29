import React, { useContext, useEffect, useMemo, useState } from 'react';
import { DataTable, Link, Loading } from './shared';
import { fetchNotifications, updateNotification } from '../api/notificationApi';
import { Container, Fade, Tooltip } from '@mui/material';
import { MarkEmailRead, MarkEmailUnread } from '@mui/icons-material';
import { UserContext } from '../context';
import { updateNavbarNotificationIcon } from '../helpers/notification';

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
    label: 'Date and Time',
    body: ({datetime}) => {
      return new Date(datetime).toLocaleString();
    },
    sortBy: ({datetime}) => {
      // Descending order
      return (new Date(datetime)).toISOString().split('').map(
        // If the character is a digit, make it 9 minus the digit
        character => /\d/.test(character) ? '' + (9 - parseInt(character)) : character
      ).join('');
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
    updateNavbarNotificationIcon(userContext);
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
          // sort by status (Unread followed by Read) + date (newest first)
          defaultOrderBy={props => columnsWithoutOptions[1].sortBy(props) + columnsWithoutOptions[2].sortBy(props)}
        />
      </Container>
    </Fade>
  )
}
