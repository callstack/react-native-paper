/* @flow */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  Image
} from 'react-native';
import {
  Caption,
  Headline,
  Paragraph,
  Subheading,
  Title,
  FAB
} from 'react-native-paper';

export default class TextExample extends Component {

  static title = 'Floating Action Button';

  constructor(props) {
    super(props);
    this.state = {toolbarLeftOpen: false, toolbarRightOpen: false};
  }

  dismissToolbar() {
    this.setState({toolbarLeftOpen: false, toolbarRightOpen: false});
  }

  render() {
    return (
        <TouchableHighlight style={styles.bgButton} underlayColor={'transparent'}
          onPress={this.dismissToolbar.bind(this)}
        >
          <View style={styles.container}>
            <View style={styles.paragraph}>
              <Title style={styles.text}>Floating Action Button</Title>
              <Caption style={styles.text}>Simple floating button</Caption>
            </View>

            <FAB style={styles.faButton}
              buttonIcon={
                <Image source={require('../assets/help.png')} style={styles.icon}
                  />
              }>
            </FAB>

            <View style={styles.paragraph}>
              <Title style={styles.text}>FAB Toolbar</Title>
              <Caption style={styles.text}>
                Expands from left. Touch outside to dismiss
              </Caption>
            </View>

            <FAB style={styles.faButton}
              buttonIcon={
                <Image source={require('../assets/share.png')} style={styles.icon}
                />
              }
            >
              <FAB.Toolbar open={this.state.toolbarLeftOpen}>
                <View style={styles.toolbar}>
                  <Image source={require('../assets/facebook.png')}
                   style={styles.icon}
                  />
                  <Image source={require('../assets/twitter.png')}
                   style={styles.icon}
                  />
                  <Image source={require('../assets/snapchat.png')}
                   style={styles.icon}
                  />
                  <Image source={require('../assets/instagram.png')}
                   style={styles.icon}
                  />
                  <Image source={require('../assets/pinterest.png')}
                   style={styles.icon}
                  />
                </View>
              </FAB.Toolbar>
            </FAB>

            <View style={styles.paragraph}>
              <Caption style={styles.text}>
                Expands from right. Touch outside to dismiss
              </Caption>
            </View>

            <FAB style={styles.faButtonRight}
              buttonIcon={
                <Image source={require('../assets/share.png')} style={styles.icon}
                />
              }
            >
              <FAB.Toolbar open={this.state.toolbarRightOpen}
                direction={FAB.Toolbar.Direction.RIGHT}>
                <View style={styles.toolbar}>
                  <Image source={require('../assets/facebook.png')}
                   style={styles.icon}
                  />
                  <Image source={require('../assets/twitter.png')}
                   style={styles.icon}
                  />
                  <Image source={require('../assets/snapchat.png')}
                   style={styles.icon}
                  />
                  <Image source={require('../assets/instagram.png')}
                   style={styles.icon}
                  />
                  <Image source={require('../assets/pinterest.png')}
                   style={styles.icon}
                  />
                </View>
              </FAB.Toolbar>
            </FAB>
          </View>
        </TouchableHighlight>
    );
  }
}
const styles = StyleSheet.create({
  container: {
  },
  paragraph: {
    padding: 16
  },
  bgButton: {
    flex: 1,
  },
  text: {
    marginVertical: 4,
  },
  faButton: {
    paddingHorizontal: 16
  },
  faButtonRight: {
    position: 'absolute',
    right: 16
  },
  icon: {
    height: 24,
    width: 24
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  }
});
