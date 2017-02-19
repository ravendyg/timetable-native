'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});

export class List extends React.Component {

  constructor() {
    super();

    this.state =
    {
    };
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
        <Text>search list</Text>
      </View>
    );
  }
}