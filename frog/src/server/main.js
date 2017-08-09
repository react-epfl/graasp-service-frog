// @flow

import { Meteor } from 'meteor/meteor';

import { startShareDB } from './share-db-manager';

import '../universal/startup/shutdown-if-env.js';

import { Messages } from '../universal/api/messages.js';
import {
  Activities,
  Operators,
  Connections
} from '../universal/api/activities.js';
import { Graphs } from '../universal/api/graphs.js';
import { Sessions } from '../universal/api/sessions.js';
import { Logs } from '../universal/api/logs.js';
import { ActivityData } from '../universal/api/activityData.js';
import { Products } from '../universal/api/products.js';
import { Objects } from '../universal/api/objects.js';
import { GlobalSettings } from '../universal/api/global.js';
import { Uploads } from '../universal/api/uploads.js';
// import '../universal/api/engine.js';

Meteor.publish('userData', () => Meteor.users.find({}));
Meteor.publish('activities', () => Activities.find({}));
Meteor.publish('operators', () => Operators.find({}));
Meteor.publish('connections', () => Connections.find({}));
Meteor.publish('activity_data', () => ActivityData.find({}));
Meteor.publish('global_settings', () => GlobalSettings.find({}));
Meteor.publish('graphs', () => Graphs.find({}));
Meteor.publish('logs', () => Logs.find({}));
Meteor.publish('messages', () => Messages.find({})); // unused ???
Meteor.publish('objects', () => Objects.find({}));
Meteor.publish('products', () => Products.find({}));
Meteor.publish('sessions', () => Sessions.find({}));
Meteor.publish('uploads', () => Uploads.find({}));

startShareDB();
