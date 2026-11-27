import { describe, expect, it } from '@jest/globals';
import path from 'node:path';

import { createComponentParser } from '../parser';

describe('component docs parser', () => {
  it('documents every branch of the Card public prop unions', () => {
    const repositoryRoot = process.cwd();
    const parse = createComponentParser(
      path.join(repositoryRoot, 'tsconfig.source.json')
    );
    const { props: documentedProps } = parse(
      path.join(repositoryRoot, 'src', 'components'),
      { source: 'Card/Card' }
    );
    const props = new Map(documentedProps.map((prop) => [prop.name, prop]));

    expect(props.get('variant')?.type).toContain('"filled"');
    expect(props.get('variant')?.type).toContain('"elevated"');
    expect(props.get('variant')?.type).toContain('"outlined"');
    expect(props.get('elevation')?.type).toContain('Elevation');
    expect(props.get('header')?.type).toBe('React.ReactNode');
    expect(props.get('title')?.type).toBe('React.ReactNode');
    expect(props.get('borderColor')?.type).toBe('ColorValue');
  });

  it('keeps the written type of props that are not union branches', () => {
    const repositoryRoot = process.cwd();
    const parse = createComponentParser(
      path.join(repositoryRoot, 'tsconfig.source.json')
    );
    const getType = (source: string, name: string) => {
      const { props: documentedProps } = parse(
        path.join(repositoryRoot, 'src', 'components'),
        { source }
      );

      return documentedProps.find((prop) => prop.name === name)?.type;
    };

    // Declared again by the pressable props it extends.
    expect(getType('IconButton/IconButton', 'onPress')).toBe(
      '(e: GestureResponderEvent) => void'
    );
    // Written out in the main props object for the docs, next to the union.
    expect(getType('Appbar/AppbarContent', 'title')).toBe('React.ReactNode');
  });
});
