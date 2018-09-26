import * as React from 'react';
import { ImageSourcePropType } from 'react-native';

type IconSourceBase = string | ImageSourcePropType;

interface PartialIconProps {
  color: string;
  size: number;
}

export type IconSource =
  | IconSourceBase
  | Readonly<{ source: IconSourceBase; direction: 'rtl' | 'ltr' | 'auto' }>
  | ((props: PartialIconProps) => React.ReactNode);

export interface IconProps extends PartialIconProps {
  source: IconSource;
}

export class Icon extends React.Component<IconProps> {}
