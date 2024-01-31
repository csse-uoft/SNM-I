import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Button, Container, Grid, Paper, Typography } from "@mui/material";
import { fetchNotification, fetchNotifications, updateNotification } from "../../api/notificationApi";
import { Loading } from "../shared";
import VirtualizeTable from "../shared/virtualizeTable";
import { UserContext } from "../../context";

export default function VisualizeNotification() {
  const userContext = useContext(UserContext);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [information, setInformation] = useState([]);
  const [notificationData, setNotificationData] = useState(null);

  useEffect(() => {
    (async function () {
      const notification = (await fetchNotification(id)).notification;
      setNotificationData({ ...notification, isRead: true });
      await updateNotification(id, notificationData); // Mark as read
      fetchNotifications()
        .then(data => data.notifications)
        .then(notifications => {
          userContext.updateUser({
            ...userContext,
            anyUnreadNotifications: notifications.filter(notification => !notification.isRead).length > 0
          });
        });
    })();
  }, [id]);

  useEffect(() => {
    (async function () {
      if (!notificationData) return;

      setInformation([
        { label: 'Name', value: notificationData.name },
        { label: 'Description', value: notificationData.description },
        { label: 'Datetime', value: new Date(notificationData.datetime).toLocaleString() },
        { label: 'Read?', value: notificationData.isRead ? 'Yes' : 'No' },
      ]);

      setLoading(false);
    })();
  }, [notificationData]);

  if (loading)
    return <Loading message={`Loading notification...`} />;

  return (
    <Container>
      <Paper sx={{ pl: 2, pr: 2, pb: 2, mb: 2 }} elevation={5}>
        <Typography
          sx={{ marginTop: '20px', pt: 1, marginRight: '20px', fontSize: '150%' }}>
          {`Information for notification with ID: ` + id}
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Button variant="outlined" onClick={async () => {
              await updateNotification(id, { ...notificationData, isRead: !notificationData.isRead });
              setNotificationData((await fetchNotification(id)).notification);
              fetchNotifications()
                .then(data => data.notifications)
                .then(notifications => {
                  userContext.updateUser({
                    ...userContext,
                    anyUnreadNotifications: notifications.filter(notification => !notification.isRead).length > 0
                  });
                });
            }}>Mark as {notificationData.isRead ? 'unread' : 'read'}</Button>
          </Grid>
        </Grid>

        <VirtualizeTable rows={information} />
      </Paper>
    </Container>
  );
}
