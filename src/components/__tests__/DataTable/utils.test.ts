import { describe, expect, it } from '@jest/globals';

import {
  composeCellLabel,
  composeRowLabel,
  defaultFormatRowPosition,
  getElementLabel,
  getNodeText,
} from '../../DataTable/utils';

describe('getNodeText', () => {
  it('reads strings and numbers', () => {
    expect(getNodeText('Cupcake')).toBe('Cupcake');
    expect(getNodeText(356)).toBe('356');
    expect(getNodeText(0)).toBe('0');
  });

  it('gives up on anything that is not plainly readable', () => {
    expect(getNodeText(null)).toBeUndefined();
    expect(getNodeText(undefined)).toBeUndefined();
    expect(getNodeText(['a', 'b'])).toBeUndefined();
  });
});

describe('getElementLabel', () => {
  it('prefers an explicit label over the content', () => {
    expect(
      getElementLabel({ 'aria-label': 'Calories', children: 'kcal' })
    ).toBe('Calories');
  });

  it('falls back to the content', () => {
    expect(getElementLabel({ children: 159 })).toBe('159');
  });

  it('has no label for content it cannot read', () => {
    expect(getElementLabel({ children: [1, 2] })).toBeUndefined();
  });
});

describe('composeCellLabel', () => {
  it('names the column the value belongs to', () => {
    expect(composeCellLabel({ columnLabel: 'Calories', value: '159' })).toBe(
      'Calories, 159'
    );
  });

  it('falls back to the value alone when the column has no name', () => {
    expect(composeCellLabel({ value: '159' })).toBe('159');
  });

  it('falls back to the column name when there is no value', () => {
    expect(composeCellLabel({ columnLabel: 'Calories' })).toBe('Calories');
    expect(composeCellLabel({})).toBeUndefined();
  });
});

describe('defaultFormatRowPosition', () => {
  it('states the position within the set', () => {
    expect(defaultFormatRowPosition({ position: 3, rowCount: 6 })).toBe(
      'row 3 of 6'
    );
  });

  it('leaves the total out when it is unknown', () => {
    expect(defaultFormatRowPosition({ position: 3 })).toBe('row 3');
  });
});

describe('composeRowLabel', () => {
  const cellLabels = ['Dessert, Frozen yogurt', 'Calories, 159'];

  it('flattens the cells and the position into one announcement', () => {
    expect(
      composeRowLabel({
        cellLabels,
        rowIndex: 2,
        rowCount: 6,
        formatRowPosition: defaultFormatRowPosition,
      })
    ).toBe('Dessert, Frozen yogurt, Calories, 159, row 3 of 6');
  });

  it('skips cells that have no label', () => {
    expect(
      composeRowLabel({
        cellLabels: ['Dessert, Frozen yogurt', undefined],
        formatRowPosition: null,
      })
    ).toBe('Dessert, Frozen yogurt');
  });

  it('leaves the position out when it is turned off', () => {
    expect(
      composeRowLabel({ cellLabels, rowIndex: 2, formatRowPosition: null })
    ).toBe('Dessert, Frozen yogurt, Calories, 159');
  });

  it('leaves the position out when the row index is unknown', () => {
    expect(
      composeRowLabel({
        cellLabels,
        rowCount: 6,
        formatRowPosition: defaultFormatRowPosition,
      })
    ).toBe('Dessert, Frozen yogurt, Calories, 159');
  });

  it('has no label for an empty row', () => {
    expect(
      composeRowLabel({ cellLabels: [], formatRowPosition: null })
    ).toBeUndefined();
  });
});
