#!/usr/bin/env node
import { recoverAndroid } from './recovery/android';
async function main(){const [command,input,out='recovered-workspace']=process.argv.slice(2);if(command==='recover-apk'&&input){console.log(JSON.stringify(await recoverAndroid(input,out),null,2));return;}console.error('Usage: decomposer recover-apk <app.apk> [out]');process.exitCode=2;}
main().catch(e=>{console.error(e);process.exitCode=1;});
