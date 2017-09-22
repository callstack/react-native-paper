/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ProgressBarAndroid,
  ProgressViewIOS,
  Platform,
  StyleSheet,
} from 'react-native';
import withTheme from '../core/withTheme';
import type { Theme } from '../types/Theme';
import setColor from 'color';

type Props = {
  progress: number,
  color?: string,
  style?: any,
  theme: Theme,
};

export const progressProps = {
  styleAttr: 'Horizontal',
  indeterminate: false,
};

/**
* Progress bar is an indicator used to present some activity in the app
*/
const ProgressBar = ({ progress, color, style, theme }: Props) => {
  const ProgressBarComponent =
    Platform.OS === 'ios' ? ProgressViewIOS : ProgressBarAndroid;

  const setTintColor = color => {
    return setColor(color).alpha(0.38).rgbaString();
  };

  return (
    <View>
      <ProgressBarComponent
        {...progressProps}
        progress={progress}
        progressTintColor={color || theme.colors.primary}
        color={color || theme.colors.primary}
        style={[styles.progressBarHeight, style]}
        trackTintColor={setTintColor(color || theme.colors.primary)}
      />
    </View>
  );
};

ProgressBar.propTypes = {
  /**
  * Progress value (between 0 and 1)
  */
  progress: PropTypes.number,
  /**
  * Color of the progress bar
  */
  color: PropTypes.string,
  style: PropTypes.any,
  theme: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  progressBarHeight: {
    height: 40,
  },
});

export default withTheme(ProgressBar);
