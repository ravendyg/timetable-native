'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput
} from 'react-native';


const styles = StyleSheet.create({
  container: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  input: {
    borderWidth: 0,
    height: 50,
    fontSize: 16,
    flex: 1,
    marginLeft:  16,
    marginRight: 16,
  }
});

export class Search extends React.Component
{
  constructor()
  {
    super();

    this.state =
    {
    };

    this.onChange = this._onChange.bind(this);
  }

  _onChange(val)
  {
    this.props.report(val);
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
        <TextInput
          style={styles.input}
          onChangeText={this.onChange}
          placeholder={'Группа, фамилия, аудитория'}
        />
      </View>
    );
  }
}
