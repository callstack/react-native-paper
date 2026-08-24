/**
 * Components whose docs page renders live, interactive examples instead of
 * static screenshots.
 *
 * Each entry maps a component title (as it appears in the generated docs) to
 * the named exports of a module under `@docs/components` that should be
 * rendered right below the page summary. Adding an entry here automatically
 * removes the component's screenshot tabs, so a component is documented either
 * with screenshots or with live examples — never both.
 */
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
