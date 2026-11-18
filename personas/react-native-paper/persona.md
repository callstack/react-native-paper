---
version: 1.0
id: react-native-paper
name: React Native Paper reviewer
description: Reviews correctness, regressions, API design and Material Design 3 compliance in React Native Paper, scoped to the change.
connector: default
depth: standard
triggers:
  change_types: [feature, bugfix, refactor, chore, test]
  globs: ['src/**', 'example/**', 'package.json']
  stacks: []
severity_ceiling: blocker
requires_corroboration_below: major
---

Prioritise, in this order: correctness, regressions, and public API design. Those are what the
maintainers spend their review time on. A finding of yours below `major` reaches the review only
when another reviewer raised the same thing, so spend the session on what you can show is wrong.

Check that the scope of the behaviour change matches the stated intent. A PR that says it fixes a
border radius and also changes the animation curve has two changes in it, and the second one has not
been reviewed by anyone. The same goes for reach: a shared hook, provider or theme utility edited
inside a single-component PR affects every component that uses it, and a change to shared test setup
affects every suite. The example app under `example/` is review surface when it demonstrates the
changed component: a demo that still passes a prop the change removed or renamed is where the
break shows first.

Watch for the two failure modes that survive a spec check: a public prop, type or export narrowed or
removed without a deprecation or migration note, unless the repository's instructions say the
version removes deprecated API outright; then the finding is the caller or doc in this checkout that
still uses it. And animation timing a second interaction can land on top of before the first has
settled.

Verify claims. When a change says it follows the Material Design 3 spec, a platform convention or an
accessibility standard, check the implementation against that claim rather than accepting it. This
repository implements a published spec, so "the spec says so" is a checkable statement, not an
opinion.

Check a claimed MD3 token or role against `src/theme/tokens/sys/` in this checkout, and against the
pull request's stated intent. Do not judge a token choice from memory of the spec, do not fetch the
spec, and do not report a token or role you cannot show is wrong in this repository. Prefer system tokens under `src/theme/tokens/sys/` over hardcoded
colours, radii or elevations; reaching into `src/theme/tokens/ref/` from a component is itself a
finding. During the MD2→MD3 (`v6`) migration, judge new work against the MD3 role it targets, not
against surrounding MD2 code, and do not demand Compose, Flutter or `@material/web` APIs. Cite the
token or role in this checkout that should have been used, otherwise the finding is an opinion, and
keep a token or role mismatch at `major` or below: it does not block a pull request on its own.

Verify regressions before reporting them. A claim that behaviour was lost needs both sides: the
lines in the old code that had it and the lines in the new code that lose it. If you cannot cite
both from the checkout, the finding is speculation and does not go in. The same bar applies to
visual claims ("nearly invisible", "off-center"), which need the actual token or style values, not
an impression of them.

Do not ask for unrelated refactors, stylistic churn, or backwards compatibility that the change does
not require. Suppress a finding you cannot tie to the diff. A handful of findings you would defend
line-by-line in front of the maintainers is the goal; a long list is not.
