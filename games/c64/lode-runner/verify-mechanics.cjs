/* Original-code verification. Requires the contributor's private play snapshot.
   node games/c64/lode-runner/verify-mechanics.cjs path/to/play-round1.vsf
   Widget functions/data are read from the self-contained article. */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const path=require('node:path');
const root=path.resolve(__dirname,'../../..');
const {CPU}=require(path.join(root,'kit/c64/cpu6502.js'));
const snap=process.argv[2];if(!snap)throw Error('Supply private play snapshot path');
let html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const code=html.match(/<script id="lr-mechanics">([\s\S]*?)<\/script>/)[1];
const D=JSON.parse(html.match(/<script id="lr-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
const box={Uint8Array,Math};vm.createContext(box);vm.runInContext(code,box);
const cpu=CPU.fromSnapshot(snap);let cases=0;
for(let player=0;player<16;player++)for(let row=0;row<16;row++)for(let guard=0;guard<28;guard++)for(let col=0;col<28;col++){
 cpu.m[4]=player;cpu.m[0x15]=guard;cpu.call(0x81ce,{a:row,x:col});assert.equal(box.routeCost(row,col,player,guard),cpu.a);cases++;
}
const scoreCPU=CPU.fromSnapshot(snap);let seed=6401983;
const scores=[0,75,250,9999999,10000000,99999999];for(let i=0;i<400;i++){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;scores.push((seed>>>0)%100000000);}
for(const s of scores)for(const amount of [0,75,250,1500]){
 let n=s;for(let i=0;i<4;i++){const v=n%100;scoreCPU.m[0x130a+i]=Math.floor(v/10)*16+v%10;n=Math.floor(n/100);}
 let digits=[];const low=amount%100,hi=Math.floor(amount/100);scoreCPU.call(0x87e6,{a:Math.floor(low/10)*16+low%10,y:Math.floor(hi/10)*16+hi%10},{hooks:{[0x8885]:c=>{digits.push(c.a);c.rts();}}});
 const result=box.addPoints(s,amount);let expected=0;
 for(let i=3;i>=0;i--){const v=scoreCPU.m[0x130a+i];expected=expected*100+(v>>4)*10+(v&15);}
 assert.equal(result,expected);assert.equal(box.displayedScore(result),digits.join(''));cases++;
}
// Every hole countdown value, through the actual bitmap/map update body.
for(let timer=0;timer<=180;timer++){
 const c=CPU.fromSnapshot(snap);c.m[0x131c]=0;c.m.fill(0,0x1298,0x129e);c.m.fill(0,0x12e0,0x12ff);c.m[0x12e0]=timer;c.m[0x12a0]=2;c.m[0x12c0]=2;c.m[0x083a]=0;
 c.call(0x84f1);assert.equal(box.holeTick(timer),c.m[0x12e0]);cases++;
}
let musicTicks=0;
for(let selection=0;selection<D.audio.selections.length;selection++){
 let writes=[];const c=CPU.fromSnapshot(snap,{io:{write:(a,v)=>writes.push(a-0xd400,v)}});
 const drv=box.createQueueDriver(D.audio);drv.init(selection);const [t,offset]=D.audio.selections[selection];c.m[0x132e]=0;c.m[0x132f]=D.audio.tunes[t].length;c.m[0x1313]=255;
 D.audio.tunes[t].forEach((e,i)=>{c.m[0xc000+i]=e[0];c.m[0xc100+i]=e[1]?(e[1]+offset)&255:0;c.m[0xc200+i]=e[2]&&e[2]<128?(e[2]+offset)&255:e[2];c.m[0xc300+i]=e[3];});
 while(drv.playing()){writes=[];c.call(0x6319);drv.tick();assert.deepEqual(Array.from(drv.writes),writes);musicTicks++;}
}
console.log(JSON.stringify({routeCases:200704,scoreCases:scores.length*4,holeCases:181,musicTicks,totalCases:cases+musicTicks}));
