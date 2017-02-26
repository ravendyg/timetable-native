'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ListView
} from 'react-native';

import {LessonItemCollapsed } from './lesson-item-collapsed';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 100,
    backgroundColor: '#FFFFFF'
  },
  timeCollapsed: {
    width: 50,
  },
  dataCollapsed : {
    // flex: 1,
    // height: 100,
    // flexDirection: 'column'
  }
});

export class Lesson extends React.Component {

  constructor()
  {
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
    let view;
    if (!this.props.event.open)
    {
      view =
        <View style={styles.container}>
          <View style={styles.timeCollapsed}>
            <Text>{this.props.event.bell.short}</Text>
          </View>
          <View style={styles.dataCollapsed}>
            {(this.props.event.lessons || []).map(
              item => <LessonItemCollapsed item={item}/>
            )}
          </View>
        </View>
        ;
    }
    else
    {
      view = null;
    }
    return (
      view
    );
  }
}





          // <Text>{this.props.item.index}</Text>
          // <Text>{this.props.item.type}</Text>

          {/*<ListItem
                    item={e}
                    key={e.id}
                    clickHandler={this.clickHandler.bind(this, e)}
                  />*/}