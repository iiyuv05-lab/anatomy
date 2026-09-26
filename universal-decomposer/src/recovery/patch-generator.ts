import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { PatchPlan } from './patch-plan';
type Candidate={path:string;score:number;reasons:string[]};
export async function generatePatchTemplate(goal:string,workspace:string){const base=resolve(workspace),vibe=JSON.parse(await readFile(join(base,'vibe-plan.json'),'utf8')) as {candidates:Candidate[]};const ops=[] as PatchPlan['operations'];const top=vibe.candidates.slice(0,5);const result={goal,candidates:top,plan:{goal,operations:ops},instructions:'Inspect candidate files and fill exact find/replace pairs. No mutation is generated without exact source evidence.',requiresReview:true};await writeFile(join(base,'patch-template.json'),JSON.stringify(result,null,2));return result;}
