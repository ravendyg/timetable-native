'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ListView
} from 'react-native';
import { ListItem } from './list-item';

import dismissKeyboard from 'dismissKeyboard';

import { pushItemIntoHistory } from '../actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'flex-start',
  },
});

export class List extends React.Component {

  constructor() {
    super();

    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.text !== r2.text});
  }

  clickHandler(e)
  {
    dismissKeyboard();
    pushItemIntoHistory(e);
    // timeout to show click
    setTimeout(() => this.props.onForward(e));
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
      <ListView
        style={styles.container}
        dataSource={this.ds.cloneWithRows(this.props.items || [])}
        enableEmptySections={true}
        renderRow={
          e => <ListItem
                item={e}
                key={e.id}
                clickHandler={this.clickHandler.bind(this, e)}
              />
        }
      />
    );
  }
}


{/*<ListView
        style={styles.container}
      >
        {this.props.items && this.props.items.map(
          e => <ListItem
                item={e}
                key={e.id}
                clickHandler={this.clickHandler.bind(this, e)}
              />
        )}
      </ListView>*/}