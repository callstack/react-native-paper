import * as React from 'react';
import { StyleSheet } from 'react-native';
import type { StyleProp } from 'react-native';

import { SearchbarTokens } from './tokens';
import { getSearchbarColors } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { Elevation, ThemeProp } from '../../theme/types';
import { resolveCornerRadius } from '../../theme/utils/shape';
import Surface from '../Surface';
import type { SurfaceStyle } from '../Surface';

export type Props = {
  /**
   * Search results / suggestions to render inside the container.
   */
  children: React.ReactNode;
  /**
   * Changes the container's shadow and background.
   */
  elevation?: Elevation;
  style?: StyleProp<SurfaceStyle>;
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
  const { resultsContainerColor } = React.useMemo(
    () => getSearchbarColors(theme),
    [theme]
  );
  const borderRadius = resolveCornerRadius(theme, SearchbarTokens.results);

  return (
    <Surface
      backgroundColor={resultsContainerColor}
      borderRadius={borderRadius}
      elevation={elevation}
      style={[styles.container, style]}
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
