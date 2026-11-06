import { Platform } from 'react-native';

/** ARIA attributes for the web. */
export type WebAriaProps = {
  'aria-rowcount'?: number;
  'aria-colcount'?: number;
  'aria-rowindex'?: number;
  'aria-colindex'?: number;
  'aria-sort'?: 'ascending' | 'descending' | 'none' | 'other';
};

/** Returns the given ARIA attributes on the web and nothing anywhere else. */
export default function webAriaProps(props: WebAriaProps): WebAriaProps {
  return Platform.OS === 'web' ? props : {};
}
