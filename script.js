const $=id=>document.getElementById(id);
const F=['name','role','email','phone','loc','link','summary','skills','langs','refs'];
const blank={exp:[{a:'',b:'',c:'',d:'',e:''}],edu:[{a:'',b:'',c:'',d:'',e:''}]};
const sample={name:'Thandi Mokoena',role:'Administrative Assistant',email:'thandi@example.com',phone:'082 000 0000',loc:'Benoni, Gauteng',link:'',
summary:'Organised and reliable assistant with three years of office experience. Quick to learn and comfortable with deadlines.',
skills:'MS Office, Filing, Customer service, Data capture',langs:'English (fluent), Zulu (home language)',refs:'Available on request',
exp:[{a:'Office Assistant',b:'ABC Trading',c:'Jan 2022',d:'Present',e:'Answered phones and emails\nCaptured invoices and kept records up to date'}],
edu:[{a:'National Senior Certificate',b:'Benoni High School',c:'2017',d:'2021',e:''}],tpl:'',accent:'#0f6b5c'};
let S=load()||JSON.parse(JSON.stringify(sample));
function load(){try{const v=localStorage.getItem('cv-data');return v?JSON.parse(v):null}catch(e){return null}}
function save(){try{localStorage.setItem('cv-data',JSON.stringify(S))}catch(e){}}
const esc=s=>String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function items(key){
 const box=$(key);box.innerHTML='';
 const L=key==='exp'?['Job title','Employer','Start','End','What you did']:['Qualification','School / college','Start','End','Notes (optional)'];
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
function entries(list){
 return list.filter(x=>x.a||x.b).map(x=>`<div class="e"><div class="eh"><span>${esc(x.a)}</span><span>${esc([x.c,x.d].filter(Boolean).join(' – '))}</span></div>${x.b?`<div class="sub">${esc(x.b)}</div>`:''}${x.e?`<p>${esc(x.e)}</p>`:''}</div>`).join('');
}
function sec(t,h){return h?`<h3>${t}</h3>${h}`:''}
function render(){
 const cv=$('cv');cv.className=S.tpl||'';cv.style.setProperty('--accent',S.accent);
 const contact=[S.email,S.phone,S.loc,S.link].filter(Boolean).map(x=>`<span>${esc(x)}</span>`).join('');
 const sk=S.skills.split(',').map(s=>s.trim()).filter(Boolean).map(s=>`<span>${esc(s)}</span>`).join('');
 $('phimg').hidden=$('phrm').hidden=!S.photo;if(S.photo)$('phimg').src=S.photo;
 cv.innerHTML=`<div class="hd"><div><h1>${esc(S.name)||'Your name'}</h1>${S.role?`<div class="title">${esc(S.role)}</div>`:''}<div class="contact">${contact}</div></div>${S.photo?`<img class="photo" src="${S.photo}" alt="Profile photo">`:''}</div>`+
 sec('PROFILE',S.summary?`<p>${esc(S.summary)}</p>`:'')+
 sec('WORK EXPERIENCE',entries(S.exp))+
 sec('EDUCATION',entries(S.edu))+
 sec('SKILLS',sk?`<div class="skills">${sk}</div>`:'')+
 sec('LANGUAGES',S.langs?`<p>${esc(S.langs)}</p>`:'')+
 sec('REFERENCES',S.refs?`<p>${esc(S.refs)}</p>`:'');
 save();
}
function fill(){
 F.forEach(k=>{$(k).value=S[k]||''});
 $('tpl').value=S.tpl||'';$('accent').value=S.accent||'#0f6b5c';
 items('exp');items('edu');render();
}
F.forEach(k=>$(k).addEventListener('input',e=>{S[k]=e.target.value;render()}));
$('tpl').addEventListener('change',e=>{S.tpl=e.target.value;render()});
$('accent').addEventListener('input',e=>{S.accent=e.target.value;render()});
document.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.add;S[k].push({a:'',b:'',c:'',d:'',e:''});items(k)}));
$('clear').addEventListener('click',()=>{if(confirm('Clear everything and start with an empty CV?')){S={...JSON.parse(JSON.stringify(blank)),tpl:'',accent:'#0f6b5c',photo:''};F.forEach(k=>S[k]='');fill()}});
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
