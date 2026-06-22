---
applyTo: "**/*.{ts,tsx,js,jsx}"
---

# TypeScript And React Review Instructions

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

## React

- Check that hooks follow the Rules of Hooks.
- Check dependency arrays for unstable values.
- Ensure components do not perform side effects during rendering.
- Avoid storing values in state when they can be derived from props or existing state.
- Avoid multiple sources of truth for the same state.
- Avoid `React.Children`, `cloneElement`, and reading React elements directly unless there is a strong justification.
- Treat memoization as something that needs a reason: expensive calculation, stable identity requirement, or measured performance need.
- Check async effects for cancellation or race conditions when relevant.
- Check accessibility: labels, roles, focus order, keyboard interactions, disabled states, and loading states.

## Animations And Layout

- Check for unnecessary layout shifts.
- Prefer animating only `transform` and `opacity` unless another property is required.
- For layout transitions, verify the approach handles rapid state changes, gestures, interruption, and cancellation.
- Check that duration and easing feel appropriate for the platform and interaction.
- Verify text and UI elements do not overlap or overflow at supported screen sizes.
