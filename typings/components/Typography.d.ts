import * as React from 'react';
import { ThemeShape } from '..';

interface TypographyProps {
  style?: any;
}

export class Caption extends React.Component<TypographyProps> {}
export class Headline extends React.Component<TypographyProps> {}
export class Paragraph extends React.Component<TypographyProps> {}
export class Subheading extends React.Component<TypographyProps> {}
export class Title extends React.Component<TypographyProps> {}
export class Text extends React.Component<
  TypographyProps & {
    theme?: ThemeShape;
  }
> {}
