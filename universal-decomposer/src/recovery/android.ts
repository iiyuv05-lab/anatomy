import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { commandExists, run } from './process';
import { RecoveryReport, RecoveryStep } from './types';

const step=(id:string):RecoveryStep=>({id,status:'pending',evidence:[]});

export async function recoverAndroid(apkPath:string,outDir:string):Promise<RecoveryReport>{
  const apk=resolve(apkPath),root=resolve(outDir),decoded=join(root,'apktool'),sources=join(root,'jadx'),project=join(root,'editable');
  await mkdir(root,{recursive:true});
  const [apktool,jadx,java,gradle]=await Promise.all([commandExists('apktool'),commandExists('jadx'),commandExists('java'),commandExists('gradle')]);
  const report:RecoveryReport={input:apk,platform:'android',level:'L0_IDENTIFIED',workspace:root,tools:[{name:'apktool',...apktool},{name:'jadx',...jadx},{name:'java',...java},{name:'gradle',...gradle}],steps:[step('decode-resources'),step('decompile-dex'),step('reconstruct-project'),step('rebuild'),step('editable-check')],warnings:[]};
  if(!apktool.available||!jadx.available){report.warnings.push('apktool and jadx are required for Android L2 recovery.');await writeFile(join(root,'recovery-report.json'),JSON.stringify(report,null,2));return report;}
  report.steps[0].status='running';const a=await run('apktool',['d','-f',apk,'-o',decoded]);report.steps[0].status=a.code===0?'passed':'failed';report.steps[0].evidence.push(a.stderr.slice(-2000));
  if(a.code!==0){await writeFile(join(root,'recovery-report.json'),JSON.stringify(report,null,2));return report;}report.level='L1_DECOMPOSED';
  report.steps[1].status='running';const j=await run('jadx',['-d',sources,'--show-bad-code',apk]);report.steps[1].status=j.code===0?'passed':'failed';report.steps[1].evidence.push((j.stderr||j.stdout).slice(-2000));if(j.code===0)report.level='L2_RECOVERED';else report.warnings.push('JADX returned errors; apktool output remains usable for smali-level editing.');
  report.steps[2].status='running';await mkdir(project,{recursive:true});const manifest=await readFile(join(decoded,'AndroidManifest.xml'),'utf8').catch(()=> '');
  const meta={sourceApk:basename(apk),decodedResources:decoded,decompiledSources:sources,manifestRecovered:Boolean(manifest),strategy:'dual-track: apktool truth + jadx readable source'};
  await writeFile(join(project,'recovery.json'),JSON.stringify(meta,null,2));
  await writeFile(join(project,'README.md'),'# Recovered Android workspace\n\n../apktool preserves rebuild-oriented resources and smali.\n../jadx contains readable Java-like source.\nrecovery.json binds both evidence tracks.\n');
  report.steps[2].status='passed';report.steps[2].evidence.push('editable/recovery.json created');report.editableProject=project;
  report.steps[3].status='running';const rebuilt=join(root,'rebuilt.apk');const build=await run('apktool',['b',decoded,'-o',rebuilt]);report.steps[3].status=build.code===0?'passed':'failed';report.steps[3].evidence.push((build.stderr||build.stdout).slice(-2000));
  if(build.code===0){report.level='L3_REBUILDABLE';report.buildArtifact=rebuilt}else report.warnings.push('Decoded project did not rebuild yet; repair is required before L3.');
  report.steps[4].status=report.level==='L3_REBUILDABLE'?'passed':'skipped';if(report.level==='L3_REBUILDABLE'){report.level='L4_EDITABLE';report.steps[4].evidence.push('Readable/decode tracks exist and rebuild path passed.');}
  await writeFile(join(root,'recovery-report.json'),JSON.stringify(report,null,2));return report;
}
