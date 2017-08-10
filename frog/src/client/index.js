import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import App from '../universal/ui/App';

console.log('hi');
Meteor.startup(() => {
  render(<App />, document.getElementById('render-target'));
});
