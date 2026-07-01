import * as React from 'react';
import { Animated, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { getSearchbarColors } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import Surface from '../Surface';

export type Props = {
  /**
   * Search results / suggestions to render inside the container.
   */
  children: React.ReactNode;
  /**
   * Changes the container's shadow and background.
   */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5 | Animated.Value;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * TestID used for testing purposes
   */
  testID?: string;
};

/**
 * A container for the search results / suggestions list shown below a
 * `Searchbar` (MD3 search anatomy element 6). It only provides the surface;
 * grouping results with gaps is left to the consumer.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Searchbar, List } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [query, setQuery] = React.useState('');
 *
 *   return (
 *     <>
 *       <Searchbar value={query} onChangeText={setQuery} placeholder="Search" />
 *       <Searchbar.Results>
 *         <List.Item title="Result 1" />
 *         <List.Item title="Result 2" />
 *       </Searchbar.Results>
 *     </>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const SearchbarResults = ({
  children,
  elevation = 0,
  style,
  theme: themeOverrides,
  testID = 'search-bar-results',
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { resultsContainerColor } = getSearchbarColors(theme);

  return (
    <Surface
      container
      elevation={elevation}
      style={[
        styles.container,
        { backgroundColor: resultsContainerColor },
        style,
      ]}
      theme={theme}
      testID={testID}
    >
      {children}
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default SearchbarResults;
