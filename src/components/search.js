'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';


const styles = StyleSheet.create({
  container: {
    height: 50,
  },
});

export class Search extends React.Component {

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
        <Text>search input</Text>
      </View>
    );
  }
}
