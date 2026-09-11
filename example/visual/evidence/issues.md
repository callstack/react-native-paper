# agent-device dogfooding issues

Tool: `agent-device` 0.21.0 (run as `npx agent-device@0.21.0`), Node v24.18.
Device: iPhone 17 Pro, iOS 26.5, UDID `2464A356-C17C-4B0D-99DB-CDFBDB98826C`.
Session state dir (for runner/request logs): `/Users/juliankobrynski/.agent-device/sessions/cwd_4a6658db6e09aaf6_default/`.

---

## 1. `find` taps the match instead of just locating it

`find` is documented/named as a query, but a successful match performs a tap, so
navigation happens as a side effect. There is no way to locate an element without
acting on it (you have to fall back to `snapshot`).

Command:

```
npx agent-device@0.21.0 find 'label="Surface"' --udid 2464A356-C17C-4B0D-99DB-CDFBDB98826C --json
```

Output (note `"Tapped …"`):

```json
{
  "success": true,
  "data": {
    "ref": "@e13",
    "locator": "any",
    "query": "label=\"Surface\"",
    "x": 201,
    "y": 501,
    "message": "Tapped @e13 (201, 501)"
  }
}
```

Artifact: `19-find-surface.json` (also `16-find.json`, `17-find.json`).

Related: when the label is not on screen, `find` fails with a generic
`find did not match any element` and no indication that the element may simply be
below the fold — artifact `17-find.json`.

---

## 2. `scroll bottom` hits a safety limit and leaves the Expo dev menu open

`scroll bottom` on the example-list screen never reports reaching the edge, aborts
on a safety limit, and the repeated scrolling gesture is interpreted by the Expo
dev client as the "open dev menu" gesture. The app is then left with the dev-menu
sheet on top, which silently poisons any screenshot taken afterwards.

Command:

```
npx agent-device@0.21.0 scroll bottom --udid 2464A356-C17C-4B0D-99DB-CDFBDB98826C --json
```

Output:

```json
{
  "success": false,
  "error": {
    "code": "COMMAND_FAILED",
    "message": "scroll bottom reached the safety limit before the snapshot showed the edge",
    "hint": "The scoped scroll container still reports hidden content. Use a smaller manual scroll + snapshot loop to inspect the current state."
  }
}
```

Artifact: `16-scroll.json`. Recovery: `press 'label="Close"'` (artifact `18-press-close.json`).
Workaround used for the PoC: `scroll down 6 --settle` twice instead of `scroll bottom`.

---

## 3. `open --relaunch` leaves the Expo dev menu open on the restarted app

New in Task B. After `open … --relaunch` the app process is genuinely restarted
(PID 27223 -> 37870) and React Navigation restores the previous screen, but the
Expo dev-client menu sheet is on screen. A capture taken right after the relaunch
would include it. There is no signal in the `open --json` payload that the app is
not in a clean state; only a `snapshot` reveals it.

Command:

```
npx agent-device@0.21.0 open com.callstack.reactnativepaperexample --platform ios \
  --udid 2464A356-C17C-4B0D-99DB-CDFBDB98826C --relaunch --json
```

`open` reports success (`startup.durationMs: 1032`), artifact `45-open-relaunch.json`.
The following snapshot shows the dev menu nodes (`Runtime version: exposdk:56.0.0`,
`Close`, `Reload`, `Go home`) — artifact `47-snapshot.json`.
Recovery: `press 'label="Close"'` — artifact `48-press-close.json`.

---

## 4. Default `diff screenshot --threshold 0.1` misses real soft-shadow regressions

New in Task B, and the most consequential finding for using this tool as a visual
regression guard for Material elevation.

A realistic regression — Surface elevation level 1 rendering the level 2 spot and
ambient shadow, one step off — is reported as a **perfect match** at the default
threshold:

```
npx agent-device@0.21.0 diff screenshot \
  --baseline example/visual/__baselines__/ios/surface-example-elevated.png \
  <capture of the broken build> --out <diff.png> --threshold 0.1 --json
```

Committed evidence: `evidence/results.csv` rows `ios / realistic / 0.1` (0 changed pixels,
`match: true`) and `ios / realistic / 0.02` (10,179 changed pixels) are the two diffs of the
same capture; the three repeats are the `ios / realistic-{1,2,3}` rows at both thresholds;
the diff image at 0.02 is `evidence/diff-images/ios-realistic-1-t0.02.png`.
There is no 0.1 image because `diff screenshot --out` writes nothing on a match (issue 18).
The raw capture PNG was not committed.

```json
{
  "success": true,
  "data": {
    "totalPixels": 774252,
    "differentPixels": 0,
    "mismatchPercentage": 0,
    "match": true
  }
}
```

The same pair at `--threshold 0.02` reports 10179 different pixels (1.31%) in a
single 378x378 region exactly around the affected surface (`results.csv`,
`ios / realistic`; image `ios-realistic-1-t0.02.png`).

The gross break (every elevated surface forced to the level 5 shadow) is also
badly under-reported at the default threshold: 4277 px / 0.55% in one 316x17 band
versus 116292 px / 15.02% in 3 regions at 0.02 (`results.csv`, `ios / gross`;
image `ios-gross-t0.02.png`). At the default threshold, a change that is
plainly visible to the eye across the whole screen registers as a thin sliver.

Suggestion: either lower the default, or document that the default threshold is
unsuitable for low-contrast/anti-aliased content such as shadows and gradients,
and surface the threshold actually used in the JSON output (it is not echoed today).

---

## 5. Minor: no way to time a capture from the JSON output

`screenshot --json` returns path and dimensions but no timing, so wall-clock has to
be measured around the process. Measured externally for the record: single
`screenshot --crop-on … --pixel-density 3` = 673-737 ms; `open --relaunch` = 1539 ms
round-trip (`startup.durationMs` 1032). Artifacts `44-screenshot.json`,
`45-open-relaunch.json`.

---

# Android (Fri 2026-09-10, agent-device 0.21.0, Pixel_10_Pro API 37)

## 6. A cwd whose session is bound to one platform cannot target another device

`boot --platform android --device Pixel_10_Pro` from a cwd whose default session was
bound to an iOS simulator fails with `INVALID_ARGS` ("already bound to apple device
… but this request selected --platform=android"). Artifact `74-boot.json`. The hint is
good (pass a different `--session`), and `--session android` worked (`75-boot.json`),
but a session keyed only by cwd means one checkout cannot drive iOS and Android
without inventing session names by hand. Worth documenting in the multi-platform
guide, or keying sessions by cwd+platform.

## 7. The same `find` selector is not portable across platforms

`find 'label="Surface"'` resolves to exactly one node on iOS, but on Android it fails
with `AMBIGUOUS_MATCH` — the accessibility tree exposes both the row `ViewGroup` and
its child `TextView` with the same label (`83-find-surface.json`,
candidates `@e21 [group] "Surface"`, `@e22 [text] "Surface"`). Any cross-platform
script has to carry two selectors for one row. A role-defaulting rule (prefer the
tappable ancestor) or a documented `role=` qualifier for the common case would fix it.

## 8. Refs from an earlier snapshot are rejected with a confusing message

`press '@e21'`, with the ref taken from the immediately preceding `snapshot --json`,
failed: "Ref @e21 needs a complete snapshot — the current frame only authorizes its
emitted refs" (`84-press-surface.json`). Re-snapshotting and using the new ref for the
same element (`@e55`) worked (`86-press-surface.json`). The message does not say what
invalidated the ref or that a fresh snapshot renumbers every element.

## 9. Android relaunch lands in the Expo dev launcher, not the app

Android version of issue 3. `open com.callstack.reactnativepaperexample --platform
android` on an app whose process is alive shows the Expo **dev menu** overlay — two
presses ("Continue", then "Close") were needed to reach the app (`77-`/`79-`/
`81-snapshot.json`). After `open --relaunch` (pid 9944 → 10860, `95-open-relaunch.json`)
the app starts on the Expo dev launcher screen and must be reconnected by pressing the
"RECENTLY OPENED" entry (`97-press-recent.json`), then the JS bundle takes several
seconds to load — `wait stable` returns immediately on the "nearly-empty tree" and only
`wait text` (or a retry) reveals the app is still on "Connecting to the development
server…" (`98-wait.json`). A dev-client aware `open` (or a documented recipe) would
remove three commands from every relaunch.

## 10. `logs` reports success on an empty log unless `logs start` ran first

`logs --json` returned `success: true` with `sizeBytes: 0`, `active: false`,
`state: "inactive"` (`104-logs.json`) — no indication that nothing was being captured.
Confirming the Fast Refresh probe had to be done with `adb logcat -d | grep`
(19 hits). `logs start` (`105-logs-start.json`) arms capture, but a success response
for a log that is not running is misleading.

## 11. Recorded, not a bug: `--pixel-density` is iOS-only

`screenshot --crop-on … --pixel-density 3` on Android → `UNSUPPORTED_OPERATION`,
"currently supported only on iOS-family simulators" (`91-screenshot-pd3.json`).
Android already returns native device pixels (1280x642 for the crop at 480 dpi), so
nothing is lost — but the iOS default of 1x logical points remains an easy trap.

## Threshold data point for issue 4 (Android)

Android repeats the iOS finding for the realistic break: 0 changed pixels and
`match: true` at the default 0.1, 9,336 px at 0.02 (`results.csv`, `android / realistic`).
Unlike iOS, the gross break is caught at the default (65,051 px / 7.92 %).

## 12. The typed Node client is exported but unreachable without a dependency

`agent-device@0.21.0`'s `package.json` does export the client
(`exports["."] → dist/src/index.js`, which exports `createAgentDeviceClient`), so
the plan's "one Node file on `createAgentDeviceClient()`" is supported in
principle. In practice the package only exists in the `npx` cache
(`~/.npm/_npx/<hash>/node_modules/agent-device`); `import('agent-device')` from
`example/` fails with `ERR_MODULE_NOT_FOUND`. Reaching the typed API therefore
means adding a devDependency, which the PoC forbade, so the runner (on branch `poc/agent-device-visual-runner`)
spawns the CLI with `--json` instead. Worth a documented "run the client without
installing" story (or a `npx agent-device init`-style scaffold), since the CLI
path costs an `npx` resolution per command and loses all the result types.

## 13. `snapshot` returns an empty `nodes` array when the tree is unchanged

A plain `snapshot` only reports nodes that changed since the previous snapshot in
the same session. When nothing changed it returns `data.nodes: []` with
`success: true`, which is indistinguishable from "the screen is empty" or "the
node is gone" for any caller that greps the result for an identifier. This cost
real time in the review round: a plain snapshot after the `testID` edit looked
as if the id had never reached the tree, when it had been there the whole time —
`--force-full` returned it (the resulting trees are excerpted in
`evidence/a11y-excerpt.json`; full files on branch `poc/agent-device-visual-runner`). Anything that asks "is this node
on screen?" must pass `--force-full`; the runner on that branch does so for
exactly this reason.
An empty diff-mode result would be much less of a trap if the payload said so —
e.g. a `mode: "diff"` / `unchanged: true` field alongside the empty array.

## 14. `open --relaunch` restores the app's previous route

The first scripted loop assumed a relaunch puts the example list back at the
top, so it could scroll down a fixed number of rows to reach "Surface". It does
not. The example app persists its navigation state in AsyncStorage
(`PERSISTENCE_KEY = 'NAVIGATION_STATE'` in `example/src/index.tsx`), so after
`open --relaunch` (iOS) or `am force-stop` + `open` (Android) the app comes back
on whatever screen it was on. Reproduced on both platforms in this pass:

The logs of the runs that first showed this were not kept. The fixed runner on
branch `poc/agent-device-visual-runner` logs `relaunching the app … not on the Surface screen — going back to the
example list … pressing "Back" … at the example list root` when started from
another example screen, on both platforms — a branch that could not be reached if a
relaunch reset the route. Its run summaries are committed on that branch under
`example/visual/evidence/runs/`.

This is a runner bug, not an agent-device bug: navigation has to be driven
back to the list explicitly (press `Back` until no `Back` control is left, then
scroll for the row), not implied by a relaunch. Related trap: because
`navigateToSurface()` matches on `label === 'Surface'` and picks the largest
match, on the restored _Surface_ screen it pressed the nav header title
(`RCTParagraphComponentView "Surface"`) instead of a list row. That log was not
kept either; the trap is encoded as a unit test in the runner on branch `poc/agent-device-visual-runner`
(`findSurfaceRow picks the list row, not the Appbar title`), whose fix picks the
row by position and width.

## 15. The dev-menu check runs before the app finishes loading

`dismissDevMenu()` snapshots once, immediately after the relaunch. On iOS that
snapshot came back with three nodes — `UIApplication`, `SplashScreenLogo`,
`Downloading 100%…` — so it found none of the `Close` / `Continue` labels and
returned "clean". Reproduced for the record on 2026-09-11 —
`evidence/devclient-excerpt.json`, `ios_after_open_relaunch`: immediately after
`open --relaunch` the tree is 3 nodes (`React Native Paper Example`, the splash
image, `Downloading 100%…`); six seconds later it is 77 nodes including the dev
menu's `Close` (`identifier: "xmark"`). Full snapshots on branch `poc/agent-device-visual-runner` under
`example/visual/evidence/runner/`. The dev menu appears _after_ the bundle finishes downloading; a
check that snapshots once at open time cannot see it, and it then swallows every
subsequent scroll. The check has to
wait for the app to be ready first, and be repeated inside the navigation loop
rather than run once.

On Android the same step fails differently and confirms issue 9: after
`am force-stop` + `open`, the app is the Expo **dev launcher**
(`DEVELOPMENT SERVERS` / `Fetch development servers` / `RECENTLY OPENED`), whose
labels differ from the dev menu's. Recovery is to press the recently-opened
entry (`http://192.168.1.151:8081`), which reloads the bundle in ~20 s.

## 16. Fast Refresh did not reach the Android app; a manual Reload was required

On iOS every edit to `src/components/Surface.tsx` was picked up within a few
seconds (first realistic-break capture already differed: 10,179 px). On Android
the same edits produced **zero** changed pixels — including the gross break,
every elevation level forced to 5 — even though Metro was serving the new code
(`curl .../.expo/.virtual-metro-entry.bundle?platform=android` contained the
probe added alongside the break) and `adb reverse --list` showed
`tcp:8081 tcp:8081`. `adb logcat` carried no React Native output at all, so it
is useless as a "did the edit land" probe here. Pressing **Reload** in the dev
menu (`adb shell input keyevent 82`, then press the `Reload` node) made the
break appear immediately at the expected magnitude (gross: 65,051 px at 0.1).
Consequence for the loop: on Android, an edit must be followed by an explicit
reload — a device-runner that relies on Fast Refresh will silently compare stale
pixels and report PASS.

## 17. Minor: an agent-device command occasionally exits non-zero with no output

Twice in this pass (`press '@e2'`, `press 'label="Close"'`, both on iOS) the CLI
exited 1 with completely empty stdout _and_ stderr. Re-running the identical
command immediately afterwards succeeded. Nothing to act on beyond noting that a
caller cannot distinguish this from a crash, and that a runner's "parse the
first `{`..`}` out of stdout" fallback turns it into a `null` response rather
than a clear error.

## 18. Minor: `diff screenshot --out` writes nothing when the images match

`--out` is silently ignored on a `match: true` diff, and the response omits
`diffPath` as well. That is defensible (there is nothing to draw), but it means
"the diff image exists" cannot be used as evidence that a diff ran, and a
per-threshold sweep produces a gappy set of files: the realistic break has a
diff image at 0.02 but none at 0.1, because at 0.1 it matches. The 0.1 rows in
`evidence/results.csv` are the record for those.

## 19. The dev-client's floating "Tools" button lands inside the crop and reads as a regression

Found 2026-09-11 while re-running the Android loop with `src/` clean after the
round-2 changes. The scripted loop reported a deterministic **FAIL** —
`surface-example-elevated changed=2822 (0.34%) regions=1` — twice in a row,
against a baseline byte-identical to the committed one (`md5 8693c919…` in both
the working tree and `HEAD`). The diff image
(`evidence/diff-images/android-devclient-tools-button.png`) shows the change: a
152x74 pill at the top-right of the crop reading **Tools** — the Expo dev-client's
floating dev-tools button, `android.widget.ImageView` label `Tools`, rect
`{x:1115, y:243, w:78, h:78}` (`evidence/devclient-excerpt.json`,
`android_devclient_floating_tools_button`). Both failing run summaries are on branch `poc/agent-device-visual-runner`.

It is a dev-client setting, toggled by the dev menu entry **"Tools button"**
(the dev menu lists `Close`, `Reload`, `TOOLS`, `Tools button`, `Toggle Dev Menu`, …).
Pressing it and then `Close` removed the node (60 nodes, no `Tools`), and the next
run passed with `changed=0` on both stories. The setting
survives a relaunch. It had been off in every earlier run today
(`round2-pass`, 08:53 UTC, 0 px) and was on by 10:14 UTC; which earlier dev-menu
interaction flipped it is not known.

Two lessons. For agent-device: a screenshot of a dev build can contain dev-client
chrome that is not part of the app, and `diff screenshot` cannot tell — worth a
note in the docs, or a `screenshot` option that hides dev-client overlays. For
any runner: a dev overlay inside the crop must never be reported as a visual
regression; the runner on branch `poc/agent-device-visual-runner` looks for the floating node after dismissing the
dev menu and launcher, turns it off through the dev menu when it can, and
otherwise stops with a message naming the node and the manual fix. This is also
the strongest argument so far for capturing from a release build rather than a
dev-client once this moves past a PoC.
