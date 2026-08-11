# React Native Paper

A React Native component library implementing Material Design. The v6 effort
realigns components with the current Material Design 3 specification.

## Language

### Design tokens

**Reference token** (`md.ref.*`):
A raw, context-free value — a palette entry or a typeface weight. Lives in
`src/theme/tokens/ref/`. Never read directly by a component.
_Avoid_: primitive token, base token

**System token** (`md.sys.*`):
A semantic decision expressed against reference tokens — a colour role, a
typescale entry, a shape corner, a state opacity. Lives in
`src/theme/tokens/sys/` and is surfaced to users through the theme.
_Avoid_: semantic token, alias token

**Component token** (`md.comp.*`):
A value a single component needs, named for that component's anatomy. Lives
next to the component in its own `tokens.ts`, and stores *references* to
system tokens (a `ColorRole` key, a `TypescaleKey`, a `ShapeToken`) rather
than resolved values, so user theme overrides still apply.
_Avoid_: local token, private token

**Colour role**:
The name of a system colour slot — `primary`, `onSurfaceVariant`,
`secondaryContainer`. Component tokens hold the role name and index into
`theme.colors` at render time.
_Avoid_: colour name, palette entry

**Emphasized typescale**:
A typescale entry carrying its base style's `*-weight-prominent` weight,
named `<base>Emphasized`. Used to mark selection, such as the active
destination in a navigation drawer.
_Avoid_: prominent variant, bold variant

### Interaction

**State layer**:
A translucent overlay in a colour role, shown at a `md.sys.state.opacity`
value to signal hover, focus, press or drag. Modern components render it as
their own view with the opacity on the view, never baked into the colour —
`theme.colors.*` may be a `PlatformColor`, which cannot take runtime alpha.
_Avoid_: overlay, highlight, ripple

**Focus indicator**:
The ring shown on keyboard focus only, drawn in a colour role at
`md.sys.state.focusIndicator.thickness`. An *outer* offset places it outside
the component; a negative *inner* offset places it inside, for components
whose neighbours sit flush.
_Avoid_: focus ring outline, focus outline

### Navigation

**Destination**:
A row in a navigation surface that switches the displayed view. Rendered by
`Drawer.Item` in a drawer and `Drawer.CollapsedItem` in a rail.
_Avoid_: menu item, link, tab

**Active indicator**:
The filled shape marking the currently selected destination —
`secondaryContainer`, fully rounded, 336×56 in a drawer and 56×32 in a rail.
Distinct from the destination itself, which is the whole touch target.
_Avoid_: selection pill, highlight, active background

**Standard drawer**:
A navigation drawer that shares the screen with content, on `surface` at
elevation 0. Used at expanded and larger breakpoints.
_Avoid_: permanent drawer, persistent drawer

**Modal drawer**:
A navigation drawer that overlays content behind a scrim, on
`surfaceContainerLow` at elevation 1. Used at compact and medium breakpoints.
_Avoid_: temporary drawer, overlay drawer

**Headline**:
The `titleSmall` label naming a group of destinations, rendered by
`Drawer.Section`'s `title`.
_Avoid_: section title, group header, caption
