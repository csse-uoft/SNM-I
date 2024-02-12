import { fetchNotifications } from "../api/notificationApi";

export const updateNavbarNotificationIcon = (userContext) => {
  fetchNotifications()
    .then(data => data.notifications)
    .then(notifications => {
      userContext.updateUser({
        ...userContext,
        anyUnreadNotifications: notifications.filter(notification => !notification.isRead).length > 0
      });
    });
}
