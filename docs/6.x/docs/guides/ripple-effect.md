---
title: Ripple effect
---

The ripple effect is a visual feedback that occurs when a user interacts with a pressable UI element, such as a button. This response takes the form of a circular ripple expanding from the point of contact, much like a drop falling into water and creating ripples.

The ripple effect is an essential aspect of Material Design, and Paper's pressable components have it enabled by default. Nonetheless, it can be tailored to suit specific needs.

:::note
The ripple effect on the iOS platform is replaced by a highlight effect.
:::

## Customize ripple effect color in component

The `rippleColor` prop of `TouchableRipple` sets the color of the ripple effect. For example, to make the ripple effect a translucent red, pass the color value to the prop:

```typescript
<TouchableRipple
  rippleColor="#FF000020"
  onPress={() => console.log('Pressed')}>
  <Text>Press me</Text>
</TouchableRipple>
```

## Disable ripple effect in all components

To disable the ripple effect in **all** of Paper's components set `rippleEffectEnabled: false` on the `settings` prop of `PaperProvider`.

```typescript
import { Provider as PaperProvider } from 'react-native-paper';
// ...

<PaperProvider
  settings={{
    rippleEffectEnabled: false
  }}
>
  // ...
</PaperProvider>
```
