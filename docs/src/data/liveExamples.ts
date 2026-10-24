export type LiveExample = {
  /** Module specifier the examples are imported from. */
  module: string;
  /** Named exports rendered, in order, under the page summary. */
  exports: string[];
};

export const liveExamples: Record<string, LiveExample> = {
  FAB: {
    module: '@docs/components/FABExample.tsx',
    exports: ['FABVariantsExample', 'FABSizesExample'],
  },
  Extended: {
    module: '@docs/components/FABExample.tsx',
    exports: ['FABExtendedExample'],
  },
  Switch: {
    module: '@docs/components/SwitchExample.tsx',
    exports: [
      'SwitchStatesExample',
      'SwitchDisabledExample',
      'SwitchIconsExample',
    ],
  },
};
