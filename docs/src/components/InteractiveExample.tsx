import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { DarkTheme, LightTheme, Provider, Text } from 'react-native-paper';

import { useColorMode } from './theme-common';

/**
 * Row of demo variations, wrapping on narrow viewports.
 */
export const ExampleRow = ({ children }: React.PropsWithChildren) => (
  <View style={styles.row}>{children}</View>
);

/**
 * A single demo variation captioned with the prop value it illustrates.
 */
export const Labelled = ({
  label,
  children,
}: React.PropsWithChildren<{ label: string }>) => (
  <View style={styles.item}>
    {children}
    <Text style={styles.itemLabel}>{label}</Text>
  </View>
);

type InteractiveExampleProps = React.PropsWithChildren<{
  /**
   * Short caption rendered above the live preview, describing what the
   * example demonstrates.
   */
  title?: string;
}>;

/**
 * Shared shell for live component demos embedded in the docs.
 *
 * The Paper theme follows the active docs color mode so demos match the
 * surrounding page.
 */
const InteractiveExample = ({ title, children }: InteractiveExampleProps) => {
  const isDarkTheme = useColorMode().colorMode === 'dark';

  return (
    <Provider theme={isDarkTheme ? DarkTheme : LightTheme}>
      <figure className="paper-interactive-example">
        {title ? (
          <figcaption className="paper-interactive-example__title">
            {title}
          </figcaption>
        ) : null}
        <View style={styles.content}>{children}</View>
      </figure>
    </Provider>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 24,
  },
  item: {
    alignItems: 'center',
    gap: 8,
  },
  itemLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
});

export default InteractiveExample;
