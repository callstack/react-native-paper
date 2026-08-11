# `Drawer.Item` keeps `TouchableRipple` instead of its own state layer

Switch and Checkbox render their own state layer: a view filled with a
full-opacity colour role, with the `md.sys.state` opacity applied to the
*view*. `Drawer.Item` does not follow them — it leaves hover and press
feedback to `TouchableRipple` and only adds the focus indicator.

## Considered options

MD3 gives the drawer per-state layer colours (`onSecondaryContainer` when
active, `onSurface` when inactive), which `TouchableRipple` does not honour:
it defaults every ripple to `theme.colors.stateLayerPressed`, an
`onSurface`-derived colour precomputed at 10%. Passing a per-state
`rippleColor` would mean computing alpha at runtime, and
`theme.colors.*` can be a `PlatformColor` under Android dynamic theming,
which cannot be manipulated that way — the reason `stateLayerPressed` is
precomputed at all.

Adopting the Switch pattern would sidestep the alpha problem, but it replaces
`TouchableRipple` and so gives up Android's native ripple — while
`Drawer.Item` still exposes a `background: PressableAndroidRippleConfig`
prop for configuring exactly that ripple. Shipping both would be incoherent,
and removing the prop is a breaking change for a component MD3 has retired.

## Consequences

`Drawer.Item`'s hover and press layers are `onSurface`-derived in both active
and inactive states, which deviates from the spec's active-state colour. The
focus indicator is spec-correct and is rendered by `Drawer.Item` itself,
since `TouchableRipple` has no equivalent. Revisit if
`stateLayerPressed` is replaced by `PlatformColor`-with-alpha (#4972).
