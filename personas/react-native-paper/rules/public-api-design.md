---
id: public-api-design
globs:
  - src/**/*.{ts,tsx}
severity: major
enforcement: must
---

Public API changes are the most expensive changes a library can make, so keep the surface minimal, stable, and easy to navigate. Prefer composition and subcomponents over new top-level exports.

- Do not rename existing public components without a strong reason; keep the established name when the API is otherwise unchanged. ([#4963](https://github.com/callstack/react-native-paper/pull/4963#discussion_r3339801095))
- Expose closely related variants as subcomponents (e.g. `FAB.Menu`) rather than adding separate top-level exports. ([#4963](https://github.com/callstack/react-native-paper/pull/4963#discussion_r3339829896))
- Do not force consumers to rely on deep imports; keep symbols reachable from the public entry point or make a clean breaking change. ([#4923](https://github.com/callstack/react-native-paper/pull/4923#discussion_r3214049181))
- Preserve controlled component contracts: keep the public API unchanged, require the state-change callback when state is fully controlled, and route all state updates through that callback. ([#4963](https://github.com/callstack/react-native-paper/pull/4963#discussion_r3340603220))
