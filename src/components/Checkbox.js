/* @flow */

import React, {
  PropTypes,
} from 'react';
import {
  StyleSheet,
} from 'react-native';
import color from 'color';
import Icon from './Icon';
import TouchableRipple from './TouchableRipple';
import withTheme from '../core/withTheme';
import type { Theme } from '../types/Theme';

type Props = {
  checked: boolean;
  disabled?: boolean;
  onPress?: Function;
  color?: string;
  theme: Theme;
}

const Checkbox = (props: Props) => {
  const {
    checked,
    disabled,
    onPress,
    theme,
  } = props;

  const checkboxColor = props.color || theme.colors.primary;

  let rippleColor, checkboxStyle;

  if (disabled) {
    rippleColor = 'rgba(0, 0, 0, .16)';
    checkboxStyle = { color: 'rgba(0, 0, 0, .26)' };
  } else {
    rippleColor = color(checkboxColor).clearer(0.32).rgbaString();
    if (checked) {
      checkboxStyle = { color: checkboxColor };
    }
  }

  return (
    <TouchableRipple
      {...props}
      borderless
      rippleColor={rippleColor}
      onPress={disabled ? undefined : onPress}
      style={styles.container}
    >
      <Icon
        name={checked ? 'check-box' : 'check-box-outline-blank'}
        size={24}
        style={[ styles.checkbox, checkboxStyle ]}
      />
    </TouchableRipple>
  );
};

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  color: PropTypes.string,
  theme: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
  },

  checkbox: {
    /* FIXME: using opacity doesn't work properly with TouchableHighlight */
    color: 'rgba(0, 0, 0, .54)',
    margin: 6,
  },
});

export default withTheme(Checkbox);
