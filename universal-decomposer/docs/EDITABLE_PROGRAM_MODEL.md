# Editable Program Model Milestone

The project now moves from separate analysis outputs to a shared editable program model.

## Android

DEX class_data_item parsing records direct/virtual methods, access flags and code_off values. DEX class descriptors are mapped to expected smali and JADX paths. Manifest, resource handlers, DEX classes/methods and workspace files are merged into android-product-graph.json.

Edges explicitly retain evidence level. Example: an XML android:onClick handler and a DEX method with the same name create an Inferred name-match edge, not a false Extracted call edge.

The buildAndroidModel orchestrator regenerates workspace, Manifest, resource, DEX, source-map and Product Graph layers together.

## Apple native

AppleRuntimeGraph normalizes Objective-C class/metaclass symbols, selector-like runtime strings, Swift signals and __objc_/__swift sections from collected native metadata.

The native decompiler contract currently supports Ghidra headless import when analyzeHeadless is installed. Successful import means decompiler workspace creation, not recovered original Swift/Objective-C source.

## Next

- DEX code_item instruction decoding and invoke/call edges
- smali/JADX existence verification rather than expected-path mapping
- resource ID to R-class/smali linkage
- Objective-C method list/category/protocol metadata parsing from Mach-O sections
- Swift nominal type/protocol descriptor parsing
- Ghidra export scripts producing normalized functions/decompilation evidence
- graph-driven exact patch generation and rebuild/runtime verification in one transaction
