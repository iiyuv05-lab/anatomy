import { join, resolve } from 'node:path';
import { run } from './process';
export async function rebuildAndroid(decodedRoot:string,outDir:string){const root=resolve(decodedRoot),apk=join(resolve(outDir),'rebuilt-after-patch.apk');const r=await run('apktool',['b',root,'-o',apk]);return{passed:r.code===0,apk:r.code===0?apk:undefined,evidence:(r.stderr||r.stdout).slice(-4000)};}
