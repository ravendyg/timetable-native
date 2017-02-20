'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';

import { Store } from '../store';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  spinnerStyle: {
    color: '#1A237E'
  }
});

export class Table extends React.Component {

  constructor() {
    super();
  }


  componentDidMount()
  {
  }

  componentWillUnmount()
  {

  }


  render()
  {
    return (
      <View style={styles.container}>
        <Text>{this.props.index}</Text>
        <Text>{this.props.type}</Text>
      </View>
    );
  }
}
