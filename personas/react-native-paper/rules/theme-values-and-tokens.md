---
id: theme-values-and-tokens
globs:
  - src/theme/**/*.{ts,tsx}
severity: major
enforcement: must
---

Theme values should be aligned with the design-token system so components stay consistent and the public API stays clean: tokens should be direct, well-named values that represent real customisation points.

- Tokens must represent genuinely customisable values; reject additions such as full-opacity enabled states that can never reasonably differ from their defaults ([#4917](https://github.com/callstack/react-native-paper/pull/4917#discussion_r3214016900)).
- Name token groups after the values they expose, not overloaded or misleading terms; prefer a name that describes the actual property over broad labels such as `state` ([#4917](https://github.com/callstack/react-native-paper/pull/4917#discussion_r3214012396)).
- Expose token values directly; avoid intermediate scales or mappings that translate between an internal enum and the real value ([#4923](https://github.com/callstack/react-native-paper/pull/4923#discussion_r3214059930)).
