import type { ViewStyle } from 'react-native';

import { splitStyles } from '../splitStyles';

describe('splitStyles', () => {
  const styles: Readonly<ViewStyle> = Object.freeze({
    backgroundColor: 'red',
    marginTop: 1,
    marginBottom: 2,
    marginLeft: 3,
    padding: 4,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 6,
    right: 4,
  });

  it('splits margins, paddings, and border radiuses correctly', () => {
    const marginPredicate = (style: string) => style.startsWith('margin');
    const paddingPredicate = (style: string) => style.startsWith('padding');
    const borderRadiusPredicate = (style: string) =>
      style.startsWith('border') && style.endsWith('Radius');
    const [filteredStyles, marginStyles, paddingStyles, borderRadiusStyles] =
      splitStyles(
        styles,
        marginPredicate,
        paddingPredicate,
        borderRadiusPredicate
      );

    expect(keysLength(filteredStyles)).toBeGreaterThan(0);
    expect(keysLength(filteredStyles)).toBeLessThan(keysLength(styles));
    for (const style in filteredStyles) {
      expect(marginPredicate(style)).toBeFalsy();
      expect(paddingPredicate(style)).toBeFalsy();
      expect(borderRadiusPredicate(style)).toBeFalsy();
    }

    expect(keysLength(marginStyles)).toBeGreaterThan(0);
    for (const style in marginStyles) {
      expect(marginPredicate(style)).toBeTruthy();
    }

    expect(keysLength(paddingStyles)).toBeGreaterThan(0);
    for (const style in paddingStyles) {
      expect(paddingPredicate(style)).toBeTruthy();
    }

    expect(keysLength(borderRadiusStyles)).toBeGreaterThan(0);
    for (const style in borderRadiusStyles) {
      expect(borderRadiusPredicate(style)).toBeTruthy();
    }
  });

  it('filtered styles is an empty object if all styles matched some predicate', () => {
    const styles = {
      margin: 5,
      padding: 6,
    };
    const [filteredStyles] = splitStyles(
      styles,
      (style) => style.startsWith('margin'),
      (style) => style.startsWith('padding')
    );

    expect(keysLength(filteredStyles)).toBe(0);
  });

  it('processes predicates in order', () => {
    const [, marginStyles, marginStyles2, marginStyles3] = splitStyles(
      styles,
      (style) => style.startsWith('margin'),
      (style) => style.startsWith('margin'),
      (style) => style.startsWith('margin')
    );

    expect(keysLength(marginStyles)).toBeGreaterThan(0);
    expect(keysLength(marginStyles2)).toBe(0);
    expect(keysLength(marginStyles3)).toBe(0);
  });
});

function keysLength(object: object): number {
  return Object.keys(object).length;
}
