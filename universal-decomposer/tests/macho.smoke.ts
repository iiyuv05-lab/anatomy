import { machoAdapter } from '../src/adapters/macho';
const b=new Uint8Array(64);b.set([0xcf,0xfa,0xed,0xfe],0);b.set([0x0c,0x00,0x00,0x01],4);b.set([0x02,0,0,0],12);b.set([0x03,0,0,0],16);b.set([0x90,0,0,0],20);
if(!machoAdapter.supports({name:'sample',bytes:b}))throw new Error('Mach-O detection failed');
const r=machoAdapter.analyze({name:'sample',bytes:b});if(r.facts.architecture!=='ARM64')throw new Error('ARM64 parse failed');
console.log('Mach-O smoke test passed');
