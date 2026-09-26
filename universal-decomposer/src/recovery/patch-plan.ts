import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
export type PatchOperation={type:'replace-text';file:string;find:string;replace:string};
export interface PatchPlan { goal:string; operations:PatchOperation[]; }
export async function applyPatchPlan(plan:PatchPlan,root:string,dryRun=true){const base=resolve(root),changes:{file:string;changed:boolean}[]=[];for(const op of plan.operations){const file=resolve(base,op.file);if(!(file===base||file.startsWith(base+'/')))throw new Error('Patch path escapes workspace');const before=await readFile(file,'utf8');if(!before.includes(op.find))throw new Error('Patch target not found: '+op.file);const after=before.replace(op.find,op.replace);changes.push({file:op.file,changed:before!==after});if(!dryRun)await writeFile(file,after);}return{goal:plan.goal,dryRun,changes};}
