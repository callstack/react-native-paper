import * as React from 'react';

import { FAB, type FABSize, type FABVariant } from 'react-native-paper';

import InteractiveExample, { ExampleRow, Labelled } from './InteractiveExample';

const VARIANTS: FABVariant[] = [
  'primary',
  'secondary',
  'tertiary',
  'tonalPrimary',
  'tonalSecondary',
  'tonalTertiary',
];

const SIZES: FABSize[] = ['default', 'medium', 'large'];

export const FABVariantsExample = () => (
  <InteractiveExample title="Variants">
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
  <InteractiveExample title="Sizes">
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
    <InteractiveExample title="Extended">
      <FAB.Extended
        icon="plus"
        label="New message"
        expanded={expanded}
        onPress={() => setExpanded((value) => !value)}
      />
    </InteractiveExample>
  );
};
