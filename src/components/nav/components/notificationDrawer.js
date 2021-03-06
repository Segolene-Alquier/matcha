import React, { Fragment } from 'react';
import moment from 'moment';
import {
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash';

const NotificationDrawer = ({ classes, toggleDrawer, notifications }) => {
  const messageToDisplay = (sender, event) => {
    let message = '';

    if (event) {
      switch (event) {
        case 'message':
          message = `${sender} sent you a new message`;
          break;
        case 'like':
          message = `${sender} liked you`;
          break;
        case 'visit':
          message = `${sender} visited your profile!`;
          break;
        case 'match':
          message = `${sender} liked you back, it's a match!`;
          break;
        case 'unmatch':
          message = `${sender} unliked you, no more match. Sorry!`;
          break;
        default:
      }
      return message;
    }
  };

  return (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      {_.isEmpty(notifications) ? (
        <Typography className={classes.noNotificationsDrawer}>
          <span role="img" aria-label="emoji">
            You don't have any notifications yet! Be patient, it's coming 😌
          </span>
        </Typography>
      ) : (
        <List>
          {notifications.map(notification => {
            const notifLink = `/profile/${notification.username}`;
            return (
              <Fragment key={notification.id}>
                <ListItem
                  button
                  component="a"
                  href={notifLink}
                  className={notification.read ? null : classes.notReadNotif}
                >
                  <ListItemAvatar>
                    <Avatar alt="avatar" src={notification.profilePicture} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={messageToDisplay(
                      notification.firstname,
                      notification.event,
                    )}
                    secondary={moment(notification.date).fromNow()}
                  />
                </ListItem>
                <Divider />
              </Fragment>
            );
          })}
        </List>
      )}
    </div>
  );
};

export default NotificationDrawer;
