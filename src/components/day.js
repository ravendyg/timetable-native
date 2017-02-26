'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ListView,
  TouchableHighlight
} from 'react-native';
import { config } from '../config';

import { Lesson } from './lesson';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF'
  },
  header: {
    backgroundColor: '#4DD0E1'
  },
});

export class Day extends React.Component {

  constructor()
  {
    super();

    this.state = {
      open: false
    };

    this.clickMe = this._clickMe.bind(this);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.lessons !== r2.lessons});
  }


  componentDidMount()
  {
    let day = ((new Date()).getDay() + 6 + 1) % 7; // tested on sunday
    if (this.props.day._count > 0 && this.props.day.day === config.DAYS[day])
    {
      this.setState({
        open: true
      });
    }
  }

  componentWillUnmount()
  {
  }

  _clickMe()
  {

  }


  render()
  {
    let list = this.state.open
      ?
        <ListView
          style={styles.container}
          dataSource={this.ds.cloneWithRows(this.props.day.events)}
          enableEmptySections={true}
          renderRow={
            event => <Lesson event={event}/>
          }
        />
      : null;

    return (
      <View style={styles.container}>
        <TouchableHighlight
          style={styles.header}
          onPress={this.clickMe}
          activeOpacity={0.8}
          underlayColor={'rgba(200, 200, 200, 0.8)'}
        >
          <Text>{this.props.day.day.toUpperCase()}</Text>
        </TouchableHighlight>
        {list}
      </View>
    );
  }
}



/*
<View style={styles.header}>
          <Text>{this.props.day.day.toUpperCase()}</Text>
        </View>*/

          // <Text>{this.props.item.index}</Text>
          // <Text>{this.props.item.type}</Text>

          {/*<ListItem
                    item={e}
                    key={e.id}
                    clickHandler={this.clickHandler.bind(this, e)}
                  />*/}