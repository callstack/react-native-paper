import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import Link from '../../../src/components/Link';
import ScreenWrapper from '../ScreenWrapper';

const LinkExample = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Link
          href="https://callstack.github.io/react-native-paper"
          underline
          style={styles.link}
        >
          React native paper
        </Link>
        <Link
          href="https://google.com"
          size="titleLarge"
          position="center"
          style={styles.link}
        >
          Google
        </Link>
        <Link
          href="https://facebook.com"
          size="bodyLarge"
          position="right"
          style={styles.link}
        >
          Facebook
        </Link>
        <Link
          href="https://callstack.github.io"
          size="headlineLarge"
          style={styles.link}
        >
          Instagram
        </Link>
      </View>
    </ScreenWrapper>
  );
};

LinkExample.title = 'Link';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  link: {
    marginVertical: 10,
  },
});

export default LinkExample;
