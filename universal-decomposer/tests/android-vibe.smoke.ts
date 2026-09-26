import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { indexAndroidWorkspace } from '../src/recovery/android-index';
import { planVibePatch } from '../src/recovery/vibe-planner';
import { applyPatchPlan } from '../src/recovery/patch-plan';
const root=await mkdtemp(join(tmpdir(),'decomposer-'));await mkdir(join(root,'res','layout'),{recursive:true});const file=join(root,'res','layout','login.xml');await writeFile(file,'<Button android:text="Login" android:onClick="login"/>');const index=await indexAndroidWorkspace(root);if(index.files!==1||index.entries[0].size<=0)throw new Error('index failed');const plan=await planVibePatch('login button',root);if(!plan.candidates.length)throw new Error('planner failed');const patch={goal:'rename login',operations:[{type:'replace-text' as const,file:'res/layout/login.xml',find:'Login',replace:'Continue'}]};const dry=await applyPatchPlan(patch,root,true);if(!dry.dryRun)throw new Error('dry run failed');if((await readFile(file,'utf8')).includes('Continue'))throw new Error('dry run mutated file');await applyPatchPlan(patch,root,false);if(!(await readFile(file,'utf8')).includes('Continue'))throw new Error('apply failed');console.log('Android vibe pipeline smoke test passed');
