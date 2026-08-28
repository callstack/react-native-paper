import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import type { StyleProp } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import DialogActions from './DialogActions';
import DialogContent from './DialogContent';
import DialogIcon from './DialogIcon';
import DialogScrollArea from './DialogScrollArea';
import DialogTitle from './DialogTitle';
import { useInternalTheme } from '../../core/theming';
import type { Elevation, ThemeProp } from '../../types';
import type { IconSource } from '../Icon';
import Modal from '../Modal';

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
  icon?: IconSource;
  /**
   * Title of the dialog.
   */
  title?: React.ReactNode;
  /**
   * Content of the dialog. Non-empty strings are rendered as Material 3
   * supporting text.
   */
  content?: React.ReactNode;
  /**
   * Action buttons displayed at the bottom of the dialog.
   * Keep their order stable between renders.
   */
  actions?: React.ReactNode[];
  /**
   * Whether to render the content in a `ScrollView` within the dialog scroll
   * area.
   */
  scrollable?: boolean;
  /**
   * Props passed to `Dialog.Content` when `scrollable` is not enabled.
   */
  contentProps?: Omit<DialogContentProps, 'children'>;
  /**
   * Props passed to `Dialog.ScrollArea` when `scrollable` is enabled.
   */
  scrollAreaProps?: Omit<DialogScrollAreaProps, 'children'>;
  /**
   * Props passed to the `ScrollView` when `scrollable` is enabled.
   */
  scrollViewProps?: Omit<ScrollViewProps, 'children'>;
  /**
   * Accessibility label for the dialog. This is read by the screen reader when the user opens a dialog.
   */
  'aria-label'?: string;
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

const DIALOG_ELEVATION: Elevation = 3;

/**
 * Dialogs inform users about a specific task and may contain critical information, require decisions, or involve multiple tasks.
 * To render the `Dialog` above other components, you'll need to wrap it with the [`Portal`](../Portal) component.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { Button, Dialog, Portal, PaperProvider } from 'react-native-paper';
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
 *           <Dialog
 *             visible={visible}
 *             onDismiss={hideDialog}
 *             title="Alert"
 *             content="This is simple dialog"
 *             actions={[{ label: 'Done', onPress: hideDialog }]}
 *           />
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
  dismissable = true,
  dismissableBackButton = dismissable,
  onDismiss,
  visible = false,
  style,
  theme: themeOverrides,
  testID,
  actions,
  content,
  icon,
  scrollable,
  contentProps,
  scrollAreaProps,
  scrollViewProps,
  title,
  'aria-label': ariaLabel,
}: Props) => {
  const { right, left } = useSafeAreaInsets();

  const theme = useInternalTheme(themeOverrides);
  const borderRadius = theme.shapes.corner.extraLarge;

  const backgroundColor = theme.colors.surfaceContainerHigh;

  const contentNode =
    typeof content === 'string' ? (
      <Text
        variant="bodyMedium"
        style={{ color: theme.colors.onSurfaceVariant }}
      >
        {content}
      </Text>
    ) : (
      content
    );

  return (
    <Modal
      dismissable={dismissable}
      dismissableBackButton={dismissableBackButton}
      onDismiss={onDismiss}
      visible={visible}
      contentBackgroundColor={backgroundColor}
      contentBorderRadius={borderRadius}
      contentElevation={DIALOG_ELEVATION}
      contentContainerStyle={[
        {
          marginHorizontal: Math.max(left, right, 26),
        },
        styles.container,
        style,
      ]}
      theme={theme}
      testID={testID}
      aria-label={typeof title === 'string' ? title : ariaLabel}
    >
      {icon ? <DialogIcon icon={icon} /> : null}

      {title ? (
        <DialogTitle
          style={{
            ...(icon ? styles.titleWithIcon : styles.firstChild),
          }}
        >
          {title}
        </DialogTitle>
      ) : null}

      {scrollable ? (
        <DialogScrollArea
          {...scrollAreaProps}
          style={{
            ...(!title ? styles.firstChild : {}),
            ...scrollAreaProps?.style,
          }}
        >
          <ScrollView {...scrollViewProps}>{contentNode}</ScrollView>
        </DialogScrollArea>
      ) : (
        <DialogContent
          {...contentProps}
          style={{
            ...(!title ? styles.firstChild : {}),
            ...contentProps?.style,
          }}
        >
          {contentNode}
        </DialogContent>
      )}

      {actions?.length ? <Dialog.Actions>{actions}</Dialog.Actions> : null}
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
    justifyContent: 'flex-start',
    minWidth: 280,
    maxWidth: 560,
  },
  titleWithIcon: {
    textAlign: 'center',
  },
  firstChild: {
    marginTop: 24,
  },
});

export default Dialog;
