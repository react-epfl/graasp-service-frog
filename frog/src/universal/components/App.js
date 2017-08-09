import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Counts from '../collections/Counts';
import { createContainer } from 'react-meteor-data';
import { withState } from 'recompose';

export const List = ({ counts, counter, setCounter }) =>
  <p>
    <h1>hi</h1>
    {JSON.stringify(counts)}
    <hr />
    <a href="#" onClick={() => setCounter(counter + 1)}>
      local state counter: {counter}
    </a>
  </p>;

const ListState = withState('counter', 'setCounter', 0)(List);

export default createContainer(() => {
  Meteor.subscribe('counts', 'a');
  return {
    counts: Counts.find().fetch()
  };
}, ListState);
