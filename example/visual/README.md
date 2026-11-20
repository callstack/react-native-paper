# Visual regression PoC: agent-device on the example app

Proof of concept. iOS and Android against the existing example screens, `Surface` only, agent-device and its own diff. One script, `run.mjs`, drives both platforms. The raw per-command JSON and accessibility-tree dumps behind the evidence are on branch `poc/agent-device-visual-runner`; this PR keeps the summaries.

## Result

Does [agent-device](https://github.com/callstack/agent-device) capture the existing example screens deterministically enough to diff `Surface` against a baseline, and does that diff catch a realistic regression rather than only a gross one?

On iOS and Android, yes, with one catch. The noise floor is 0 pixels on iOS and Android, across warm captures and a process relaunch, at every threshold tried. A realistic Surface regression, elevation level 1 rendering the level-2 shadow, is caught at `--threshold 0.02`, on exactly the right card, and gives the same pixel count on three independent captures per platform. At agent-device's default threshold (0.1) that same regression is reported as a perfect match on both platforms. Any suite built on this must set the threshold explicitly and verify noise at that threshold.

## Setup

- Branch `poc/agent-device-visual`, React Native 0.85.3, Expo 56, Debug dev-client. agent-device 0.21.0 through its CLI via `npx`; its Node client was not used because it requires adding agent-device as a dependency, which this PoC avoided. If the approach is adopted, the runner should switch to the client. The docs and source were re-checked against 0.21.3. No Storybook, no extra screens.
- iPhone 17 Pro simulator (iOS 26.5, 3x) and `Pixel_10_Pro` emulator (API 37, 480 dpi, `hw.gpu.mode=auto`). `env.json` pins that profile, not the instance: no UDID and no serial. The runner resolves the simulator by name plus runtime through `xcrun simctl`, and the emulator by AVD name through `agent-device devices`, and boots it if it is down. iOS therefore works on any Mac with an iPhone 17 Pro on the iOS 26.5 runtime; Android works wherever the AVD is named exactly `Pixel_10_Pro` (an AVD name is the only handle agent-device exposes for a stopped emulator) and `adb` and `emulator` are reachable, on `PATH` or through `ANDROID_HOME`, which the runner defaults to `~/Library/Android/sdk` when unset. Baselines stay valid for that configuration only.
- The only app change: a `testID` on the "Elevated surface" and "Flat surface" `List.Section`s in `SurfaceExample.tsx` (`surface-example-elevated` / `surface-example-flat`, named so they cannot be mistaken for the library defaults removed in #5088 and #5099). `screenshot --crop-on 'id="…"'` then crops to exactly that section: 402x214 logical, 1206x642 px at `--pixel-density 3` on iOS; 1280x642 native px on Android.
- No animation freezing, status-bar normalisation or release build was needed. The crop excludes the status bar and LogBox.

Why not `accessible`: an earlier revision also set `accessible` on the sections, assuming Android needed it. It did not, and on iOS it collapsed each section into one VoiceOver element: 2 Elevation-labelled nodes on screen instead of 26, the section a childless leaf labelled `"Elevated surface, Elevation 0, … Elevation 5, Vertical scroll bar, 3 pages"`. `testID` alone resolves the crop to the identical rect on both platforms and has no effect on the accessibility tree. Excerpts in `evidence/a11y-excerpt.json`.

## iOS

Stability, four captures of `surface-example-elevated` against the baseline, 774,252 px each:

| capture                                            | @ 0.1 | @ 0.02 | regions |
| -------------------------------------------------- | ----- | ------ | ------- |
| warm-1 / warm-2 / warm-3                           | 0     | 0      | 0       |
| relaunch-1 (`open --relaunch`, pid 27223 to 37870) | 0     | 0      | 0       |

Sensitivity, one-line changes to the iOS branch of `src/components/Surface.tsx`, reverted after each capture (revert re-diffed to 0):

| break                                                 | @ 0.1 (default)             | @ 0.02                                                                              |
| ----------------------------------------------------- | --------------------------- | ----------------------------------------------------------------------------------- |
| Gross: every elevated surface gets the level-5 shadow | 4,277 px (0.55 %), 1 region | 116,292 px (15.02 %), 3 regions                                                     |
| Realistic: level 1 renders the level-2 shadow         | **0 px, `match: true`**     | **10,179 px (1.31 %)**, 3 regions, the dominant one 378x378 on the Elevation 1 card |

## Android

Stability, four captures against the baseline, 821,760 px each, thresholds declared before capturing:

| capture                                           | @ 0.1 | @ 0.05 | @ 0.02 | @ 0.01 | regions |
| ------------------------------------------------- | ----- | ------ | ------ | ------ | ------- |
| warm-1 / warm-2 / warm-3                          | 0     | 0      | 0      | 0      | 0       |
| relaunch-1 (`open --relaunch`, pid 9944 to 10860) | 0     | 0      | 0      | 0      | 0       |

Sensitivity, one-line changes to the Android branch (`androidElevationLevels[…]`), reverted after each capture:

| break                                      | @ 0.1 (default)               | @ 0.05                          | @ 0.02                          | @ 0.01                          |
| ------------------------------------------ | ----------------------------- | ------------------------------- | ------------------------------- | ------------------------------- |
| Gross: every elevated surface gets level 5 | 65,051 px (7.92 %), 2 regions | 118,661 px (14.44 %), 4 regions | 208,505 px (25.37 %), 4 regions | 265,916 px (32.36 %), 2 regions |
| Realistic: level 1 renders level 2         | **0 px, `match: true`**       | 1,830 px (0.22 %), 1 region     | **9,336 px (1.14 %)**, 1 region | 14,686 px (1.79 %), 1 region    |

## The realistic break, repeated

Three independent captures per platform (`wait stable`, 2 s, screenshot, diff), thresholds declared first:

| platform | capture             | @ 0.1 | @ 0.02          |
| -------- | ------------------- | ----- | --------------- |
| iOS      | realistic-1 / 2 / 3 | 0     | 10,179 (1.31 %) |
| Android  | realistic-1 / 2 / 3 | 0     | 9,336 (1.14 %)  |

Same count every time, and the same as the first single captures. The diff image is a ring on the Elevation 1 card and nothing else (`evidence/diff-images/<platform>-realistic-1-t0.02.png`). To a human the change is borderline: noticeable only when flipping between the two images.

## Web

Tried once on 2026-09-14 against `expo export --platform web` of the example app, served locally, with agent-device's managed browser (`agent-device web setup`, agent-browser 0.27.1). `open` works and a full-page `screenshot` works (1280x577). `screenshot --crop-on 'id="surface-example-elevated"'` is refused: `UNSUPPORTED_OPERATION`, `CROP_TARGET_NOT_ACCEPTED`, `PENDING_PIXEL_IDENTITY_EVIDENCE`. Transcript in `evidence/web-excerpt.json`, the full-page capture in `evidence/diff-images/web-full-page-screenshot.png`. A web leg would therefore diff full viewports rather than per-section crops. Not pursued for a Surface-only PoC.

## Caveats

- The crop is not perfectly isolated. Under the gross break a full-width 33 px band at the top of the crop changed: the Appbar is itself a `Surface`, and the break changed every Surface. The realistic break showed no bleed. An Appbar-only change could register against this crop; that is inherent in screenshotting real screens rather than isolated components.
- Dev-client chrome can land in the crop. The Expo dev-client's floating "Tools" button, switched on by a stray dev-menu press, sits inside the elevated section on both platforms and produced deterministic false FAILs with `src/` clean: 2,822 px on Android (`evidence/diff-images/android-devclient-tools-button.png`, `evidence/devclient-excerpt.json`) and 3,916 px on iOS. Turning it off in the dev menu ("Tools button") restored 0 on both. On iOS the dev-client's first-run onboarding sheet also dims the whole app, and `wait stable` reports that as settled. A release build would remove the whole class of dev menu, dev launcher, onboarding sheet and floating button.
- Not measured: swiftshader (what `ubuntu-latest` renders with), cold simulator/emulator boot, another host or day, runtime or image updates, other components, text-heavy crops, dark theme.

## Reproducing by hand

Prerequisites: the example app built and installed on a device matching the profile in `env.json`, Metro running (`yarn example start`). Each platform gets its own named session, `paper-visual-ios` and `paper-visual-android`, the same names the runner uses. An agent-device session is bound to one device, so if another session on the machine still claims the device, `open` is refused; close that session (`npx agent-device@0.21.0 close --session <name>`) and try again. Start by listing the devices to get the UDID or serial; the loop is the same on both platforms and only these values differ:

| value                      | iOS                                                           | Android                                                                            |
| -------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `TARGET`                   | `--platform ios --session paper-visual-ios --udid <UDID>`     | `--platform android --session paper-visual-android --serial <serial>`              |
| `DENSITY`                  | `--pixel-density 3`                                           | (none; Android returns native pixels)                                              |
| overlay after `--relaunch` | dev menu, a few seconds after launch: `press 'label="Close"'` | dev launcher: `press 'label="http://<metro-host>:8081"'`, then wait for the bundle |
| `BASELINE`                 | `example/visual/__baselines__/ios`                            | `example/visual/__baselines__/android`                                             |

```bash
AD="npx agent-device@0.21.0"
$AD devices --platform ios --json   # or --platform android; yields the UDID or serial
$AD open com.callstack.reactnativepaperexample --relaunch $TARGET --json
$AD wait stable 500 10000 $TARGET --json
# dismiss the overlay for this platform (table above); the app restores its last screen,
# so if it is not the Surface example, press Back to the list and press the "Surface" row
$AD wait stable 500 10000 $TARGET --json && sleep 2
$AD screenshot current.png --crop-on 'id="surface-example-elevated"' $DENSITY $TARGET --json
$AD diff screenshot --baseline $BASELINE/surface-example-elevated.png current.png --out diff.png --threshold 0.02 --json
```

Expect `differentPixels: 0`. To see a failure, change `shadow(elevation, …)` to `shadow(elevation === 1 ? 2 : elevation, …)` in `src/components/Surface.tsx` (iOS) or `androidElevationLevels[elevation]` to `androidElevationLevels[elevation === 1 ? 2 : elevation]` (Android), relaunch so the app fetches the bundle, capture, diff: about 10,179 px (iOS) or 9,336 px (Android) at 0.02, and `match: true` at 0.1. `git checkout -- src/components/Surface.tsx` afterwards.

## Running it

`example/visual/run.mjs` runs the loop above on either platform: plain ESM on Node 20 or newer, no new dependencies, spawning `npx agent-device@0.21.0 … --json` and parsing the output.

```bash
yarn example visual --platform ios
yarn example visual --platform android
```

It resolves and boots the device from the profile in `env.json`, relaunches the app so the bundle is fresh, waits for the app to be ready, dismisses the dev menu, dev launcher and floating Tools button if present, goes Back to the example list root and presses the Surface row if the app restored another screen, then captures and diffs each story and prints one line per story:

```
ios surface-example-elevated changed=0 (0%) regions=0 threshold=0.02 → PASS
```

Exit codes: 1 if any story fails the diff, 2 for a setup error (no simulator with that name on that runtime, no AVD with that name, an emulator whose API level or density is not the one the baselines were captured on, a failed boot, or an `open` that agent-device refused because another session claims the device), 3 if a capture's size does not match its baseline PNG. `--update` writes the captures as baselines, creating missing ones. `--out <dir>` sets where captures, diff images and `summary.json` go (default `example/visual/artifacts/run/<platform>`, gitignored). `--threshold <0-1>` overrides the 0.02 default and `--story a,b` limits the run to some stories; `--help` lists them all. `summary.json` is written on every exit except an argument error, which exits 2 before an output directory is known.

Prerequisites are the same as for the hand-run loop: the app built and installed on a device matching the profile, an AVD named exactly `Pixel_10_Pro` on Android with `adb` and `emulator` reachable, and Metro running. After an Android boot the runner sets `adb reverse tcp:8081 tcp:8081` itself, since a cold emulator has no route to Metro. A simulator that has never booted runs Apple's first-boot migration, which can take longer than agent-device's 120 s boot cap; boot it once from Xcode before the first run.

The pure helpers have ten `node:test` cases, no device needed (boot and the `open` retry are not covered):

```bash
yarn example test:visual
```

Left as follow-ups: creating the simulator or AVD when it is missing, per-profile baseline directories, `open --metro-port` in place of dismissing the dev launcher, a release-build variant of the example app, and CI. Before anything runs this in CI, `npx agent-device@0.21.0` has to become a locked dependency: today the runner executes a package fetched from the network on every run with no lockfile entry.

Not run by Jest, the pre-commit hook or CI. `results.csv` was transcribed from the raw `diff screenshot` JSON; its last column is the path of that JSON on branch `poc/agent-device-visual-runner`, not in this PR, except one iOS dev-client row from an uncommitted 2026-09-16 re-verification.

## What a real runner has to handle

Things `run.mjs` had to deal with. None is an agent-device bug:

- Relaunch before every capture (`open --relaunch` on iOS, `am force-stop` plus `open` on Android) so the app fetches the current bundle. Fast Refresh silently stopped reaching the Android app; without a fresh bundle a stale screen reads as PASS. `agent-device metro reload` exists for the same purpose and works, but the runner relaunches anyway because the app persists its navigation state.
- The example app persists navigation state. A relaunch lands on the last screen, so the runner has to press Back to the list root and pick the Surface row, not the header title.
- Dev-client chrome: on Android a relaunch lands in the dev launcher; on iOS the first-run onboarding sheet dims the whole app and `wait stable` reports it as settled; on both, the floating Tools button can sit inside the crop. Dismiss all of it before capturing, or capture from a release build. The runner keeps the dismissal code because the example app is only built as a dev client here; a release-build variant is a follow-up.
- Set `--threshold` explicitly (0.02 for soft shadows) and verify noise at it; the default 0.1 is documented as a 44-unit RGB tolerance, far looser than a one-step shadow change.
- Use `find … list` to locate without tapping, `--first` or a `role=` qualifier where Android exposes the same label on a row and its text child, and assert on node count after `snapshot --scope`, which returns success with empty nodes when nothing matches.
- Pin the device profile, resolve the instance through `simctl` and `agent-device devices` and boot it, and refuse to compare or re-baseline on a different image; derive expected capture size from the baseline PNG, per story.
- A plain `.mjs` entry guarded by `import.meta.main` does nothing on Node 20/22; guard with an `argv[1]` comparison.

## Evidence

- `evidence/results.csv`: one row per `diff screenshot` run (74 rows, including the two dev-client false FAILs): platform, capture, threshold, total and changed pixels, mismatch %, regions, match, and the path of the raw JSON it came from on the runner branch (one iOS dev-client row comes from an uncommitted re-verification).
- `evidence/diff-images/`: one diff image per platform for the realistic break (ring on the Elevation 1 card) and the gross break, both at 0.02, the dev-client Tools-button false FAIL, and the full-page web capture. There is no 0.1 image of the realistic break because it matches at 0.1 and `diff screenshot --out` writes nothing on a match, deleting any stale file at that path; the gross break did produce 0.1 images and they were not kept.
- `evidence/a11y-excerpt.json`, `evidence/devclient-excerpt.json`, `evidence/web-excerpt.json`: the nodes and responses that matter; full trees on the runner branch.
- `env.json`: the pinned device profiles, versions and thresholds.

The first-run rows predate the test-id rename and their source files say `surface-elevated` / `surface-flat`; renaming an id changes no pixel.
