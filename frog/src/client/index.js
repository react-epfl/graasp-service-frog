import 'meteor-imports';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import React from 'react';
import { AppContainer } from 'react-hot-loader';
import App from '../universal/ui/App';

render(
  <AppContainer key={0}>
    <App />
  </AppContainer>,
  document.getElementById('root')
);

let reloads = 0;

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('../universal/ui/App', () => {
    const App = require('../universal/ui/App').default;
    render(
      <AppContainer key={++reloads}>
        <App />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
