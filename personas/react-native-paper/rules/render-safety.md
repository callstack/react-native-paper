---
id: render-safety
globs:
  - src/components/**/*.{ts,tsx}
severity: minor
enforcement: must
---

Make platform checks and memoisation deliberate: use `Platform.OS` and `Platform.select` directly, and don't memoise trivial object creation.

- `Platform.OS` or `Platform.select` is used directly; the result is not stored in a variable ([#4963](https://github.com/callstack/react-native-paper/pull/4963#discussion_r3339897888)).
- Trivial object creation is not wrapped in `useMemo` ([#4963](https://github.com/callstack/react-native-paper/pull/4963#discussion_r3339920824)).
