import React, { useEffect, useState } from 'react';
import { DataTable, Loading } from '../shared'; // Adjust the import based on your project structure
import { Container, Typography } from '@mui/material';
import { fetchNotification } from '../../api/notificationApi'; // Import the fetch function

const ReferralNotifications = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const title = 'Referral Notifications';

  const columns = [
    {
      label: 'Referral Name',
      body: ({ name }) => <span>{name}</span>,
    },
    {
      label: 'Status',
      body: ({ isRead }) => <span>{isRead ? 'Read' : 'Unread'}</span>,
    },
    {
      label: 'Date',
      body: ({ datetime }) => <span>{new Date(datetime).toLocaleString()}</span>,
    },
  ];

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await fetchNotification(); // Fetch all notifications
        const allNotifications = response.notifications || [];
        // Filter notifications by category
        const referralNotifications = allNotifications.filter(notification => notification.category === 'referral');
        setData(referralNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  if (loading) return <Loading message={`Loading ${title}...`} />;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <DataTable
        columns={columns}
        data={data}
        title={title}
      />
    </Container>
  );
};

export default ReferralNotifications;
