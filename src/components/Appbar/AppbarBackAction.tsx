import * as React from 'react';
import {
  View,
  Image,
  I18nManager,
  StyleSheet,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { $Omit } from './../../types';
import AppbarAction from './AppbarAction';
import MaterialCommunityIcon from '../MaterialCommunityIcon';

type Props = $Omit<
  React.ComponentPropsWithoutRef<typeof AppbarAction>,
  'icon'
> & {
  /**
   *  Custom color for back icon.
   */
  color?: string;
  /**
   * Optional icon size.
   */
  size?: number;
  /**
   * Whether the button is disabled. A disabled button is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean;
  /**
   * Accessibility label for the button. This is read by the screen reader when the user taps the button.
   */
  accessibilityLabel?: string;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * A component used to display a back button in the appbar.
 */
class AppbarBackAction extends React.Component<Props> {
  static displayName = 'Appbar.BackAction';

  static defaultProps = {
    accessibilityLabel: 'Back',
  };

  render() {
    return (
      <AppbarAction
        {...this.props}
        icon={({ size, color }: { size: number; color: string }) =>
          Platform.OS === 'ios' ? (
            <View
              style={[
                styles.wrapper,
                {
                  width: size,
                  height: size,
                  transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                },
              ]}
            >
              <Image
                source={require('../../assets/back-chevron.png')}
                style={[styles.icon, { tintColor: color }]}
              />
            </View>
          ) : (
            <MaterialCommunityIcon
              name="arrow-left"
              color={color}
              size={size}
              direction={I18nManager.isRTL ? 'rtl' : 'ltr'}
            />
          )
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: 21,
    width: 21,
    resizeMode: 'contain',
  },
});

export default AppbarBackAction;
