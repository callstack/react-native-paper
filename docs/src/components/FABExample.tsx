import * as React from 'react';

import { FAB } from 'react-native-paper';

import InteractiveExample, { ExampleRow, Labelled } from './InteractiveExample';

/**
 * Every role-color preset accepted by the `variant` prop, kept in the same
 * order as the `Variant` union in `src/components/FAB/tokens.ts`.
 */
const VARIANTS = [
  'primary',
  'secondary',
  'tertiary',
  'tonalPrimary',
  'tonalSecondary',
  'tonalTertiary',
] as const;

/**
 * Every spec size accepted by the `size` prop.
 */
const SIZES = ['default', 'medium', 'large'] as const;

export const FABVariantsExample = () => (
  <InteractiveExample title="All variants — press for the ripple and state layer">
    <ExampleRow>
      {VARIANTS.map((variant) => (
        <Labelled key={variant} label={variant}>
          <FAB
            icon="pencil"
            variant={variant}
            onPress={() => {}}
            aria-label={`${variant} floating action button`}
          />
        </Labelled>
      ))}
    </ExampleRow>
  </InteractiveExample>
);

export const FABSizesExample = () => (
  <InteractiveExample title="All sizes — press for the ripple and state layer">
    <ExampleRow>
      {SIZES.map((size) => (
        <Labelled key={size} label={size}>
          <FAB
            icon="pencil"
            size={size}
            onPress={() => {}}
            aria-label={`${size} floating action button`}
          />
        </Labelled>
      ))}
    </ExampleRow>
  </InteractiveExample>
);

export const FABExtendedExample = () => {
  const [expanded, setExpanded] = React.useState(true);

  return (
    <InteractiveExample title="Extended — press to collapse and expand">
      <FAB.Extended
        icon="plus"
        label="New message"
        expanded={expanded}
        onPress={() => setExpanded((value) => !value)}
      />
    </InteractiveExample>
  );
};
