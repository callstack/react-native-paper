import * as React from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import type { StyleProp } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import DialogActions from './DialogActions';
import DialogContent from './DialogContent';
import DialogIcon from './DialogIcon';
import DialogScrollArea from './DialogScrollArea';
import DialogTitle from './DialogTitle';
import { DialogTitleIdContext } from './utils';
import type { DialogChildProps } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { Elevation, ThemeProp } from '../../theme/types';
import type { OverlayFocusTarget } from '../../utils/useOverlayFocus';
import Button from '../Button/Button';
import Modal from '../Modal';
import type { SurfaceStyle } from '../Surface';
import Text from '../Typography/Text';

type CommonProps = {
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
   * Accessibility label for dismissing the dialog if it's `dismissable`.
   */
  dismissAccessibilityLabel?: string;
  /**
   * Accessible name for the dialog. On web, defaults to the text of `Dialog.Title`.
   */
  'aria-label'?: string;
  /**
   * Determines Whether the dialog is visible.
   */
  visible: boolean;
  /**
   * Element to focus when the dialog opens.
   *
   * By default, focus moves to the first focusable element inside the dialog on
   * web, or to the dialog itself when there is none. Focus that is already
   * inside, such as on an `autoFocus` field, stays where it is. On iOS, screen
   * reader focus moves to the dialog. On Android, TalkBack moves its focus to
   * the first element inside the dialog by itself.
   *
   * Accepts a host element, such as a `View` or `Pressable`. On iOS it receives
   * screen reader focus, not keyboard focus. A component handle with a
   * `focus()` method, such as the one of a `TextInput`, has `focus()` called.
   * TalkBack on Android follows neither.
   */
  initialFocusRef?: React.RefObject<OverlayFocusTarget | null>;
  /**
   * Element to focus when the dialog closes.
   *
   * On web, focus returns to the element that had it before the dialog opened,
   * and this prop picks another one. If that element is gone by then, such as a
   * list row the dialog deleted, focus goes back to the one that had it before.
   * On iOS and Android, nothing is restored unless this prop is given.
   *
   * Accepts a host element, such as a `View` or `Pressable`. On iOS it receives
   * screen reader focus, not keyboard focus. A component handle with a
   * `focus()` method, such as the one of a `TextInput`, has `focus()` called.
   * TalkBack on Android doesn't move to a host element.
   */
  restoreFocusRef?: React.RefObject<OverlayFocusTarget | null>;
  /**
   * Content of the `Dialog`.
   */
  children: React.ReactNode;
  style?: StyleProp<SurfaceStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * testID to be used on tests.
   */
  testID?: string;
  /**
   * testID for the overlay that is displayed behind the dialog.
   */
  overlayTestID?: string;
};

const DIALOG_ELEVATION: Elevation = 3;

const renderChildren = (children: React.ReactNode) => {
  const dialogChildren = React.Children.toArray(children).filter(
    (child) => child != null && typeof child !== 'boolean'
  );
  const hasIcon = dialogChildren.some(
    (child) => React.isValidElement(child) && child.type === DialogIcon
  );

  return dialogChildren.map((child, i) => {
    if (React.isValidElement<DialogChildProps>(child)) {
      const topMarginStyle =
        i === 0 && child.type !== DialogIcon ? styles.firstChild : undefined;
      const titleAlignmentStyle =
        hasIcon && child.type === DialogTitle
          ? styles.titleWithIcon
          : undefined;

      if (topMarginStyle || titleAlignmentStyle) {
        return React.cloneElement(child, {
          style: [topMarginStyle, child.props.style, titleAlignmentStyle],
        });
      }
    }

    return child;
  });
};

/**
 * Dialogs inform users about a specific task and may contain critical information, require decisions, or involve multiple tasks.
 *
 * ## Recommended props
 *
 * | Prop | Type | Description |
 * | --- | --- | --- |
 * | `icon` | `IconSource` | Icon rendered through `Dialog.Icon`. |
 * | `title` | `ReactNode` | Dialog title rendered through `Dialog.Title`. |
 * | `content` | `ReactNode` | Required dialog content. Non-empty strings use Material 3 supporting-text styles. |
 * | `actions` | `DialogActionsProps[]` | Action labels, press handlers, and optional Button props. |
 * | `scrollable` | `boolean` | Renders content through `Dialog.ScrollArea` and a `ScrollView`. |
 * | `contentProps` | `DialogContentProps` | Props forwarded to `Dialog.Content`. |
 * | `scrollAreaProps` | `DialogScrollAreaProps` | Props forwarded to `Dialog.ScrollArea`. |
 * | `scrollViewProps` | `ScrollViewProps` | Props forwarded to the `ScrollView`. |
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { Button, Dialog, PaperProvider } from 'react-native-paper';
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
 *         <Dialog
 *           visible={visible}
 *           onDismiss={hideDialog}
 *           title="Alert"
 *           content="This is simple dialog"
 *           actions={[{ label: 'Done', onPress: hideDialog }]}
 *         />
 *       </View>
 *     </PaperProvider>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 *
 * ## Compound composition
 *
 * `Dialog.Icon`, `Dialog.Title`, `Dialog.Content`, `Dialog.ScrollArea`, and
 * `Dialog.Actions` remain available for custom composition within `Dialog`.
 * Passing them through `children` is deprecated; prefer the props above.
 *
 * ## Migrating from children
 *
 * ```js
 * // Before
 * <Dialog visible={visible} onDismiss={hideDialog}>
 *   <Dialog.Title>Alert</Dialog.Title>
 *   <Dialog.Content><Text>Something happened.</Text></Dialog.Content>
 *   <Dialog.Actions><Button onPress={hideDialog}>Done</Button></Dialog.Actions>
 * </Dialog>
 *
 * // After
 * <Dialog
 *   visible={visible}
 *   onDismiss={hideDialog}
 *   title="Alert"
 *   content="Something happened."
 *   actions={[{ label: 'Done', onPress: hideDialog }]}
 * />
 * ```
 */
const Dialog = ({
  children,
  dismissable = true,
  dismissableBackButton = dismissable,
  onDismiss,
  dismissAccessibilityLabel,
  'aria-label': ariaLabel,
  visible = false,
  initialFocusRef,
  restoreFocusRef,
  style,
  theme: themeOverrides,
  testID,
  overlayTestID,
  ...props
}: Props) => {
  const { right, left } = useSafeAreaInsets();

  const theme = useInternalTheme(themeOverrides);
  const borderRadius = theme.shapes.corner.extraLarge;

  const backgroundColor = theme.colors.surfaceContainerHigh;

  const titleId = React.useId();

  const _children = React.useMemo(() => {
    if (children) return children;

    const {
      actions,
      content,
      icon,
      scrollable,
      contentProps,
      scrollAreaProps,
      scrollViewProps,
      title,
    } = props;

    const dialogIcon = icon ? (
      <DialogIcon icon={icon} key="dialogIcon" />
    ) : null;
    const dialogTitle = title ? <DialogTitle>{title}</DialogTitle> : null;

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

    const dialogContent = scrollable ? (
      <DialogScrollArea
        key="dialogScrollArea"
        {...scrollAreaProps}
        style={scrollAreaProps?.style}
      >
        <ScrollView {...scrollViewProps}>{contentNode}</ScrollView>
      </DialogScrollArea>
    ) : (
      <DialogContent
        key="dialogContent"
        {...contentProps}
        style={contentProps?.style}
      >
        {contentNode}
      </DialogContent>
    );

    const dialogActions = actions?.length ? (
      <DialogActions key="dialogActions">
        {actions.map(
          ({ label, onPress: onActionPress, ...buttonProps }, index) => (
            <Button
              key={index}
              mode="text"
              {...buttonProps}
              onPress={onActionPress}
            >
              {label}
            </Button>
          )
        )}
      </DialogActions>
    ) : null;

    return [dialogIcon, dialogTitle, dialogContent, dialogActions];
  }, [children, props, theme.colors.onSurfaceVariant]);

  return (
    <Modal
      aria-label={ariaLabel}
      aria-labelledby={ariaLabel == null ? titleId : undefined}
      dismissable={dismissable}
      dismissableBackButton={dismissableBackButton}
      onDismiss={onDismiss}
      dismissAccessibilityLabel={dismissAccessibilityLabel}
      visible={visible}
      initialFocusRef={initialFocusRef}
      restoreFocusRef={restoreFocusRef}
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
      overlayTestID={overlayTestID}
    >
      <DialogTitleIdContext.Provider value={titleId}>
        {renderChildren(_children)}
      </DialogTitleIdContext.Provider>
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
