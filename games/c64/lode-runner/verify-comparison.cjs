/* Reproduce the edition checks using privately supplied inputs.
   node verify-comparison.cjs play.vsf original.crt sectors-parent-directory
   The parent contains sectors-{black,gray,yellow}-label/tNN-sNN.bin.
   No game image or snapshot is included in this repository. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {CPU}=require('../../../kit/c64/cpu6502.js');
const vm=require('node:vm'),box={Uint8Array,Math};vm.createContext(box);
const [snap,crtPath,sectors]=process.argv.slice(2);
if(!sectors)throw Error('Supply play snapshot, original CRT, and extracted-sector parent');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const data=JSON.parse(html.match(/<script id="lr-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
vm.runInContext(html.match(/<script id="lr-mechanics">([\s\S]*?)<\/script>/)[1],box);
const crt=fs.readFileSync(crtPath),crypto=require('node:crypto');
assert.equal(crypto.createHash('sha256').update(crt).digest('hex'),'629471f8c1587ffd37c1b52b742e2755cc6e3773e9acd9e2d0c7aab4929cf8a0');
assert.equal(crt.toString('ascii',64,68),'CHIP');
assert.equal(crt.readUInt16BE(76),0x8000);assert.equal(crt.readUInt16BE(78),16384);
const rom=crt.subarray(80,80+16384);
const cartridge=()=>{const m=new Uint8Array(65536);m.set(rom,0x8000);return new CPU(m);};
// Register shadow accepts sprite/SID writes; this is routine execution, not video timing.
const disk=()=>{const io=new Uint8Array(4096);return CPU.fromSnapshot(snap,{io:{read:a=>io[a-0xd000],write:(a,v)=>{io[a-0xd000]=v;}}});};
const cell=(c,base,col,row)=>base+(c.m[0x8d66+row]|((c.m[0x8d76+row]-8)<<8))+col;
const grid=(c,base)=>Array.from({length:448},(_,i)=>c.m[cell(c,base,i%28,Math.floor(i/28))]);
const unpack=bytes=>Array.from(bytes).flatMap(b=>[b&15,b>>4]).map(t=>t<10?t:0);
const rawRoom=(label,n)=>fs.readFileSync(path.join(sectors,`sectors-${label}-label`,`t${String(3+(n>>4)).padStart(2,'0')}-s${String(n&15).padStart(2,'0')}.bin`));
let roomCases=0;const packed=[];
for(let n=0;n<150;n++){
 const raw=rawRoom('black',n);assert.equal(raw.length,256);packed.push(raw.subarray(1,225));
 for(const label of ['black','gray','yellow']){
  const r=rawRoom(label,n);assert.deepEqual(r,raw);
  const c=disk();let head=0;
  // Actual reader discards the first CHRIN value, then stores 256 values.
  c.call(0x71f5,{}, {hooks:{[0xffcf]:cpu=>{cpu.a=head<256?r[head]:0;head++;cpu.rts();},[0x7276]:cpu=>cpu.rts()}});
  assert.equal(head,257);assert.deepEqual(Buffer.from(c.m.subarray(0x1000,0x10e0)),r.subarray(1,225));
  c.m[0x1310]=c.m[0x133b]=n;
  // Stop before actor extraction; both original grids still contain stored markers.
  c.call(0x6fa6,{x:0},{hooks:{[0x7034]:()=>true}});
  const expected=unpack(r.subarray(1,225));assert.deepEqual(grid(c,0x800),expected);assert.deepEqual(grid(c,0xa00),expected);
  assert.deepEqual(data.rooms[n].tiles,expected);roomCases++;
 }
}
assert.notDeepEqual(unpack(rawRoom('black',0).subarray(0,224)),data.rooms[0].tiles,'Offset-zero decoder must fail');
assert.equal(data.rooms[0].tiles[14+14*28],9,'Room-one runner starts at (14,14)');
assert.deepEqual(Buffer.from(disk().m.subarray(0x1000,0x10e0)),packed[0],'Recorded native room-one payload');
const matches=[],streams=[];
for(let i=0;i<17;i++){
 let cursor=rom[0x2c00+i]+((0xac+rom[0x2c12+i])<<8),start=cursor,tiles=[];
 while(tiles.length<448){const b=rom[cursor++-0x8000];tiles.push(...Array((b>>4)+1).fill(b&15));}
 assert.equal(tiles.length,448);const p=Buffer.from(Array.from({length:224},(_,k)=>tiles[k*2]|(tiles[k*2+1]<<4)));
 const c=cartridge();c.m.fill(0xa5,0x6000,0x6100);c.call(0x97de,{a:0x60,x:i});
 assert.deepEqual(Buffer.from(c.m.subarray(0x6000,0x60e0)),p);assert(c.m.subarray(0x60e0,0x6100).every(v=>v===0xa5));
 assert.equal(c.m[0x9810]|(c.m[0x9811]<<8),cursor);assert.equal(c.m[0x70],0);
 const found=packed.flatMap((r,k)=>r.equals(p)?[k+1]:[]);assert.equal(found.length,1);matches.push(found[0]);streams.push({start,end:cursor,bytes:cursor-start});
 if(i)assert.equal(start,streams[i-1].end);
}
assert.deepEqual(matches,[1,5,111,46,50,11,4,12,100,33,48,84,14,64,6,134,150]);
assert.equal(streams[0].start,0xac24);assert.equal(streams.at(-1).end,0xb658);
if(data.cartridge)assert.deepEqual(data.cartridge.diskRooms,matches);
let routeCases=0;const route=cartridge();
for(let pr=0;pr<16;pr++)for(let cr=0;cr<16;cr++)for(let gc=0;gc<28;gc++)for(let cc=0;cc<28;cc++){
 route.m[3]=pr;route.m[0x14]=gc;route.call(0xa5fd,{a:cr,x:cc});assert.equal(route.a,box.routeCost(cr,cc,pr,gc));routeCases++;
}
const score=cartridge();let seed=6401983,scoreCases=0;
const scores=[0,75,250,9999999,10000000,99999999];for(let i=0;i<400;i++){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;scores.push((seed>>>0)%100000000);}
for(const s of scores)for(const amount of [0,75,250,1500]){
 let n=s;for(let i=0;i<4;i++){const v=n%100;score.m[0x77+i]=Math.floor(v/10)*16+v%10;n=Math.floor(n/100);}
 const low=amount%100,hi=Math.floor(amount/100),digits=[];
 score.call(0x8fed,{a:Math.floor(low/10)*16+low%10,y:Math.floor(hi/10)*16+hi%10},{hooks:{[0x905a]:c=>{digits.push(c.a);c.rts();}}});
 let result=0;for(let i=3;i>=0;i--){const v=score.m[0x77+i];result=result*100+(v>>4)*10+(v&15);}
 assert.equal(result,box.addPoints(s,amount));assert.equal(digits.join(''),box.displayedScore(result));scoreCases++;
}
const graphics=cartridge();graphics.call(0xa8bb);
if(data.cartridge?.patterns){
 assert.deepEqual(Array.from(graphics.m.subarray(0x1800,0x1e88)),data.cartridge.patterns);
 assert.deepEqual(Array.from(graphics.m.subarray(0xc000,0xc100)),data.cartridge.low);
 assert.deepEqual(Array.from(graphics.m.subarray(0xc100,0xc200)),data.cartridge.high);
}
// Native countdown cycles seven motifs; transposition remains 2..11.
assert.deepEqual(Array.from(rom.subarray(0x38a9,0x38ac)),[6,2,12]);
const music=cartridge();music.m[0x1313]=6;music.m[0x1314]=2;
for(let completion=1;completion<=70;completion++){music.call(0x9760);assert.equal(music.m[0x1313],6-(completion%7));assert.equal(music.m[0x1314],2+(Math.floor(completion/7)%10));}
function fixture(){
 const c=disk();for(let row=0;row<16;row++)for(let col=0;col<28;col++){c.m[cell(c,0x800,col,row)]=0;c.m[cell(c,0xa00,col,row)]=0;}
 c.m[3]=10;c.m[4]=5;c.m[5]=c.m[6]=2;c.m[0x131c]=0;c.m.fill(0,0x1298,0x129e);c.m.fill(0,0x12e0,0x12ff);c.m[0x1316]=0;c.m[0x130e]=1;
 return c;
}
let digCalls=[],cancelCases=0;
for(const [start,dx,phase] of [[0x76e6,-1,0],[0x77a5,1,12]]){
 const c=fixture();c.m[cell(c,0x800,10+dx,6)]=c.m[cell(c,0xa00,10+dx,6)]=1;
 for(let call=1;call<=13;call++){
  c.call(call===1?start:0x73c7);assert.equal(c.m[0x12e0],call===13?180:0);assert.equal(c.m[0x54],phase+Math.min(call,12));
  c.call(0x84f1);assert.equal(c.m[0x12e0],call===13?179:0);
 }
 assert.equal(c.m[0x1316],0);digCalls.push(13);
 // The adjacent cell is checked throughout the animation, even on the final call.
 for(const tile of [1,2,3,4,5,6,7,8,9]){
  const t=fixture();t.m[cell(t,0x800,10+dx,6)]=t.m[cell(t,0xa00,10+dx,6)]=1;t.m[0x1316]=dx&255;t.m[0x54]=phase+12;t.m[cell(t,0x800,10+dx,5)]=tile;
  t.call(0x73c7);assert.equal(t.m[0x1316],0);assert(t.m.subarray(0x12e0,0x12fe).every(v=>v===0));assert.equal(t.m[cell(t,0x800,10+dx,6)],1);cancelCases++;
 }
}
let tileCases=0;
// Original runner comparisons for every persistent tile ID, with legal centered phases.
for(let tile=0;tile<10;tile++){
 for(const [entry,dx,dy,coord] of [[0x74de,-1,0,5],[0x7550,1,0,5],[0x75c8,0,-1,6],[0x7671,0,1,6]]){
  const c=fixture();c.m[cell(c,0xa00,10,5)]=3;c.m[cell(c,0x800,10+dx,5+dy)]=tile;
  c.call(entry);const direction=dy===1?'down':dy===-1?'up':dx===1?'right':'left';assert.equal(c.m[coord]===2,box.tileBlocks(tile,direction));tileCases++;
 }
 const c=fixture();c.m[cell(c,0x800,10,6)]=c.m[cell(c,0xa00,10,6)]=tile;
 // Intercept only the supported/input and falling entries to test the gravity decision.
 c.call(0x73c7,{}, {hooks:{[0x7494]:()=>true,[0x7431]:()=>true}});
 assert.equal(c.pc===0x7494,box.tileBlocks(tile,'fall'));tileCases++;
}
let cartridgeTileCases=0;
const cartCell=(c,base,col,row)=>base+c.m[0x9529+row]+((c.m[0x9539+row]-8)<<8)+col;
function cartFixture(){const c=new CPU(Uint8Array.from(graphics.m));c.m.fill(0,0x800,0xc00);c.m[2]=10;c.m[3]=5;c.m[4]=c.m[5]=2;c.m[0x130a]=0;return c;}
for(let tile=0;tile<10;tile++){
 for(const [entry,dx,dy,coord,direction] of [[0x9ad4,-1,0,4,'left'],[0x9b38,1,0,4,'right'],[0x9ba2,0,-1,5,'up'],[0x9c28,0,1,5,'down']]){
  const c=cartFixture();c.m[cartCell(c,0xa00,10,5)]=3;c.m[cartCell(c,0x800,10+dx,5+dy)]=tile;c.call(entry);assert.equal(c.m[coord]===2,box.tileBlocks(tile,direction));cartridgeTileCases++;
 }
 const c=cartFixture();c.m[cartCell(c,0x800,10,6)]=c.m[cartCell(c,0xa00,10,6)]=tile;c.call(0x99e9,{}, {hooks:{[0x9a8c]:()=>true,[0x9a3e]:()=>true}});assert.equal(c.pc===0x9a8c,box.tileBlocks(tile,'fall'));cartridgeTileCases++;
}
// Arranged allocation cadence, not a joystick route proving the bound is attainable.
const cadence=fixture();let allocated=0,peak=0,expires=0;
for(let step=1;step<=720;step++){
 if((step-1)%13===0){const col=1+allocated%26;cadence.m[4]=6;cadence.m[cell(cadence,0x800,col,7)]=cadence.m[cell(cadence,0xa00,col,7)]=1;cadence.call(0x7b12,{x:col});allocated++;}
 peak=Math.max(peak,Array.from(cadence.m.subarray(0x12e0,0x12fe)).filter(Boolean).length);
 const ending=Array.from(cadence.m.subarray(0x12e0,0x12fe)).filter(v=>v===1).length;assert(ending<=1);expires+=ending;cadence.call(0x84f1);
 const model=box.holeSchedule(13,step);assert.deepEqual(Array.from(model.timers),Array.from(cadence.m.subarray(0x12e0,0x12fe)));assert.equal(model.peak,peak);
}
assert.equal(peak,14);assert.equal(allocated,56);
const additionalCadences=[];
for(const gap of [26,60]){
 const c=fixture();let made=0,high=0;
 for(let step=1;step<=720;step++){
  if((step-1)%gap===0){const col=1+made%26;c.m[4]=6;c.m[cell(c,0x800,col,7)]=c.m[cell(c,0xa00,col,7)]=1;c.call(0x7b12,{x:col});made++;}
  high=Math.max(high,Array.from(c.m.subarray(0x12e0,0x12fe)).filter(Boolean).length);c.call(0x84f1);
  const model=box.holeSchedule(gap,step);assert.deepEqual(Array.from(model.timers),Array.from(c.m.subarray(0x12e0,0x12fe)));assert.equal(model.peak,high);
 }
 additionalCadences.push({gap,services:720,allocated:made,peak:high});
}
let pairCases=0;const pair=fixture();pair.m[0x12a0]=2;pair.m[0x12c0]=2;pair.m[0x12a0+29]=24;pair.m[0x12c0+29]=12;
for(let a=1;a<=180;a++)for(let b=a+1;b<=180;b++){
 pair.m.fill(0,0x12e0,0x12ff);pair.m[0x12e0]=a;pair.m[0x12e0+29]=b;pair.call(0x84f1);assert.equal(pair.m[0x12e0],a-1);assert.equal(pair.m[0x12e0+29],b-1);pairCases++;
}
// Negative control: the update itself can expire two deliberately equal timers.
pair.m.fill(0,0x12e0,0x12ff);pair.m[0x12e0]=pair.m[0x12e0+29]=1;pair.call(0x84f1);assert.equal(pair.m[0x12e0]+pair.m[0x12e0+29],0);
console.log(JSON.stringify({roomCases,cartridgeRooms:matches,compressedBytes:streams.reduce((n,s)=>n+s.bytes,0),streamLengths:streams.map(s=>s.bytes),routeCases,scoreCases,cartridgeGraphics:1672,cartridgeMusicCompletions:70,digCalls,cancelCases,tileCases,cartridgeTileCases,cadence:{services:720,allocated,peak,expires},additionalCadences,pairCases}));
