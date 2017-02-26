'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ListView
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF'
  },
  name: {
    flex: 1
  },
});

export class LessonItemCollapsed extends React.Component {

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
    if (this.props.item)
    {
      view =
        <View style={styles.container}>
          <View style={styles.name}>
            <Text>{this.props.item.name}</Text>
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