/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

type Props = {
  index?: number,
  total?: number,
  siblings?: Array<string>,
  style?: any,
};

const CardContent = (props: Props) => {
  const { index, total, siblings, style } = props;
  const cover = 'withTheme(CardCover)';

  let contentStyle, prev, next;

  if (typeof index === 'number' && siblings) {
    prev = siblings[index - 1];
    next = siblings[index + 1];
  }

  if ((prev === cover && next === cover) || total === 1) {
    contentStyle = styles.only;
  } else {
    if (index === 0) {
      if (next === cover) {
        contentStyle = styles.only;
      } else {
        contentStyle = styles.first;
      }
    } else if (typeof total === 'number' && index === total - 1) {
      if (prev === cover) {
        contentStyle = styles.only;
      } else {
        contentStyle = styles.last;
      }
    } else {
      if (prev === cover) {
        contentStyle = styles.first;
      } else if (next === cover) {
        contentStyle = styles.last;
      }
    }
  }

  return <View {...props} style={[styles.container, contentStyle, style]} />;
};

CardContent.propTypes = {
  index: PropTypes.number,
  total: PropTypes.number,
  siblings: PropTypes.arrayOf(PropTypes.string),
  style: View.propTypes.style,
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  first: {
    paddingTop: 16,
  },
  last: {
    paddingBottom: 16,
  },
  only: {
    paddingVertical: 16,
  },
});

export default CardContent;
