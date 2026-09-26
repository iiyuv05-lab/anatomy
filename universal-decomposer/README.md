# Universal Decomposer binary adapters

This directory is an independent implementation layer for the Product Decomposer.

## Implemented

- **Electron ASAR**: header JSON discovery, recursive file-tree flattening, package.json candidate detection, JS/TS/native/unpacked entry classification.
- **Windows PE (EXE/DLL)**: MZ/PE signature verification, COFF machine architecture, PE32/PE32+, section table, CLR/.NET CLI-directory detection.
- Shared adapter contract emits evidence-aware Product IR nodes instead of claiming unavailable source recovery.

## Adapter contract

Each adapter receives `{ name, bytes }`, performs deterministic binary parsing, and returns:

- adapter / format
- raw structured facts
- evidence nodes with confidence
- no fabricated internals when parsing fails

Next adapters: MSI/OLE Compound File, Mach-O/Fat Mach-O, DMG/PKG, DEX/AndroidManifest deep parsing.
