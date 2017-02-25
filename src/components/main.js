'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';

import { Store } from '../store';
// import { ActionCreators } from './action-creators';

import { Search } from './search';
import { List } from './list';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  spinnerStyle: {
    color: '#1A237E'
  }
});

export class Main extends React.Component {

  constructor() {
    super();

    this.state =
    {
      mode: 'loading',
      displayedList: [],
    };

    this.history = null;
    this.list = null;

    this.query  = '';

    this.storeSubscriber = this._storeSubscriber.bind(this);
    this.report = this._report.bind(this);
    this.onForward = this._onForward.bind(this);
  }

  _storeSubscriber()
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

    if (this.list)
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
    this.unsub = Store.subscribe(this.storeSubscriber);
    this.storeSubscriber();
  }

  componentWillUnmount()
  {
    this.unsub();
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

  onClick()
  {
    console.log('click');
  }

  _onForward(type, index)
  {
    this.props.onForward(type, index);
  }

  render() {
    let view;
    switch (this.state.mode)
    {
      case 'loaded':
        view =
          <View style={styles.container}>
            <Search report={this.report} onPress={this.onClick}/>
            <List items={this.state.displayedList} onForward={this.onForward}/>
          </View>;
      break;

      default:
        view =
          <View style={styles.container} onClick={this.onClick}>
            <Spinner visible={true} textContent={"Синхронизация..."} textStyle={styles.spinnerStyle} />
          </View>;
      break;
    };

    return (
      view
    );
  }
}
