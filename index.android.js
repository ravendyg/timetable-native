/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
  BackAndroid
} from 'react-native';

import { Main } from './src/components/main';
import { Table } from './src/components/table';

import { Store } from './src/store';
import { ActionCreators } from './src/action-creators';

import {getListsFromStorage, getSearchHistory} from './src/actions';

var navigator;

export default class timetable extends Component
{
  componentDidMount()
  {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (navigator && navigator.getCurrentRoutes().length > 1) {
        navigator.pop();

        if (navigator.getCurrentRoutes().length === 2)
        {
          Store.dispatch(
            ActionCreators.navigation(0)
          );
        }
        return true;
      }
      return false;
    });
  }

  render() {
    return (
      <Navigator
        ref={(nav) => { navigator = nav; }}
        initialRoute={{page: 'main', index: 0}}
        renderScene={
          (route, navigator) =>
          {
            let onForward = (type, index) =>
            {
              const nextIndex = route.index++;
              navigator.push({
                page: 'table', type, index
              });
              Store.dispatch(
                ActionCreators.navigation(1)
              );
            };
            switch (route.page)
            {
              case 'table':
                return <Table type={route.type} index={route.index} />;
              default:
                return <Main onForward={onForward} />;
            }
          }
        }
      />
    );
  }
}

AppRegistry.registerComponent('venomyd.nopay.timetable.q', () => timetable);
