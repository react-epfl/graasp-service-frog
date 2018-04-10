// @flow
import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Activities } from '/imports/api/activities';
import ChooseActivity from './ChooseActivity';
import EditActivity from './EditActivity';

export default withTracker(({ id }) => ({ activity: Activities.findOne(id) }))(
  ({
    activity,
    setDelete,
    importActivityList,
    setImportActivityList,
    lastRefreshAct,
    refreshActDate,
    setIdRemove
  }) => {
    if (!activity) return null;
    if (activity.activityType) return <EditActivity activity={activity} />;
    else
      return (
        <ChooseActivity
          {...{
            setDelete,
            setIdRemove,
            importActivityList,
            setImportActivityList,
            lastRefreshAct,
            refreshActDate,
            activity
          }}
        />
      );
  }
);
