---
applyTo: '**/*.{ts,tsx,js,jsx}'
---

# TypeScript and React Review Instructions

## Code Quality

- Flag unnecessary abstractions, one-off helpers, excessive indirection, and defensive code without a real use case.
- Flag comments that restate obvious code instead of explaining non-obvious intent.
- Check that changes follow existing project style, structure, naming, and local patterns.

## TypeScript

- Flag uses of `any`, unsafe `as` assertions, and non-null assertions (`!`) unless clearly justified.
- Avoid broad types such as `object`, `Function`, `{}`, and `Record<string, unknown>` unless the broadness is intentional.
- Do not accept `@ts-ignore`.
- Only accept `@ts-expect-error` when it has a comment explaining why the error is expected and cannot be resolved.
- Prefer simple types over complex conditional types, overloads, or type logic when simpler approaches work.
- Prefer `type` aliases over `interface` unless there is a specific reason to use `interface`.
- Reuse React Native prop and ref types where they describe the component's contract.

## React

- Check that hooks follow the Rules of Hooks.
- Check dependency arrays for unstable values.
- Ensure components do not perform side effects during rendering.
- Avoid storing values in state when they can be derived from props or existing state.
- Avoid multiple sources of truth for the same state.
- Avoid `React.Children`, `cloneElement`, and reading React elements directly unless there is a strong justification.
- Treat memoization as something that needs a reason: expensive calculation, stable identity requirement, or measured performance need.
- Check async effects for cancellation or race conditions when relevant.

## Component APIs and Styles

- Prefer existing native props or `style` over new props when they express the required behavior.
- Verify that components forward relevant native props and events without changing their meaning.
- Ensure controlled values have callbacks to update them. Support uncontrolled input when controlled rendering causes a demonstrated performance or reliability problem.
- Merge consumer styles after defaults for supported overrides. Check that computed styles preserve supplied padding, colors, dimensions, and other supported values.
- Expose test IDs for public interaction or content. Avoid IDs on internal wrappers solely for tests and default IDs that can collide across component instances.

## Design and Accessibility

- Compare component states, dimensions, icons, shapes, ripple effects, and disabled appearance with the Material Design specification.
- Use theme defaults and named tokens for colors, spacing, sizing, and motion where available. Check spacing against the design scale.
- Check labels, roles, focus order, and loading states. Verify keyboard, mouse, and touch interaction where applicable.
- Ensure disabled controls expose their state to assistive technology and prevent activation. Preserve appropriate focus when a control becomes unavailable after activation.
- Check that dismissing temporary UI restores focus to an appropriate element.
- Ensure visual changes do not make noninteractive content pressable.

## Platforms

- Check affected behavior on iOS, Android, and web, including positioning and interaction within scrolling containers and safe areas.
- Use direct `Platform.OS` checks or `Platform.select` so build tools can remove unused branches. Use `.native` files for native/web splits.
- Use CSS for web behavior it already supports instead of recreating it with JavaScript or layout measurements.
- Keep browser APIs and layout measurements out of server rendering. Verify that server output and the initial client render match.

## Animations and Layout

- Check for unnecessary layout shifts.
- Prefer animating only `transform` and `opacity` unless another property is required.
- Verify that animations handle rapid state changes, gestures, interruption, and cancellation. Stale completion callbacks must not leave rendered state, focus, or component callbacks inconsistent.
- Check that duration and easing feel appropriate for the platform and interaction.
- Keep continuous gesture work off the JavaScript thread when responsiveness requires it, using Gesture Handler and Reanimated where appropriate.
- Measure dimensions near animation start when this provides current values and avoids extra state.
- Verify text and UI elements do not overlap or overflow at supported screen sizes.
