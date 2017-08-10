// @flow
import React from 'react';
import { createContainer } from 'react-meteor-data';

import { Activities } from '../../../../api/activities';
import ChooseActivity from './ChooseActivity';
import EditActivity from './EditActivity';

export default createContainer(
  ({ id }) => ({ activity: Activities.findOne(id) }),
  ({ activity }) => {
    if (activity.activityType && activity.activityType !== '') {
      return <EditActivity activity={activity} />;
    } else {
      return <ChooseActivity activity={activity} />;
    }
  }
);
