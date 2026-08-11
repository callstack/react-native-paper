# `TypescaleKey` exposes the emphasized typescale entries

`md.sys.typescale` has carried the 15 `*Emphasized` entries
(`labelLargeEmphasized`, `titleSmallEmphasized`, …) since the token set was
restructured, but `TypescaleKey` listed only the 15 base keys — so the values
existed at runtime while `theme.fonts.labelLargeEmphasized` and
`<Text variant="labelLargeEmphasized">` failed to typecheck, and no component
could reach them. Modernizing the Drawer needed one:
`md.comp.navigation-drawer.active.label-text.weight` resolves to
`label-large-weight-prominent`. We widened `TypescaleKey` to include all 30
entries.

## Considered options

A Drawer-local `activeLabelWeight` token holding `700` would have avoided
touching the theme, but it duplicates a value the system typescale already
owns, and a user's `configureFonts` override of `labelLargeEmphasized` would
silently not reach the Drawer. Reading the internal `typescale` import
directly has the same override problem without the duplication.

## Consequences

The widening is additive at every consumer — `Text.variant`,
`Card.Title.titleVariant`, `Checkbox.Item`/`RadioButton.Item.labelVariant`,
`FAB.labelTypescale` and `configureFonts` all take `TypescaleKey` in a union
or `Partial` position, so more keys only permit more. `Typescale` becomes
`Record` over 30 keys rather than 15, which is stricter for anyone
hand-constructing a complete `fonts` object; the default `typescale` value
already supplies all 30. The navigation rail (#4982) and bottom navigation
(#4975) need `labelMediumEmphasized` and are unblocked by this.
