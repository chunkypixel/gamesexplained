'use strict';
// Fresh semantic sample: execute hash-identified original PRGs, not page models.
// Controlled RAM and register-shadow I/O; no raster, ROM, or collision generation.
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const {CPU}=require('../../../../kit/c64/cpu6502');
const game=path.resolve(__dirname,'..'),args=process.argv.slice(2);
const opt=n=>{const i=args.indexOf(n);return i<0?null:path.resolve(args[i+1]);};
const disk=opt('--disk-dir'),output=opt('--report'),native=opt('--native-cases');
if(!disk){console.log('node checks/semantic.js --disk-dir <PRGs> [--report <JSON>] [--native-cases <private JSON>]');process.exit(1);}
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'inputs.json')));
const files=new Map();
for(const f of manifest.files){const b=fs.readFileSync(path.join(disk,f.name.toLowerCase()+'.prg'));assert.equal(sha(b),f.sha256,f.name);files.set(f.name,b.subarray(2));}
const base=new Uint8Array(65536);base.set(files.get('INTRO.SYS'),0x2000);base.set(files.get('JUMPMAN'),0x800);
const sample=JSON.parse(fs.readFileSync(path.join(__dirname,'semantic-sample.json')));
const report={baseline:sample.baseline,method:'Additional self-audit; controlled original instructions with RAM and I/O shadows. No independent verification or natural reachability claim.',facts:[],routines:[],cases:0,assertions:0},recipes=[];
const word=(m,a)=>m[a]|m[a+1]<<8,read=(c,a,n=1)=>Array.from(c.m.slice(a,a+n));
function eq(a,b,label){assert.deepEqual(a,b,label);report.assertions++;}
function make(id='resident',fields={}){const m=base.slice();if(id!=='resident')m.set(files.get('PLF'+id),0x3000);for(const[a,v]of Object.entries(fields))m[+a]=v;const c=new CPU(m,{strict:true,port:0x36,io:{read:a=>m[a],write:(a,v)=>m[a]=v}});c.image=id;return c;}
function call(c,entry,regs={},options={}){report.cases++;return c.call(entry,{d:0,i:1,...regs},options);}
function run(c,entry,stop,regs={}){report.cases++;c.setRegs({pc:entry,d:0,i:1,...regs});c.run({until:stop});}
function observe(c,name,entry,stop,regs,watch,action){
 const before=c.m.slice();action();
 if(native)recipes.push({name,image:c.image,entry,stop,regs,patches:Array.from(before.entries()).filter(([a,v])=>v!==(c.image!=='resident'&&a>=0x3000&&a<0x3800?files.get('PLF'+c.image)[a-0x3000]:base[a])),watch:watch.map(([a,n])=>({address:a,bytes:read(c,a,n)}))});
}
function result(id,details){report.facts.push({id,status:'confirmed within stated controlled scope',...details});}
// F01: run the actual initialization stores; its wait/roster caller is traced separately.
{
 const c=make('resident',{0x40ff:1});c.m.fill(255,0x40da,0x40e5);
 observe(c,'F01 player record',0x7bbe,0x7bee,{},[[0x40da,11]],()=>run(c,0x7bbe,0x7bee));
 eq(read(c,0x40da,11),[0,0,0,0,0,0,16,39,0,4,6]);
 result('F01',{trace:'$7BBE-$7BDB clears eleven bytes, then writes speed 4, reserves 6 and threshold $002710.',record:read(c,0x40da,11)});
}
{
 const rates=[];for(let mode=1;mode<=4;mode++){const c=make('resident',{0x40ff:mode});observe(c,'F02 mode '+mode,0x2932,0x2941,{},[[0x2a0a,2]],()=>run(c,0x2932,0x2941));rates.push(word(c.m,0x2a0a));}eq(rates,[100,250,500,750]);result('F02',{trace:'$2932-$293E indexes separate low/high tables with mode 1-4.',rates});
}
{
 const c=make();c.m.fill(0xcc,0x400,0x800);const writes=new Uint8Array(65536);
 observe(c,'F03 three buildings',0x2b83,0x2bb0,{},[[0x400,1000]],()=>{c.pc=0x2b83;c.run({until:0x2bb0,writes});report.cases++;});
 let cells=0;for(let j=0;j<3;j++){const start=c.m[0x2b4a+j]+256*c.m[0x2b4d+j],height=[8,10,12][j];for(let y=0;y<height;y++)for(let x=0;x<5;x++){eq(c.m[start+y*40+x],0xa0);cells++;}}
 eq(Array.from(writes.slice(0x400,0x800)).reduce((a,b)=>a+b,0),150);result('F03',{trace:'$2B5A-$2B82 writes five columns per row; $2B83 calls it for heights $08,$0A,$0C.',cells});
}
{
 const pairs=[];for(let mode=1;mode<=4;mode++){const c=make('resident',{0x40ff:mode,0x2c0b:15,0x2c0c:7});const w=new Uint8Array(65536);observe(c,'F04 mode '+mode,0x2c00,null,{},[[0xd800,1000]],()=>call(c,0x2c00,{}, {writes:w}));const count=Array.from(w.slice(0xd800,0xdbe8)).reduce((a,b)=>a+b,0);pairs.push(count/2);eq(c.m[0x2c0c],0);}
 eq(pairs,[4,5,6,15]);result('F04',{trace:'$2C00 accepts every sixteenth callback; ranges from $2B42/$2B46 select pairs at offsets 0 and 2.',pairs});
}
{
 const c=make();for(let i=0;i<241;i++)c.m[0xc100+i]=(i*37+255)&255;c.m.fill(0xa5,0x8400,0x8600);const reads=new Uint8Array(65536);
 observe(c,'F05 short sprite expansion',0x5e6f,null,{x:0xc1,y:0},[[0x8400,512]],()=>call(c,0x5e6f,{x:0xc1,y:0},{reads}));
 for(let f=0;f<8;f++){eq(read(c,0x8400+64*f,30),read(c,0xc100+30*f,30));eq(read(c,0x8400+64*f+30,34),Array(34).fill(0));}eq(Array.from(reads.slice(0xc100,0xc1f1)).reduce((a,b)=>a+b,0),240);
 result('F05',{trace:'$5E78 clears 512 bytes; $5EA2 counts 30, $5E97/$5EC2 count 8; pointers advance 30/64.',sourceReads:240,sourceIncludesFF:true});
}
{
 const outcomes=[];for(const score of [0,99,100,101]){const c=make('resident',{0x24a2:0x00,0x24a3:0xc2});for(let row=0;row<20;row++)c.m.set(Buffer.from(String(row===0?100:0).padStart(6,'0')),0xc204+40*row);c.m.set(Buffer.from(String(score).padStart(6,'0')),0x249a);
  // Stop before insertion to test ordering independently of record movement.
  let stop;call(c,0x24a8,{}, {hooks:{0x24eb:()=>{stop=0x24eb;return true;},0x24ea:()=>{stop=0x24ea;return true;}}});const rank=stop===0x24eb?20-c.m[0x2495]:null;outcomes.push({score,rank});
  const fresh=make('resident',{0x24a2:0,0x24a3:0xc2});for(let row=0;row<20;row++)fresh.m.set(Buffer.from(String(row===0?100:0).padStart(6,'0')),0xc204+40*row);fresh.m.set(Buffer.from(String(score).padStart(6,'0')),0x249a);observe(fresh,'F06 score '+score,0x24a8,stop,{},[[0x2495,1],[0x24a6,2],[0x24c1,2]],()=>run(fresh,0x24a8,stop));
 }eq(outcomes.map(x=>x.rank),[null,1,1,0]);result('F06',{trace:'$24BE masks candidate bit 7; BCC skips lower, BEQ compares next digit; all six equal skips record.',outcomes});
}
{
 const ids=[9,11,12,13],descriptors=ids.map(i=>read({m:base},0x603c+16*i,16));for(const d of descriptors)eq(d,descriptors[0]);
 for(const id of ids){const c=make();for(let i=0;i<21;i++)c.m[0x4030+i]=i+1;const before=read(c,0x4030,21);observe(c,'F07 silent definition '+id,0x6000,null,{a:id},[[0x4030,21]],()=>call(c,0x6000,{a:id}));eq(read(c,0x4030,21),before);}
 result('F07',{trace:'$6000 submits all three descriptors. With all voices occupied, $45DA-$45E1 cannot preempt any positive priority with zero. An idle voice may receive an inactive zero-priority descriptor.',ids});
}
{
 const outcomes=[];for(const kind of ['title','demo'])for(const pulse of [0,1]){const title=kind==='title',entry=title?0x9440:0x99db,state=title?0x93eb:0x9989;const c=make('resident',{0x402b:pulse,[state]:2});observe(c,'F08 '+kind+' pulse '+pulse,entry,null,{},[[state,1]],()=>call(c,entry));const value=c.m[state];eq(value,(title?pulse:!pulse)?1:2);outcomes.push({kind,pulse,countdown:value});}
 result('F08',{trace:'$9443 BNE enters title processing; $99DE BEQ enters demo processing.',outcomes});
}
// F09/F10: original command decoder; synthetic programs exercise each opcode.
{
 const scenarios=[
  {name:'position then stop',program:[0x81,254,0,100,0x83,0,0,0],want:[254,0,100]},
  {name:'negative motion crossing X byte',program:[0xfc,0xff,0xfe,2,0x83,0,0,0],want:[252,0,98]},
  {name:'positive motion crossing X byte',program:[4,0,2,1,0x83,0,0,0],want:[4,1,102]},
  {name:'call supplied sound wrapper then stop',program:[0x82,0x02,0x9e,0,0x83,0,0,0],want:[0,1,100]},
  {name:'load frames/color then stop',program:[0x80,0xc2,0x9c,5,0x83,0,0,0],want:[0,1,100]}
 ];
 for(const s of scenarios){const c=make('resident',{0x402b:0,0x9a8c:0,0x9a8e:0xc2,0x9a8d:0x40,0x9a8f:0xc2,0x4064:0,0x406c:1,0x4074:100});c.m.set(s.program,0xc200);c.m[0xc240]=0x83;c.m.fill(0xa5,0x8500,0x8601);observe(c,'F09 '+s.name,0x9a98,null,{},[[0x4064,1],[0x406c,1],[0x4074,1],[0x9a8a,6],[0x8500,257],[0x4030,7]],()=>call(c,0x9a98));eq([c.m[0x4064],c.m[0x406c],c.m[0x4074]],s.want);eq(c.m[0x9a8c],4);eq(c.m[0x9a8d],0x40);if(s.program[0]===0x81)eq(c.m[0x405c],1);if(s.program[0]===0x82){eq(c.m[0x4032],0x9e);eq(word(c.m,0x4033),0x9e38);eq(c.m[0x4035],0x80);}if(s.program[0]===0x80){eq(read(c,0x8500,24),read(c,0x9cc2,24));eq(read(c,0x8540,24),read(c,0x9cda,24));eq(c.m[0x8580],0);eq(c.m[0x8581],0xa5);}}
 const c=make('resident',{0xfb:0,0xfc:0xc2});c.m.fill(0xa5,0x8500,0x8601);observe(c,'F10 first clear loop',0x9b11,0x9b26,{x:0},[[0x8500,129]],()=>run(c,0x9b11,0x9b26,{x:0}));eq(c.m[0x8500],0xa5);eq(read(c,0x8501,128),Array(128).fill(0));
 result('F09',{trace:'$9ABE-$9ACC dispatches four opcodes; $9AE6 advances four bytes and processes next command immediately; $83 retains its pointer.',programs:scenarios.map(s=>s.name)});
 result('F10',{trace:'$9B1D LDY #$80; store then DEY/BNE visits 128..1, omitting 0.',untouchedOffset:0,clearedOffsets:[1,128]});
}
{
 const outcomes=[];for(const y of [212,213,214]){const c=make('03',{0x402c:1,0x4028:0,0x405c:1,0x4074:y,0x407c:0x10,0x4064:100});observe(c,'F11 impact Y '+y,0x3336,0x33f0,{x:1},[[0x4074,1],[0x407c,1],[0x4059,1],[0x4064,1]],()=>run(c,0x3336,0x33f0,{x:1}));eq(c.m[0x4074],y+3);eq(c.m[0x407c],y+3>=216?0x14:0x11);eq(c.m[0x4059]&2,y+3>=216?2:0);outcomes.push({y,after:read(c,0x4074),frame:c.m[0x407c],expand:c.m[0x4059]});}
 for(const pulse of [0,1])for(const life of [0,1,2]){const c=make('03',{0x402c:pulse,0x4028:life});for(let slot=1;slot<=3;slot++){c.m[0x405b+slot]=1;c.m[0x4073+slot]=100;c.m[0x407b+slot]=0x10;}call(c,0x32c6);eq(read(c,0x4074,3),Array(3).fill(pulse&&life!==2?103:100));}
 result('F11',{trace:'$3336/$3339/$333C increment Y; compare $D8 at $337E triggers expansion and shifts X left 12. Fall path requires hazard pulse and life !=2.',outcomes});
}
{
 const c=make('05'),sequence=[];for(let i=1;i<=14;i++){observe(c,'F12 bomb '+i,0x3317,null,{},[[0x3454,2],[0x407c,3]],()=>call(c,0x3317));sequence.push(c.m[0x3454]);eq(c.m[0x3454],Math.min(3,Math.floor(i/3)));}eq(read(c,0x407c,3),[16,16,16]);
 let p=word(c.m,0x3006),records=0;while(c.m[p]!==255){eq(word(c.m,p+3),0x3317);records++;p+=7;}eq(records,14);
 result('F12',{trace:'Every record calls $3317; equality with 3 resets the bomb divider, then caps the activation count at 3 from its zero initial state.',sequence,records});
}
{
 const cases=[{name:'same row left',px:160,py:100,x:200,y:98,dy:2,want:[252,255,0]}, {name:'same row right',px:160,py:100,x:100,y:98,dy:2,want:[4,0,0]}, {name:'half-X equal up',px:161,py:90,x:160,y:100,dy:2,want:[0,0,254]}, {name:'half-X equal down',px:160,py:110,x:161,y:100,dy:2,want:[0,0,2]}, {name:'neither alignment',px:160,py:110,x:164,y:100,dy:2,want:[0,0,2]}, {name:'old X aligned after horizontal movement',px:160,py:90,x:160,y:100,dy:0,dx:4,want:[0,0,254]}];
 for(const s of cases){const c=make('05',{0x3454:1,0x346a:5,0x4029:4,0x4063:s.px,0x4073:s.py,0x4064:s.x,0x4074:s.y,0x3456:s.dy,0x3459:s.dx||0});observe(c,'F13 '+s.name,0x3339,null,{},[[0x3456,9],[0x4064,1],[0x4074,1]],()=>call(c,0x3339));eq([c.m[0x3459],c.m[0x345c],c.m[0x3456]],s.want);}
 result('F13',{trace:'$3368 caches pre-move half-X; movement precedes $33E0 row compare, which uses updated Y. $340F compares cached half-X.',qualification:'Row uses post-move Y; half-X uses pre-move X. Equality of rows has priority.',cases:cases.length});
}
function special(id,claim,entry){const c=make(id),records=[];let p=word(c.m,0x3006);while(c.m[p]!==255){const pc=word(c.m,p+3);const probe=make(id);let seen=false;call(probe,pc,{}, {hooks:{[entry]:()=>{seen=true;return true;}}});if(seen)records.push(p);p+=7;}eq(records.length,4);
 for(const [i,p] of records.entries()){const t=make(id,{0x29:p&255,0x2a:p>>8,0x40e0:255,0x40e1:255,0x40e2:255});observe(t,claim+' record '+i,0x5611,0x5677,{y:0},[[0x40da,3]],()=>run(t,0x5611,0x5677,{y:0}));eq(word(t.m,0x40da),500);eq(t.m[0x40dc],0);}
 result(claim,{trace:'$5611 fetches the real record callback; $5646 calls it before $565C adds ordinary 100 points. Private callback adds $0190.',records:records.map(a=>'$'+a.toString(16).toUpperCase())});}
special('07','F14',0x3282);
{
 const c=make('08');eq([8,10,12,14].map(a=>word(c.m,0x3000+a)),[0,0,0,0x308f]);eq(word(c.m,0x3019),0x301f);eq(word(c.m,0x301d),0x301f);eq(word(c.m,0x303a),0);let p=word(c.m,0x3006),n=0;while(c.m[p]!==255){eq(word(c.m,p+3),0x301f);n++;p+=7;}
 for(const hit of [0,3]){const t=make('08',{0x402b:1,0x4088:hit});observe(t,'F15 collision '+hit,0x308f,null,{},[[0x4028,1]],()=>call(t,0x308f));eq(t.m[0x4028],hit?1:0);}
 result('F15',{trace:'Header hooks 0,0,0,$308F; init/cleanup and all record callbacks use RTS $301F; global callback zero; foreground only uses resident spawn/collection.',bombRecords:n,limit:'No private moving callback is installed; resident perimeter bullets remain active.'});
}
{
 const c=make('09',{0x4052:0,0x402c:1,0x4062:1,0x407a:100,0x406a:160,0x4097:1});const bitmap=c.m.slice(0xa000,0xc000);
 observe(c,'F16 queue floor edit',0x31fc,null,{},[[0x4000,2],[0x3287,14],[0x407a,1]],()=>call(c,0x31fc));eq(word(c.m,0x4000),0x3288);eq(c.m.slice(0xa000,0xc000),bitmap);eq([c.m[0x328b],c.m[0x328c],c.m[0x3291],c.m[0x3292]],[68,53,68,49]);
 observe(c,'F16 foreground applies edit',0x3053,0x3060,{},[[0x4000,2],[0xa000,8192]],()=>run(c,0x3053,0x3060));eq(c.m[0x4001],0);assert.notDeepEqual(c.m.slice(0xa000,0xc000),bitmap);
 result('F16',{trace:'$31FC requires enabled slot7, hazard pulse, life!=2. Latched contact resets a three-contact divider; $3269 queues $3288. Foreground $3053-$305D draws/clears pointer.',labelFinding:'The baseline routine name incorrectly identifies the preceding RTS at $31FB.'});
}
{
 const changed=[];for(let frame=0;frame<8;frame++){const c=make('10',{0x4020:frame,0x407a:100,0x4082:16});observe(c,'F17 phase '+frame,0x33c8,null,{},[[0x4082,1],[0x407a,1]],()=>call(c,0x33c8));eq(c.m[0x4082],frame%4?17:16);if(c.m[0x4082]===17)changed.push(frame);}result('F17',{trace:'$33CB AND #3 / BEQ skips phase 0; nonzero effect Y required; reaching frame $15 hides it.',changed});
}
{
 const placements=[];for(const seed of [0x7b7b,1,2,0x1234,0xbeef]){const c=make('11',{0x585b:seed&255,0x585c:seed>>8});observe(c,'F18 Runaway seed '+seed,0x3161,null,{},[[0x31c5,18],[0x3199,1]],()=>call(c,0x3161));eq(read(c,0x31c5,18).reduce((a,b)=>a+b,0),12);eq(c.m[0x3199],0);placements.push({seed,occupied:read(c,0x31c5,18)});}result('F18',{trace:'$316B masks random byte to 0..31; $316D rejects >=18; $3175 rejects occupied; $3193 counts 12 successful distinct draws.',placements,limit:'Returning seeds checked; this is not a termination proof for all RNG states.'});
}
special('15','F19',0x3667);
{
 const scenarios=[{name:'same row overrides background',px:160,py:100,x:100,y:100,hit:1,want:[104,100]}, {name:'same row left',px:160,py:100,x:200,y:100,hit:0,want:[196,100]}, {name:'background rises',px:160,py:90,x:100,y:100,hit:1,want:[100,99]}, {name:'air right rises',px:160,py:90,x:100,y:100,hit:0,want:[104,98]}, {name:'air left rises',px:160,py:90,x:200,y:100,hit:0,want:[196,98]}, {name:'top reset',px:160,py:90,x:100,y:4,hit:1,want:[104,216]}];
 for(const s of scenarios){const c=make('17',{0x402c:1,0x4063:s.px,0x4073:s.py});for(let k=5;k<8;k++){c.m[0x4063+k]=s.x;c.m[0x4073+k]=s.y;c.m[0x4090+k]=s.hit;}
  observe(c,'F20 '+s.name,0x32eb,null,{},[[0x4068,3],[0x4078,3],[0x4095,3]],()=>call(c,0x32eb));eq([c.m[0x4068],c.m[0x4078]],s.want);eq(read(c,0x4095,3),[0,0,0]);if(s.name==='top reset')eq(read(c,0x4068,3),[104,176,248]);}
 result('F20',{trace:'$3301 tests same row first; otherwise contact selects movement index0, no contact3/4. $334C resets only if unsigned prospective Y<4.',cases:scenarios.length});
}
// Two additional named routines whose behavior is not covered above.
{
 const c=make();observe(c,'R01 boot picture',0x811,0x898,{},[[0x400,1000]],()=>run(c,0x811,0x898));assert(c.m.slice(0x400,0x800).some(v=>v===0xa0));
 const logo=make('resident',{0xb2:0xf7,0xb3:4,0x90b6:6,0x90b7:0x91});observe(logo,'R06 logo row',0x90b3,0x90c3,{},[[0x4f7,26]],()=>run(logo,0x90b3,0x90c3));eq(read(logo,0x4f7,26),read(logo,0x9106,26).map(i=>logo.m[0x91f0+i]));
}
for(const s of sample.symbols){const root=s.image==='resident'?game:path.join(game,'reference/sources',s.image);const sy=JSON.parse(fs.readFileSync(path.join(root,'symbols.json')));const found=sy.symbols.find(v=>v.name===s.name);assert(found,s.name);eq(found.address,s.id==='R09'?0x31fc:s.address);report.routines.push({...s,currentAddress:found.address,status:s.id==='R09'?'baseline name at $31FB was wrong; corrected to actual entry $31FC through native disassembler':'name supported by instruction trace and controlled execution'});}
eq(report.facts.length,20);eq(report.routines.length,10);
if(output)fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');if(native)fs.writeFileSync(native,JSON.stringify({method:report.method,cases:recipes},null,2)+'\n');
console.log(JSON.stringify({facts:report.facts.length,routines:report.routines.length,cases:report.cases,assertions:report.assertions,nativeRecipes:recipes.length}));
