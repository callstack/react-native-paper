import * as React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import type { DatePickerProps } from './types';
import { useInternalTheme } from '../../core/theming';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const daysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

const firstWeekday = (year: number, month: number) =>
  new Date(year, month, 1).getDay();

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const styles = StyleSheet.create({
  container: {
    padding: 8,
    width: 320,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  } as ViewStyle,
  navLabel: {
    fontSize: 16,
    fontWeight: '600',
  } as ViewStyle,
  navButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  navButtonText: {
    fontSize: 20,
  } as ViewStyle,
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  } as ViewStyle,
  cell: {
    width: '14.285714285714286%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  weekday: {
    fontSize: 12,
    fontWeight: '500',
  } as ViewStyle,
  day: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  dayText: {
    fontSize: 14,
  } as ViewStyle,
  outOfMonth: {
    opacity: 0.35,
  } as ViewStyle,
});

/**
 * Material 3 calendar date picker (month view).
 *
 * Shows a single-month grid with prev/next navigation and a selectable day
 * cell for each day. The selected day is highlighted; days outside the
 * `min`/`max` range are disabled.
 *
 * @param props
 */
function DatePicker({
  value,
  onChange,
  min,
  max,
  weekStartsOn = 0,
  style,
  theme: themeOverrides,
  testID = 'date-picker',
}: DatePickerProps) {
  const theme = useInternalTheme(themeOverrides);
  const [view, setView] = React.useState({
    year: value.getFullYear(),
    month: value.getMonth(),
  });

  const primary = theme.isV3 ? theme.colors.primary : theme.colors.accent;
  const onSurface = theme.isV3 ? theme.colors.onSurface : '#000';
  const surface = theme.isV3 ? theme.colors.surface : '#fff';
  const outline = theme.isV3 ? theme.colors.outline : '#999';

  const orderedWeekdays = [
    ...WEEKDAYS.slice(weekStartsOn),
    ...WEEKDAYS.slice(0, weekStartsOn),
  ];

  const total = daysInMonth(view.year, view.month);
  const firstDow = (firstWeekday(view.year, view.month) - weekStartsOn + 7) % 7;

  // Leading days from the previous month to fill the first row.
  const prevMonthDays = daysInMonth(
    view.month === 0 ? view.year - 1 : view.year,
    view.month === 0 ? 11 : view.month - 1
  );
  const cells: Array<{
    day: number;
    monthOffset: number; // -1 prev, 0 current, +1 next
    date: Date;
  }> = [];

  for (let i = 0; i < firstDow; i++) {
    const day = prevMonthDays - firstDow + 1 + i;
    const date = new Date(
      view.month === 0 ? view.year - 1 : view.year,
      view.month === 0 ? 11 : view.month - 1,
      day
    );
    cells.push({ day, monthOffset: -1, date });
  }
  for (let d = 1; d <= total; d++) {
    cells.push({
      day: d,
      monthOffset: 0,
      date: new Date(view.year, view.month, d),
    });
  }
  // Trailing days to fill a full 6-week (42-cell) grid.
  let next = 1;
  while (cells.length < 42) {
    const date = new Date(
      view.month === 11 ? view.year + 1 : view.year,
      view.month === 11 ? 0 : view.month + 1,
      next
    );
    cells.push({ day: next, monthOffset: 1, date });
    next += 1;
  }

  const isDisabled = (date: Date) => {
    if (
      min &&
      date < new Date(min.getFullYear(), min.getMonth(), min.getDate())
    ) {
      return true;
    }
    if (
      max &&
      date > new Date(max.getFullYear(), max.getMonth(), max.getDate())
    ) {
      return true;
    }
    return false;
  };

  const prevMonth = () => {
    setView((v) =>
      v.month === 0
        ? { year: v.year - 1, month: 11 }
        : { year: v.year, month: v.month - 1 }
    );
  };
  const nextMonth = () => {
    setView((v) =>
      v.month === 11
        ? { year: v.year + 1, month: 0 }
        : { year: v.year, month: v.month + 1 }
    );
  };

  const label = `${MONTHS[view.month]} ${view.year}`;

  return (
    <View
      testID={testID}
      style={[styles.container, { backgroundColor: surface }, style]}
    >
      <View style={styles.header}>
        <Pressable
          testID={`${testID}-prev`}
          onPress={prevMonth}
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          style={styles.navButton}
        >
          <Text style={[styles.navButtonText, { color: onSurface }]}>‹</Text>
        </Pressable>
        <Text
          testID={`${testID}-label`}
          style={[styles.navLabel, { color: onSurface }]}
        >
          {label}
        </Text>
        <Pressable
          testID={`${testID}-next`}
          onPress={nextMonth}
          accessibilityRole="button"
          accessibilityLabel="Next month"
          style={styles.navButton}
        >
          <Text style={[styles.navButtonText, { color: onSurface }]}>›</Text>
        </Pressable>
      </View>

      <View style={styles.grid} testID={`${testID}-weekdays`}>
        {orderedWeekdays.map((wd, i) => (
          <View key={i} style={styles.cell}>
            <Text style={[styles.weekday, { color: outline }]}>{wd}</Text>
          </View>
        ))}
      </View>

      <View style={styles.grid} testID={`${testID}-grid`}>
        {cells.map((cell, i) => {
          const selected = sameDay(cell.date, value);
          const disabled = isDisabled(cell.date);
          const outOfMonth = cell.monthOffset !== 0;
          return (
            <View key={i} style={styles.cell}>
              <Pressable
                testID={`${testID}-day-${cell.date.toISOString()}`}
                onPress={() => {
                  if (!disabled) onChange(cell.date);
                }}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel={cell.date.toDateString()}
                style={[
                  styles.day,
                  selected
                    ? { backgroundColor: primary }
                    : { backgroundColor: 'transparent' },
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    {
                      color: selected ? surface : onSurface,
                    },
                    outOfMonth ? styles.outOfMonth : null,
                    disabled ? { opacity: 0.3 } : null,
                  ]}
                >
                  {cell.day}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default DatePicker;
