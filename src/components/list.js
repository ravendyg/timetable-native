'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import { ListItem } from './list-item';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'center'
  },
});

export class List extends React.Component {

  constructor() {
    super();

    this.state =
    {
    };
  }

  clickHandler(e)
  {
    this.props.onForward(e.type, e.id);
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
        {this.props.items && this.props.items.map(
          e => <ListItem
                item={e}
                key={e.id}
                clickHandler={this.clickHandler.bind(this, e)}
              />
        )}
      </View>
    );
  }
}