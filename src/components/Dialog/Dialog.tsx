import * as React from 'react';
import { StyleSheet, Platform, StyleProp, ViewStyle } from 'react-native';
import Modal from '../Modal';
import DialogContent from './DialogContent';
import DialogActions from './DialogActions';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import DialogTitle, { DialogTitle as _DialogTitle } from './DialogTitle';
import DialogScrollArea from './DialogScrollArea';
import { withTheme } from '../../core/theming';
import overlay from '../../styles/overlay';

export type Props = {
  /**
   * Determines whether clicking outside the dialog dismiss it.
   */
  dismissable?: boolean;
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
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
};

const DIALOG_ELEVATION: number = 24;

/**
 * Dialogs inform users about a specific task and may contain critical information, require decisions, or involve multiple tasks.
 * To render the `Dialog` above other components, you'll need to wrap it with the [`Portal`](portal.html) component.
 *
 *  <div class="screenshots">
 *   <img class="medium" src="screenshots/dialog-1.png" />
 *   <img class="medium" src="screenshots/dialog-2.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { Button, Paragraph, Dialog, Portal, Provider } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [visible, setVisible] = React.useState(false);
 *
 *   const showDialog = () => setVisible(true);
 *
 *   const hideDialog = () => setVisible(false);
 *
 *   return (
 *     <Provider>
 *       <View>
 *         <Button onPress={showDialog}>Show Dialog</Button>
 *         <Portal>
 *           <Dialog visible={visible} onDismiss={hideDialog}>
 *             <Dialog.Title>Alert</Dialog.Title>
 *             <Dialog.Content>
 *               <Paragraph>This is simple dialog</Paragraph>
 *             </Dialog.Content>
 *             <Dialog.Actions>
 *               <Button onPress={hideDialog}>Done</Button>
 *             </Dialog.Actions>
 *           </Dialog>
 *         </Portal>
 *       </View>
 *     </Provider>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const Dialog = ({
  children,
  dismissable = true,
  onDismiss,
  visible = false,
  style,
  theme,
}: Props) => (
  <Modal
    dismissable={dismissable}
    onDismiss={onDismiss}
    visible={visible}
    contentContainerStyle={[
      {
        borderRadius: theme.roundness,
        backgroundColor:
          theme.dark && theme.mode === 'adaptive'
            ? overlay(DIALOG_ELEVATION, theme.colors.surface)
            : theme.colors.surface,
      },
      styles.container,
      style,
    ]}
    theme={theme}
  >
    {React.Children.toArray(children)
      .filter((child) => child != null && typeof child !== 'boolean')
      .map((child, i) => {
        if (
          i === 0 &&
          React.isValidElement(child) &&
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

// @component ./DialogContent.tsx
Dialog.Content = DialogContent;
// @component ./DialogActions.tsx
Dialog.Actions = DialogActions;
// @component ./DialogTitle.tsx
Dialog.Title = DialogTitle;
// @component ./DialogScrollArea.tsx
Dialog.ScrollArea = DialogScrollArea;

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
    marginHorizontal: 26,
    elevation: DIALOG_ELEVATION,
    justifyContent: 'flex-start',
  },
});

export default withTheme(Dialog);
