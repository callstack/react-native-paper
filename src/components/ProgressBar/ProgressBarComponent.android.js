/* @flow */

import * as React from 'react';
import { ProgressBarAndroid } from 'react-native';

export default function BaseProgressBarAndroid({
  progressTintColor,
  ...rest
}: *) {
  return (
    <ProgressBarAndroid
      {...rest}
      styleAttr="Horizontal"
      indeterminate={false}
      color={progressTintColor}
    />
  );
}
