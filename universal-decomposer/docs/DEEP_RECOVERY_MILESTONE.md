# Deep Recovery Milestone

## Android

Implemented pipeline:

APK -> apktool/JADX -> workspace index -> Manifest semantic graph -> DEX header graph -> vibe candidate ranking -> reviewed patch template -> dry-run/apply -> rebuild -> sign/verify -> optional install -> launch/logcat/screenshot evidence.

### New commands

- `npm run index:manifest -- recovered/apktool`
- `npm run index:dex -- classes.dex classes2.dex output`
- `npm run patch:template -- "goal" recovered/apktool`
- `npm run runtime:android -- com.example.app runtime-output`

The DEX module currently parses deterministic header/table counts, not method bytecode semantics. The Manifest graph uses Apktool-decoded XML. The patch generator deliberately creates an evidence-backed template rather than inventing source replacements.

## macOS / Electron

Mach-O parsing now covers fat slices and bounded load-command enumeration, including segment and dylib command counts.

Electron source recovery supports ASAR extraction. Electron rebuild can restore dependencies with npm when available, run an existing package script, and/or repack the recovered source as app.asar.

Native Swift/Objective-C source recovery is NOT yet claimed. Next work is segment/section payload parsing, symbol table, Objective-C runtime metadata, Swift metadata, then decompiler integration.

## Evidence rule

A capability is promoted only when the corresponding artifact or runtime check exists:

- L1 decomposed: structural evidence
- L2 recovered: readable recoverable representation
- L3 rebuildable: a build command actually succeeds
- L4 editable: reviewed mutation path + successful rebuild
- runtime verified: install/launch evidence recorded separately
