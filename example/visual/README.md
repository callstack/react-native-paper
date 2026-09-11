# Visual regression PoC — agent-device on the example app

**Status: proof of concept, complete. Under review in #5115.** iOS and Android, one component, hand-run CLI. A hardened runner script and the full raw evidence that grew out of review live on branch `poc/agent-device-visual-runner`; they are deliberately not in this PR.

## The question, and the answer

Does [agent-device](https://github.com/callstack/agent-device) capture the existing example screens deterministically enough to diff `Surface` against a baseline, and does that diff catch a realistic regression rather than only a gross one?

**Yes on both platforms, with one catch.** The noise floor is 0 pixels on iOS and Android, across warm captures and a process relaunch, at every threshold tried. A realistic Surface regression — elevation level 1 rendering the level-2 shadow — is caught cleanly at `--threshold 0.02`, on exactly the right card, and is **bit-identical across three independent captures per platform**. But at agent-device's **default threshold (0.1) that same regression is reported as a perfect match** on both platforms. Any suite built on this must set the threshold explicitly and verify noise at that threshold.

## Setup

- Branch `poc/agent-device-visual`, React Native 0.85.3, Expo 56, Debug dev-client, agent-device 0.21.0 via `npx`. No Storybook, no extra screens.
- iPhone 17 Pro simulator (iOS 26.5, 3x) and `Pixel_10_Pro` emulator (API 37, 480 dpi, `hw.gpu.mode=auto`). Pinned in `env.json`; baselines are valid for that configuration only.
- The only app change: a `testID` on the "Elevated surface" and "Flat surface" `List.Section`s in `SurfaceExample.tsx` (`surface-example-elevated` / `surface-example-flat` — named so they cannot be mistaken for the library defaults removed in #5088 and #5099). `screenshot --crop-on 'id="…"'` then crops to exactly that section: 402x214 logical, 1206x642 px at `--pixel-density 3` on iOS; 1280x642 native px on Android.
- No animation freezing, status-bar normalisation or release build was needed for these captures. The crop excludes the status bar and LogBox.

**Why not `accessible`.** An earlier revision also set `accessible` on the sections, assuming Android needed it. It didn't, and on iOS it collapsed each section into one VoiceOver element: 2 Elevation-labelled nodes on screen instead of 26, the section a childless leaf labelled `"Elevated surface, Elevation 0, … Elevation 5, Vertical scroll bar, 3 pages"`. `testID` alone resolves the crop to the identical rect on both platforms and has no effect on the accessibility tree. Excerpts of the four trees are in `evidence/a11y-excerpt.json`; the full dumps are on the runner branch.

## iOS

Stability — four captures of `surface-example-elevated` against the baseline, 774,252 px each:

| capture                                           | @ 0.1 | @ 0.02 | regions |
| ------------------------------------------------- | ----- | ------ | ------- |
| warm-1 / warm-2 / warm-3                          | 0     | 0      | 0       |
| relaunch-1 (`open --relaunch`, pid 27223 → 37870) | 0     | 0      | 0       |

Sensitivity — one-line changes to the iOS branch of `src/components/Surface.tsx`, reverted after each capture (revert re-diffed to 0):

| break                                                  | @ 0.1 (default)             | @ 0.02                                                             |
| ------------------------------------------------------ | --------------------------- | ------------------------------------------------------------------ |
| Gross — every elevated surface gets the level-5 shadow | 4,277 px (0.55 %), 1 region | 116,292 px (15 %), 3 regions                                       |
| Realistic — level 1 renders the level-2 shadow         | **0 px, `match: true`**     | **10,179 px (1.31 %)**, one 378x378 region on the Elevation 1 card |

## Android

Stability — four captures against the baseline, 821,760 px each, thresholds pre-declared before capturing:

| capture                                          | @ 0.1 | @ 0.05 | @ 0.02 | @ 0.01 | regions |
| ------------------------------------------------ | ----- | ------ | ------ | ------ | ------- |
| warm-1 / warm-2 / warm-3                         | 0     | 0      | 0      | 0      | 0       |
| relaunch-1 (`open --relaunch`, pid 9944 → 10860) | 0     | 0      | 0      | 0      | 0       |

Sensitivity — one-line changes to the Android branch (`androidElevationLevels[…]`), reverted after each capture:

| break                                       | @ 0.1 (default)               | @ 0.05                          | @ 0.02                          | @ 0.01                          |
| ------------------------------------------- | ----------------------------- | ------------------------------- | ------------------------------- | ------------------------------- |
| Gross — every elevated surface gets level 5 | 65,051 px (7.92 %), 2 regions | 118,661 px (14.44 %), 4 regions | 208,505 px (25.37 %), 4 regions | 265,916 px (32.36 %), 2 regions |
| Realistic — level 1 renders level 2         | **0 px, `match: true`**       | 1,830 px (0.22 %), 1 region     | **9,336 px (1.14 %)**, 1 region | 14,686 px (1.79 %), 1 region    |

## The realistic break, repeated

Three independent captures per platform (`wait stable`, 2 s, screenshot, diff), thresholds declared first:

| platform | capture             | @ 0.1 | @ 0.02          |
| -------- | ------------------- | ----- | --------------- |
| iOS      | realistic-1 / 2 / 3 | 0     | 10,179 (1.31 %) |
| Android  | realistic-1 / 2 / 3 | 0     | 9,336 (1.14 %)  |

Bit-identical every time, and identical to the first single captures. On these targets the changed-pixel count is a deterministic function of the code. The diff image is a ring on the Elevation 1 card and nothing else (`evidence/diff-images/<platform>-realistic-1-t0.02.png`). Human visibility: borderline — noticeable only when flipping between the two images.

## Caveats

- **The crop is not perfectly isolated.** Under the gross break a full-width 33 px band at the top of the crop changed: the Appbar is itself a `Surface`, and the break changed every Surface. The realistic break showed no bleed. An Appbar-only change could register against this crop; that is inherent in screenshotting real screens rather than isolated components.
- **Dev-client chrome can land in the crop.** The Expo dev-client's floating "Tools" button, switched on by a stray dev-menu press, sat inside the Android section and produced a deterministic 2,822 px false FAIL with `src/` clean (`evidence/diff-images/android-devclient-tools-button.png`, `evidence/devclient-excerpt.json`). Turning it off in the dev menu ("Tools button") restored 0. A release build would remove the whole class of dev menu, dev launcher and floating button.
- **Not measured:** swiftshader (what `ubuntu-latest` renders with), cold simulator/emulator boot, another host or day, runtime or image updates, other components, text-heavy crops, dark theme, web (`--crop-on` is refused there).

## Reproducing by hand

Prerequisites: the example app built and installed on the device pinned in `env.json`, Metro running (`yarn example start`). Commands verified on 2026-09-10/11. agent-device sessions are keyed by cwd and bound to one device — use one directory per platform, or `--session <name>` for the second.

iOS (from the same cwd every time):

```bash
UDID=2464A356-C17C-4B0D-99DB-CDFBDB98826C
npx agent-device@0.21.0 open com.callstack.reactnativepaperexample --relaunch --platform ios --udid $UDID --json
# the dev menu appears a few seconds after relaunch; wait for it, then:
npx agent-device@0.21.0 wait stable 500 10000 --platform ios --udid $UDID --json
npx agent-device@0.21.0 press 'label="Close"' --platform ios --udid $UDID --json
# navigate to Surface (the app restores its last screen; if it is not Surface, press Back to the list and press the "Surface" row)
npx agent-device@0.21.0 wait stable 500 10000 --platform ios --udid $UDID --json && sleep 2
npx agent-device@0.21.0 screenshot current.png --crop-on 'id="surface-example-elevated"' --pixel-density 3 --platform ios --udid $UDID --json
npx agent-device@0.21.0 diff screenshot --baseline example/visual/__baselines__/ios/surface-example-elevated.png current.png --out diff.png --threshold 0.02 --json
```

Android (`--session android --platform android` on every command; after `open --relaunch` the dev launcher shows — press the row labelled with the Metro URL, e.g. `http://192.168.1.151:8081`, then wait for the app to load; no `--pixel-density`):

```bash
npx agent-device@0.21.0 open com.callstack.reactnativepaperexample --relaunch --platform android --session android --json
npx agent-device@0.21.0 screenshot current.png --crop-on 'id="surface-example-elevated"' --platform android --session android --json
npx agent-device@0.21.0 diff screenshot --baseline example/visual/__baselines__/android/surface-example-elevated.png current.png --out diff.png --threshold 0.02 --json
```

To see a failure: in `src/components/Surface.tsx` change `shadow(elevation, …)` to `shadow(elevation === 1 ? 2 : elevation, …)` (iOS) or `androidElevationLevels[elevation]` to `androidElevationLevels[elevation === 1 ? 2 : elevation]` (Android), relaunch the app so it fetches the bundle, capture, diff — expect ~10,179 px (iOS) / ~9,336 px (Android) at 0.02 and `match: true` at 0.1. `git checkout -- src/components/Surface.tsx` afterwards.

## What a real runner would have to handle

Learned the hard way while trying to script the loop above; each is documented in `evidence/issues.md` and implemented on the runner branch, none of it is in this PR:

- **Relaunch before every capture.** Fast Refresh silently stopped reaching the Android app; without a fresh bundle a stale screen reads as PASS.
- **The example app persists navigation state.** A relaunch lands on the last screen, so "start at the top of the list" is false; the runner has to press Back to the root and pick the Surface _row_, not the header title.
- **Dev-client chrome:** the dev menu appears seconds _after_ the app is ready, the Android relaunch lands in the dev launcher, and the floating Tools button can appear inside the crop.
- `snapshot` returns an empty `nodes` array when nothing changed unless `--force-full` is passed.
- Set `--threshold` explicitly (0.02 for soft shadows) and verify noise at it; the default hides real regressions.
- Pin the device (UDID, runtime, density) and refuse to compare or re-baseline on anything else; derive expected capture size from the baseline PNG, per story.
- Plain `.mjs` entry guarded by `import.meta.main` does nothing on Node 20/22; guard with an `argv[1]` comparison.

## agent-device issues found

Nineteen, with commands and evidence, in `evidence/issues.md`. The ones that matter most: the default diff threshold misses soft-shadow regressions (4); `find` taps what it finds (1); sessions are bound to one device per cwd (6); a dev-build screenshot can contain dev-client chrome the diff cannot tell apart from the app (19).

## Evidence

Every number above resolves to a row or a file:

- `evidence/results.csv` — one row per `diff screenshot` run (72 rows): platform, capture, threshold, total and changed pixels, mismatch %, regions, match, and the name of the raw JSON it came from. The raw per-command JSON files are on the runner branch.
- `evidence/diff-images/` — one diff image per platform for the realistic break (ring on the Elevation 1 card) and the gross break, both at 0.02, plus the dev-client Tools-button false FAIL. No 0.1 images exist because `diff screenshot --out` writes nothing on a match (issue 18).
- `evidence/a11y-excerpt.json`, `evidence/devclient-excerpt.json` — the nodes that matter from the accessibility trees; full trees on the runner branch.
- `env.json` — the pinned devices, versions and thresholds.

The first-run rows predate the test-id rename and their source files say `surface-elevated` / `surface-flat`; renaming an id changes no pixel.
