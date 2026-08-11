# Paper ships drawer destinations, not a drawer container

Material Design specifies a navigation drawer *container* (360dp wide,
`corner-large-end`, modal on `surfaceContainerLow` at elevation 1 or standard
on `surface` at elevation 0), but Paper only ships `Drawer.Item`,
`Drawer.Section` and `Drawer.CollapsedItem` — the contents. Positioning,
gesture handling, the scrim and the open/close animation stay with
`@react-navigation/drawer`, which apps already depend on for routing. We kept
it that way when modernizing to MD3 rather than adding a container component.

## Considered options

Adding a `<Drawer>` container was rejected on two grounds. It would duplicate
`@react-navigation/drawer`, forcing users to choose between two drawers that
must agree on open state. And MD3 Expressive retired the navigation drawer in
May 2025 in favour of the expanded navigation rail, so a new container would
be new public API for a pattern the spec no longer recommends.

## Consequences

Users style the container themselves through `drawerStyle`. The example app
shows the recipe in `example/src/index.tsx`, and the container's spec values
are recorded in `src/components/Drawer/tokens.ts` even though no Paper
component consumes them.
