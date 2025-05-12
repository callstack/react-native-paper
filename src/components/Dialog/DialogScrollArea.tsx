import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import type { ThemeProp } from 'src/types';

import { useInternalTheme } from '../../core/theming';

export type Props = React.ComponentPropsWithRef<typeof View> & {
  /**
   * Content of the `DialogScrollArea`.
   */
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * A component to show a scrollable content in a Dialog. The component only provides appropriate styling.
 * For the scrollable content you can use `ScrollView`, `FlatList` etc. depending on your requirement.
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
  const { colors } = useInternalTheme(props.theme);

  return (
    <View
      {...props}
      style={[
        { borderColor: colors.surfaceVariant },
        styles.container,
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
    marginBottom: 24,
    flexGrow: 1,
    flexShrink: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
});

export default DialogScrollArea;
