'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight
} from 'react-native';


const styles = StyleSheet.create({
  container: {
    height: 64,
    paddingLeft:  16,
    paddingRight: 16,
    justifyContent: 'center'
  },
  text: {
    fontSize: 18,
  }
});

export class ListItem extends React.Component {

  constructor() {
    super();

    this.state =
    {
    };
  }


  render()
  {
    return (
      <TouchableHighlight
        style={styles.container}
        onPress={this.props.clickHandler.bind(this)}
        activeOpacity={0.8}
        underlayColor={'rgba(200, 200, 200, 0.8)'}
      >
        <Text style={styles.text}>{this.props.item.text}</Text>
      </TouchableHighlight>
    );
  }
}