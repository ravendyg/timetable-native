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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  input: {

  },
  list: {

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
      showSpinner: true,
      history: null,
      list: null
    };
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

    if (this.state.showSpinner && !this.list && !this.history)
    {
      newState = Object.assign(newState || {}, {showSpinner: false});
    }

    if (newState)
    {
      this.setState(newState);
    }
  }

  componentDidMount()
  {
    setTimeout(
      () => this.setState({showSpinner: false}),
      3000
    );
  }

  componentWillUnmount()
  {

  }


  render() {
    let view = this.state.showSpinner
      ? <View style={styles.container}>
          <Spinner visible={true} textContent={"Загружаю расписание..."} textStyle={styles.spinnerStyle} />
        </View>
      : <View style={styles.container}>
          <Search />
          <List />
        </View>
    return (
      view
    );
  }
}
