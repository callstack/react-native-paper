import * as React from 'react';
import {
  Animated,
  Platform,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import DialogActions from './DialogActions';
import DialogContent from './DialogContent';
import DialogIcon from './DialogIcon';
import DialogScrollArea from './DialogScrollArea';
import DialogTitle from './DialogTitle';
import { useInternalTheme } from '../../core/theming';
import overlay from '../../styles/overlay';
import type { ThemeProp } from '../../types';
import Modal from '../Modal';
import { DialogChildProps } from './utils';

export type Props = {
  /**
   * Determines whether clicking outside the dialog dismiss it.
   */
  dismissable?: boolean;
  /**
   * Determines whether clicking Android hardware back button dismiss dialog.
   */
  dismissableBackButton?: boolean;
  /**
   * Callback that is called when the user dismisses the dialog.
   */
  onDismiss?: () => void;
  /**
   * Determines Whether the dialog is visible.
   */
  visible: boolean;
  /**
   * Content of the `Dialog`.
   */
  children: React.ReactNode;
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * testID to be used on tests.
   */
  testID?: string;
};

const DIALOG_ELEVATION: number = 24;

/**
 * Dialogs inform users about a specific task and may contain critical information, require decisions, or involve multiple tasks.
 * To render the `Dialog` above other components, you'll need to wrap it with the [`Portal`](../../Portal) component.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { Button, Dialog, Portal, PaperProvider, Text } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [visible, setVisible] = React.useState(false);
 *
 *   const showDialog = () => setVisible(true);
 *
 *   const hideDialog = () => setVisible(false);
 *
 *   return (
 *     <PaperProvider>
 *       <View>
 *         <Button onPress={showDialog}>Show Dialog</Button>
 *         <Portal>
 *           <Dialog visible={visible} onDismiss={hideDialog}>
 *             <Dialog.Title>Alert</Dialog.Title>
 *             <Dialog.Content>
 *               <Text variant="bodyMedium">This is simple dialog</Text>
 *             </Dialog.Content>
 *             <Dialog.Actions>
 *               <Button onPress={hideDialog}>Done</Button>
 *             </Dialog.Actions>
 *           </Dialog>
 *         </Portal>
 *       </View>
 *     </PaperProvider>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const Dialog = ({
  children,
  dismissable = true,
  dismissableBackButton = dismissable,
  onDismiss,
  visible = false,
  style,
  theme: themeOverrides,
  testID,
}: Props) => {
  const { right, left } = useSafeAreaInsets();
  const theme = useInternalTheme(themeOverrides);
  const { isV3, dark, mode, colors, roundness } = theme;
  const borderRadius = (isV3 ? 7 : 1) * roundness;

  const backgroundColorV2 =
    dark && mode === 'adaptive'
      ? overlay(DIALOG_ELEVATION, colors?.surface)
      : colors?.surface;
  const backgroundColor = isV3
    ? theme.colors.elevation.level3
    : backgroundColorV2;

  return (
    <Modal
      dismissable={dismissable}
      dismissableBackButton={dismissableBackButton}
      onDismiss={onDismiss}
      visible={visible}
      contentContainerStyle={[
        {
          borderRadius,
          backgroundColor,
          marginHorizontal: Math.max(left, right, 26),
        },
        styles.container,
        style,
      ]}
      theme={theme}
      testID={testID}
    >
      {React.Children.toArray(children)
        .filter((child) => child != null && typeof child !== 'boolean')
        .map((child, i) => {
          if (isV3) {
            if (i === 0 && React.isValidElement<DialogChildProps>(child)) {
              return React.cloneElement(child, {
                style: [{ marginTop: 24 }, child.props.style],
              });
            }
          }

          if (
            i === 0 &&
            React.isValidElement<DialogChildProps>(child) &&
            child.type === DialogContent
          ) {
            // Dialog content is the first item, so we add a top padding
            return React.cloneElement(child, {
              style: [{ paddingTop: 24 }, child.props.style],
            });
          }

          return child;
        })}
    </Modal>
  );
};

// @component ./DialogContent.tsx
Dialog.Content = DialogContent;
// @component ./DialogActions.tsx
Dialog.Actions = DialogActions;
// @component ./DialogTitle.tsx
Dialog.Title = DialogTitle;
// @component ./DialogScrollArea.tsx
Dialog.ScrollArea = DialogScrollArea;
// @component ./DialogIcon.tsx
Dialog.Icon = DialogIcon;

const styles = StyleSheet.create({
  container: {
    /**
     * This prevents the shadow from being clipped on Android since Android
     * doesn't support `overflow: visible`.
     * One downside for this fix is that it will disable clicks on the area
     * of the shadow around the dialog, consequently, if you click around the
     * dialog (44 pixel from the top and bottom) it won't be dismissed.
     */
    marginVertical: Platform.OS === 'android' ? 44 : 0,
    elevation: DIALOG_ELEVATION,
    justifyContent: 'flex-start',
  },
});

export default Dialog;
