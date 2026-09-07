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
  });
});
