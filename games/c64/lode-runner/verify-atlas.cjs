/* Verify the picture gallery against the original disk glyph expansion.
   node games/c64/lode-runner/verify-atlas.cjs path/to/private/play-round1.vsf path/to/private/original.crt
   Checks source masks and the runtime guard-shape substitutions. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {CPU}=require(path.join(__dirname,'../../../kit/c64/cpu6502.js'));
const [snap,crtPath]=process.argv.slice(2);if(!crtPath)throw Error('Supply private disk play snapshot and cartridge paths');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const data=JSON.parse(html.match(/<script id="lr-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
const renderer=html.match(/<script id="lr-atlas-renderer">([\s\S]*?)<\/script>/)[1];
const catalog=html.slice(html.indexOf(' const cartPictureMatches='),html.indexOf(' let pictureEdition='));
const palette=['#000000','#75cec8','#813338','#ffffff'];
const box={colours:palette};vm.createContext(box);vm.runInContext(renderer+catalog+'\nglobalThis.catalog={cartPictureMatches,runnerPictures,guardPictures,guardSpritePictures,sprayPictures};',box);
const cpu=CPU.fromSnapshot(snap),original=[];
assert.deepEqual(data.patterns,Array.from(cpu.m.slice(0xa800,0xb0f0)));
assert.deepEqual(data.low,Array.from(cpu.m.slice(0xa000,0xa100)));
assert.deepEqual(data.high,Array.from(cpu.m.slice(0xa100,0xa200)));
for(let g=0;g<104;g++){
 cpu.m[0x23]=g;cpu.call(0x8af8,{x:0});
 const bytes=Array.from(cpu.m.slice(0x5b,0x7c));
 const rows=Array.from({length:11},(_,r)=>(bytes[r*3]<<16)|(bytes[r*3+1]<<8)|bytes[r*3+2]);
 assert.deepEqual(Array.from(box.atlasRows(data,g,104)),rows);original.push(rows);
}
const unique=a=>Array.from(new Set(a)).sort((a,b)=>a-b);
assert.deepEqual(Array.from(box.catalog.runnerPictures).sort((a,b)=>a-b),unique([...cpu.m.slice(0x7865,0x7877)]));
assert.deepEqual(Array.from(box.catalog.guardPictures).sort((a,b)=>a-b),unique([...cpu.m.slice(0x7bc2,0x7bd2)]));
assert.deepEqual(Array.from(box.catalog.sprayPictures).sort((a,b)=>a-b),unique([...cpu.m.slice(0x7877,0x788f)].filter(g=>g!==0)));
assert.deepEqual(unique([...cpu.m.slice(0x788f,0x789b)]),[31,32,33,34,35,36]);
const crt=fs.readFileSync(crtPath);
assert.equal(require('node:crypto').createHash('sha256').update(crt).digest('hex'),'629471f8c1587ffd37c1b52b742e2755cc6e3773e9acd9e2d0c7aab4929cf8a0');
const ram=new Uint8Array(65536);ram.set(crt.subarray(80,16464),0x8000);const cartCPU=new CPU(ram);cartCPU.call(0xa8bb);
assert.deepEqual(data.cartridge.patterns,Array.from(cartCPU.m.slice(0x1800,0x1e88)));
let pixels=0,actorSelectors=0;
for(const cartridge of [false,true]){
 const source=cartridge?data.cartridge:data,count=cartridge?76:104;
 for(let g=0;g<count;g++){
  const disk=cartridge?box.catalog.cartPictureMatches[g]:g;
  const info=box.pictureInfo(g,cartridge),mask=info.sprite??g;
  const rows=original[info.sprite??disk];
  if(cartridge){
   cartCPU.m[0x22]=g;cartCPU.call(0x936e,{x:0});
   const bytes=Array.from(cartCPU.m.slice(0x43,0x64));
   const nativeRows=Array.from({length:11},(_,r)=>(bytes[r*3]<<16)|(bytes[r*3+1]<<8)|bytes[r*3+2]);
   assert.deepEqual(Array.from(box.atlasRows(source,g,count)),nativeRows);
  }
  if(info.group==='actors'){
   const c=cartridge?cartCPU:cpu;
   c.m[cartridge?0x1312:0x132c]=0;c.m[cartridge?0x22:0x23]=g;
   c.call(cartridge?0x93de:0x8b5c,{x:0},{hooks:{[cartridge?0x9489:0x8bf3]:()=>true}});
   assert.equal(c.m[cartridge?0x22:0x23],mask);actorSelectors++;
  }
  if(cartridge){
   const decoded=Array.from(box.atlasRows(source,g,count));
   const matches=original.map((r,i)=>JSON.stringify(r)===JSON.stringify(decoded)?i:-1).filter(i=>i>=0);
   assert.deepEqual(matches,g===0?[0,102,103]:[disk]);
  }
  const actor=info.group==='actors',drawn=Array(264).fill(palette[0]);
  const ctx={fillStyle:'',fillRect(x,y,w,h){assert.equal(h,1);for(let dx=0;dx<w;dx++)drawn[y*24+x+dx]=this.fillStyle;}};
  box.drawAtlasPicture(ctx,source,mask,count,1,actor);
  for(let row=0;row<11;row++)for(let col=0;col<24;col++){
   const value=actor?(rows[row]>>>(23-col))&1:(rows[row]>>>(22-2*Math.floor(col/2)))&3;
   assert.equal(drawn[row*24+col],actor?(value?palette[3]:palette[0]):palette[value]);pixels++;
  }
 }
}
console.log(JSON.stringify({originalExpansionMasks:180,cartridgeMatches:76,actorSelectors,actorAndDiggingTables:true,pixelComparisons:pixels}));
