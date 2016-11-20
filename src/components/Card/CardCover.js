/* @flow */

import React, { PropTypes } from 'react';
import {
  StyleSheet,
  Image,
} from 'react-native';
import { grey200 } from '../../styles/colors';

type Props = {
  index?: number;
  total?: number;
  style?: any;
}

const CardCover = (props: Props) => {
  const { index, total, style } = props;

  let coverStyle;

  if (index === 0) {
    if (total === 1) {
      coverStyle = styles.only;
    } else {
      coverStyle = styles.first;
    }
  } else {
    if (typeof total === 'number' && index === (total - 1)) {
      coverStyle = styles.last;
    }
  }

  return <Image {...props} style={[ styles.container, coverStyle, style ]} />;
};

CardCover.propTypes = {
  index: PropTypes.number,
  total: PropTypes.number,
  style: Image.propTypes.style,
};

const styles = StyleSheet.create({
  container: {
    height: 195,
    width: null,
    padding: 16,
    justifyContent: 'flex-end',
    backgroundColor: grey200,
    resizeMode: 'cover',
  },
  first: {
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  last: {
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  only: {
    borderRadius: 2,
  },
});

export default CardCover;
