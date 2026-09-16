# General Code Review Standards

## Review Priorities

- Prioritize correctness, regressions, missing tests, and API design issues.
- Check that the behavior scope matches the stated intent.
- Verify claims about external standards, platform conventions, accessibility, and design systems against the implementation.
- Avoid asking for unrelated refactors, stylistic churn, or backwards compatibility unless required by the change.

## Public APIs

- Review new or modified public APIs for visibility, naming, defaults, customizability, and extensibility.
- Ensure public APIs and exported types do not leak implementation details.

## Dependencies

- For dependencies added for individual components, evaluate bundle size and platform impact. Prefer existing capabilities when they meet the requirements.

## Validation

- Call out missing tests when the changed behavior is risky.
- For visual changes, check before and after screenshots or videos for each affected platform and a nearby unaffected case.
