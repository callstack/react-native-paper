import {
  Platform,
  StyleSheet,
  Text as RNText,
  useWindowDimensions,
  View,
} from 'react-native';

import { afterEach, describe, expect, it, jest } from '@jest/globals';
import * as Reanimated from 'react-native-reanimated';

import { LocaleProvider } from '../../../core/locale';
import PaperProvider from '../../../core/PaperProvider';
import { getTheme } from '../../../core/theming';
import { render, screen } from '../../../test-utils';
import Checkbox from '../../Checkbox';
import type { DataTableColumn } from '../../DataTable/columns';
import DataTable from '../../DataTable/DataTable';

const columns: readonly DataTableColumn[] = [
  { key: 'name', flex: 2 },
  { key: 'calories', numeric: true },
];

const Table = ({
  children,
  ...props
}: Partial<React.ComponentProps<typeof DataTable>> = {}) => (
  <DataTable aria-label="Nutrition" rowCount={6} firstRowIndex={2} {...props}>
    <DataTable.Header>
      <DataTable.Title onPress={() => {}} sortDirection="ascending">
        Dessert
      </DataTable.Title>
      <DataTable.Title numeric>Calories</DataTable.Title>
    </DataTable.Header>
    {children ?? (
      <DataTable.Row testID="row">
        <DataTable.Cell>Frozen yogurt</DataTable.Cell>
        <DataTable.Cell numeric>159</DataTable.Cell>
      </DataTable.Row>
    )}
  </DataTable>
);

// Cells of a row-focused table are hidden from the accessibility tree on
// purpose, so layout assertions have to look past that.
const hidden = { includeHiddenElements: true };

const mockFontScale = (fontScale: number) => {
  jest.mocked(useWindowDimensions).mockReturnValue({
    fontScale,
    width: 750,
    height: 1334,
    scale: 2,
  });
};

afterEach(() => {
  Platform.OS = 'ios';
  mockFontScale(1);
});

describe('DataTable', () => {
  it('names itself as a table and reports its shape', async () => {
    await render(<Table testID="table" />);

    const table = screen.getByTestId('table');

    expect(table).toHaveProp('role', 'table');
  });

  it('exposes row and column counts on the web', async () => {
    Platform.OS = 'web';

    await render(<Table testID="table" columns={columns} />);

    const table = screen.getByTestId('table');

    // Six data rows plus the header row.
    expect(table).toHaveProp('aria-rowcount', 7);
    expect(table).toHaveProp('aria-colcount', 2);
  });

  it('does not name the container on native, where it would swallow the rows', async () => {
    await render(<Table testID="table" />);

    const table = screen.getByTestId('table');

    // A container with an accessibility label becomes a single screen-reader
    // stop on Android, hiding every row inside it.
    expect(table).not.toHaveProp('aria-label');
    expect(table).not.toHaveProp('accessibilityLabel');
  });

  it('names the container on the web, where the role makes it meaningful', async () => {
    Platform.OS = 'web';

    await render(<Table testID="table" />);

    const table = screen.getByTestId('table');

    expect(table).toHaveProp('aria-label', 'Nutrition');
  });

  it('keeps grid attributes off native, where they mean nothing', async () => {
    await render(<Table testID="table" columns={columns} />);

    expect(screen.getByTestId('table')).not.toHaveProp('aria-rowcount');
  });
});

describe('DataTable.Row', () => {
  it('announces a row as one item naming every column', async () => {
    await render(<Table />);

    expect(
      screen.getByRole('row', {
        name: 'Dessert, Frozen yogurt, Calories, 159, row 3 of 6',
      })
    ).toBeOnTheScreen();
  });

  it('does not repeat the column name when a cell carries its own label', async () => {
    await render(
      <Table>
        <DataTable.Row>
          <DataTable.Cell>Frozen yogurt</DataTable.Cell>
          <DataTable.Cell aria-label="One fifty nine">159</DataTable.Cell>
        </DataTable.Row>
      </Table>
    );

    // Not "Calories, One fifty nine" - the label is already complete.
    expect(
      screen.getByRole('row', {
        name: 'Dessert, Frozen yogurt, One fifty nine, row 3 of 6',
      })
    ).toBeOnTheScreen();
  });

  it('does not report a read-only row as disabled', async () => {
    await render(<Table />);

    expect(
      screen.getByRole('row', { name: /Frozen yogurt/ })
    ).not.toBeDisabled();
  });

  it('announces a pressable row as a button so it reads as activatable', async () => {
    await render(
      <Table>
        <DataTable.Row onPress={() => {}}>
          <DataTable.Cell>Frozen yogurt</DataTable.Cell>
          <DataTable.Cell numeric>159</DataTable.Cell>
        </DataTable.Row>
      </Table>
    );

    expect(
      screen.getByRole('button', { name: /Frozen yogurt/ })
    ).toBeOnTheScreen();
  });

  it('leaves the position out when the total is unknown', async () => {
    await render(
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Dessert</DataTable.Title>
        </DataTable.Header>
        <DataTable.Row>
          <DataTable.Cell>Frozen yogurt</DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    );

    // One rendered row, indexed from 0, so the count is derived as 1.
    expect(
      screen.getByRole('row', { name: 'Dessert, Frozen yogurt, row 1 of 1' })
    ).toBeOnTheScreen();
  });

  it('numbers rows against the whole set when only a page is rendered', async () => {
    Platform.OS = 'web';

    await render(<Table />);

    // Row index 2 of the data set, 1-based, offset by the header row.
    expect(screen.getByTestId('row')).toHaveProp('aria-rowindex', 4);
  });

  it('numbers a row a consumer component renders, not just an inline one', async () => {
    const NameRow = ({ name }: { name: string }) => (
      <DataTable.Row testID="row">
        <DataTable.Cell>{name}</DataTable.Cell>
        <DataTable.Cell numeric>159</DataTable.Cell>
      </DataTable.Row>
    );

    await render(
      <Table>
        <NameRow name="Frozen yogurt" />
      </Table>
    );

    // The position reaches the row through context, so a wrapper component
    // does not swallow it on the way down.
    expect(
      screen.getByRole('row', {
        name: 'Dessert, Frozen yogurt, Calories, 159, row 3 of 6',
      })
    ).toBeOnTheScreen();
  });

  it('lets a control inside a pressable row keep its own stop', async () => {
    await render(
      <Table>
        <DataTable.Row testID="row" onPress={() => {}}>
          <DataTable.Cell>
            <Checkbox status="checked" testID="row-checkbox" />
          </DataTable.Cell>
        </DataTable.Row>
      </Table>
    );

    // Left unset, the row would default to being one accessibility element
    // and the checkbox would be out of reach.
    expect(screen.getByTestId('row')).toHaveProp('accessible', false);
    expect(screen.getByTestId('row-checkbox')).toBeOnTheScreen();
  });

  it('honours an explicitly passed index, as virtualized lists must', async () => {
    await render(
      <Table>
        <DataTable.Row index={4}>
          <DataTable.Cell>Frozen yogurt</DataTable.Cell>
        </DataTable.Row>
      </Table>
    );

    expect(screen.getByRole('row', { name: /row 5 of 6/ })).toBeOnTheScreen();
  });

  it('does not take an empty state beside the rows for a row', async () => {
    Platform.OS = 'web';

    await render(
      <DataTable testID="table">
        <DataTable.Header>
          <DataTable.Title>Dessert</DataTable.Title>
        </DataTable.Header>
        <RNText>Only one dessert left</RNText>
        <DataTable.Row testID="row">
          <DataTable.Cell>Frozen yogurt</DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    );

    // The text is neither counted nor allowed to push the row down a place.
    expect(screen.getByTestId('table')).toHaveProp('aria-rowcount', 2);
    expect(screen.getByTestId('row')).toHaveProp('aria-rowindex', 2);
  });

  it('numbers rows grouped in a wrapper one by one', async () => {
    Platform.OS = 'web';

    await render(
      <DataTable testID="table">
        <DataTable.Header>
          <DataTable.Title>Dessert</DataTable.Title>
        </DataTable.Header>
        <View>
          <DataTable.Row testID="first">
            <DataTable.Cell>Frozen yogurt</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row testID="second">
            <DataTable.Cell>Eclair</DataTable.Cell>
          </DataTable.Row>
        </View>
      </DataTable>
    );

    expect(screen.getByTestId('first')).toHaveProp('aria-rowindex', 2);
    expect(screen.getByTestId('second')).toHaveProp('aria-rowindex', 3);
    expect(screen.getByTestId('table')).toHaveProp('aria-rowcount', 3);
  });

  it('numbers rows given in a fragment', async () => {
    Platform.OS = 'web';

    await render(
      <DataTable testID="table">
        <DataTable.Header>
          <DataTable.Title>Dessert</DataTable.Title>
        </DataTable.Header>
        <>
          <DataTable.Row testID="first">
            <DataTable.Cell>Frozen yogurt</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row testID="second">
            <DataTable.Cell>Eclair</DataTable.Cell>
          </DataTable.Row>
        </>
      </DataTable>
    );

    expect(screen.getByTestId('first')).toHaveProp('aria-rowindex', 2);
    expect(screen.getByTestId('second')).toHaveProp('aria-rowindex', 3);
  });

  it('renders a fragment inside a row or a header', async () => {
    await render(
      <DataTable>
        <DataTable.Header>
          <>
            <DataTable.Title>Dessert</DataTable.Title>
          </>
        </DataTable.Header>
        <DataTable.Row testID="row">
          <>
            <DataTable.Cell>Frozen yogurt</DataTable.Cell>
          </>
        </DataTable.Row>
      </DataTable>
    );

    expect(screen.getByTestId('row')).toBeOnTheScreen();
  });
});

describe('DataTable.Cell', () => {
  it('falls back to per-cell focus when a cell is interactive', async () => {
    await render(
      <Table>
        <DataTable.Row>
          <DataTable.Cell onPress={() => {}}>Frozen yogurt</DataTable.Cell>
          <DataTable.Cell numeric>159</DataTable.Cell>
        </DataTable.Row>
      </Table>
    );

    // The row must not swallow the pressable cell.
    expect(screen.queryByRole('row', { name: /Frozen yogurt/ })).toBeNull();
    expect(
      screen.getByRole('cell', { name: 'Dessert, Frozen yogurt' })
    ).toBeOnTheScreen();
    expect(
      screen.getByRole('cell', { name: 'Calories, 159' })
    ).toBeOnTheScreen();
  });

  it('keeps element content reachable instead of hiding it behind a row label', async () => {
    await render(
      <Table>
        <DataTable.Row>
          <DataTable.Cell>
            <Checkbox status="checked" testID="row-checkbox" />
          </DataTable.Cell>
          <DataTable.Cell numeric>159</DataTable.Cell>
        </DataTable.Row>
      </Table>
    );

    expect(screen.queryByRole('row', { name: /159/ })).toBeNull();
    expect(screen.getByTestId('row-checkbox')).toBeOnTheScreen();
  });

  it('does not collapse a row whose cell holds an element, even when labelled', async () => {
    await render(
      <Table>
        <DataTable.Row>
          <DataTable.Cell>Frozen yogurt</DataTable.Cell>
          <DataTable.Cell aria-label="Selected">
            <Checkbox
              status="unchecked"
              onPress={() => {}}
              testID="row-checkbox"
            />
          </DataTable.Cell>
        </DataTable.Row>
      </Table>
    );

    // An element owns its own semantics and may be interactive, so collapsing
    // the row would put it out of reach.
    expect(screen.queryByRole('row', { name: /Frozen yogurt/ })).toBeNull();
    expect(screen.getByTestId('row-checkbox')).toBeOnTheScreen();
  });

  it('does not wrap element content in an accessibility element of its own', async () => {
    await render(
      <Table nativeFocusMode="cell">
        <DataTable.Row>
          <DataTable.Cell testID="cell" aria-label="Selected">
            <Checkbox status="checked" testID="row-checkbox" />
          </DataTable.Cell>
        </DataTable.Row>
      </Table>
    );

    // Making the cell accessible would swallow the checkbox's own state.
    expect(screen.getByTestId('cell')).not.toHaveProp('accessible', true);
    expect(screen.getByTestId('row-checkbox')).toBeOnTheScreen();
  });

  it('does not name a cell after its column when it holds a control', async () => {
    await render(
      <Table>
        <DataTable.Row>
          <DataTable.Cell testID="cell">
            <Checkbox status="checked" testID="row-checkbox" />
          </DataTable.Cell>
          <DataTable.Cell numeric>159</DataTable.Cell>
        </DataTable.Row>
      </Table>
    );

    // Not "Dessert" - the column name on the container would bury the
    // checkbox's own role and state behind it.
    expect(screen.getByTestId('cell')).not.toHaveProp('aria-label');
    expect(screen.getByTestId('row-checkbox')).toBeOnTheScreen();
  });

  it('treats a cell label as the complete name, not a value to decorate', async () => {
    await render(
      <Table nativeFocusMode="cell">
        <DataTable.Row>
          <DataTable.Cell aria-label="Ninety nine">99</DataTable.Cell>
        </DataTable.Row>
      </Table>
    );

    // Not "Dessert, Ninety nine" - an explicit label replaces the composed one.
    expect(screen.getByRole('cell', { name: 'Ninety nine' })).toBeOnTheScreen();
  });

  it('gives one stop per cell under nativeFocusMode="cell"', async () => {
    await render(<Table nativeFocusMode="cell" />);

    expect(screen.queryByRole('row', { name: /Frozen yogurt/ })).toBeNull();
    expect(
      screen.getByRole('cell', { name: 'Dessert, Frozen yogurt' })
    ).toBeOnTheScreen();
  });

  it('numbers columns on the web', async () => {
    Platform.OS = 'web';

    await render(
      <Table>
        <DataTable.Row>
          <DataTable.Cell testID="first">Frozen yogurt</DataTable.Cell>
          <DataTable.Cell testID="second" numeric>
            159
          </DataTable.Cell>
        </DataTable.Row>
      </Table>
    );

    expect(screen.getByTestId('first')).toHaveProp('aria-colindex', 1);
    expect(screen.getByTestId('second')).toHaveProp('aria-colindex', 2);
    expect(screen.getByTestId('second')).toHaveProp('role', 'cell');
    // The roles already say which column a cell is in; repeating it in the
    // name would make linear reading twice as long.
    expect(screen.getByTestId('first')).not.toHaveProp('aria-label');
  });

  it('does not invent a testID when none was given', async () => {
    await render(<DataTable.Cell>Frozen yogurt</DataTable.Cell>);

    expect(screen.queryByTestId('undefined-text-container')).toBeNull();
  });

  it('renders text content inside a text container', async () => {
    await render(
      <DataTable.Cell testID="table-cell">Table cell</DataTable.Cell>
    );

    expect(screen.getByText('Table cell')).toBeOnTheScreen();
    expect(screen.getByTestId('table-cell-text-container')).toBeOnTheScreen();
  });

  it('renders element content verbatim, without a text container', async () => {
    await render(
      <DataTable.Cell testID="table-cell">
        <Checkbox status="checked" testID="table-cell-checkbox" />
      </DataTable.Cell>
    );

    expect(
      screen.queryByTestId('table-cell-text-container')
    ).not.toBeOnTheScreen();
  });

  it('lets essential data wrap as soon as text is enlarged at all', async () => {
    // Android's display-size setting narrows the layout without moving the
    // font scale much, so content truncates well before 2x.
    mockFontScale(1.15);

    await render(
      <DataTable.Cell testID="small-bump">Frozen yogurt</DataTable.Cell>
    );

    expect(screen.getByTestId('small-bump-text-container')).not.toHaveProp(
      'numberOfLines'
    );
  });

  it('honours an explicit limit when text is enlarged', async () => {
    // Asking for 2 lines means 2 lines. Quietly granting more at large scale
    // would override an instruction the consumer gave deliberately.
    mockFontScale(2);

    await render(
      <DataTable.Cell testID="pinned" numberOfLines={2}>
        Frozen yogurt
      </DataTable.Cell>
    );

    expect(screen.getByTestId('pinned-text-container')).toHaveProp(
      'numberOfLines',
      2
    );
  });

  it('honours an explicit limit when text is shrunk', async () => {
    mockFontScale(0.85);

    await render(
      <DataTable.Cell testID="pinned" numberOfLines={2}>
        Frozen yogurt
      </DataTable.Cell>
    );

    expect(screen.getByTestId('pinned-text-container')).toHaveProp(
      'numberOfLines',
      2
    );
  });

  it('never clamps a limit of 0, whatever the scale', async () => {
    mockFontScale(1);

    await render(
      <DataTable.Cell testID="free" numberOfLines={0}>
        Frozen yogurt
      </DataTable.Cell>
    );

    expect(screen.getByTestId('free-text-container')).not.toHaveProp(
      'numberOfLines'
    );
  });

  it('clamps to one line by default and honours an explicit limit', async () => {
    await render(
      <>
        <DataTable.Cell testID="clamped">Frozen yogurt</DataTable.Cell>
        <DataTable.Cell testID="wrapping" numberOfLines={0}>
          Frozen yogurt
        </DataTable.Cell>
      </>
    );

    expect(screen.getByTestId('clamped-text-container')).toHaveProp(
      'numberOfLines',
      1
    );
    expect(screen.getByTestId('wrapping-text-container')).not.toHaveProp(
      'numberOfLines'
    );
  });
});

describe('DataTable.Title', () => {
  it('does not present an unsortable column as a control', async () => {
    await render(
      <DataTable.Header>
        <DataTable.Title testID="title">Calories</DataTable.Title>
      </DataTable.Header>
    );

    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByTestId('title')).not.toBeDisabled();
  });

  it('makes every column header its own stop on native', async () => {
    await render(
      <DataTable.Header>
        <DataTable.Title testID="plain">Calories per piece</DataTable.Title>
      </DataTable.Header>
    );

    // Otherwise the header's text is absorbed by whatever ancestor happens to
    // be focusable, and the columns are read as one run-on stop.
    expect(screen.getByTestId('plain')).toHaveProp('accessible', true);
  });

  it('lets a control inside a column header keep its own stop', async () => {
    await render(
      <DataTable.Header>
        <DataTable.Title testID="title">
          <Checkbox status="checked" testID="select-all" />
        </DataTable.Title>
      </DataTable.Header>
    );

    // Made one accessibility element, the header would swallow the checkbox.
    expect(screen.getByTestId('title')).not.toHaveProp('accessible', true);
    expect(screen.getByTestId('select-all')).toBeOnTheScreen();
  });

  it('announces a sortable column and its sort state', async () => {
    await render(<Table />);

    expect(
      screen.getByRole('button', { name: 'Dessert, sorted ascending' })
    ).toBeOnTheScreen();
  });

  it('takes localized sort wording', async () => {
    await render(
      <DataTable.Header>
        <DataTable.Title
          onPress={() => {}}
          sortDirection="descending"
          sortAccessibilityLabels={{
            ascending: 'rosnąco',
            descending: 'malejąco',
          }}
        >
          Dessert
        </DataTable.Title>
      </DataTable.Header>
    );

    expect(
      screen.getByRole('button', { name: 'Dessert, malejąco' })
    ).toBeOnTheScreen();
  });

  it('exposes sort state and column semantics on the web', async () => {
    Platform.OS = 'web';

    await render(
      <DataTable.Header>
        <DataTable.Title
          testID="sortable"
          onPress={() => {}}
          sortDirection="ascending"
        >
          Dessert
        </DataTable.Title>
        <DataTable.Title testID="plain" numeric>
          Calories
        </DataTable.Title>
      </DataTable.Header>
    );

    const sortable = screen.getByTestId('sortable');

    expect(sortable).toHaveProp('role', 'columnheader');
    expect(sortable).toHaveProp('aria-sort', 'ascending');
    expect(sortable).toHaveProp('aria-colindex', 1);

    const plain = screen.getByTestId('plain');

    expect(plain).toHaveProp('aria-colindex', 2);
    // An unsortable column advertises no sort state at all.
    expect(plain).not.toHaveProp('aria-sort');
  });

  it('advertises a sortable but unsorted column on the web', async () => {
    Platform.OS = 'web';

    await render(
      <DataTable.Header>
        <DataTable.Title testID="title" onPress={() => {}}>
          Dessert
        </DataTable.Title>
      </DataTable.Header>
    );

    expect(screen.getByTestId('title')).toHaveProp('aria-sort', 'none');
  });

  it('does not rotate the sort indicator on first render', async () => {
    const withTiming = jest.spyOn(Reanimated, 'withTiming');

    await render(
      <DataTable.Title onPress={() => {}} sortDirection="descending">
        Calories
      </DataTable.Title>
    );

    // The indicator starts at the right angle rather than spinning into it.
    expect(withTiming).not.toHaveBeenCalled();

    withTiming.mockRestore();
  });

  it('rotates the sort indicator when the direction changes', async () => {
    const withTiming = jest.spyOn(Reanimated, 'withTiming');

    const view = await render(
      <DataTable.Title onPress={() => {}} sortDirection="ascending">
        Calories
      </DataTable.Title>
    );

    await view.rerender(
      <DataTable.Title onPress={() => {}} sortDirection="descending">
        Calories
      </DataTable.Title>
    );

    expect(withTiming).toHaveBeenCalledWith(
      180,
      expect.objectContaining({
        duration: getTheme().motion.duration.short3,
        reduceMotion: Reanimated.ReduceMotion.Never,
      })
    );

    withTiming.mockRestore();
  });

  it('tells Reanimated to suppress the rotation under reduced motion', async () => {
    const withTiming = jest.spyOn(Reanimated, 'withTiming');

    const view = await render(
      <PaperProvider reduceMotion="on">
        <DataTable.Title onPress={() => {}} sortDirection="ascending">
          Calories
        </DataTable.Title>
      </PaperProvider>
    );

    await view.rerender(
      <PaperProvider reduceMotion="on">
        <DataTable.Title onPress={() => {}} sortDirection="descending">
          Calories
        </DataTable.Title>
      </PaperProvider>
    );

    expect(withTiming).toHaveBeenCalledWith(
      180,
      expect.objectContaining({
        reduceMotion: Reanimated.ReduceMotion.Always,
      })
    );

    withTiming.mockRestore();
  });
});

describe('DataTable column contract', () => {
  it('shares width and alignment from a single definition', async () => {
    await render(
      <DataTable columns={columns}>
        <DataTable.Header>
          <DataTable.Title testID="title" column="name">
            Dessert
          </DataTable.Title>
        </DataTable.Header>
        <DataTable.Row>
          <DataTable.Cell testID="cell" column="name">
            Frozen yogurt
          </DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    );

    expect(screen.getByTestId('title')).toHaveStyle({ flex: 2 });
    expect(screen.getByTestId('cell', hidden)).toHaveStyle({ flex: 2 });
  });

  it('lets an explicit style win over the shared definition', async () => {
    await render(
      <DataTable columns={columns}>
        <DataTable.Row>
          <DataTable.Cell testID="cell" column="name" style={{ flex: 5 }}>
            Frozen yogurt
          </DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    );

    expect(screen.getByTestId('cell', hidden)).toHaveStyle({ flex: 5 });
  });

  it('resolves columns by position when no key is given', async () => {
    await render(
      <DataTable columns={columns}>
        <DataTable.Row>
          <DataTable.Cell testID="first">Frozen yogurt</DataTable.Cell>
          <DataTable.Cell testID="second">159</DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    );

    expect(screen.getByTestId('first', hidden)).toHaveStyle({ flex: 2 });
    // The second column declares no flex, so it falls back to 1.
    expect(screen.getByTestId('second', hidden)).toHaveStyle({ flex: 1 });
  });

  it('names cells from the header, with no second declaration', async () => {
    await render(
      <DataTable columns={columns} nativeFocusMode="cell">
        <DataTable.Header>
          <DataTable.Title>Dessert</DataTable.Title>
          <DataTable.Title>Calories</DataTable.Title>
        </DataTable.Header>
        <DataTable.Row>
          <DataTable.Cell>Frozen yogurt</DataTable.Cell>
          <DataTable.Cell>159</DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    );

    expect(
      screen.getByRole('cell', { name: 'Calories, 159' })
    ).toBeOnTheScreen();
  });

  it('names a cell from an explicit label when the header is not text', async () => {
    await render(
      <DataTable nativeFocusMode="cell">
        <DataTable.Header>
          <DataTable.Title aria-label="Selected">
            <Checkbox status="checked" />
          </DataTable.Title>
        </DataTable.Header>
        <DataTable.Row>
          <DataTable.Cell>Yes</DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    );

    expect(
      screen.getByRole('cell', { name: 'Selected, Yes' })
    ).toBeOnTheScreen();
  });

  it('keeps declared widths when columns must not shrink', async () => {
    await render(
      <DataTable columns={[{ key: 'name', width: 120 }]} layout="fixed">
        <DataTable.Row>
          <DataTable.Cell testID="cell" column="name">
            Frozen yogurt
          </DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    );

    expect(screen.getByTestId('cell', hidden)).toHaveStyle({
      width: 120,
      flexShrink: 0,
    });
  });

  it('lays out fluid tables at full width and fixed ones at content width', async () => {
    await render(
      <>
        <DataTable testID="fluid">
          <DataTable.Row>
            <DataTable.Cell>Frozen yogurt</DataTable.Cell>
          </DataTable.Row>
        </DataTable>
        <DataTable
          testID="fixed"
          columns={[{ key: 'name', width: 120 }]}
          layout="fixed"
        >
          <DataTable.Row>
            <DataTable.Cell>Frozen yogurt</DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </>
    );

    expect(screen.getByTestId('fluid')).toHaveStyle({ width: '100%' });
    expect(screen.getByTestId('fixed')).not.toHaveStyle({ width: '100%' });
  });

  it('warns when a fixed column has no width to hold', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    await render(
      <DataTable columns={[{ key: 'name', flex: 2 }]} layout="fixed">
        <DataTable.Row>
          <DataTable.Cell column="name">Frozen yogurt</DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    );

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('layout="fixed"')
    );

    warn.mockRestore();
  });
});

describe('DataTable metrics', () => {
  it('separates rows and the header with the divider color role', async () => {
    await render(
      <DataTable>
        <DataTable.Header testID="header">
          <DataTable.Title>Dessert</DataTable.Title>
        </DataTable.Header>
        <DataTable.Row testID="row">
          <DataTable.Cell>Frozen yogurt</DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    );

    // The same role `Divider` uses, in both themes.
    expect(screen.getByTestId('header')).toHaveStyle({
      borderBottomColor: getTheme().colors.outlineVariant,
    });
    expect(screen.getByTestId('row')).toHaveStyle({
      borderBottomColor: getTheme().colors.outlineVariant,
    });
  });

  it('draws the header rule heavier than the row separators', async () => {
    await render(
      <DataTable>
        <DataTable.Header testID="header">
          <DataTable.Title>Dessert</DataTable.Title>
        </DataTable.Header>
        <DataTable.Row testID="row">
          <DataTable.Cell>Frozen yogurt</DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    );

    expect(screen.getByTestId('header')).toHaveStyle({ borderBottomWidth: 1 });
    expect(screen.getByTestId('row')).toHaveStyle({
      borderBottomWidth: StyleSheet.hairlineWidth,
    });
  });

  it('keeps rows at a touch-target height with room for wrapped content', async () => {
    await render(
      <DataTable>
        <DataTable.Row testID="row">
          <DataTable.Cell>Frozen yogurt</DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    );

    expect(screen.getByTestId('row')).toHaveStyle({
      minHeight: 48,
      paddingHorizontal: 16,
      paddingVertical: 4,
    });
  });

  it('gives a static row the same containing block as a pressable one', async () => {
    await render(
      <DataTable>
        <DataTable.Row testID="static">
          <DataTable.Cell>Frozen yogurt</DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    );

    // `TouchableRipple` sets this, so absolutely positioned children resolve
    // against the same box whether or not the row is pressable.
    expect(screen.getByTestId('static')).toHaveStyle({ position: 'relative' });
  });
});

describe('DataTable alignment', () => {
  it('aligns start and numeric columns against the writing direction', async () => {
    await render(
      <>
        <DataTable.Cell testID="start">Frozen yogurt</DataTable.Cell>
        <DataTable.Cell testID="numeric" numeric>
          159
        </DataTable.Cell>
        <DataTable.Cell testID="center" align="center">
          6
        </DataTable.Cell>
      </>
    );

    expect(screen.getByTestId('start')).toHaveStyle({
      justifyContent: 'flex-start',
    });
    expect(screen.getByTestId('start-text-container')).toHaveStyle({
      textAlign: 'left',
    });
    expect(screen.getByTestId('numeric')).toHaveStyle({
      justifyContent: 'flex-end',
    });
    expect(screen.getByTestId('numeric-text-container')).toHaveStyle({
      textAlign: 'right',
      // Tabular figures keep digits lined up between rows.
      fontVariant: ['tabular-nums'],
    });
    expect(screen.getByTestId('center-text-container')).toHaveStyle({
      textAlign: 'center',
    });
  });

  it('mirrors text alignment in right-to-left layouts', async () => {
    await render(
      <LocaleProvider direction="rtl">
        <DataTable.Cell testID="start">Frozen yogurt</DataTable.Cell>
        <DataTable.Cell testID="numeric" numeric>
          159
        </DataTable.Cell>
      </LocaleProvider>
    );

    expect(screen.getByTestId('start-text-container')).toHaveStyle({
      textAlign: 'right',
    });
    expect(screen.getByTestId('numeric-text-container')).toHaveStyle({
      textAlign: 'left',
    });
    // `justifyContent` is logical, so it resolves against the direction on its
    // own and must not be mirrored here too.
    expect(screen.getByTestId('numeric')).toHaveStyle({
      justifyContent: 'flex-end',
    });
  });

  it('treats `numeric` as the data and `align` as the position', async () => {
    await render(
      <>
        <DataTable.Cell testID="default" numeric>
          159
        </DataTable.Cell>
        <DataTable.Cell testID="centered" numeric align="center">
          159
        </DataTable.Cell>
        <DataTable.Cell testID="text" align="end">
          Shipped
        </DataTable.Cell>
      </>
    );

    // Numbers land at the end of the column unless told otherwise.
    expect(screen.getByTestId('default')).toHaveStyle({
      justifyContent: 'flex-end',
    });

    // A centred column of numbers still gets lined-up digits.
    expect(screen.getByTestId('centered')).toHaveStyle({
      justifyContent: 'center',
    });
    expect(screen.getByTestId('centered-text-container')).toHaveStyle({
      fontVariant: ['tabular-nums'],
    });

    // Non-numeric content can still be end-aligned, without tabular figures.
    expect(screen.getByTestId('text')).toHaveStyle({
      justifyContent: 'flex-end',
    });
    expect(screen.getByTestId('text-text-container')).not.toHaveStyle({
      fontVariant: ['tabular-nums'],
    });
  });

  it('takes `numeric` from the shared column definition', async () => {
    await render(
      <DataTable columns={columns}>
        <DataTable.Row>
          <DataTable.Cell testID="cell" column="calories">
            159
          </DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    );

    expect(screen.getByTestId('cell', hidden)).toHaveStyle({
      justifyContent: 'flex-end',
    });
  });
});

// Snapshots complement the assertions above rather than replacing them: those
// state the contract, these catch structural drift nobody thought to assert.
// Fixtures are kept minimal on purpose - a snapshot too long to read in review
// is a rubber stamp, which is how `aria-disabled="true"` survived in the old
// 2828-line file.
describe('DataTable snapshots', () => {
  it('renders a table', async () => {
    const tree = (
      await render(
        <DataTable aria-label="Nutrition" rowCount={6} firstRowIndex={2}>
          <DataTable.Header>
            <DataTable.Title>Dessert</DataTable.Title>
          </DataTable.Header>
          <DataTable.Row>
            <DataTable.Cell>Frozen yogurt</DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      )
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders a header', async () => {
    const tree = (
      await render(
        <DataTable.Header>
          <DataTable.Title>Dessert</DataTable.Title>
        </DataTable.Header>
      )
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders a sortable title', async () => {
    const tree = (
      await render(
        <DataTable.Title onPress={() => {}} sortDirection="descending">
          Dessert
        </DataTable.Title>
      )
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders a static title', async () => {
    const tree = (
      await render(<DataTable.Title numeric>Calories</DataTable.Title>)
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders a static row', async () => {
    const tree = (
      await render(
        <DataTable.Row>
          <DataTable.Cell>Frozen yogurt</DataTable.Cell>
        </DataTable.Row>
      )
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders a pressable row', async () => {
    const tree = (
      await render(
        <DataTable.Row onPress={() => {}}>
          <DataTable.Cell>Frozen yogurt</DataTable.Cell>
        </DataTable.Row>
      )
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders a cell', async () => {
    const tree = (
      await render(<DataTable.Cell numeric>159</DataTable.Cell>)
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders pagination', async () => {
    const tree = (
      await render(
        <DataTable.Pagination
          page={0}
          numberOfPages={3}
          onPageChange={() => {}}
          label="1-2 of 6"
        />
      )
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});

describe('DataTable.Pagination', () => {
  it('does not name its containers on native, where they would swallow the controls', async () => {
    await render(
      <DataTable.Pagination
        testID="pager"
        page={0}
        numberOfPages={3}
        onPageChange={() => {}}
        label="1-2 of 6"
        numberOfItemsPerPageList={[2, 4]}
        numberOfItemsPerPage={2}
        onItemsPerPageChange={() => {}}
        selectPageDropdownLabel="Rows per page"
      />
    );

    // Same bug as the table container: an accessibility label on a view makes
    // it one screen-reader stop on Android, hiding the buttons inside it.
    expect(screen.getByTestId('pager')).not.toHaveProp('aria-label');
    expect(screen.getByTestId('options-select')).not.toHaveProp('aria-label');
  });

  it('names the pagination region on the web', async () => {
    Platform.OS = 'web';

    await render(
      <DataTable.Pagination
        testID="pager"
        page={0}
        numberOfPages={3}
        onPageChange={() => {}}
      />
    );

    const pager = screen.getByTestId('pager');

    expect(pager).toHaveProp('role', 'group');
    expect(pager).toHaveProp('aria-label', 'Pagination');
  });

  it('makes its text labels their own stops on native', async () => {
    await render(
      <DataTable.Pagination
        page={0}
        numberOfPages={3}
        onPageChange={() => {}}
        label="1-2 of 6"
        numberOfItemsPerPageList={[2, 4]}
        numberOfItemsPerPage={2}
        onItemsPerPageChange={() => {}}
        selectPageDropdownLabel="Rows per page"
      />
    );

    // Unclaimed text is merged into whatever ancestor is focusable, which on
    // native is the enclosing scroll view - the whole screen.
    expect(screen.getByTestId('select-page-dropdown-label')).toHaveProp(
      'accessible',
      true
    );
    expect(screen.getByText('1-2 of 6')).toHaveProp('accessible', true);
  });

  it('gives every control a human name', async () => {
    await render(
      <DataTable.Pagination
        page={3}
        numberOfPages={15}
        onPageChange={() => {}}
        label="11-20 of 150"
        showFastPaginationControls
      />
    );

    expect(screen.getByLabelText('First page')).toBeOnTheScreen();
    expect(screen.getByLabelText('Previous page')).toBeOnTheScreen();
    expect(screen.getByLabelText('Next page')).toBeOnTheScreen();
    expect(screen.getByLabelText('Last page')).toBeOnTheScreen();
  });

  it('takes localized wording for every control', async () => {
    await render(
      <DataTable.Pagination
        page={3}
        numberOfPages={15}
        onPageChange={() => {}}
        label="11-20 of 150"
        showFastPaginationControls
        labels={{
          firstPage: 'Pierwsza strona',
          lastPage: 'Ostatnia strona',
        }}
      />
    );

    expect(screen.getByLabelText('Pierwsza strona')).toBeOnTheScreen();
    expect(screen.getByLabelText('Ostatnia strona')).toBeOnTheScreen();
    // Untouched entries keep their defaults.
    expect(screen.getByLabelText('Next page')).toBeOnTheScreen();
  });

  it('names the page position when there is no visible range', async () => {
    await render(
      <DataTable.Pagination
        page={3}
        numberOfPages={15}
        onPageChange={() => {}}
      />
    );

    expect(screen.getByLabelText('Page 4 of 15')).toBeOnTheScreen();
  });

  it('lets the visible range speak for itself', async () => {
    await render(
      <DataTable.Pagination
        page={3}
        numberOfPages={15}
        onPageChange={() => {}}
        label="11-20 of 150"
      />
    );

    expect(screen.queryByLabelText('Page 4 of 15')).toBeNull();
    expect(screen.getByText('11-20 of 150')).toBeOnTheScreen();
  });

  it('renders the rows-per-page selector only when it can work', async () => {
    const view = await render(
      <DataTable.Pagination
        page={3}
        numberOfPages={15}
        onPageChange={() => {}}
        label="11-20 of 150"
      />
    );

    expect(screen.queryByTestId('options-select')).not.toBeOnTheScreen();

    await view.rerender(
      <DataTable.Pagination
        page={3}
        numberOfPages={15}
        onPageChange={() => {}}
        label="11-20 of 150"
        numberOfItemsPerPageList={[2, 4, 6]}
        numberOfItemsPerPage={2}
        onItemsPerPageChange={() => {}}
        selectPageDropdownLabel="Rows per page"
      />
    );

    expect(screen.getByTestId('options-select')).toBeOnTheScreen();
    expect(screen.getByTestId('select-page-dropdown-label')).toBeOnTheScreen();
  });

  it('announces the selected page size and that it opens a menu', async () => {
    await render(
      <DataTable.Pagination
        page={3}
        numberOfPages={15}
        onPageChange={() => {}}
        numberOfItemsPerPageList={[2, 4, 6]}
        numberOfItemsPerPage={2}
        onItemsPerPageChange={() => {}}
        selectPageDropdownLabel="Rows per page"
      />
    );

    expect(
      screen.getByRole('button', { name: 'Rows per page, 2', expanded: false })
    ).toBeOnTheScreen();
  });
});
