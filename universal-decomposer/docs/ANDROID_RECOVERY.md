# Android L4 recovery pipeline

Goal: transform an APK into an evidence-preserving workspace that can actually be edited and rebuilt.

1. L0 Identified — APK input accepted.
2. L1 Decomposed — Apktool decodes manifest/resources/smali.
3. L2 Recovered — JADX adds readable Java-like source without replacing the lower-level truth track.
4. L3 Rebuildable — apktool b must produce a new APK. Decompiled source alone is not enough.
5. L4 Editable — both evidence tracks are bound in editable/recovery.json and the rebuild path has passed.

JADX output is for comprehension and may not compile as original source. Apktool/smali stays as the rebuild-oriented truth track.

Next: AndroidManifest/resources.arsc graph, DEX graph, Gradle reconstruction, signing plus adb verifier, natural-language patch planner.
