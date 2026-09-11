# Visual regression PoC — agent-device on the example app

**Status: PoC complete (Thu 2026-09-10) — iOS, Android, and a reproducible script. Under review in #5115.**

Question this PoC answers: does [agent-device](https://github.com/callstack/agent-device) capture the existing example screens deterministically enough to diff `Surface` against a baseline, and does that diff catch a realistic regression rather than only a gross one?

Every number below is backed by committed evidence in `evidence/`. The original measurements were taken before the test ids were renamed, so JSON under `evidence/ios/`, `evidence/android/` and `evidence/a11y/` refers to `surface-elevated` / `surface-flat`; the current ids are `surface-example-*`, and renaming an id does not change a pixel. Committed evidence covers the raw `diff screenshot` JSON each table is computed from, the diff images from the deliberate breaks, and `evidence/issues.md` — plus the pinned environment in `env.json`. Local run output goes to `artifacts/` (gitignored).

## Setup

- Branch `poc/agent-device-visual` (PR #5115), React Native 0.85.3, Expo 56, Debug dev-client.
- iPhone 17 Pro simulator, iOS 26.5, 3x. Built with `yarn example ios --device "iPhone 17 Pro"` (63 s incremental).
- agent-device 0.21.0 via `npx`, driven from the CLI. No Storybook, no extra screens.
- Example-app change: a `testID` on the "Elevated surface" and "Flat surface" `List.Section`s in `SurfaceExample.tsx` (`surface-example-elevated` / `surface-example-flat`, named so they cannot be mistaken for the library defaults removed in #5088 and #5099), so `screenshot --crop-on 'id="surface-example-elevated"'` crops to exactly that section (402x214 logical, 1206x642 px at `--pixel-density 3`).
- No animation freezing, no status-bar normalisation, no release build were needed. The crop excludes the status bar, dev-client bubble and LogBox.

### The only test hook: a `testID`, and why not `accessible`

An earlier revision also set `accessible` on the two `List.Section`s, on the assumption that Android needed it to expose the node. Review flagged that as an accessibility regression, and testing confirmed it — see `evidence/a11y/`:

- **With `accessible`, iOS collapses the section into one accessibility element.** The XCUITest tree (the same tree VoiceOver walks) shows `surface-example-elevated` as a childless leaf with the label `"Elevated surface, Elevation 0, Elevation 1, …, Elevation 5, Vertical scroll bar, 3 pages"` — 2 Elevation-labelled nodes in the whole screen instead of 26 (`01-ios-snapshot-with-accessible.json` vs `03-testid-only-ios-snapshot.json`). Android does not collapse children either way (217 nodes, identical structure).
- **`testID` alone is enough on both platforms.** `--crop-on 'id="…"'` resolves to the identical rect with or without `accessible` (iOS 0,134,402×214; Android 0,372,1280×642). React Native did not flatten the View on Android, so `collapsable={false}` is not needed either.
- **A label or text selector cannot replace the id.** `label="Elevated surface"` is ambiguous on iOS (`CROP_TARGET_AMBIGUOUS`, nested StaticText) and on Android resolves to the 138 px subheader rather than the section.

`testID` has no effect on the accessibility tree on either platform, so the example app's behaviour is unchanged by the hook.

## iOS results

### Stability

Four captures of `surface-example-elevated` diffed against the baseline, 774,252 pixels each:

| capture                                           | changed px @ threshold 0.1 | changed px @ 0.02 | regions |
| ------------------------------------------------- | -------------------------- | ----------------- | ------- |
| warm-1                                            | 0                          | 0                 | 0       |
| warm-2                                            | 0                          | 0                 | 0       |
| warm-3                                            | 0                          | 0                 | 0       |
| relaunch-1 (`open --relaunch`, pid 27223 → 37870) | 0                          | 0                 | 0       |

**Noise floor: 0 pixels**, including across a real process restart. Screenshot wall-clock ≈ 0.7 s; relaunch ≈ 1.5 s.

Not measured: cold simulator boot, a different day/host, an iOS runtime update, other devices. Baselines are valid for the `env.json` configuration only.

### Sensitivity

Two deliberate one-line changes to `src/components/Surface.tsx` (iOS branch), applied via Fast Refresh and reverted after each measurement (revert re-diffed to 0 both times):

| break                                                  | @ 0.1 (CLI default)         | @ 0.02                                                                  |
| ------------------------------------------------------ | --------------------------- | ----------------------------------------------------------------------- |
| Gross — every elevated surface gets the level-5 shadow | 4,277 px (0.55 %), 1 region | 116,292 px (15 %), 3 regions                                            |
| Realistic — level 1 renders the level-2 shadow         | **0 px, `match: true`**     | **10,179 px (1.31 %)**, dominant region 378x378 on the Elevation 1 card |

**The most important finding:** agent-device's default per-pixel colour threshold (0.1) reports the realistic regression as a perfect match. At 0.02 it is caught cleanly, on exactly the right card, with the noise floor still at zero. Soft shadows are low-contrast by design; any suite built on this must set `--threshold` explicitly and verify noise at that threshold.

Human visibility of the realistic break: borderline — noticeable only when flipping between the two images. This is the class of regression a reviewer misses and a pixel diff catches.

The table above is the original single capture per break. Review asked for the realistic break to be repeated; the three independent re-captures per platform are in "Re-measured after review" below and are bit-identical to these numbers.

Two caveats, both from independent review of the artifacts:

- **Threshold choice was post-hoc on iOS.** 0.02 was chosen after the default missed the break, then re-verified against the same four noise captures. For Android the thresholds are pre-registered as a sweep (0.1 / 0.05 / 0.02 / 0.01) over every noise capture and every break, and the whole curve is reported.
- **The crop is not perfectly isolated.** Under the gross break, a full-width 33 px band at the top of the crop changed — the Appbar's shadow bleeding into the section. That is expected: the Appbar is itself a `Surface`, and the gross break changed every Surface. It accounted for 2 of 3 regions but not the majority of the signal (the dominant region, ~61 % of changed pixels, sits on the cards). The realistic break showed no bleed. Consequence for a real suite: an Appbar-only change could register against this crop. That is inherent in screenshotting real screens rather than isolated components, and is documented rather than engineered around in this PoC.

## agent-device issues found (to file)

See `evidence/issues.md` for commands and evidence.

1. `find <selector>` taps the match instead of only locating it.
2. `scroll bottom` hits a safety limit and leaves the Expo dev menu open.
3. `open --relaunch` restarts the app with the Expo dev menu open.
4. Default `diff screenshot --threshold 0.1` misses soft-shadow regressions (above).
5. Screenshot JSON carries no timing; wall-clock has to be measured externally.

Also noted: docs say `wait --stable`, the CLI takes `wait stable [quietMs] [timeoutMs]`.

Issues 6–12 (session binding per cwd, non-portable `find` selectors, stale-ref errors, Android relaunch landing in the launcher, `logs` on an inactive log, `--pixel-density` iOS-only, Node client not resolvable from the `npx` cache) are in `evidence/issues.md` with commands and evidence.

Issues 13–18 came out of the review round: `snapshot` returns an empty `nodes` array when the tree is unchanged unless `--force-full` is passed; a relaunch restores the previous route (the example app persists navigation state, so this is app behaviour the runner has to handle, logged for context); the dev menu appears after app-ready, not at open; Fast Refresh not reaching Android after a relaunch; an occasional non-zero CLI exit with empty stdout and stderr; and `diff screenshot --out` writing no image when the result is a match.

## Android

Emulator `Pixel_10_Pro`, API 37 (Android 17), arm64 `google_apis_playstore_ps16k`, 480 dpi, 1280x2856, emulator 36.6.11, `hw.gpu.mode=auto`. Wall-clock: emulator boot 8 s, `yarn example android` (incremental, build + install + launch) 119 s, `open` 668 ms, `open --relaunch` 1,688 ms, one cropped capture ≈ 2 s.

`--pixel-density` is rejected on Android (`UNSUPPORTED_OPERATION`, iOS-family only); Android screenshots already come back in native device pixels, so the `surface-example-elevated` crop is 1280x642 = 821,760 px. `--crop-on 'id="surface-example-elevated"'` and `'id="surface-example-flat"'` each resolve to exactly one node from the `testID` alone (see "The only test hook" above), so no fallback selector was needed.

### Stability

Four captures of `surface-example-elevated` diffed against the baseline, 821,760 pixels each, at every pre-registered threshold:

| capture                                          | changed px @ 0.1 | @ 0.05 | @ 0.02 | @ 0.01 | regions |
| ------------------------------------------------ | ---------------- | ------ | ------ | ------ | ------- |
| warm-1                                           | 0                | 0      | 0      | 0      | 0       |
| warm-2                                           | 0                | 0      | 0      | 0      | 0       |
| warm-3                                           | 0                | 0      | 0      | 0      | 0       |
| relaunch-1 (`open --relaunch`, pid 9944 → 10860) | 0                | 0      | 0      | 0      | 0       |

**Noise floor: 0 pixels at every threshold down to 0.01**, including across a real process restart. Same result as iOS. No animation freezing, no status-bar handling: the crop excludes the status bar, and `screenshot` stabilises Android chrome by default.

### Sensitivity

Both breaks are one-line changes to the Android branch of `src/components/Surface.tsx` (`androidElevationLevels[elevation]`), applied by Fast Refresh — confirmed by a temporary `console.log` probe seen 19 times in `adb logcat`, then removed. Each break was reverted with `git checkout --` and re-diffed to 0 at all four thresholds.

| break                                       | @ 0.1 (CLI default)           | @ 0.05                          | @ 0.02                          | @ 0.01                          | widest region                    |
| ------------------------------------------- | ----------------------------- | ------------------------------- | ------------------------------- | ------------------------------- | -------------------------------- |
| Gross — every elevated surface gets level 5 | 65,051 px (7.92 %), 2 regions | 118,661 px (14.44 %), 4 regions | 208,505 px (25.37 %), 4 regions | 265,916 px (32.36 %), 2 regions | 1280x444 @ 0.01 (whole card row) |
| Realistic — level 1 renders level 2         | **0 px, `match: true`**       | 1,830 px (0.22 %), 1 region     | 9,336 px (1.14 %), 1 region     | 14,686 px (1.79 %), 1 region    | 380x381 on the Elevation 1 card  |

The realistic break repeats the iOS finding exactly: at the default threshold the regression is reported as a perfect match; at 0.02 it is caught cleanly, in one region (374x375 at x=473, y=207) that covers only the Elevation 1 card, with the noise floor still 0. The diff image is a ring around that card, heaviest along the bottom edge — the extra shadow spread. Human visibility: subtle. Side by side you would notice the card sits slightly higher; in isolation almost nobody would. The gross break, unlike on iOS, is caught at the default threshold too, because a native `elevation` jump from 1 to 5 changes background compositing across the whole row, not just a soft shadow edge.

### Caveats

These numbers are for one emulator on one host with `hw.gpu.mode=auto`, i.e. host-GPU rendering. **swiftshader was not measured**, so nothing here says whether Android baselines survive on `ubuntu-latest`, which renders with swiftshader — CI parity is an open item, not a claim. Nor was a cold emulator boot from a wiped snapshot, an AVD at another density, a system-image update, or a Release build. Emulator relaunch is more expensive than on iOS in commands, not seconds: `open --relaunch` starts the Expo dev launcher, so reconnecting to Metro and waiting for the bundle takes three extra steps (see issues 9 and 10), and `wait stable` returns "settled" on the still-empty tree while the bundle loads — a suite must wait for real content, not for stability.

Six more agent-device findings came out of the Android run (session/device binding, non-portable `find` selectors, ref invalidation, dev-launcher relaunch, silent `logs`, and `--pixel-density` being iOS-only). They are issues 6-11 in `evidence/issues.md`, with commands and artifact references.

## Re-measured after review

Review asked that the headline sensitivity claim rest on more than one capture, and that the threshold be fixed before measuring rather than after. Both were done on 2026-09-10 with the renamed test ids and `testID` only (no `accessible`). Each row is an independent capture — `wait stable`, 2 s sleep, screenshot, then two diffs against the committed baseline at the two pre-declared thresholds. Raw JSON is in `evidence/sensitivity/<platform>/`, diff images in `evidence/diff-images/<platform>-realistic-<n>-t0.02.png`.

| platform | capture     | changed px @ 0.1 | changed px @ 0.02 | regions @ 0.02 |
| -------- | ----------- | ---------------- | ----------------- | -------------- |
| iOS      | realistic-1 | 0                | 10,179 (1.31 %)   | 3              |
| iOS      | realistic-2 | 0                | 10,179 (1.31 %)   | 3              |
| iOS      | realistic-3 | 0                | 10,179 (1.31 %)   | 3              |
| Android  | realistic-1 | 0                | 9,336 (1.14 %)    | 1              |
| Android  | realistic-2 | 0                | 9,336 (1.14 %)    | 1              |
| Android  | realistic-3 | 0                | 9,336 (1.14 %)    | 1              |

**Bit-identical across all three captures on both platforms**, and identical to the original single-capture numbers. There is no capture noise to average over: on these targets the changed-pixel count is a deterministic function of the code. The gross break was re-captured once per platform with the same result as before (iOS 4,277 / 116,292 px; Android 65,051 / 208,505 px at 0.1 / 0.02). After reverting, every capture diffed to 0 at both thresholds.

One operational finding from this pass matters for any runner built on this: **Fast Refresh stopped reaching the Android app after a relaunch.** Metro was serving the changed bundle (verified by fetching it), `adb reverse` was in place, and yet captures stayed at 0 changed pixels until a dev-menu Reload — after which the break appeared at exactly the expected magnitude. A runner that captures without forcing a fresh bundle can compare stale pixels and report PASS. `run.mjs` therefore always relaunches the app before capturing (issue 16).

## Not done / out of scope

Web (`--crop-on` is refused off iOS/Android, so it is a different loop), deep links, CI, other components, cross-platform comparison.

Before 0.02 is trusted as a default threshold rather than a Surface-specific one, the same protocol should be run on: other shadow-bearing components (Card, Chip, FAB), a text-heavy crop (glyph antialiasing may raise the noise floor), dark theme (different contrast profile), and an emulator on swiftshader, which is what `ubuntu-latest` CI renders with. None of these were measured.

Also unmeasured: cold simulator/emulator boot, a different day or host machine, an iOS runtime or emulator image update. Baselines are valid for the `env.json` configuration only.

## Running it

`example/visual/run.mjs` is the hand-run CLI loop above as one Node script (plain
ESM, Node 24, no build step, no new dependencies). It spawns
`npx agent-device@0.21.0 … --json` and parses stdout. The published package does
export `createAgentDeviceClient`, but `agent-device` is not a dependency of this
repo and is not resolvable from `example/`, so using the typed client would mean
adding a dependency — out of scope for the PoC.

```bash
node example/visual/run.mjs --platform ios
node example/visual/run.mjs --platform android
```

Requires Node 20 or newer, matching `example/package.json`. The entry point is
guarded by comparing `process.argv[1]` with the module URL rather than
`import.meta.main`, which only exists from Node 24.2 — on Node 20 the earlier
version printed nothing and exited 0, the worst failure a tool whose contract is
its exit code can have. The pure helpers have a `node:test` file:

```bash
node --test example/visual/run.test.mjs
```

`evidence/summary.md` is generated from the committed JSON by
`node example/visual/evidence/summarize.mjs`.

Flags: `--update` (write the current captures as baselines — creates a missing
baseline, overwrites an existing one), `--threshold <0-1>` (default `0.02`, the PoC
finding — the CLI default of `0.1` misses soft-shadow regressions),
`--story surface-example-elevated,surface-example-flat`, `--out <dir>` (where captures,
diff images, per-command JSON and `summary.json` go; default
`example/visual/artifacts/run/<platform>`, gitignored), `--force` (downgrade the device
check below to a warning — it does not touch the crop-size check).

Prerequisites are documented, not automated: the app must already be built and
installed on the device pinned in `env.json`, and Metro must be running. The
script always relaunches the app (`open --relaunch` on iOS, `am force-stop` +
`open` on Android) so the JS bundle is fetched fresh from Metro — never trusting
whatever is already on screen, after Fast Refresh was seen to silently stop
reaching the Android app. It waits for the app to be ready (not just for the tree
to be stable), dismisses the Expo dev menu (iOS) or dev launcher (Android) if
they appear, and then — because the example app persists navigation state and
restores the last route — either finds the Surface screen already showing or
presses Back to the example list root and presses the Surface row (matched by
position and width, not by label alone, so the header title is never mistaken
for it). Every loop is bounded and fails with a message rather than scrolling
forever. It then waits for the UI to go quiet and captures and diffs each story.

Each story prints one line:

```
ios surface-example-elevated changed=0 (0%) regions=0 threshold=0.02 → PASS
```

PASS means agent-device reported `match: true` at that threshold — no pixel
differed by more than the threshold's colour distance. FAIL means it did not;
`changed` is the pixel count and `regions` the number of clustered diff areas.
Exit codes: `1` if any story fails; `2` if the connected device does not match
`env.json`; `3` if a capture's dimensions do not match the crop pinned in
`env.json`. A regression is the only thing that exits 1.

Two guardrails:

- **Device pin.** Before any capture the script compares the connected device with
  `env.json` — UDID, iOS runtime and boot state via `xcrun simctl list -j devices`;
  API level and density via `adb getprop` and `adb shell wm density`. Any mismatch,
  or an inability to identify the device at all, exits 2 with an expected/observed
  list. This applies to `--update` too, so committed baselines cannot be
  overwritten from the wrong simulator by accident. `--force` downgrades this
  check to a warning; that is the only thing `--force` does.
- **Crop size.** In diff mode, after every capture the reported width, height and
  (on iOS) pixel density are compared with the crop pinned in `env.json`. A
  mismatch exits 3 with no override — a wrong-sized capture can never read as
  PASS, and a size mismatch on the right device means something a flag should
  not paper over. In `--update` mode the check is skipped (a new story has no
  pinned size yet) and the captured dimensions are printed on the `baseline
created` line instead. `env.json` is never rewritten by the script.

Verified end to end on 2026-09-10 after review; `summary.json` and the diff images are in
`evidence/runs/<platform>/fix-*/`. From the Surface screen: PASS with `changed=0`
on both stories, both platforms (iOS 12.7 s, Android 24.9 s). Started from another
example screen: relaunch → overlay dismissed → Back ×2 → Surface row pressed → PASS
(iOS 35.6 s, Android 33.6 s). With the realistic break applied and no manual
reload: `ios surface-example-elevated changed=10179 (1.31%) regions=3 → FAIL`, exit 1;
`android surface-example-elevated changed=9336 (1.14%) regions=1 → FAIL`, exit 1 —
the same counts as every hand-run capture. After `git checkout -- src/components/Surface.tsx`:
PASS again on both.

Round-2 verification (2026-09-11), `evidence/runs/<platform>/round2-*/`: PASS on iOS
(15 s) and Android (31 s) on Node 24.18; on Node 20.20.2 via `npx -y -p node@20 node
example/visual/run.mjs --platform ios` the entry point fires and PASSes (19 s), the
realistic break FAILs with `changed=10179 (1.31%)`, exit 1, and the revert PASSes.
One thing that surfaced: `npx -p` leaks `npm_config_package` into the child, which
made the script's own nested `npx agent-device` install node instead — the script
now strips `npm_config_*` from the environment it spawns with.
