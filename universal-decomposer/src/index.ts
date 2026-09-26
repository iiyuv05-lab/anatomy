import { ArtifactInput, BinaryAdapter, AdapterResult } from './core/adapter';
import { asarAdapter } from './adapters/asar';
import { machoAdapter } from './adapters/macho';
import { peAdapter } from './adapters/pe';
export const adapters:BinaryAdapter[]=[asarAdapter,machoAdapter,peAdapter];
export function analyzeArtifact(input:ArtifactInput):AdapterResult{const adapter=adapters.find(candidate=>candidate.supports(input));if(!adapter)return{adapter:'unknown',format:'UNKNOWN',facts:{name:input.name,size:input.bytes.length},nodes:[{kind:'Product',name:input.name,evidence:'Observed',confidence:100,detail:'Artifact bytes received.'},{kind:'Format',name:'Unknown binary',evidence:'Observed',confidence:60,detail:'No registered binary adapter accepted this artifact.'}]};return adapter.analyze(input);}
