---
id: naming-conventions
globs:
  - src/components/**/*.{md,tsx}
severity: minor
enforcement: must
---

Names should be as short as the surrounding context allows without becoming ambiguous. Strip redundant suffixes from parameters when the function already names the concept, resolve import collisions by renaming the imported type rather than adding a `T` prefix, and avoid names that imply computation or multi-axis layout when neither is true. Keep generics inferable, keep user-facing type names free of Hungarian prefixes, and keep the underscore prefix for class internals only.

- A parameter or variable does not repeat the type or concept already named by its enclosing function or scope; e.g. drop a `Theme` suffix when the function name includes `Theme` ([#3399](https://github.com/callstack/react-native-paper/pull/3399#discussion_r995623875)).
- When an imported type name collides with a local name, rename the import to a descriptive local alias such as `BaseRoute` instead of prefixing the local type with `T` ([#3741](https://github.com/callstack/react-native-paper/pull/3741#discussion_r1132328262)).
- Remove intermediate variables whose name suggests computation when no computation is performed; prefer the underlying name, e.g. `elevation` over `computedElevation` ([#4926](https://github.com/callstack/react-native-paper/pull/4926#discussion_r3235737976)).
- Use a single concise word for single-axis layout props; e.g. prefer `alignment` when the prop controls only one axis ([#4963](https://github.com/callstack/react-native-paper/pull/4963#discussion_r3340526973)).
- Do not prefix user-facing type names with `T`; use the plain name of the concept, or `T` for internal generic type parameters ([#3543](https://github.com/callstack/react-native-paper/pull/3543#discussion_r1054245136)).
- Do not introduce generic type parameters that cannot be inferred at the call site, such as context generics that callers cannot supply ([#3543](https://github.com/callstack/react-native-paper/pull/3543#discussion_r1054250999)).
- Reserve the underscore prefix for class properties that are internal to the class; do not prefix module-scoped or nested functions with an underscore ([#4926](https://github.com/callstack/react-native-paper/pull/4926#discussion_r3235715831)).
