import { spawn } from 'node:child_process';
export interface RunResult { code:number; stdout:string; stderr:string; }
export function run(command:string,args:string[],cwd?:string):Promise<RunResult>{return new Promise((resolve,reject)=>{const child=spawn(command,args,{cwd,stdio:['ignore','pipe','pipe']});let stdout='',stderr='';child.stdout.on('data',d=>stdout+=String(d));child.stderr.on('data',d=>stderr+=String(d));child.on('error',reject);child.on('close',code=>resolve({code:code??-1,stdout,stderr}));});}
export async function commandExists(command:string){try{const r=await run(command,['--version']);return{available:r.code===0,version:(r.stdout||r.stderr).split('\n')[0]};}catch{return{available:false};}}
