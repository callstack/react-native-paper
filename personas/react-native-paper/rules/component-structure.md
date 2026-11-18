---
id: component-structure
globs:
  - src/components/**/*.{md,tsx}
severity: major
enforcement: must
---

Structure components around explicit, type-safe data and centralised provider behaviour. Prefer typed prop objects or arrays over React children, measure layouts immediately before animating, and source safe-area insets from `useSafeAreaInsets` in examples. Keep provider logic in one place: defaults belong on the provider, and tests render components inside `PaperProvider` rather than mocking context.

- Do not use React Children APIs or read and manipulate React elements to extract configuration; accept a typed prop object or array instead so the API is composable and type-safe ([#4963](https://github.com/callstack/react-native-paper/pull/4963#discussion_r3340567072)) ([#4963](https://github.com/callstack/react-native-paper/pull/4963#discussion_r3340580708)).
- Measure component dimensions immediately before starting an animation, using UI-thread measurement where possible, instead of caching dimensions from events ([#4963](https://github.com/callstack/react-native-paper/pull/4963#discussion_r3340080418)).
- In examples, read safe-area insets with `useSafeAreaInsets` from `react-native-safe-area-context` inside the component rather than receiving them from screen options ([#4926](https://github.com/callstack/react-native-paper/pull/4926#discussion_r3235798261)).
- Set provider defaults on the provider itself, not on the context object, so values stay consistent and hooks throw when used outside the tree ([#4921](https://github.com/callstack/react-native-paper/pull/4921#discussion_r3201546305)).
- Render components inside `PaperProvider` in tests instead of mocking the provider context ([#4921](https://github.com/callstack/react-native-paper/pull/4921#discussion_r3210620821)).
