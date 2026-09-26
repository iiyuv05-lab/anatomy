import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { PatchPlan } from './patch-plan';

type Entry={path:string;kind:string;signals:string[]};
export interface PlanResult { goal:string; candidates:{path:string;score:number;reasons:string[]}[]; plan:PatchPlan; requiresReview:boolean; }

const terms=(goal:string)=>[...new Set(goal.toLowerCase().match(/[a-z0-9가-힣_]+/g)||[])].filter(x=>x.length>1);
export async function planVibePatch(goal:string,workspace:string):Promise<PlanResult>{const base=resolve(workspace);const idx=JSON.parse(await readFile(join(base,'product-index.json'),'utf8')) as {entries:Entry[]};const q=terms(goal);const candidates=idx.entries.map(e=>{let score=0;const reasons:string[]=[];for(const t of q){if(e.path.toLowerCase().includes(t)){score+=5;reasons.push('path:'+t)}if(e.signals?.includes(t)){score+=3;reasons.push('signal:'+t)}}if(/로그인|login|signin|auth/i.test(goal)&&e.signals?.some(s=>['login','signin','auth'].includes(s))){score+=6;reasons.push('auth-domain')}if(/버튼|button/i.test(goal)&&e.signals?.includes('button')){score+=6;reasons.push('button-domain')}return{path:e.path,score,reasons};}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,20);const result:PlanResult={goal,candidates,plan:{goal,operations:[]},requiresReview:true};await writeFile(join(base,'vibe-plan.json'),JSON.stringify(result,null,2));return result;}
