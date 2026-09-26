#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { recoverAndroid } from './recovery/android';
import { indexAndroidWorkspace } from './recovery/android-index';
import { rebuildAndroid } from './recovery/android-rebuild';
import { signAndVerifyAndroid } from './recovery/android-verify';
import { recoverMac } from './recovery/macos';
import { applyPatchPlan, PatchPlan } from './recovery/patch-plan';
import { planVibePatch } from './recovery/vibe-planner';
async function main(){const [command,...args]=process.argv.slice(2);const value=(k:string)=>{const i=args.indexOf(k);return i>=0?args[i+1]:undefined};if(command==='recover-apk'&&args[0]){console.log(JSON.stringify(await recoverAndroid(args[0],args[1]||'recovered-workspace'),null,2));return}if(command==='index-android'&&args[0]){console.log(JSON.stringify(await indexAndroidWorkspace(args[0]),null,2));return}if(command==='plan'&&args[0]&&args[1]){console.log(JSON.stringify(await planVibePatch(args[0],args[1]),null,2));return}if(command==='patch'&&args[0]&&args[1]){const plan=JSON.parse(await readFile(args[0],'utf8')) as PatchPlan;console.log(JSON.stringify(await applyPatchPlan(plan,args[1],!args.includes('--apply')),null,2));return}if(command==='rebuild-apk'&&args[0]){console.log(JSON.stringify(await rebuildAndroid(args[0],args[1]||'rebuild-output'),null,2));return}if(command==='verify-apk'&&args[0]){console.log(JSON.stringify(await signAndVerifyAndroid({apk:args[0],workspace:value('--out')||'verified-workspace',keystore:value('--ks'),alias:value('--alias'),storePass:value('--ks-pass'),install:args.includes('--install')}),null,2));return}if(command==='recover-mac'&&args[0]){console.log(JSON.stringify(await recoverMac(args[0],args[1]||'recovered-mac'),null,2));return}console.error('Commands: recover-apk | index-android | plan | patch | rebuild-apk | verify-apk | recover-mac');process.exitCode=2}main().catch(e=>{console.error(e);process.exitCode=1});
