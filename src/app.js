'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';

import { Store } from './store';
// import { ActionCreators } from './action-creators';

import { Search } from './components/search';
import { List } from './components/list';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  spinnerStyle: {
    color: '#1A237E'
  }
});

export class App extends React.Component {

  constructor() {
    super();

    this.state =
    {
      mode: 'loading',
      history: null,
      list: null
    };

    this.fetchListAndHistory = this.fetchListAndHistory.bind(this);
  }

  fetchListAndHistory()
  {
    let newState;
    let history = Store.getState().searchHistory;
    if (history && this.history !== history)
    {
      this.history = history;
      newState = Object.assign(newState || {}, {history});
    }

    let list = Store.getState().searchList;
    if (list && this.list !== list)
    {
      this.list = list;
      newState = Object.assign(newState || {}, {list});
    }

    if (Store.getState().syncStatus === 'error' && !this.list)
    { // no data, no connection
      newState = Object.assign(newState || {}, {mode: 'error'});
    }
    else if (this.state.mode !== 'loaded' && this.list)
    {
      newState = Object.assign(newState || {}, {mode: 'loaded'});
    }

    if (newState)
    {
      this.setState(newState);
    }
  }

  componentDidMount()
  {
    Store.subscribe(this.fetchListAndHistory);
    this.fetchListAndHistory();
  }

  componentWillUnmount()
  {

  }


  render() {
    let view;
    // debugger;
    switch (this.state.mode)
    {
      case 'loading':
        view =
          <View style={styles.container}>
            <Spinner visible={true} textContent={"Загружаю расписание..."} textStyle={styles.spinnerStyle} />
          </View>;
      break;

      case 'loaded':
        view =
          <View style={styles.container}>
            <Search />
            <List />
          </View>;
      break;

      default:
        view =
          <View style={styles.container}>
            <Text>Error</Text>
          </View>;
    };

    return (
      view
    );
  }
}
