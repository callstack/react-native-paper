# Visual regression PoC — agent-device on the example app

**Status: PoC complete (Thu 2026-09-10) — iOS, Android, and a reproducible script. Pending maintainer review; nothing committed yet.**

Question this PoC answers: does [agent-device](https://github.com/callstack/agent-device) capture the existing example screens deterministically enough to diff `Surface` against a baseline, and does that diff catch a realistic regression rather than only a gross one?

Everything below is reproducible from the JSON artifacts in `artifacts/` (gitignored, kept locally) and the pinned environment in `env.json`.

## Setup

- Branch `poc/agent-device-visual` @ `cbcd52f7e`, React Native 0.85.3, Expo 56, Debug dev-client.
- iPhone 17 Pro simulator, iOS 26.5, 3x. Built with `yarn example ios --device "iPhone 17 Pro"` (63 s incremental).
- agent-device 0.21.0 via `npx`, driven from the CLI. No Storybook, no extra screens.
- Example-app change: `testID` + `accessible` on the "Elevated surface" and "Flat surface" `List.Section`s in `SurfaceExample.tsx`, so `screenshot --crop-on 'id="surface-elevated"'` crops to exactly that section (402x214 logical, 1206x642 px at `--pixel-density 3`).
- No animation freezing, no status-bar normalisation, no release build were needed. The crop excludes the status bar, dev-client bubble and LogBox.

## iOS results

### Stability

Four captures of `surface-elevated` diffed against the baseline, 774,252 pixels each:

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

Two caveats, both from independent review of the artifacts:

- **Threshold choice was post-hoc on iOS.** 0.02 was chosen after the default missed the break, then re-verified against the same four noise captures. For Android the thresholds are pre-registered as a sweep (0.1 / 0.05 / 0.02 / 0.01) over every noise capture and every break, and the whole curve is reported.
- **The crop is not perfectly isolated.** Under the gross break, a full-width 33 px band at the top of the crop changed — the Appbar's shadow bleeding into the section. That is expected: the Appbar is itself a `Surface`, and the gross break changed every Surface. It accounted for 2 of 3 regions but not the majority of the signal (the dominant region, ~61 % of changed pixels, sits on the cards). The realistic break showed no bleed. Consequence for a real suite: an Appbar-only change could register against this crop. That is inherent in screenshotting real screens rather than isolated components, and is documented rather than engineered around in this PoC.

## agent-device issues found (to file)

See `artifacts/issues.md` for commands and evidence.

1. `find <selector>` taps the match instead of only locating it.
2. `scroll bottom` hits a safety limit and leaves the Expo dev menu open.
3. `open --relaunch` restarts the app with the Expo dev menu open.
4. Default `diff screenshot --threshold 0.1` misses soft-shadow regressions (above).
5. Screenshot JSON carries no timing; wall-clock has to be measured externally.

Also noted: docs say `wait --stable`, the CLI takes `wait stable [quietMs] [timeoutMs]`.

Issues 6–12 (session binding per cwd, non-portable `find` selectors, stale-ref errors, Android relaunch landing in the launcher, `logs` on an inactive log, `--pixel-density` iOS-only, Node client not resolvable from the `npx` cache) are in `artifacts/issues.md` with commands and evidence.

## Android

Emulator `Pixel_10_Pro`, API 37 (Android 17), arm64 `google_apis_playstore_ps16k`, 480 dpi, 1280x2856, emulator 36.6.11, `hw.gpu.mode=auto`. Wall-clock: emulator boot 8 s, `yarn example android` (incremental, build + install + launch) 119 s, `open` 668 ms, `open --relaunch` 1,688 ms, one cropped capture ≈ 2 s.

`--pixel-density` is rejected on Android (`UNSUPPORTED_OPERATION`, iOS-family only); Android screenshots already come back in native device pixels, so the `surface-elevated` crop is 1280x642 = 821,760 px. `--crop-on 'id="surface-elevated"'` and `'id="surface-flat"'` each resolve to exactly one node (`testID` + `accessible` exposes `resource-id`), so no fallback selector was needed.

### Stability

Four captures of `surface-elevated` diffed against the baseline, 821,760 pixels each, at every pre-registered threshold:

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

Six more agent-device findings came out of the Android run (session/device binding, non-portable `find` selectors, ref invalidation, dev-launcher relaunch, silent `logs`, and `--pixel-density` being iOS-only). They are issues 6-11 in `artifacts/issues.md`, with commands and artifact references.

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

Flags: `--update` (overwrite the baselines with the current captures instead of
diffing), `--threshold <0-1>` (default `0.02`, the PoC finding — the CLI default of
`0.1` misses soft-shadow regressions), `--story surface-elevated,surface-flat`.

Prerequisites are documented, not automated: the app must already be built and
installed on the device pinned in `env.json`, and Metro must be running. The
script opens the app, dismisses the Expo dev menu if it is showing, navigates to
the Surface example (skipped if it is already on screen), waits for the UI to go
quiet, then captures and diffs each story.

Each story prints one line:

```
ios surface-elevated changed=0 (0%) regions=0 threshold=0.02 → PASS
```

PASS means agent-device reported `match: true` at that threshold — no pixel
differed by more than the threshold's colour distance. FAIL means it did not;
`changed` is the pixel count and `regions` the number of clustered diff areas.
The process exits 1 if any story fails, so it can gate a script or a CI step.
Captures, diff images, per-command JSON and `summary.json` land in
`example/visual/artifacts/run/<platform>/`.

On start-up the script compares the connected device with `env.json` — UDID, iOS
runtime and boot state via `xcrun simctl list -j devices`; API level and density
via `adb getprop` and `adb shell wm density` — and prints a `WARNING:` line per
mismatch. It does not refuse to run: baselines are only valid for the pinned
configuration, so a warning is the signal that a diff result is not comparable
with the numbers in this file.

Verified end to end on 2026-09-10: PASS with `changed=0` on both stories on both
platforms; with the realistic iOS break reapplied by Fast Refresh
(`shadow(elevation === 1 ? 2 : elevation, …)`) the script reported
`ios surface-elevated changed=10179 (1.31%) regions=3 threshold=0.02 → FAIL` and
exited 1 — the same pixel count as the hand-run loop — then PASS again after
`git checkout -- src/components/Surface.tsx`.
