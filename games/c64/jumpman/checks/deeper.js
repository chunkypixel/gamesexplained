"use strict";
// Runs original identified PRGs. Explicit counterfactuals diagnose one unusual
// byte/opcode; they are not game fixes or evidence of author intent.
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const {CPU}=require('../../../../kit/c64/cpu6502');
const args=process.argv.slice(2),option=k=>{const i=args.indexOf(k);return i<0?null:path.resolve(args[i+1]);};
const disk=option('--disk-dir'),output=option('--report'),native=option('--native-cases');
if(!disk)throw Error('Use --disk-dir <original extracted PRGs> [--report JSON] [--native-cases private JSON]');
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'inputs.json'))),files=new Map();
function file(name){if(!files.has(name)){const b=fs.readFileSync(path.join(disk,name.toLowerCase()+'.prg'));assert.equal(crypto.createHash('sha256').update(b).digest('hex'),manifest.files.find(x=>x.name===name.toUpperCase()).sha256);files.set(name,b.subarray(2));}return files.get(name);}
const base=new Uint8Array(65536);base.set(file('INTRO.SYS'),0x2000);base.set(file('JUMPMAN'),0x800);
function make(id){const m=base.slice();if(id)m.set(file('PLF'+id),0x3000);const c=new CPU(m,{strict:true,port:0x36,io:{read:a=>m[a],write:(a,v)=>m[a]=v}});c.image=id||'resident';return c;}
let routineCalls=0;const report={},recipes=[];
function call(c,e,o={},regs={}){routineCalls++;return c.call(e,{i:1,d:0,...regs},o);}
function observe(c,name,entry,stop,watch,action,regs={}){const before=c.m.slice();action();if(!native)return;const original=make(c.image==='resident'?null:c.image).m;recipes.push({name,image:c.image,entry,stop,regs,patches:Array.from(before.entries()).filter(([a,v])=>v!==original[a]),watch:watch.map(([address,n])=>({address,bytes:Array.from(c.m.slice(address,address+n))}))});}
{
let cases=0,diffs=[];
for(const y of Array.from({length:256},(_,i)=>i))for(const direction of [1,255])for(const x of [96,100,104])for(const material of [8,12]){
 const states=[];
 for(const fix of [false,true]){
  const c=make('01'),m=c.m;for(const [a,v] of Object.entries({0x402b:1,0x4029:4,0x4053:16,0x4052:direction===1?13:14,0x4051:direction,0x4063:x,0x4073:y,0x4098:material,0x40b0:38}))m[a]=v;
  if(fix)m[0x49bb]=0xc9;if(x===96&&material===8&&[100,216,222].includes(y))observe(c,'climb y'+y+' direction'+direction+' diagnostic'+fix,0x4900,null,[[0x4063,1],[0x4073,1],[0x407b,1],[0x409d,3]],()=>call(c,0x4900));else call(c,0x4900);states.push([m[0x4063],m[0x4073],m[0x407b],m[0x409d],m[0x409f],m[0x4028]]);
 }
 if(JSON.stringify(states[0])!==JSON.stringify(states[1])){assert.equal(y,222);assert.equal(direction,1);diffs.push({x,y,direction,material,original:states[0],counterfactual:states[1]});}cases++;
}
assert.equal(diffs.length,6);
report.climb={cases,comparison:'Original CMP $01 versus diagnostic CMP #$01, without asserting intended behavior. Selected X96/100/104, all256 Y, up/down, material8/12, pulse1 and life0.',different:diffs.length,differences:diffs};
}

{
const c=make('2c'),m=c.m;m[0x4000]=m[0x3002];m[0x4001]=m[0x3003];call(c,0x4d0f);let calls=0,individual=0,combined=[];
function sample(x,y,shape,fix){m[0x4063]=m[0x409d]=x&255;m[0x406b]=m[0x409e]=x>>8;m[0x4073]=y;m[0x409f]=(y+11)&255;m[0x407b]=shape;m[0x7dff]=fix?8:0;if([212,216].includes(x)&&y===216&&shape===0x20)observe(c,'maze sample x'+x+' diagnostic'+fix,0x47c0,null,[[0x4098,1],[0x409c,1]],()=>call(c,0x47c0));else call(c,0x47c0);calls++;return [m[0x4098],m[0x409c]];}
for(const shape of [0x20,0x23])for(let y=0;y<256;y++)for(let x=0;x<512;x++){
 const old=sample(x,y,shape,false),fixed=sample(x,y,shape,true);
 if(old[0]!==fixed[0]||old[1]!==fixed[1])individual++;
 if((old[0]|old[1])!==(fixed[0]|fixed[1]))combined.push({x,y,shape,original:old,counterfactual:fixed});
}
assert.equal(individual,588);assert.equal(combined.length,90);
report.material={image:'2c',cases:262144,calls,setup:'Original opening geometry; all512 X and256 Y, shapes$20/$23; foot probe assigned current X and Y+11 rather than inherited from previous movement. Diagnostic branch changes only $7DFF from0 to8.',individualDifferences:individual,combinedDifferences:combined.length,casesWithCombinedDifference:combined};
}

{
let runtime={plf15:[],plf30:[]};
function commit(c){call(c,0x428d,{hooks:{0x42ad:()=>true}});}
for(const [request,target] of [[0x31c6,0x35bc],[0x31d4,0x35e0],[0x31e2,0x35f9],[0x31f0,0x3593],[null,0x3567]]){
 const c=make('15'),m=c.m;m[0x40e1]=39;m[0x40e0]=16;
 if(request)call(c,request);else {m[0x40c8]=target&255;m[0x40c9]=target>>8;}
 assert.equal(m[0x40c8]+256*m[0x40c9],target);commit(c);assert.equal(m[0x400c]+256*m[0x400d],target);
 m.fill(255,0x8400,0x8500);m[0x402c]=0;call(c,target);assert(m.slice(0x8400,0x8500).every(x=>x===255));
 let ticks=0;m[0x402c]=1;
 while(!m[0x40c9]&&ticks<20){if(ticks===0||m[0x40c9])observe(c,'puzzle15 task '+target.toString(16)+' first',target,null,[[0x8400,256],[0x40c8,2]],()=>call(c,target));else call(c,target);ticks++;}
 assert.equal(m[0x40c8]+256*m[0x40c9],0x301f);assert.equal(ticks,target===0x35f9?10:9);commit(c);assert.equal(m[0x400c]+256*m[0x400d],0x301f);
 runtime.plf15.push({request,target,ticks,changedSpriteBytes:Array.from(m.slice(0x8400,0x8500).entries()).filter(([a,v])=>v!==255).map(([a,v])=>[a+0x8400,v])});
}
{
 const c=make('30'),m=c.m;m[0x3013]=4;m[0x40ce]=0;m[0x40cf]=0;m[0x402a]=4;
 observe(c,'puzzle30 begin transformation',0x3393,0x33c8,[[0x40c8,8],[0x8400,64],[0x4029,1]],()=>call(c,0x3393,{hooks:{0x33c8:()=>true}}));
 assert.equal(m[0x40cc]+256*m[0x40cd],0x3418);assert.equal(m[0x40ce]+256*m[0x40cf],0x34c7);commit(c);
 let frames=[];for(let i=0;i<8;i++){call(c,0x3418);frames.push(m[0x407b]);}assert.deepEqual(frames,[49,50,51,52,49,50,51,52]);
 observe(c,'puzzle30 finish transformation',0x33ce,null,[[0x40c8,8],[0x40b0,14],[0x3006,2],[0x3013,2],[0xa000,8192]],()=>call(c,0x33ce));commit(c);assert.equal(m[0x400c+4]+256*m[0x400d+4],0x3499);assert.equal(m[0x3006]+256*m[0x3007],0x3226);assert.equal(m[0x3013],4);assert.equal(m[0x3014],5);
 runtime.plf30.push({callbacks:Array.from(m.slice(0x400c,0x4014)),frames,bombTable:0x3226,targets:m[0x3013],divider:m[0x4029],ladders:Array.from(m.slice(0x40b0,0x40be))});
}
report.runtime=runtime;
}

{
// Runtime replacements are outside the initial-header/table entry audit.
const game=path.resolve(__dirname,'..'),entries=[];
for(const id of ['15','30']){
 const root=path.join(game,'reference/sources',id);
 const records=new Map(JSON.parse(fs.readFileSync(path.join(root,'listing.json'))).records.map(r=>[r.a,r]));
 const symbols=new Map(JSON.parse(fs.readFileSync(path.join(root,'symbols.json'))).symbols.map(s=>[s.address,s]));
 const check=(address,kind,pointer)=>{
  assert.equal(records.get(address)?.t,'code');assert(symbols.has(address));
  entries.push({image:id,address,kind,pointer,name:symbols.get(address).name});
 };
 for(const address of id==='15'?[0x3567,0x3593,0x35bc,0x35e0,0x35f9,0x301f]:[0x3418,0x34c7,0x3499])check(address,'runtime task');
 if(id==='30'){
  const m=make(id).m;let p=0x3226,n=0;
  while(m[p]!==255){assert(n<8);check(m[p+3]+256*m[p+4],'replacement bomb callback',p+3);n++;p+=7;}
  assert.equal(n,8);
 }
}
report.runtimeEntries=entries;
}

{
// Controlled boundary: four landings followed by four spawns in one pulse.
// No claim that this supplied arrangement is reached by ordinary input.
const c=make('11'),m=c.m;m[0x402c]=1;m[0x585b]=33;m[0x585c]=0;
m.fill(1,0x31c5,0x31d7);m.fill(0,0x31c5,0x31c9);
for(let k=0;k<4;k++){
 const slot=4+k,x=2*(m[0x31a1+k]+12);m[0x31f2+slot]=1;
 m[0x4063+slot]=x&255;m[0x406b+slot]=x>>8;m[0x4073+slot]=m[0x31b3+k]+50;
}
call(c,0x3388);assert.equal(m[0x348a],24);
observe(c,'runaway controlled four landings then four spawns',0x3216,null,[[0x348a,1],[0x34da,48]],()=>call(c,0x3216));
assert.equal(m[0x348a],48);report.controlledBurst={seed:33,landings:4,spawns:4,pending:8};
}

{
let result=[];
for(let origin=0;origin<18;origin++)for(let direction=0;direction<4;direction++){
 const c=make('11'),m=c.m,slot=7;m[0x406a]=(2*(m[0x31a1+origin]+12))&255;m[0x4072]=(2*(m[0x31a1+origin]+12))>>8;m[0x407a]=(m[0x31b3+origin]+50)&255;
 m[0x31f7+slot]=m[0x3209+direction];m[0x31fc+slot]=m[0x320d+direction];m[0x3201+slot]=m[0x3211+direction];let hits=[],seen=new Set(),steps=0;
 while(steps<1024){call(c,0x32ab,{hooks:{0x3228:()=>true}},{x:7});steps++;const x=((m[0x406a]+256*m[0x4072])>>1)-12,y=m[0x407a]-50;
  for(let j=0;j<18;j++)if(x===m[0x31a1+j]&&y===m[0x31b3+j])hits.push({steps,destination:j});
  const key=[m[0x406a],m[0x4072],m[0x407a],m[0x3208]].join(',');if(seen.has(key))break;seen.add(key);
 }
 assert(steps<1024);result.push({origin,direction,cycleSteps:steps,firstArrival:hits[0]||null});
}
let arrivals=result.filter(x=>x.firstArrival);const min=Math.min(...arrivals.map(x=>x.firstArrival.steps));assert.equal(min,13);report.travel={paths:72,minimumMovesToAnyLocation:min,results:result};
}

{
// Over-approximation: any eligible bomb may land at any pulse; any idle
// slot may spawn, without imposing actual geometry, occupancy or RNG.
// 0=idle; 1=flight eligible to land; 2..13=countdown until eligibility.
const states=[[0,0,0,0,0]],seen=new Set(['0,0,0,0,0']);let peak=0,transitions=0;
for(let pos=0;pos<states.length;pos++){
 const s=states[pos],q=s[4],slots=s.slice(0,4),branches=[];
 for(let mask=0;mask<16;mask++){
  if(slots.some((a,i)=>(mask>>i&1)&&a!==1))continue;
  branches.push({a:slots.map((a,i)=>mask>>i&1?0:a),push:slots.filter((a,i)=>mask>>i&1).length});
 }
 for(let i=0;i<4;i++)if(slots[i]){let a=slots.slice();a[i]=0;branches.push({a,push:0});}
 for(const b of branches)for(let spawn=0;spawn<16;spawn++){
  if(b.a.some((a,i)=>(spawn>>i&1)&&a!==0))continue;
  const n=b.a.map((a,i)=>spawn>>i&1?13:Math.max(1,a-1)*(a!==0));
  const push=b.push+b.a.filter((a,i)=>spawn>>i&1).length,top=q+push;peak=Math.max(peak,top);
  n.sort((a,b)=>a-b);n.push(Math.max(0,top-2));const key=n.join(',');transitions++;
  if(!seen.has(key)){seen.add(key);states.push(n);assert(top<44);}
 }
}
assert.equal(peak,8);assert.equal(states.length,3128);
const result={states:states.length,transitions,maximumPending:peak,slotCount:4,minimumServicesPerHazardPulse:2,minimumFlightUpdatesBeforeLanding:13,scope:'Conservative state-space bound for original scheduler and normal selected speeds2..8, initialized with four idle slots and an empty queue. No geometry/RNG restrictions on spawn or eligible landing; unlimited collections admitted, at most one per pulse and no landings in the same collection branch. Speed1 remains open.'};report.backlogBound=result;
}

{
let dividers=[];
for(let speed=1;speed<=8;speed++){
 const c=make('11'),m=c.m;m[0x4029]=m[0x402a]=speed;const pulses=[];
 for(let i=0;i<80;i++){call(c,0x41a9,{hooks:{0x4206:()=>true}});if(m[0x402c])pulses.push(i);}
 for(let i=1;i<pulses.length;i++)assert.equal(pulses[i]-pulses[i-1],speed);
 dividers.push({speed,firstPulse:pulses[0],steadyPeriod:speed});
}report.dividers=dividers;
}
report.routineExecutions=routineCalls;
if(output)fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
if(native)fs.writeFileSync(native,JSON.stringify({method:'Original controlled instructions with separately named diagnostic patches; no route inferred.',cases:recipes},null,2)+'\n');
console.log(JSON.stringify({routineExecutions:routineCalls,materialCases:report.material.cases,climbCases:report.climb.cases,backlogStates:report.backlogBound.states,nativeRecipes:recipes.length}));
