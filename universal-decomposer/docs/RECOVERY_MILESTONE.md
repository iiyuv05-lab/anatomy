# Universal Decomposer — Recovery milestone

## Android end-to-end

```
APK
 -> apktool decode (resources / manifest / smali)
 -> JADX readable source
 -> product-index.json
 -> natural-language goal -> ranked candidate files
 -> vibe-plan.json (review required)
 -> patch dry-run
 -> explicit --apply
 -> apktool rebuild
 -> apksigner sign + verify
 -> optional single-device adb install
```

The planner intentionally does not invent a patch. It first ranks evidence-backed files. A concrete PatchPlan is applied only after review.

### Commands

```bash
npm run recover:apk -- app.apk recovered
npm run index:android -- recovered/apktool
npm run plan -- "login button" recovered/apktool
npm run patch -- plan.json recovered/apktool
npm run patch -- plan.json recovered/apktool --apply
npm run rebuild:apk -- recovered/apktool build
npm run verify:apk -- build/rebuilt-after-patch.apk --ks key.jks --alias app --install
```

## macOS

```
.app
 -> Info.plist
 -> runtime detection
 -> Electron? app.asar -> asar extract -> editable JS/HTML/CSS project
 -> Native? Mach-O adapter -> architecture/load-command facts
 -> ObjC/Swift source reconstruction (next adapter)
```

Electron recovery can reach source recovery when `asar` is available. Native Mach-O is currently decomposed honestly without claiming original Swift/Objective-C source.

## Implemented binary adapters

- ASAR
- PE/EXE/DLL
- Mach-O / Fat Mach-O
- ZIP-family package inspection in the web prototype

## Next milestone

1. Android DEX class/method graph and binary AndroidManifest/resource graph.
2. Generate concrete patch operations from reviewed candidate nodes.
3. ADB launch/screenshot/logcat regression verifier.
4. Mach-O load-command/segment/section/symbol parsing.
5. Objective-C runtime metadata and Swift metadata extraction.
6. DMG/PKG mounting/extraction adapters.
7. Electron rebuild/package verification.
