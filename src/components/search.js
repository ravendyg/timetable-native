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
    marginLeft:  10,
    marginRight: 10,
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

    this.onChange = this.onChange.bind(this);
  }

  onChange(val)
  {

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
          placeholder={'Группа, фамилия, аудитория'}
        />
      </View>
    );
  }
}
