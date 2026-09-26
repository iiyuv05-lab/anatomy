# Graph-to-Patch Milestone

Android now links four evidence layers: decoded workspace, Manifest graph, resource graph, and DEX class/method-id graph.

The exact patch proposer only emits a replace operation when the user's quoted source literal is actually present in a ranked candidate file. Example goal: `change "Login" "Continue"`. Review remains required.

Runtime verification can be captured before and after a patch and compared for launch regression and new AndroidRuntime/FATAL/ANR signals.

macOS now has:
- Mach-O fat slice and bounded load-command parsing
- native metadata collection through otool/nm/strings when available
- Objective-C/Swift section/string signal collection
- PKG extraction through pkgutil
- DMG read-only mounting through hdiutil with explicit detach command
- Electron ASAR recovery and repack support

Native Swift/Objective-C original source is still not claimed. The next native milestone is symbol/ObjC metadata normalization plus decompiler adapter integration.
