import { analyzeArtifact } from '../src/index';

const put16=(b:Uint8Array,o:number,v:number)=>{b[o]=v&255;b[o+1]=(v>>>8)&255};
const put32=(b:Uint8Array,o:number,v:number)=>{b[o]=v&255;b[o+1]=(v>>>8)&255;b[o+2]=(v>>>16)&255;b[o+3]=(v>>>24)&255};

export function makeMinimalPE(dotnet=false){
  const b=new Uint8Array(1024);b[0]=0x4d;b[1]=0x5a;put32(b,0x3c,0x80);b.set([0x50,0x45,0,0],0x80);put16(b,0x84,0x8664);put16(b,0x86,1);put16(b,0x94,0xf0);put16(b,0x98,0x20b);
  b.set(new TextEncoder().encode('.text'),0x188);put32(b,0x190,0x100);put32(b,0x194,0x1000);put32(b,0x198,0x200);put32(b,0x19c,0x200);
  if(dotnet)put32(b,0x98+112+14*8,0x3000);return b;
}

const native=analyzeArtifact({name:'sample.exe',bytes:makeMinimalPE(false)});
if(native.adapter!=='pe'||native.facts.architecture!=='x86-64')throw new Error('PE architecture parse failed');
const managed=analyzeArtifact({name:'managed.exe',bytes:makeMinimalPE(true)});
if(managed.facts.dotnet!==true)throw new Error('.NET detection failed');
console.log('binary adapter smoke tests passed');
