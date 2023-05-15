import type { ViewStyle } from 'react-native';

type FiltersArray = readonly ((style: keyof ViewStyle) => boolean)[];

type MappedTuple<Tuple extends FiltersArray> = {
  [Index in keyof Tuple]: ViewStyle;
} & { length: Tuple['length'] };

type Style = ViewStyle[keyof ViewStyle];
type Entry = [keyof ViewStyle, Style];

/**
 * Utility function to extract styles in separate objects
 *
 * @param styles The style object you want to filter
 * @param filters The filters by which you want to split the styles
 * @returns An array of filtered style objects:
 * - The first style object contains the properties that didn't match any filter
 * - After that there will be a style object for each filter you passed in the same order as the matching filters
 * - A style property will exist in a single style object, the first filter it matched
 */
export function splitStyles<Tuple extends FiltersArray>(
  styles: ViewStyle,
  ...filters: Tuple
) {
  if (process.env.NODE_ENV !== 'production' && filters.length === 0) {
    console.error('No filters were passed when calling splitStyles');
  }

  // `Object.entries` will be used to iterate over the styles and `Object.fromEntries` will be called before returning
  // Entries which match the given filters will be temporarily stored in `newStyles`
  const newStyles = filters.map(() => [] as Entry[]);

  // Entries which match no filter
  const rest: Entry[] = [];

  // Iterate every style property
  outer: for (const item of Object.entries(styles) as Entry[]) {
    // Check each filter
    for (let i = 0; i < filters.length; i++) {
      // Check if filter matches
      if (filters[i](item[0])) {
        newStyles[i].push(item); // Push to temporary filtered entries array
        continue outer; // Skip to checking next style property
      }
    }

    // Adds to rest styles if not filtered
    rest.push(item);
  }

  // Put unmatched styles in the beginning
  newStyles.unshift(rest);

  // Convert arrays of entries into objects
  return newStyles.map((styles) => Object.fromEntries(styles)) as unknown as [
    ViewStyle,
    ...MappedTuple<Tuple>
  ];
}
