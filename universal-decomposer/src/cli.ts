#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { recoverAndroid } from './recovery/android';
import { signAndVerifyAndroid } from './recovery/android-verify';
import { applyPatchPlan, PatchPlan } from './recovery/patch-plan';

async function main(){
  const [command,...args]=process.argv.slice(2);
  if(command==='recover-apk'&&args[0]){console.log(JSON.stringify(await recoverAndroid(args[0],args[1]||'recovered-workspace'),null,2));return;}
  if(command==='patch'&&args[0]&&args[1]){const plan=JSON.parse(await readFile(args[0],'utf8')) as PatchPlan;console.log(JSON.stringify(await applyPatchPlan(plan,args[1],args.includes('--apply')?false:true),null,2));return;}
  if(command==='verify-apk'&&args[0]){const install=args.includes('--install');const value=(key:string)=>{const i=args.indexOf(key);return i>=0?args[i+1]:undefined};console.log(JSON.stringify(await signAndVerifyAndroid({apk:args[0],workspace:value('--out')||'verified-workspace',keystore:value('--ks'),alias:value('--alias'),storePass:value('--ks-pass'),install}),null,2));return;}
  console.error('Usage: recover-apk <apk> [out] | patch <plan.json> <workspace> [--apply] | verify-apk <apk> [--ks file --alias name --ks-pass pass --install]');
  process.exitCode=2;
}
main().catch(e=>{console.error(e);process.exitCode=1;});
