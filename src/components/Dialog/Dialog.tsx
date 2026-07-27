import * as React from 'react';
import { Animated, Platform, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import DialogActions from './DialogActions';
import DialogContent from './DialogContent';
import DialogIcon from './DialogIcon';
import DialogScrollArea from './DialogScrollArea';
import DialogTitle from './DialogTitle';
import type { DialogAction, DialogChildProps } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { Theme, ThemeProp } from '../../types';
import Button from '../Button/Button';
import type { IconSource } from '../Icon';
import Modal from '../Modal';
import Text from '../Typography/Text';

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
   * Icon to display at the top of the dialog, above the title (MD3).
   * Only used by the declarative API; ignored when `children` are provided.
   */
  icon?: IconSource;
  /**
   * Title of the dialog. When provided (and `children` are omitted), it is
   * rendered inside a `Dialog.Title`. Accepts a string or any React node.
   */
  title?: React.ReactNode;
  /**
   * Supporting text of the dialog. When provided (and `children` are omitted),
   * it is rendered inside a `Dialog.Content`. A string is wrapped in a themed
   * `Text`; any other node is rendered as-is.
   */
  content?: React.ReactNode;
  /**
   * List of action buttons rendered inside a `Dialog.Actions` row. Only used by
   * the declarative API; ignored when `children` are provided.
   */
  actions?: DialogAction[];
  /**
   * Content of the `Dialog`. When provided, the declarative `icon` / `title` /
   * `content` / `actions` props are ignored and the composition API is used.
   */
  children?: React.ReactNode;
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
 * To render the `Dialog` above other components, you'll need to wrap it with the [`Portal`](../Portal) component.
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
 *
 * Alternatively, the dialog can be described declaratively via the `icon`,
 * `title`, `content` and `actions` props instead of composing children:
 *
 * ```js
 * <Portal>
 *   <Dialog
 *     visible={visible}
 *     onDismiss={hideDialog}
 *     title="Delete item"
 *     content="Are you sure? This action cannot be undone."
 *     actions={[
 *       { label: 'Cancel', onPress: hideDialog },
 *       { label: 'Delete', onPress: onConfirmDelete },
 *     ]}
 *   />
 * </Portal>
 * ```
 */
const Dialog = ({
  children,
  icon,
  title,
  content,
  actions,
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
  const borderRadius = (theme as Theme).shapes.corner.extraLarge;

  const backgroundColor = theme.colors.surfaceContainerHigh;

  const hasDeclarativeProps =
    icon != null || title != null || content != null || actions != null;

  if (__DEV__ && children != null && hasDeclarativeProps) {
    console.warn(
      'Dialog: `children` was provided together with the declarative ' +
        '`icon`/`title`/`content`/`actions` props. `children` take precedence ' +
        'and the declarative props are ignored. Use one API or the other.'
    );
  }

  // Build the composition tree from the declarative props when no explicit
  // `children` are passed. This keeps the existing children-based API fully
  // backward compatible while offering a simpler declarative alternative.
  const dialogChildren = React.useMemo(() => {
    if (children != null) {
      return children;
    }

    const centered = icon != null;
    const items: React.ReactNode[] = [];

    if (icon != null) {
      items.push(<DialogIcon key="icon" icon={icon} />);
    }

    if (title != null) {
      items.push(
        <DialogTitle
          key="title"
          style={centered ? styles.centeredTitle : undefined}
        >
          {title}
        </DialogTitle>
      );
    }

    if (content != null) {
      items.push(
        <DialogContent key="content">
          {typeof content === 'string' ? (
            <Text
              variant="bodyMedium"
              style={[
                { color: theme.colors.onSurfaceVariant },
                centered && styles.centeredContent,
              ]}
            >
              {content}
            </Text>
          ) : (
            content
          )}
        </DialogContent>
      );
    }

    if (actions != null && actions.length > 0) {
      items.push(
        <DialogActions key="actions">
          {actions.map((action, i) => (
            <Button
              key={action.key ?? i}
              mode={action.mode ?? 'text'}
              onPress={action.onPress}
              icon={action.icon}
              loading={action.loading}
              disabled={action.disabled}
              labelStyle={action.labelStyle}
              testID={action.testID}
            >
              {action.label}
            </Button>
          ))}
        </DialogActions>
      );
    }

    return items;
  }, [children, icon, title, content, actions, theme.colors.onSurfaceVariant]);

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
      {React.Children.toArray(dialogChildren)
        .filter((child) => child != null && typeof child !== 'boolean')
        .map((child, i) => {
          if (i === 0 && React.isValidElement<DialogChildProps>(child)) {
            return React.cloneElement(child, {
              style: [{ marginTop: 24 }, child.props.style],
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
  centeredTitle: {
    textAlign: 'center',
  },
  centeredContent: {
    textAlign: 'center',
  },
});

export default Dialog;
