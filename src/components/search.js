'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Image,
  TouchableHighlight
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
  },
  hl: {
    position: 'absolute',
    right: 18,
    top: 12
  },
  image: {
    width:  24,
    height: 24,
    margin: 6
  }
});

export class Search extends React.Component
{
  constructor()
  {
    super();

    this.state =
    {
      key: Math.random().toFixed(5).slice(2),
      val: ''
    };

    this.onChange = this._onChange.bind(this);
    this.clear = this._clear.bind(this);
  }

  _onChange(val)
  {
    this.props.report(val);
    this.setState({val});
  }

  _clear()
  {
    this.props.report('');
    this.setState({key: Math.random().toFixed(5).slice(2), val: ''});
  }


  render()
  {
    let icon =
      <TouchableHighlight
        style={styles.hl}
        onPress={this.clear}
        activeOpacity={0.8}
        underlayColor={'rgba(200, 200, 200, 0.4)'}
      >
        <Image
          style={styles.image}
          source={require('../../assets/clear.png')}
        />
      </TouchableHighlight>
    return (
      <View style={styles.container}>
        <TextInput
          key={this.state.key}
          style={styles.input}
          onChangeText={this.onChange}
          placeholder={'Группа, фамилия, аудитория'}
        />
        {this.state.val
          ? icon
          : null
        }
      </View>
    );
  }
}
