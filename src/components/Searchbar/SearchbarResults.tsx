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
   * Match the `mode` of the `Searchbar` above, the default value is
   * "contained".
   * - `contained` - rounded corners and the 12dp horizontal margin of a
   *   focused contained bar, so the two line up.
   * - `divided` - full width with square corners, continuing the divided bar
   *   below its `Divider` as in the MD3 full-screen layout. For a docked
   *   layout, set its width and margins through `style`.
   */
  mode?: 'contained' | 'divided';
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
 * the content, such as `List.Item`s, and grouping results with gaps are left
 * to the consumer. Set `mode` to the `Searchbar`'s `mode` so the two line up.
 * In `contained` mode it carries the horizontal margin of a focused bar; pass
 * a margin through `style` to change that.
 *
 * For accessibility, MD3 recommends showing that the list holds results, for
 * example with a "Results" label at its top, such as a `List.Subheader`.
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
 *         <List.Subheader>Results</List.Subheader>
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
  mode = 'contained',
  elevation = 0,
  style,
  theme: themeOverrides,
  testID,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { resultsContainerColor } = React.useMemo(
    () => getSearchbarColors(theme),
    [theme]
  );
  const isContained = mode === 'contained';
  const borderRadius = resolveCornerRadius(
    theme,
    isContained ? SearchbarTokens.results : SearchbarTokens.dividedResults
  );

  return (
    <Surface
      backgroundColor={resultsContainerColor}
      borderRadius={borderRadius}
      elevation={elevation}
      style={[isContained && styles.contained, style]}
      theme={theme}
      testID={testID}
    >
      {children}
    </Surface>
  );
};

const styles = StyleSheet.create({
  contained: {
    // Margin rather than width: a width would add to it and overflow.
    marginHorizontal: SearchbarTokens.marginFocused,
  },
});

export default SearchbarResults;
