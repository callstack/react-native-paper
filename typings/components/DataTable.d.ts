import * as React from 'react';
import { StyleProp, ViewStyle, ViewProps } from 'react-native';
import { IconSource, ThemeShape } from '../types';
import { TouchableRippleProps } from './TouchableRipple';

export interface DataTableHeaderProps extends ViewProps {
  children: React.ReactNode;
  theme?: ThemeShape;
}

export interface DataTableTitleProps extends TouchableRippleProps {
  numeric?: boolean;
  sortDirection?: 'ascending' | 'descending';
  theme?: ThemeShape;
}

export interface DataTableRowProps extends TouchableRippleProps {
  theme?: ThemeShape;
}

export interface DataTableCellProps extends TouchableRippleProps {
  numeric?: boolean;
  style?: StyleProp<ViewStyle>;
}

export interface DataTablePaginationProps {
  page:number;
  numberOfPages:number;
  label?: React.ReactNode;
  onPageChange: (value: number) => any;
  theme?: ThemeShape;
}

export interface DataTableProps extends ViewProps {
  children: React.ReactNode;
}

export declare class DataTable extends React.Component<DataTableProps> {
  static Header: React.ComponentClass<DataTableHeaderProps>;
  static Title: React.ComponentClass<DataTableTitleProps>;
  static Row: React.ComponentClass<DataTableRowProps>;
  static Cell: React.ComponentClass<DataTableCellProps>;
  static Pagination: React.ComponentClass<DataTablePaginationProps>;
}
