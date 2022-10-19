import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useInternalTheme } from '../../core/theming';

export type Props = React.ComponentPropsWithRef<typeof View> & {
  /**
   * Content of the `DialogScrollArea`.
   */
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * A component to show a scrollable content in a Dialog. The component only provides appropriate styling.
 * For the scrollable content you can use `ScrollView`, `FlatList` etc. depending on your requirement.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="small" src="screenshots/dialog-scroll-area.gif" />
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { ScrollView } from 'react-native';
 * import { Dialog, Portal, Text } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [visible, setVisible] = React.useState(false);
 *
 *   const hideDialog = () => setVisible(false);
 *
 *   return (
 *     <Portal>
 *       <Dialog visible={visible} onDismiss={hideDialog}>
 *         <Dialog.ScrollArea>
 *           <ScrollView contentContainerStyle={{paddingHorizontal: 24}}>
 *             <Text>This is a scrollable area</Text>
 *           </ScrollView>
 *         </Dialog.ScrollArea>
 *       </Dialog>
 *     </Portal>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const DialogScrollArea = (props: Props) => {
  const theme = useInternalTheme();
  const borderStyles = {
    borderColor: theme.isV3
      ? theme.colors.surfaceVariant
      : 'rgba(0, 0, 0, .12)',
    borderTopWidth: theme.isV3 ? 1 : StyleSheet.hairlineWidth,
    borderBottomWidth: theme.isV3 ? 1 : StyleSheet.hairlineWidth,
  };
  return (
    <View
      {...props}
      style={[
        styles.container,
        borderStyles,
        theme.isV3 && styles.v3Container,
        props.style,
      ]}
    >
      {props.children}
    </View>
  );
};

DialogScrollArea.displayName = 'Dialog.ScrollArea';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    flexGrow: 1,
    flexShrink: 1,
  },
  v3Container: {
    marginBottom: 24,
  },
});

export default DialogScrollArea;
