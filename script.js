const $=id=>document.getElementById(id);
const F=['name','role','email','phone','loc','link','summary','skills','langs','hobbies','refs'];
const newCV=()=>{const o={tpl:'sidebar',accent:'#10287a',photo:'',exp:[{a:'',b:'',c:'',d:'',e:''}],edu:[{a:'',b:'',c:'',d:'',e:''}]};F.forEach(k=>o[k]='');return o};
const sample={name:'Thandi Mokoena',role:'Administrative Assistant',email:'thandi@example.com',phone:'082 000 0000',loc:'Benoni, Gauteng',link:'linkedin.com/in/thandi-mokoena',
summary:'Organised and reliable assistant with three years of office experience. Quick to learn and comfortable with deadlines.',
skills:'Customer service | 4, MS Office | 4, Data capture | 3, Filing | 5',langs:'English | 5 | Fluent, Zulu | 5 | Home language, Afrikaans | 3 | Intermediate',hobbies:'Reading, Netball, Volunteering',refs:'Available on request',
exp:[{a:'Office Assistant',b:'ABC Trading, Benoni',c:'2022-01',d:'Present',e:'- Answered phones and emails for a busy office, passing messages on\nthe same day.\n- Captured invoices and kept records up to date'}],
edu:[{a:'National Senior Certificate',b:'Benoni High School',c:'2017',d:'2021',e:'Distinction in Business Studies'}],tpl:'sidebar',accent:'#10287a'};
let S=Object.assign(newCV(),load()||{});
const pg=document.createElement('style');document.head.appendChild(pg);
function load(){try{const v=localStorage.getItem('cv-data-v2');return v?JSON.parse(v):null}catch(e){return null}}
function save(){try{localStorage.setItem('cv-data-v2',JSON.stringify(S))}catch(e){}}
const esc=s=>String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const list=t=>{const s=t||'',nl=/\n/.test(s.trim()),out=[];
 (nl?s.split('\n'):s.split(',')).forEach(x=>{const q=x.trim();
  if(!q){if(nl&&out.length&&!out[out.length-1].sp)out.push({sp:1});return}
  const p=q.split('|').map(y=>y.trim());out.push({n:p[0],r:Math.min(5,parseInt(p[1])||0),l:p[2]||''})});
 while(out.length&&out[out.length-1].sp)out.pop();return out};
const SP='<div class="sp"></div>';
const dots=n=>n?`<div class="dots">${[1,2,3,4,5].map(i=>`<i class="d${i<=n?' on':''}"></i>`).join('')}</div>`:'';
function items(key){
 const box=$(key);box.innerHTML='';
 const L=key==='exp'?['Job title','Employer','Start','End','What you did (- for a bullet, Enter for a new line, blank line for a space)']:['Qualification','School / college','Start','End','Notes (- for a bullet, Enter for a new line, blank line for a space)'];
 S[key].forEach((it,i)=>{
  const d=document.createElement('div');d.className='item';
  d.innerHTML=`<button class="x" aria-label="Remove">Remove</button>
  <label>${L[0]}</label><input type="text" data-k="a" value="${esc(it.a)}">
  <label>${L[1]}</label><input type="text" data-k="b" value="${esc(it.b)}">
  <div class="row"><div><label>${L[2]}</label><input type="text" data-k="c" value="${esc(it.c)}"></div><div><label>${L[3]}</label><input type="text" data-k="d" value="${esc(it.d)}"></div></div>
  <label>${L[4]}</label><textarea data-k="e">${esc(it.e)}</textarea>`;
  d.querySelectorAll('[data-k]').forEach(inp=>inp.addEventListener('input',()=>{S[key][i][inp.dataset.k]=inp.value;render()}));
  d.querySelector('.x').addEventListener('click',()=>{S[key].splice(i,1);items(key);render()});
  box.appendChild(d);
 });
}
function entries(l){
 return l.filter(x=>x.a||x.b).map(x=>`<div class="e"><div class="eh"><span>${esc(x.a)}</span><span>${esc([x.c,x.d].filter(Boolean).join(' – '))}</span></div>${x.b?`<div class="sub">${esc(x.b)}</div>`:''}${x.e?`<p>${esc(x.e)}</p>`:''}</div>`).join('');
}
const bullets=e=>{const bl=[];let cur=null;
 (e||'').split('\n').forEach(r=>{const t=r.trim();
  if(!t){if(bl.length&&bl[bl.length-1].k!=='s')bl.push({k:'s'});cur=null;return}
  const m=t.match(/^(?:[•*]\s*|-\s+)(.*)$/);
  if(m){cur={k:'li',l:[m[1]]};bl.push(cur)}
  else if(cur)cur.l.push(t);
  else{cur={k:'p',l:[t]};bl.push(cur)}});
 while(bl.length&&bl[bl.length-1].k==='s')bl.pop();
 let h='',ul='';const fl=()=>{if(ul){h+=`<ul>${ul}</ul>`;ul=''}};
 bl.forEach(b=>{const s=b.l?b.l.map(esc).join('<br>'):'';
  if(b.k==='li')ul+=`<li>${s}</li>`;else{fl();h+=b.k==='s'?'<div class="sp"></div>':`<p>${s}</p>`}});
 fl();return h};
function entries2(l){
 return l.filter(x=>x.a||x.b).map(x=>`<div class="r2"><div class="dt">${esc([x.c,x.d].filter(Boolean).join(' – '))}</div><div><div class="et">${esc(x.a)}</div>${x.b?`<div class="eo">${esc(x.b)}</div>`:''}${bullets(x.e)}</div></div>`).join('');
}
function sec(t,h){return h?`<h3>${t}</h3>${h}`:''}
function renderSide(cv){
 const sk=list(S.skills),lg=list(S.langs),hb=list(S.hobbies);
 const links=(S.link||'').split('\n').map(x=>x.trim()).filter(Boolean);
 const ct=[['Address',S.loc],['Phone',S.phone],['E-mail',S.email]].filter(x=>x[1]).map(x=>`<div class="lb">${x[0]}</div><div class="val">${esc(x[1])}</div>`).join('');
 const side=(S.photo?`<img class="photo" src="${S.photo}" alt="Profile photo">`:'')+
  sec('Contact',ct)+
  sec('Links',links.map(l=>`<div class="val">${esc(l)}</div>`).join(''))+
  sec('Skills',sk.map(s=>s.sp?SP:`<div class="sk"><span class="val">${esc(s.n)}</span>${dots(s.r)}</div>`).join(''))+
  sec('Languages',lg.map(s=>s.sp?SP:`<div class="sk"><span class="val">${esc(s.n)}</span>${dots(s.r)}</div>${s.l?`<div class="lv">${esc(s.l)}</div>`:''}`).join(''));
 const main=(S.summary?`<p>${esc(S.summary)}</p>`:'')+
  sec('Education',entries2(S.edu))+
  sec('Hobbies and interests',hb.map(h=>h.sp?SP:`<div class="r2"><div></div><div>${esc(h.n)}</div></div>`).join(''))+
  sec('Experience',entries2(S.exp))+
  sec('References',S.refs?`<p>${esc(S.refs)}</p>`:'');
 cv.innerHTML=`<div class="banner"><h1>${esc(S.name)||'Your name'}</h1>${S.role?`<div class="title">${esc(S.role)}</div>`:''}</div><div class="cols"><div class="main">${main}</div><aside class="side">${side}</aside></div>`;
}
function render(){
 const cv=$('cv');cv.className=S.tpl||'';cv.style.setProperty('--accent',S.accent);
 $('phimg').hidden=$('phrm').hidden=!S.photo;if(S.photo)$('phimg').src=S.photo;
 pg.textContent='@page{margin:'+(S.tpl==='sidebar'?'0':'16mm')+'}';
 if(S.tpl==='sidebar'){renderSide(cv);save();return}
 const contact=[S.email,S.phone,S.loc].concat((S.link||'').split('\n')).map(x=>x.trim()).filter(Boolean).map(x=>`<span>${esc(x)}</span>`).join('');
 const sk=list(S.skills).filter(s=>!s.sp).map(s=>`<span>${esc(s.n)}</span>`).join('');
 const lg=list(S.langs).filter(s=>!s.sp).map(s=>s.n+(s.l?` (${s.l})`:'')).join(', ');
 const hb=list(S.hobbies).filter(s=>!s.sp).map(s=>s.n).join(', ');
 cv.innerHTML=`<div class="hd"><div><h1>${esc(S.name)||'Your name'}</h1>${S.role?`<div class="title">${esc(S.role)}</div>`:''}<div class="contact">${contact}</div></div>${S.photo?`<img class="photo" src="${S.photo}" alt="Profile photo">`:''}</div>`+
 sec('PROFILE',S.summary?`<p>${esc(S.summary)}</p>`:'')+
 sec('WORK EXPERIENCE',entries(S.exp))+
 sec('EDUCATION',entries(S.edu))+
 sec('SKILLS',sk?`<div class="skills">${sk}</div>`:'')+
 sec('LANGUAGES',lg?`<p>${esc(lg)}</p>`:'')+
 sec('HOBBIES AND INTERESTS',hb?`<p>${esc(hb)}</p>`:'')+
 sec('REFERENCES',S.refs?`<p>${esc(S.refs)}</p>`:'');
 save();
}
function fill(){
 F.forEach(k=>{$(k).value=S[k]||''});
 $('tpl').value=S.tpl||'';$('accent').value=S.accent||'#0f6b5c';
 items('exp');items('edu');render();
}
F.forEach(k=>$(k).addEventListener('input',e=>{S[k]=e.target.value;render()}));
$('tpl').addEventListener('change',e=>{S.tpl=e.target.value;if(S.tpl==='sidebar'&&S.accent==='#0f6b5c'){S.accent='#10287a';$('accent').value=S.accent}render()});
$('accent').addEventListener('input',e=>{S.accent=e.target.value;render()});
document.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.add;S[k].push({a:'',b:'',c:'',d:'',e:''});items(k)}));
$('clear').addEventListener('click',()=>showStart());
$('photo').addEventListener('change',e=>{
 const f=e.target.files[0];if(!f)return;
 const img=new Image(),u=URL.createObjectURL(f);
 img.onload=()=>{const n=Math.min(img.width,img.height),c=document.createElement('canvas');c.width=c.height=320;
  c.getContext('2d').drawImage(img,(img.width-n)/2,(img.height-n)/2,n,n,0,0,320,320);
  S.photo=c.toDataURL('image/jpeg',.85);URL.revokeObjectURL(u);render()};
 img.src=u;e.target.value=''});
$('phrm').addEventListener('click',()=>{S.photo='';render()});
$('print').addEventListener('click',()=>window.print());

/* Start screen, open and save */
let started=false;const st=$('start');
const err=m=>{$('st-err').textContent=m};
function showStart(){const d=load()||{};$('st-cont').hidden=!(started||d.name||d.summary||d.skills||(d.exp||[]).some(x=>x.a||x.b));err('');st.hidden=false;$('st-new').focus()}
function hideStart(){st.hidden=true;started=true}
function openFirst(){document.querySelectorAll('.sec').forEach((d,i)=>d.open=i===0)}
function clean(d){
 const o=newCV(),str=(v,n)=>typeof v==='string'?v.slice(0,n):'';
 F.forEach(k=>{if(typeof d[k]==='string')o[k]=d[k].slice(0,5000)});
 ['exp','edu'].forEach(k=>{if(Array.isArray(d[k])&&d[k].length)o[k]=d[k].slice(0,30).map(it=>{const r={};['a','b','c','d','e'].forEach(f=>r[f]=str(it&&it[f],5000));return r})});
 if(['','modern','classic','sidebar'].includes(d.tpl))o.tpl=d.tpl;
 if(/^#[0-9a-f]{6}$/i.test(d.accent||''))o.accent=d.accent;
 if(typeof d.photo==='string'&&d.photo.length<2e6&&/^data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+\/=]+$/.test(d.photo))o.photo=d.photo;
 return o;
}
/* ---- Save as PDF (the CV data is hidden inside, so the PDF can be opened again) ---- */
const PW=595.28,PH=841.89,INK='0.13 0.13 0.13',MUTE='0.35 0.35 0.35',LINE='0.84 0.84 0.84';
const rgb=h=>{const n=parseInt(String(h).slice(1),16)||0;return[n>>16&255,n>>8&255,n&255].map(v=>(v/255).toFixed(3)).join(' ')};
const CP={'–':150,'—':151,'‘':145,'’':146,'“':147,'”':148,'•':149,'…':133,'€':128};
const pe=s=>{let o='';for(const ch of String(s)){const c=ch.charCodeAt(0);if(c<32)continue;o+=String.fromCharCode(CP[ch]||(c<256?c:63))}return o.replace(/[\\()]/g,m=>'\\'+m)};
let _cx;
function mw(t,sz,b){try{_cx=_cx||document.createElement('canvas').getContext('2d');_cx.font=(b?'bold ':'')+sz+'px Arial, Helvetica, sans-serif';return _cx.measureText(t).width}catch(e){return String(t).length*sz*.5}}
function wrap(t,sz,b,w){
 const out=[];
 String(t).split('\n').forEach(par=>{let line='';
  par.split(/\s+/).filter(Boolean).forEach(word=>{
   const test=line?line+' '+word:word;
   if(mw(test,sz,b)<=w){line=test;return}
   if(line){out.push(line);line=''}
   while(word.length>1&&mw(word,sz,b)>w){let k=word.length;while(k>1&&mw(word.slice(0,k),sz,b)>w)k--;out.push(word.slice(0,k));word=word.slice(k)}
   line=word});
  out.push(line)});
 return out;
}
const notes=e=>{const bl=[];let cur=null;
 (e||'').split('\n').forEach(r=>{const t=r.trim();
  if(!t){if(bl.length&&bl[bl.length-1].k!=='s')bl.push({k:'s'});cur=null;return}
  const m=t.match(/^(?:[•*]\s*|-\s+)(.*)$/);
  if(m){cur={k:'li',l:[m[1]]};bl.push(cur)}else if(cur)cur.l.push(t);else{cur={k:'p',l:[t]};bl.push(cur)}});
 while(bl.length&&bl[bl.length-1].k==='s')bl.pop();return bl};
function makePDF(S){
 const pages=[[]],P=n=>{while(pages.length<=n)pages.push([]);return pages[n]};
 const side=S.tpl==='sidebar',acc=rgb(S.accent),M=40,BAN=side?96:0,BOT=40,SW=190;
 const f2=n=>(+n).toFixed(2);
 const room=(c,h)=>{if(c.y+h>PH-BOT){c.pg++;c.y=M}};
 const put=(c,t,o={})=>{const sz=o.sz||10,ld=o.ld||sz*1.4,dx=o.dx||0,x=c.x+dx,w=(o.w||c.w)-dx,f=o.b?'F2':o.i?'F3':'F1';
  for(const ln of wrap(t,sz,o.b,w)){room(c,ld);const tx=o.right?x+w-mw(ln,sz,o.b):x;
   P(c.pg).push(`BT /${f} ${sz} Tf ${o.col||INK} rg ${f2(tx)} ${f2(PH-c.y-sz*.9)} Td (${pe(ln)}) Tj ET`);c.y+=ld}};
 const rect=(pg,col,x,yt,w,h)=>P(pg).push(`${col} rg ${f2(x)} ${f2(PH-yt-h)} ${f2(w)} ${f2(h)} re f`);
 const dot=(pg,col,cx,yt,r)=>{const cy=PH-yt,k=.5523*r,q=a=>a.map(f2).join(' ');
  P(pg).push(`${col} rg ${q([cx+r,cy])} m ${q([cx+r,cy+k,cx+k,cy+r,cx,cy+r])} c ${q([cx-k,cy+r,cx-r,cy+k,cx-r,cy])} c ${q([cx-r,cy-k,cx-k,cy-r,cx,cy-r])} c ${q([cx+k,cy-r,cx+r,cy-k,cx+r,cy])} c f`)};
 const head=(c,t)=>{room(c,44);c.y+=8;put(c,side?t:t.toUpperCase(),{sz:side?14:11,b:1,col:acc,ld:side?18:15});rect(c.pg,LINE,c.x,c.y,c.w,.8);c.y+=7};
 const body=(c,e,dx=0)=>notes(e).forEach(b=>{
  if(b.k==='s'){c.y+=5;return}
  if(b.k==='p'){b.l.forEach(l=>put(c,l,{dx,sz:9.5}));return}
  b.l.forEach((l,i)=>{if(i===0){room(c,14);P(c.pg).push(`BT /F1 9.5 Tf ${INK} rg ${f2(c.x+dx+2)} ${f2(PH-c.y-9)} Td (${pe('•')}) Tj ET`)}put(c,l,{dx:dx+12,sz:9.5})})});
 const jpeg=S.photo&&/^data:image\/jpeg;base64,/.test(S.photo)?atob(S.photo.split(',')[1]):'';
 const img=(pg,x,yt,s)=>P(pg).push(`q ${f2(s)} 0 0 ${f2(s)} ${f2(x)} ${f2(PH-yt-s)} cm /Im1 Do Q`);
 const sk=list(S.skills),lg=list(S.langs),hb=list(S.hobbies);
 const links=(S.link||'').split('\n').map(x=>x.trim()).filter(Boolean);
 if(side){
  const bc={x:28,w:PW-56,y:22,pg:0};
  put(bc,S.name||'Your name',{sz:26,b:1,col:'1 1 1',ld:31});
  if(S.role)put(bc,S.role,{sz:14,col:'1 1 1'});
  const mc={x:28,w:PW-SW-44,pg:0,y:BAN+22},sc={x:PW-SW+16,w:SW-32,pg:0,y:BAN+16};
  if(jpeg){img(0,sc.x,sc.y,sc.w);sc.y+=sc.w+8}
  const row=(c,name,n,lv)=>{room(c,28);const y0=c.y,pg0=c.pg;put(c,name,{sz:9.5,w:c.w-(n?66:0)});
   if(n)for(let i=0;i<5;i++)dot(pg0,i<n?acc:'0.86 0.86 0.86',c.x+c.w-4.5-(4-i)*12,y0+6.5,4.3);
   if(lv)put(c,lv,{sz:8,right:1,col:MUTE});c.y+=3};
  const ct=[['Address',S.loc],['Phone',S.phone],['E-mail',S.email]].filter(x=>x[1]);
  if(ct.length){head(sc,'Contact');ct.forEach(x=>{put(sc,x[0],{sz:9,b:1});put(sc,x[1],{sz:9.5});sc.y+=3})}
  if(links.length){head(sc,'Links');links.forEach(l=>{put(sc,l,{sz:9.5});sc.y+=2})}
  if(sk.length){head(sc,'Skills');sk.forEach(s=>s.sp?sc.y+=7:row(sc,s.n,s.r))}
  if(lg.length){head(sc,'Languages');lg.forEach(s=>s.sp?sc.y+=7:row(sc,s.n,s.r,s.l))}
  const ent=(c,l)=>l.filter(x=>x.a||x.b).forEach(x=>{
   room(c,44);const d={x:c.x,w:68,pg:c.pg,y:c.y};
   put(d,[x.c,x.d].filter(Boolean).join(' – '),{sz:8.5,b:1,col:MUTE});
   put(c,x.a,{b:1,sz:11,dx:82});if(x.b)put(c,x.b,{i:1,sz:9.5,dx:82,col:MUTE});
   body(c,x.e,82);if(d.pg===c.pg&&d.y>c.y)c.y=d.y;c.y+=8});
  if(S.summary)put(mc,S.summary,{sz:10});
  if(S.edu.some(x=>x.a||x.b)){head(mc,'Education');ent(mc,S.edu)}
  if(hb.length){head(mc,'Hobbies and interests');hb.forEach(h=>h.sp?mc.y+=6:put(mc,h.n,{dx:82,sz:9.5,ld:16}))}
  if(S.exp.some(x=>x.a||x.b)){head(mc,'Experience');ent(mc,S.exp)}
  if(S.refs){head(mc,'References');put(mc,S.refs,{sz:9.5})}
  pages.forEach((_,i)=>{rect(i,'0.953 0.953 0.953',PW-SW,i?0:BAN,SW,PH-(i?0:BAN))});
  pages[0].unshift(`${acc} rg 0 ${f2(PH-BAN)} ${f2(PW)} ${BAN} re f`);
  // sidebar rectangles must sit under the text: move them to the front
  pages.forEach(p=>{const i=p.findIndex(o=>o.startsWith('0.953 0.953 0.953 rg'));if(i>0)p.unshift(p.splice(i,1)[0])});
 }else{
  const hasPh=!!jpeg,hc={x:M,w:PW-2*M-(hasPh?95:0),pg:0,y:M},c={x:M,w:PW-2*M,pg:0,y:M};
  put(hc,S.name||'Your name',{sz:24,b:1,col:acc,ld:28});
  if(S.role)put(hc,S.role,{sz:12.5});
  const ctt=[S.email,S.phone,S.loc].concat(links).filter(Boolean).join('   |   ');
  if(ctt)put(hc,ctt,{sz:9.5,col:MUTE});
  if(hasPh)img(0,PW-M-80,M,80);
  c.y=Math.max(hc.y,hasPh?M+86:0)+4;
  const ent=l=>l.filter(x=>x.a||x.b).forEach(x=>{
   room(c,40);const d={x:c.x,w:c.w,pg:c.pg,y:c.y};
   put(d,[x.c,x.d].filter(Boolean).join(' – '),{sz:9,right:1,col:MUTE});
   put(c,x.a,{b:1,sz:11,w:c.w-120});if(x.b)put(c,x.b,{i:1,sz:9.5,col:MUTE});
   body(c,x.e);c.y+=7});
  if(S.summary){head(c,'Profile');put(c,S.summary,{sz:10})}
  if(S.exp.some(x=>x.a||x.b)){head(c,'Work experience');ent(S.exp)}
  if(S.edu.some(x=>x.a||x.b)){head(c,'Education');ent(S.edu)}
  const names=a=>a.filter(s=>!s.sp);
  if(names(sk).length){head(c,'Skills');put(c,names(sk).map(s=>s.n).join(', '),{sz:10})}
  if(names(lg).length){head(c,'Languages');put(c,names(lg).map(s=>s.n+(s.l?' ('+s.l+')':'')).join(', '),{sz:10})}
  if(names(hb).length){head(c,'Hobbies and interests');put(c,names(hb).map(s=>s.n).join(', '),{sz:10})}
  if(S.refs){head(c,'References');put(c,S.refs,{sz:10})}
 }
 let out='%PDF-1.4\n%\u00e2\u00e3\u00cf\u00d3\n';const off=[];
 const obj=(n,b)=>{off[n]=out.length;out+=n+' 0 obj\n'+b+'\nendobj\n'};
 const data='CVBDATA['+btoa(unescape(encodeURIComponent(JSON.stringify(S))))+']CVBDATA';
 obj(1,'<< /Type /Catalog /Pages 2 0 R /CVBuilder 6 0 R >>');
 obj(2,'<< /Type /Pages /Kids ['+pages.map((_,i)=>(8+2*i)+' 0 R').join(' ')+'] /Count '+pages.length+' >>');
 ['Helvetica','Helvetica-Bold','Helvetica-Oblique'].forEach((f,i)=>obj(3+i,'<< /Type /Font /Subtype /Type1 /BaseFont /'+f+' /Encoding /WinAnsiEncoding >>'));
 obj(6,'<< /Length '+data.length+' >>\nstream\n'+data+'\nendstream');
 if(jpeg)obj(7,'<< /Type /XObject /Subtype /Image /Width 320 /Height 320 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+jpeg.length+' >>\nstream\n'+jpeg+'\nendstream');else obj(7,'null');
 pages.forEach((ops,i)=>{const s=ops.join('\n');
  obj(8+2*i,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 '+PW+' '+PH+'] /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> /XObject << /Im1 7 0 R >> >> /Contents '+(9+2*i)+' 0 R >>');
  obj(9+2*i,'<< /Length '+s.length+' >>\nstream\n'+s+'\nendstream')});
 const n=8+2*pages.length,xr=out.length;
 out+='xref\n0 '+n+'\n0000000000 65535 f \n';
 for(let k=1;k<n;k++)out+=String(off[k]).padStart(10,'0')+' 00000 n \n';
 out+='trailer\n<< /Size '+n+' /Root 1 0 R >>\nstartxref\n'+xr+'\n%%EOF';
 const u=new Uint8Array(out.length);for(let i=0;i<out.length;i++)u[i]=out.charCodeAt(i)&255;
 return u;
}
const bin=u=>{let s='';for(let i=0;i<u.length;i+=8192)s+=String.fromCharCode.apply(null,u.subarray(i,i+8192));return s};
const PDFERR='This PDF was not saved from this builder, so it cannot be opened for editing. Only PDFs made with "Save CV (PDF)" can be uploaded.';
function importFile(f){
 if(!f)return;
 if(f.size>12e6){err('That file is too big.');return}
 const rd=new FileReader();
 rd.onload=()=>{try{
  const s=bin(new Uint8Array(rd.result));let txt;
  if(s.slice(0,5)==='%PDF-'){
   const a=s.indexOf('CVBDATA['),b=s.indexOf(']CVBDATA',a);
   if(a<0||b<0){err(PDFERR);return}
   txt=decodeURIComponent(escape(atob(s.slice(a+8,b))));
  }else txt=decodeURIComponent(escape(s));
  const o=JSON.parse(txt),d=o&&o.data&&typeof o.data==='object'?o.data:o;
  if(!d||typeof d!=='object'||Array.isArray(d)||!('name' in d||'exp' in d||'summary' in d))throw 0;
  S=clean(d);fill();openFirst();hideStart();
 }catch(e){err('That file could not be opened. Please choose a PDF made with "Save CV (PDF)".')}};
 rd.onerror=()=>err('Could not read that file.');
 rd.readAsArrayBuffer(f);
}
function saveFile(){
 const blob=new Blob([makePDF(S)],{type:'application/pdf'});
 const a=document.createElement('a');
 a.href=URL.createObjectURL(blob);
 a.download=((S.name||'my').replace(/[^\w\- ]+/g,'').trim().replace(/\s+/g,'-')||'my')+'-cv.pdf';
 document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
$('st-new').addEventListener('click',()=>{S=newCV();fill();openFirst();hideStart()});
$('st-ex').addEventListener('click',()=>{S=clean(sample);fill();openFirst();hideStart()});
$('st-cont').addEventListener('click',hideStart);
$('st-file').addEventListener('change',e=>{importFile(e.target.files[0]);e.target.value=''});
$('savef').addEventListener('click',saveFile);
$('xall').addEventListener('click',()=>document.querySelectorAll('.sec').forEach(d=>d.open=true));
$('call').addEventListener('click',()=>document.querySelectorAll('.sec').forEach(d=>d.open=false));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&started&&!st.hidden)hideStart()});
fill();
showStart();
