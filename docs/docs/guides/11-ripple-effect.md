---
title: Ripple effect
---

The ripple effect is a visual feedback that occurs when a user interacts with a clickable UI element, such as a button. This response takes the form of a circular ripple expanding from the point of contact, much like a drop falling into water and creating ripples.

The ripple effect is an essential aspect of Material Design, and Paper's pressable components have it enabled by default. Nonetheless, it can be tailored to suit specific needs.

## Customize ripple effect color in component

The `rippleColor` prop is available for every pressable component which allows you to set the color of the ripple effect. For the instance, to make the `Button` component's ripple effect transparent, simply pass the desired color value to the prop:

```
<Button rippleColor="transparent" icon="camera" mode="contained" onPress={() => console.log('Pressed')}>
  Press me
</Button>
```

## Disable ripple effect in all components

To disable the ripple effect in *all* of Paper's components, you need to customize the `Provider`  that is likely wrapping your root component. To do this, simply pass `rippleEffectEnabled: false` to the `settings` object prop within the mentioned `Provider`.

```
import { Provider } from 'react-native-paper';
// ...

<Provider
  settings={{
    rippleEffectEnabled: false
  }}
>
  // ...
</Provider>
```



