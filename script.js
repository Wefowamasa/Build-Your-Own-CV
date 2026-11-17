const $=id=>document.getElementById(id);
const F=['name','role','email','phone','loc','link','summary','skills','langs','hobbies','refs'];
const blank={exp:[{a:'',b:'',c:'',d:'',e:''}],edu:[{a:'',b:'',c:'',d:'',e:''}]};
const sample={name:'Thandi Mokoena',role:'Administrative Assistant',email:'thandi@example.com',phone:'082 000 0000',loc:'Benoni, Gauteng',link:'linkedin.com/in/thandi-mokoena',
summary:'Organised and reliable assistant with three years of office experience. Quick to learn and comfortable with deadlines.',
skills:'Customer service | 4, MS Office | 4, Data capture | 3, Filing | 5',langs:'English | 5 | Fluent, Zulu | 5 | Home language, Afrikaans | 3 | Intermediate',hobbies:'Reading, Netball, Volunteering',refs:'Available on request',
exp:[{a:'Office Assistant',b:'ABC Trading, Benoni',c:'2022-01',d:'Present',e:'- Answered phones and emails for a busy office, passing messages on\nthe same day.\n- Captured invoices and kept records up to date'}],
edu:[{a:'National Senior Certificate',b:'Benoni High School',c:'2017',d:'2021',e:'Distinction in Business Studies'}],tpl:'sidebar',accent:'#10287a'};
let S=Object.assign({hobbies:'',photo:'',tpl:'',accent:'#0f6b5c'},load()||JSON.parse(JSON.stringify(sample)));
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
$('clear').addEventListener('click',()=>{if(confirm('Clear everything and start with an empty CV?')){S={...JSON.parse(JSON.stringify(blank)),tpl:S.tpl,accent:S.accent,photo:''};F.forEach(k=>S[k]='');fill()}});
$('photo').addEventListener('change',e=>{
 const f=e.target.files[0];if(!f)return;
 const img=new Image(),u=URL.createObjectURL(f);
 img.onload=()=>{const n=Math.min(img.width,img.height),c=document.createElement('canvas');c.width=c.height=320;
  c.getContext('2d').drawImage(img,(img.width-n)/2,(img.height-n)/2,n,n,0,0,320,320);
  S.photo=c.toDataURL('image/jpeg',.85);URL.revokeObjectURL(u);render()};
 img.src=u;e.target.value=''});
$('phrm').addEventListener('click',()=>{S.photo='';render()});
$('print').addEventListener('click',()=>window.print());
fill();
