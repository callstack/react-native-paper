# React Native Paper

React Native Paper is Callstack's open-source Material Design component library for React Native. The repository is mid-transition to Material You (MD3): v6 work modernises components to the MD3 spec, adopts the New Architecture, and makes `react-native-reanimated` a peer dependency. The Expo, React and React Native versions it builds against are in `example/package.json`. `main` is the 6.x line; the `5.0` branch is 5.x maintenance.

## Layout

- `src/components/`: public component implementations (Button, TextInput, FAB, Switch, Checkbox, SegmentedButtons, BottomNavigation, etc.).
- `src/theme/`: theme schemes, reference and system tokens (`tokens/ref/`, `tokens/sys/`: colour, elevation, motion, shape, state and typography), fonts, the theme provider with `useTheme` and `useInternalTheme`, the reduce-motion context with `useReduceMotion`, and theme types.
- `src/core/`: `PaperProvider`, settings, locale and `useLocale`, `theming.tsx` (which re-exports `src/theme/provider.tsx`), and the hooks that resolve the system colour scheme and the reduce-motion preference.
- `src/index.tsx`: public API surface; keep exports compact and avoid deep imports.
- `example/`: Expo example app, with a demo screen per component in `example/src/Examples/`.
- `docs/`: documentation site; `docs/6.x/` holds the 6.x guides and `docs/5.x/` the 5.x ones.

## House style reviewers should not flag

- Type callbacks that ignore return values as `() => void`.
- Instead of casting a result with `as`, annotate the return type, and use overloads when it depends on the arguments.
- Components read the theme with `useInternalTheme(theme)`, so a `theme` prop overrides it for one instance; apps use `useTheme` or `withTheme`. A per-instance colour is a dedicated prop such as `containerColor`, `contentColor` or `textColor`, not a value read back out of `style`, because an animated style can't be read.
- Do not prefix public types with `T` or `I`; rename colliding imports locally instead.
- When wrapping a component, include its props type in your own and forward the remaining props as `...rest`.
- Multi-select components use the prop `multiSelect`; `value`/`onValueChange` are `string[]` when true and `string` when false.
- Use `Pressable` when no ripple is visible; use `TouchableRipple` when a ripple is intended.
- Drive gesture-driven animations and styling from Reanimated shared values, not event → state → effect → animation chains.
- Source safe-area insets from `useSafeAreaInsets` in examples, not from screen options.
- Tests render through `render` from `src/test-utils.tsx`, which wraps the real settings, locale and theme providers, rather than mocking a context.
- Centralise provider behaviour: set defaults, subscribe to side effects, and control internal behaviour through explicit provider props.

## Deliberate decisions that may look wrong

- v6 removes deprecated public API rather than keeping it alongside replacements.
- Theme tokens are removed rather than deprecated, because stale tokens pollute the public API and migration path.
- 6.x supports only Material Design 3: the MD2 themes, `isV3` and `version` are gone. Components move to the current MD3 spec one pull request at a time, so a modernised component can sit next to one that is not yet.
- `react-native-reanimated` is a peer dependency, not a direct dependency.
- New Architecture support is a deliberate requirement; new code should assume Fabric/TurboModules, not the legacy bridge.
- The peer dependency ranges for `react`, `react-native` and `react-native-safe-area-context` are `*` on purpose, and Getting Started names the minimum versions. `react-native-reanimated` and `react-native-worklets` keep `>=` floors.
- Paper adds no `react-native-svg` dependency, so ProgressBar and ActivityIndicator keep their current implementation in 6.0.
- There is no per-component `rippleColor`: components derive the ripple from their content colour. TouchableRipple and the components that extend its props (IconButton, List.Item, DataTable.Row) keep it and pass it through, and a component doesn't read an inherited `rippleColor`, `background` or `underlayColor` itself.
- PaperProvider merges its `theme` prop shallowly: each top-level key replaces the default, and `colors` merges one level deep. A component's `theme` prop merges deeply.
- PaperProvider is required: components that need it throw outside it, and `LocaleContext` has no default.
- Internal helpers such as `useReduceMotion` and `ThemeProp` stay unexported. Removals and renames land before 6.0.0; additions can wait for a minor.
- Compound components share state through context. `React.Children` and `cloneElement` remain only in Appbar, Chip and Tooltip, which are moving off them.
- A breaking change needs `!` in the PR title, a `BREAKING CHANGE:` paragraph for the squash commit and its own section in `docs/6.x/docs/guides/migration.md`.
- New components ship in 6.1 or later, so a 6.0 PR that adds one is out of scope.

## Known landmines

- The library is mid-migration to Material Design 3. v6 work intentionally changes visual output and
  public props. Check the change against the MD3 spec it claims to implement rather than against
  surrounding code that has not been modernised yet.
- Component docs on the website are generated from source by `docs/plugins/component-docs`, so prop
  JSDoc and `@extends` annotations are published output, not internal comments.
- Tests run under Jest with `@react-native/jest-preset`; `src/test-utils.tsx` is the shared harness.

## Toolchain

Yarn 4 (Berry, pinned in `.yarn/releases` and `packageManager`), ESLint flat config, Prettier,
lefthook, TypeScript project build via `tsc -b`. The published build is `react-native-builder-bob`.
