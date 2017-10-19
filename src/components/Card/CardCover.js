/* @flow */

import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import withTheme from '../../core/withTheme';
import { grey200 } from '../../styles/colors';
import type { Theme } from '../../types/Theme';

type Props = {
  index?: number,
  total?: number,
  style?: any,
  theme: Theme,
};

const CardCover = (props: Props) => {
  const { index, total, style, theme } = props;
  const { roundness } = theme;

  let coverStyle;

  if (index === 0) {
    if (total === 1) {
      coverStyle = {
        borderRadius: roundness,
      };
    } else {
      coverStyle = {
        borderTopLeftRadius: roundness,
        borderTopRightRadius: roundness,
      };
    }
  } else {
    if (typeof total === 'number' && index === total - 1) {
      coverStyle = {
        borderBottomLeftRadius: roundness,
      };
    }
  }

  return (
    <View style={[styles.container, coverStyle, style]}>
      <Image {...props} style={[styles.image, coverStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 195,
    backgroundColor: grey200,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    height: null,
    width: null,
    padding: 16,
    justifyContent: 'flex-end',
    resizeMode: 'cover',
  },
});

export default withTheme(CardCover);
