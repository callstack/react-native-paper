---
id: documentation-standards
globs:
  - docs/**/*.{md,mdx,tsx}
  - '**/*.{md,mdx}'
severity: minor
enforcement: must
---

Keep docs accurate, concise, and consistent with the project’s conventions: dependency notes should be minimal and migration guidance should live in one place.

- Keep dependency notes as short bullets: omit internal declarations, peer-dependency warnings, and `>=` range details, and make every version string reflect the range the upgrade guide actually supports. ([#4926](https://github.com/callstack/react-native-paper/pull/4926#discussion_r3235781888))
- Put migration steps and breaking-change lists in the central upgrade guide, not in individual component or feature guides, and avoid “From v5” framing or self-referential version notes. ([#4926](https://github.com/callstack/react-native-paper/pull/4926#discussion_r3235770849)) ([#4926](https://github.com/callstack/react-native-paper/pull/4926#discussion_r3235817815))
- For platform APIs, document the full steps, required configuration, and known limitations; if a single call such as `forceRTL` is not enough, or differs on web/Expo, state the extra step or link to upstream docs. ([#4921](https://github.com/callstack/react-native-paper/pull/4921#discussion_r3225966040))
- Use exact component names in references and docstrings, and describe what a helper does rather than its internal structure when that makes the docs clearer. ([#3399](https://github.com/callstack/react-native-paper/pull/3399#discussion_r995621947))
- Rewrite convoluted sentences so the meaning is clear in one read. ([#3399](https://github.com/callstack/react-native-paper/pull/3399#discussion_r995626758))
