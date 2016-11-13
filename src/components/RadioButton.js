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

const RadioButton = (props: Props) => {
  const {
    checked,
    disabled,
    onPress,
    theme,
  } = props;

  const radioColor = props.color || theme.colors.primary;

  let rippleColor, radioStyle;

  if (disabled) {
    rippleColor = 'rgba(0, 0, 0, .16)';
    radioStyle = { color: 'rgba(0, 0, 0, .26)' };
  } else {
    rippleColor = color(radioColor).clearer(0.32).rgbaString();
    if (checked) {
      radioStyle = { color: radioColor };
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
        name={checked ? 'radio-button-checked' : 'radio-button-unchecked'}
        size={24}
        style={[ styles.radio, radioStyle ]}
      />
    </TouchableRipple>
  );
};

RadioButton.propTypes = {
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

  radio: {
    /* FIXME: using opacity doesn't work properly with TouchableHighlight */
    color: 'rgba(0, 0, 0, .54)',
    margin: 6,
  },
});

export default withTheme(RadioButton);
