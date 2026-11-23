---
id: typescript-typing-discipline
globs:
  - '**/*.{ts,tsx}'
severity: minor
enforcement: must
---

Treat TypeScript as a linting layer, not a runtime feature: derive types from a single source-of-truth map, let inference remove boilerplate, and avoid unsafe casts and `any`.

- Derive union types, numeric ranges and object shapes from one source-of-truth map instead of duplicating them as separate enum/union/object/range definitions; prefer plain union types over enums. ([#4923](https://github.com/callstack/react-native-paper/pull/4923#discussion_r3214063953)) ([#4917](https://github.com/callstack/react-native-paper/pull/4917#discussion_r3213994718)) ([#4917](https://github.com/callstack/react-native-paper/pull/4917#discussion_r3213994370))
- Type callback props whose return value is ignored as `() => void`; do not widen the return type to `void | null` or similar. ([#3543](https://github.com/callstack/react-native-paper/pull/3543#discussion_r1054245931))
- Annotate function return types instead of casting the result with `as`; use overloads when the return type must depend on the argument types. ([#3399](https://github.com/callstack/react-native-paper/pull/3399#discussion_r995618761))
- Remove explicit generic type parameters when TypeScript already infers them from the surrounding props. ([#3741](https://github.com/callstack/react-native-paper/pull/3741#discussion_r1133880480))
- Suppress unavoidable type errors with `// @ts-expect-error` and a comment explaining why; do not silently ignore types or use `any`. ([#4963](https://github.com/callstack/react-native-paper/pull/4963#discussion_r3339884743)) ([#3543](https://github.com/callstack/react-native-paper/pull/3543#discussion_r1054250999)) ([#3543](https://github.com/callstack/react-native-paper/pull/3543#discussion_r1054437975))
