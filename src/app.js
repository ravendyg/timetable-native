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
      displayedList: []
    };

    this.history = null;
    this.list = null;

    this.query  = '';

    this.fetchListAndHistory = this._fetchListAndHistory.bind(this);
    this.report = this._report.bind(this);
  }

  _fetchListAndHistory()
  {
    let newState;
    let history = Store.getState().searchHistory;
    if (history && this.history !== history)
    {
      this.history = history;
      this._report(this.query);
    }

    let list = Store.getState().searchList;
    if (list && this.list !== list)
    {
      this.list = list;
      this._report(this.query);
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

  _report(val)
  {
    this.query = val;
    let displayedList;
    if (val.length === 0)
    {
      displayedList = this.history || [];
    }
    else if (this.list)
    {
      let reg;
      try
      {
        reg = new RegExp(val);
      }
      catch (err)
      {
        reg = new RegExp(val.split('').map(e => '\\' + e).join(''));
      }
      displayedList = this.list.filter(
        e => reg.test(e.text.toLowerCase())
      );
    }
    if (displayedList)
    {
      this.setState({displayedList});
    }
  }


  render() {
    let view;
    // debugger;
    switch (this.state.mode)
    {
      case 'loading':
        view =
          <View style={styles.container}>
            <Spinner visible={true} textContent={"Синхронизация..."} textStyle={styles.spinnerStyle} />
          </View>;
      break;

      case 'loaded':
        view =
          <View style={styles.container}>
            <Search report={this.report} />
            <List items={this.state.displayedList}/>
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
