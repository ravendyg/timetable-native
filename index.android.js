/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';

import { App } from './src/app';

import {getListsFromStorage, getSearchHistory} from './src/actions';

export default class timetable extends Component {
  render() {
    return (
      <App />
    );
  }
}

AppRegistry.registerComponent('venomyd.nopay.timetable.q', () => timetable);
