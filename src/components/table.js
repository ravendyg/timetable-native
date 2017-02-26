'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ListView
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';

import { config } from '../config';
import { Store } from '../store';
import { fetchInfo } from '../actions';

import { Day } from './day';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  header: {
    backgroundColor: '#00BCD4'
  },
  list: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  spinnerStyle: {
    color: '#1A237E'
  }
});

export class Table extends React.Component {

  constructor()
  {
    super();
    this.state = {
      loading: true,
      events: []
    };

    this.mergeEvents = this._mergeEvents.bind(this);

    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.events !== r2.events});
  }


  componentDidMount()
  {
    this.unsub = Store.subscribe(this.mergeEvents);
    fetchInfo(this.props.item);
    this.mergeEvents();
  }

  componentWillUnmount()
  {
    this.unsub();
  }

  _mergeEvents()
  {
    let events = Store.getState().data[this.props.item.id];
    if (events && this._events !== events)
    {
      this._events = events;
      this.setState({
        days: events.days,
        loading: false
      });
    }
  }


  render()
  {
    let display;
    if (this.state.loading)
    {
      display =
        <View style={styles.container}>
          <Spinner visible={true} textContent={"Синхронизация..."} textStyle={styles.spinnerStyle} />
        </View>
        ;
    }
    else
    {
      display =
        <View style={styles.container}>
          <View style={styles.header}>
            <Text>{this.props.item.text}</Text>
          </View>
          <ListView
            style={styles.list}
            dataSource={this.ds.cloneWithRows(this.state.days)}
            enableEmptySections={true}
            renderRow={
              day => <Day day={day}/>
            }
          />
        </View>
        ;
    }
    return (
      display
    );
  }
}
