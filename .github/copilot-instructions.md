# General Code Review Standards

## Review Priorities

- Prioritize correctness, regressions, missing tests, and API design issues.
- Check that the behavior scope matches the stated intent.
- Verify claims about external standards, platform conventions, accessibility, and design systems against the implementation.
- Avoid asking for unrelated refactors, stylistic churn, or backwards compatibility unless required by the change.

## Public APIs

- Review new or modified public APIs for visibility, naming, defaults, customizability, and extensibility.
- Ensure public APIs and exported types do not leak implementation details.

## Tests

- Call out missing tests when the changed behavior is risky.
