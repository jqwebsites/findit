const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const EMAIL_DOMAIN='@hcpsmshs.edu.ph';
const LOCS=['Main Building 3rd Floor','Science Lab','Gymnasium','Canteen','Library','Prefect Office','Quadrangle','Parking Area'];
const CATS=['Electronics','Identification/Cards','School Uniforms','Books','Accessories','Others'];
const EM={Electronics:'📱','Identification/Cards':'🪪','School Uniforms':'🧥',Books:'📘',Accessories:'⌚',Others:'📦'};
const H=[210,150,30,280,340,190,60,100];
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}};
let ITEMS=ld('findit.items',[]),SURV=ld('findit.surveys',[]);
const save=()=>{try{localStorage.setItem('findit.items',JSON.stringify(ITEMS));localStorage.setItem('findit.surveys',JSON.stringify(SURV));return 1}catch(e){toast('Storage full. Try fewer or smaller photos.');return 0}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const bg=i=>i.p&&i.p[0]?`background:url(${i.p[0]}) center/cover`:`background:linear-gradient(135deg,hsl(${H[i.id%8]} 80% 88%),hsl(${H[i.id%8]} 70% 76%))`;
const card=i=>`<a class="card item" href="item-detail.html?id=${i.id}"><div class="ph" style="${bg(i)}">${i.p&&i.p[0]?'':i.e}</div><div class="bd"><span class="badge ${i.b.split(' ')[0]}">${i.b}</span><h3>${esc(i.t)}</h3><p>${i.loc} · ${fmt(i.date)}</p></div></a>`;
const empty=(m,l)=>`<div class="card" style="text-align:center;grid-column:1/-1"><p class="mu">${m}</p>${l?'<br><a class="btn" href="report-item.html">Report an item</a>':''}</div>`;
const fmt=d=>{const[y,m,x]=String(d).split('-');return x?`${x}/${m}/${y.slice(2)}`:d};
const hs=s=>{let a=3735928559,b=1103547991;for(const c of s){const k=c.charCodeAt(0);a=Math.imul(a^k,2654435761);b=Math.imul(b^k,1597334677)}a=Math.imul(a^a>>>16,2246822507)^Math.imul(b^b>>>13,3266489909);b=Math.imul(b^b>>>16,2246822507)^Math.imul(a^a>>>13,3266489909);return(4294967296*(2097151&b)+(a>>>0)).toString(36)};
const score=(l,f)=>{const u=new Set([...l.tags,...f.tags]),n=l.tags.filter(t=>f.tags.includes(t)).length;return Math.round(60*n/(u.size||1)+25*(l.loc==f.loc)+15*(l.cat==f.cat))};
const mfor=i=>ITEMS.filter(x=>x.type!=i.type&&x.st!='Resolved'&&x.id!=i.id).map(x=>[x,i.type=='lost'?score(i,x):score(x,i)]).filter(m=>m[1]>=30).sort((a,b)=>b[1]-a[1]).slice(0,3);
const mhtml=ms=>ms.length?`<div class="card" style="margin:16px 0;padding:16px;text-align:left"><b>Possible matches</b>${ms.map(([x,s])=>`<a href="item-detail.html?id=${x.id}" class="row" style="justify-content:space-between;margin-top:8px"><span>${x.e} ${esc(x.t)}</span><b>${s}%</b></a>`).join('')}</div>`:'';
function toast(m){let t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';document.body.append(t)}t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2600)}
function gate(go){
 const g=$('#gate'),has=localStorage.getItem('findit.pw'),pass=()=>{g.remove();$('#adm').hidden=false;go()};
 if(sessionStorage.getItem('findit.auth'))return pass();
 g.innerHTML=`<div class="card" style="max-width:380px;margin:60px auto;text-align:center"><h2 style="margin-top:0">${has?'Admin sign in':'Set admin password'}</h2><p class="mu">${has?'Enter the admin password.':'First visit. Choose a password (6+ characters).'}</p><br><input type="password" id="pw" placeholder="Password"><p id="ge" style="color:#ff3b30;font-size:.85rem;margin:8px 0"></p><button class="btn" id="gb" style="width:100%">${has?'Sign in':'Save and continue'}</button></div>`;
 const sub=()=>{const v=$('#pw').value;if(has){if(hs(v)!=has)return $('#ge').textContent='Wrong password.'}else{if(v.length<6)return $('#ge').textContent='Use at least 6 characters.';localStorage.setItem('findit.pw',hs(v))}sessionStorage.setItem('findit.auth','1');pass()};
 $('#gb').onclick=sub;$('#pw').addEventListener('keydown',e=>{if(e.key=='Enter')sub()});
}
function shell(){
 const p=location.pathname.split('/').pop()||'index.html';
 const L=[['index.html','Home'],['report-item.html','Report'],['browse.html','Browse']];
 $('#nav').outerHTML=`<nav><div class="in"><a class="logo" href="index.html"><i>⌕</i>FindIt</a>${L.map(([h,n])=>`<a class="l ${h==p?'on':''}" href="${h}">${n}</a>`).join('')}<button class="btn g sm" id="th" aria-label="Toggle theme">◐</button></div></nav>`;
 $('#foot').outerHTML=`<footer><a href="admin.html" style="color:inherit">FindIt</a> · Digital Lost and Found Management System for HCPSMSHS<br>Research prototype · data is saved in this browser</footer>`;
 document.body.insertAdjacentHTML('beforeend',`<div class="tabs">${L.map(([h,n],k)=>`<a class="${h==p?'on':''}" href="${h}"><b><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${[`<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>`,`<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>`,`<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>`][k]}</svg></b>${n}</a>`).join('')}</div>`);
 const sv=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.dataset.theme=sv;
 $('#th').onclick=()=>{const n=document.documentElement.dataset.theme=='dark'?'light':'dark';document.documentElement.dataset.theme=n;localStorage.setItem('theme',n)};
}
const pages={
index(){
 const f=ITEMS.filter(i=>i.type=='found');
 const S=[[f.length,'Total items found'],[ITEMS.filter(i=>i.st=='Resolved').length,'Items claimed'],[ITEMS.filter(i=>i.st=='Under Review').length,'Pending verification'],[ITEMS.filter(i=>i.b=='Matched').length,'Recent matches']];
 $('#stats').innerHTML=S.map(([n,l])=>`<div class="card stat"><b>${n}</b><span>${l}</span></div>`).join('');
 $('#recent').innerHTML=[...ITEMS].reverse().slice(0,6).map(card).join('')||empty('Nothing has been reported yet.',1);
},
report(){
 let n=0,type='lost',loc='',photos=[];const S=$$('.step'),D=$('#dots'),v=id=>$('#'+id).value.trim();
 D.innerHTML=S.map(()=>'<i></i>').join('');
 const show=()=>{S.forEach((s,i)=>s.classList.toggle('on',i==n));$$('i',D).forEach((d,i)=>d.classList.toggle('on',i<=n));$('#back').style.visibility=n?'visible':'hidden';$('#next').textContent=n==S.length-1?'Submit report':'Continue'};
 $$('#type button').forEach(b=>b.onclick=()=>{type=b.dataset.t;$$('#type button').forEach(x=>x.classList.toggle('on',x==b));$('#ttl').textContent=type=='lost'?'Describe what you lost':'Describe what you found';$('#fq').style.display=type=='found'?'block':'none'});
 $('#cat').innerHTML='<option value="">Choose a category</option>'+CATS.map(c=>`<option>${c}</option>`).join('');
 $('#map').innerHTML=LOCS.map(l=>`<button type="button">${l}</button>`).join('');
 $$('#map button').forEach(b=>b.onclick=()=>{loc=b.textContent;$$('#map button').forEach(x=>x.classList.toggle('on',x==b))});
 const now=new Date();now.setMinutes(now.getMinutes()-now.getTimezoneOffset());$('#when').value=now.toISOString().slice(0,16);
 const dz=$('#drop'),fi=$('#file');
 const files=fl=>[...fl].filter(f=>f.type.startsWith('image/')).forEach(f=>{if(photos.length>=3)return toast('Up to 3 photos');const im=new Image();im.onload=()=>{const s=Math.min(1,640/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*s;c.height=im.height*s;c.getContext('2d').drawImage(im,0,0,c.width,c.height);const u=c.toDataURL('image/jpeg',.7);photos.push(u);const t=new Image();t.src=u;$('#prev').append(t)};im.src=URL.createObjectURL(f)});
 dz.onclick=()=>fi.click();fi.onchange=()=>files(fi.files);
 dz.ondragover=e=>{e.preventDefault();dz.classList.add('hv')};dz.ondragleave=()=>dz.classList.remove('hv');
 dz.ondrop=e=>{e.preventDefault();dz.classList.remove('hv');files(e.dataTransfer.files)};
 const ok=()=>{if(n==0){if(!v('name'))return toast('Enter an item name'),0;if(!$('#cat').value)return toast('Choose a category first'),0;if(type=='found'&&(!v('q')||!v('a')))return toast('Add a verification question and answer'),0}
  if(n==1&&!loc)return toast('Tap a location on the map'),0;
  if(n==3&&!v('email').toLowerCase().endsWith(EMAIL_DOMAIN))return toast('Use your '+EMAIL_DOMAIN+' email'),0;return 1};
 $('#next').onclick=()=>{if(!ok())return;if(n<S.length-1){n++;show();return}
  const c=$('#cat').value,it={id:Date.now(),ts:Date.now(),t:(type=='lost'?'Lost: ':'')+v('name'),cat:c,type,loc,date:$('#when').value.slice(0,10),st:'Unclaimed',b:'Recently Reported',e:EM[c],tags:[...new Set((v('name')+' '+v('brand')).toLowerCase().split(/\W+/).filter(w=>w.length>2))],d:v('desc')||'No description.',brand:v('brand'),serial:v('serial'),q:type=='found'?v('q'):'',a:type=='found'?v('a').toLowerCase():'',email:v('email'),p:photos};
  ITEMS.push(it);if(!save()){ITEMS.pop();return}
  $('#wiz').innerHTML=`<div style="text-align:center;padding:30px"><div style="font-size:4rem">✅</div><h2>Report submitted</h2><p class="mu">Reference <b>FI-${String(it.id).slice(-5)}</b>. It now appears in the catalog.</p>${mhtml(mfor(it))}<a class="btn" href="item-detail.html?id=${it.id}">View your report</a></div>`};
 $('#back').onclick=()=>{n--;show()};show();
},
browse(){
 let cat='All',st='All',q='',loc='',from='',view='grid';
 const hit=i=>{const h=(i.t+' '+i.d+' '+i.tags.join(' ')+' '+i.loc+' '+i.cat+' '+fmt(i.date)+' '+fmt(i.date).replace(/\//g,'')).toLowerCase();return q.split(/\s+/).filter(Boolean).every(t=>h.includes(t)||h.includes(t.replace(/[\/.\-]/g,'')))};
 const cs=$('#cats');cs.innerHTML=['All',...CATS].map(c=>`<button class="${c==cat?'on':''}">${c}</button>`).join('');
 $('#loc').innerHTML='<option value="">All locations</option>'+LOCS.map(l=>`<option>${l}</option>`).join('');
 const seg=(el,fn)=>$$('button',el).forEach(b=>b.onclick=()=>{$$('button',el).forEach(x=>x.classList.toggle('on',x==b));fn(b)});
 const go=()=>{const r=ITEMS.filter(i=>(cat=='All'||i.cat==cat)&&(st=='All'||i.st==st)&&(!loc||i.loc==loc)&&(!from||i.date>=from)&&hit(i));
  $('#res').className='grid '+view;$('#res').innerHTML=r.map(card).join('')||(ITEMS.length?empty('No items match. Try clearing a filter.'):empty('No items have been reported yet.',1));$('#cnt').textContent=r.length+' items'};
 seg(cs,b=>{cat=b.textContent;go()});seg($('#st'),b=>{st=b.textContent;go()});seg($('#vw'),b=>{view=b.dataset.v;go()});
 $('#q').addEventListener('input',e=>{q=e.target.value.toLowerCase().trim();go()});$('#loc').onchange=e=>{loc=e.target.value;go()};$('#from').addEventListener('input',e=>{const d=e.target.value.replace(/\D/g,'');from=d.length==6?`20${d.slice(4)}-${d.slice(2,4)}-${d.slice(0,2)}`:'';go()});go();
},
detail(){
 const i=ITEMS.find(x=>x.id==new URLSearchParams(location.search).get('id'));let g=0,tries=0;
 if(!i){$('main').innerHTML='<div class="card" style="text-align:center"><h2 style="margin-top:0">Item not found</h2><p class="mu">It may have been archived.</p><br><a class="btn" href="browse.html">Browse items</a></div>';return}
 const sl=i.p&&i.p.length?i.p:[null],gal=$('#gal');
 gal.innerHTML=`<span></span><button style="left:14px" aria-label="Previous">‹</button><button style="right:14px" aria-label="Next">›</button>`;
 const draw=()=>{gal.style.cssText=sl[g]?`background:url(${sl[g]}) center/cover`:bg(i);gal.firstElementChild.textContent=sl[g]?'':i.e;$('#gd').innerHTML=sl.length>1?sl.map((_,k)=>`<i class="${k==g?'on':''}"></i>`).join(''):''};
 const [pv,nx]=$$('#gal button');if(sl.length<2)pv.hidden=nx.hidden=true;
 pv.onclick=()=>{g=(g+sl.length-1)%sl.length;draw()};nx.onclick=()=>{g=(g+1)%sl.length;draw()};draw();
 $('#info').innerHTML=`<span class="badge ${i.b.split(' ')[0]}">${i.b}</span><h1 style="font-size:2.2rem">${esc(i.t)}</h1><dl><dt>Date</dt><dd>${fmt(i.date)}</dd><dt>Location</dt><dd>${i.loc}</dd><dt>Category</dt><dd>${i.cat}</dd><dt>Status</dt><dd>${i.st}</dd><dt>Description</dt><dd>${esc(i.d)}</dd></dl>`+mhtml(mfor(i));
 const dl=$('#dlg'),bd=$('#dbody'),qr=c=>window.QRCode&&new QRCode($('#qr'),{text:c,width:180,height:180});
 if(i.type!='found'||i.st!='Unclaimed'||!i.q){$('#claim').disabled=true;$('#claim').textContent=i.type=='lost'?'Lost report — no claim needed':i.st=='Resolved'?'Already returned':i.st=='Under Review'?'Claim in review':'Claim unavailable'}
 if(i.appt&&i.st=='Under Review'){$('#claim').insertAdjacentHTML('afterend','<button class="btn g" id="pq" style="margin-left:8px">Show pickup QR</button>');$('#pq').onclick=()=>{bd.innerHTML=`<h2 style="margin:0 0 8px">Pickup QR</h2><p class="mu">Show this at the Prefect Office.</p><div id="qr"></div><button class="btn g" style="width:100%" onclick="dlg.close()">Close</button>`;dl.showModal();qr(i.appt)}}
 $('#claim').onclick=()=>{tries=0;bd.innerHTML=`<h2 style="margin:0 0 8px">Verify ownership</h2><p class="mu">Answer this question only the owner would know. 3 attempts.</p><label>${esc(i.q)}</label><input id="ans" autocomplete="off"><p id="er" style="color:#ff3b30;font-size:.85rem;margin-top:8px"></p><div class="row" style="margin-top:16px"><button class="btn" id="sub">Verify</button><button class="btn g" onclick="dlg.close()">Cancel</button></div>`;dl.showModal();
  $('#sub').onclick=()=>{if($('#ans').value.trim().toLowerCase().includes(i.a)){slots()}else{tries++;$('#er').textContent=tries>=3?'Too many attempts. Visit the Prefect Office for manual verification.':`Answer doesn't match. ${3-tries} attempt(s) left.`;if(tries>=3)$('#sub').disabled=true}}};
 function slots(){bd.innerHTML=`<h2 style="margin:0 0 8px">Verified ✓</h2><p class="mu">Pick a pick-up slot at the Prefect Office.</p><label>Date</label><input type="date" id="sd" value="${new Date(Date.now()+864e5).toISOString().slice(0,10)}"><label>Time</label><select id="stm"><option>8:00 AM</option><option>12:00 PM</option><option>3:30 PM</option></select><div class="row" style="margin-top:16px"><button class="btn" id="cf">Confirm appointment</button></div>`;
  $('#cf').onclick=()=>{const tok=Math.random().toString(36).slice(2,10),code=`FINDIT|${i.id}|${$('#sd').value}|${$('#stm').value}|${tok}`;i.tok=tok;i.st='Under Review';i.b='Matched';i.appt=code;save();
   bd.innerHTML=`<h2 style="margin:0 0 8px">Appointment set</h2><p class="mu">Show this QR at the Prefect Office. Staff scan it to confirm your claim was approved.</p><div id="qr"></div><button class="btn g" style="width:100%;margin-top:12px" onclick="location.reload()">Done</button>`;qr(code)}}
},
adminInit(){
 const rows=()=>{$('#tb').innerHTML=ITEMS.map(i=>`<tr><td>#${String(i.id).slice(-5)}</td><td>${i.e} ${esc(i.t)}</td><td>${i.type}</td><td>${i.loc}</td><td><span class="badge ${i.st=='Resolved'?'Resolved':''}">${i.st}</span></td><td><div class="row"><button class="btn sm" data-a="Approve" data-i="${i.id}">Approve</button><button class="btn sm r" data-a="Reject" data-i="${i.id}">Reject</button><button class="btn sm g" data-a="Handed" data-i="${i.id}">Handed over</button><button class="btn sm g" data-a="Archive" data-i="${i.id}">Archive</button></div></td></tr>`).join('')||'<tr><td colspan="6" class="mu">No items reported yet.</td></tr>'};
 $('#tb').onclick=e=>{const b=e.target.closest('button');if(!b)return;const it=ITEMS.find(x=>x.id==b.dataset.i),a=b.dataset.a;
  if(a=='Archive')ITEMS=ITEMS.filter(x=>x!=it);else{it.st={Approve:'Under Review',Reject:'Unclaimed',Handed:'Resolved'}[a];it.b=a=='Handed'?'Claimed':a=='Reject'?'Recently Reported':'Matched';if(a=='Handed')it.rt=Date.now()}
  save();rows();match();stats();toast({Approve:'Claim approved',Reject:'Claim rejected',Handed:'Marked as handed over',Archive:'Item archived'}[a])};
 const match=()=>{const L=ITEMS.filter(i=>i.type=='lost'),F=ITEMS.filter(i=>i.type=='found'),out=[];
  L.forEach(l=>F.forEach(f=>{const s=score(l,f);if(s>=30)out.push([l,f,s])}));
  out.sort((a,b)=>b[2]-a[2]);$('#match').innerHTML=out.map(([l,f,s])=>`<div style="margin-bottom:14px"><div class="row" style="justify-content:space-between"><span>${l.e} ${esc(l.t)} ↔ ${esc(f.t)}</span><b>${s}%</b></div><div class="bar" style="margin:6px 0 0"><b style="width:${s}%;background:${s>70?'var(--ok)':s>50?'var(--ac)':'var(--wa)'}"></b></div></div>`).join('')||'<p class="mu">No likely matches yet. Matches appear when a lost and a found report share tags or a location.</p>'};
 const avg=k=>SURV.length?(SURV.reduce((s,r)=>s+r[k],0)/SURV.length):0;
 const stats=()=>{const f=ITEMS.filter(i=>i.type=='found'),r=f.filter(i=>i.st=='Resolved'),t=r.filter(i=>i.rt);
  $('#rr').textContent=f.length?Math.round(100*r.length/f.length)+'%':'—';
  $('#at').textContent=t.length?(t.reduce((s,i)=>s+i.rt-i.ts,0)/t.length/864e5).toFixed(1)+' days':'—';
  const M=[];for(let k=5;k>=0;k--){const d=new Date();d.setDate(1);d.setMonth(d.getMonth()-k);const m=f.filter(i=>{const x=new Date(i.ts);return x.getMonth()==d.getMonth()&&x.getFullYear()==d.getFullYear()});M.push([d.toLocaleString('en',{month:'short'}),m.length?Math.round(100*m.filter(i=>i.st=='Resolved').length/m.length):0])}
  $('#rec').innerHTML=M.map(([m,v])=>`<div style="height:${Math.max(v*1.5,4)}px"><span>${v}%</span><small>${m}</small></div>`).join('');
  $('#iso').innerHTML=(SURV.length?'':'<p class="mu">No responses yet. Add one below.</p>')+['Usability','Efficiency','Reliability'].map((k,j)=>`<div class="row" style="justify-content:space-between"><span>${k}</span><b>${SURV.length?avg(j).toFixed(1):'—'} / 5</b></div><div class="bar"><b style="width:${avg(j)*20}%"></b></div>`).join('')+`<p class="mu" style="font-size:.8rem">${SURV.length} response(s)</p>`};
 $('#sf').innerHTML=['Usability','Efficiency','Reliability'].map(k=>`<div><label>${k}</label><select>${[5,4,3,2,1].map(n=>`<option>${n}</option>`).join('')}</select></div>`).join('');
 $('#sb').onclick=()=>{SURV.push($$('#sf select').map(s=>+s.value));if(save()){stats();toast('Response saved')}};
 $('#clr').onclick=()=>{if(confirm('Delete all items and survey responses from this browser?')){ITEMS=[];SURV=[];save();location.reload()}};
 const verify=t=>{const [k,id,d,tm,tok]=t.trim().split('|'),it=ITEMS.find(x=>x.id==id),r=$('#vres');
  if(k!='FINDIT'||!it||!tok||it.tok!=tok)return r.innerHTML='<div class="card" style="border-color:#ff3b30"><b style="color:#ff3b30">✗ Invalid code</b><p class="mu">This code does not match any approved claim.</p></div>';
  if(it.st=='Resolved')return r.innerHTML='<div class="card"><b style="color:var(--wa)">Already handed over</b></div>';
  r.innerHTML=`<div class="card" style="border-color:var(--ok)"><b style="color:var(--ok)">✓ Valid claim</b><p>${it.e} ${esc(it.t)}<br><span class="mu">Appointment ${fmt(d)} · ${tm}</span></p><br><button class="btn sm" id="ho">Mark as handed over</button></div>`;
  $('#ho').onclick=()=>{it.st='Resolved';it.b='Claimed';it.rt=Date.now();save();rows();match();stats();r.innerHTML='<div class="card"><b style="color:var(--ok)">Handed over ✓</b></div>'}};
 $('#chk').onclick=()=>verify($('#code').value);
 $('#scan').onclick=async()=>{const v=$('#vid');let st;try{st=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}})}catch(e){return toast('Camera unavailable (needs https). Paste the code instead.')}
  v.srcObject=st;v.hidden=false;await v.play();const c=document.createElement('canvas'),x=c.getContext('2d',{willReadFrequently:true});
  const tick=()=>{if(v.readyState>=2&&window.jsQR){c.width=v.videoWidth;c.height=v.videoHeight;x.drawImage(v,0,0);const r=jsQR(x.getImageData(0,0,c.width,c.height).data,c.width,c.height);if(r){st.getTracks().forEach(t=>t.stop());v.hidden=true;return verify(r.data)}}requestAnimationFrame(tick)};tick()};
 $('#exp').onclick=()=>{const q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';const csv=[['id','type','title','category','location','date','status','reported','returned'],...ITEMS.map(i=>[i.id,i.type,i.t,i.cat,i.loc,i.date,i.st,new Date(i.ts).toISOString(),i.rt?new Date(i.rt).toISOString():''])].map(r=>r.map(q).join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='findit-items.csv';a.click()};
 $('#out').onclick=()=>{sessionStorage.removeItem('findit.auth');location.reload()};
 rows();match();stats();
}};
pages.admin=()=>gate(pages.adminInit);
document.addEventListener('DOMContentLoaded',()=>{shell();pages[document.body.dataset.page]?.()});
function promo(){
 const SC=[['Introducing','Lost it?|Find it.','A new way to recover what matters at HCPSMSHS.','logo','#2997ff'],
 ['Report','Report in seconds.','Lost or found, in four simple steps.','report','#30d158'],
 ['Search','Search that gets it.','Keywords, categories, locations, even dates.','search','#ff9f0a'],
 ['Smart matching','It finds the match.','Lost and found reports are compared automatically.','match','#bf5af2'],
 ['Verification','Prove it’s yours.','Only the real owner knows the answer.','lock','#ff375f'],
 ['Pickup','Scan. Collect.','Staff scan your QR code to confirm the claim.','qr','#5ac8fa'],
 ['Insights','Measure what matters.','Recovery rate, return time and satisfaction.','chart','#64d2ff'],
 ['FindIt','Found. Returned.','Built for HCPSMSHS.','logo','#2997ff']];
 const CH=[[261.63,329.63,392,493.88],[220,261.63,329.63,392],[174.61,220,261.63,329.63],[196,246.94,293.66,329.63]],R=[65.41,55,43.65,49],P=[0,1,2,3,2,1,2,3],N=SC.length;
 const ic='<svg viewBox="0 0 64 64" width="64" height="64"><rect width="64" height="64" rx="16" fill="#0071e3"/><circle cx="28" cy="28" r="12" fill="none" stroke="#fff" stroke-width="6"/><path d="M37 37l11 11" stroke="#fff" stroke-width="6" stroke-linecap="round"/></svg>';
 const chk='<svg viewBox="0 0 24 24" width="20" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L19 7"/></svg>';
 const MK={
  logo:`<div class="mk lg">${ic}</div>`,
  report:`<div class="mk gl" style="width:300px"><div class="pg">${[1.2,1.7,2.2,2.7].map(d=>`<i style="--d:${d}s"></i>`).join('')}</div><div class="ln" style="--d:1.2s"></div><div class="ln" style="--d:1.5s;width:70%"></div><div class="ln" style="--d:1.8s;width:85%"></div></div>`,
  search:`<div class="mk gl" style="width:300px;text-align:left"><b class="ty">blue notebook</b><div class="rw" style="--d:2.4s"><b></b><u></u></div><div class="rw" style="--d:2.7s"><b></b><u style="flex:.7"></u></div></div>`,
  match:`<div class="mk mt"><div class="cd" style="--x:-60px"></div><div class="rg"><svg viewBox="0 0 36 36" width="96"><circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="3"/><circle class="rc" cx="18" cy="18" r="15.9" fill="none" stroke-width="3" pathLength="100"/></svg><b>92%</b></div><div class="cd" style="--x:60px"></div></div>`,
  lock:`<div class="mk gl" style="width:300px;text-align:left"><p style="font-size:.85rem;color:#a1a1a6;margin-bottom:10px">What color is the phone case?</p><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><b class="ty" style="animation-delay:1.8s;font-size:1.3rem">blue</b><span class="okc">${chk}</span></div></div>`,
  qr:`<div class="mk"><div class="qr">${Array.from({length:81},()=>Math.random()>.5?'<i></i>':'<s></s>').join('')}</div><div class="vf">Verified</div></div>`,
  chart:`<div class="mk bars">${[40,55,48,70,82,95].map((h,i)=>`<i style="--h:${h}%;--d:${1+i*.12}s"></i>`).join('')}</div>`};
 const st=$('#scn'),pb=$('#pb'),pl=$('#play'),sg=$('#stage');let ctx,w=0;
 const show=k=>{const[e,h,s,m,c]=SC[k];sg.style.setProperty('--g',c);w=0;
  const hl=h.split('|').map((ln,j,a)=>`<div class="${j==a.length-1?'gr':''}">${ln.split(' ').map(x=>`<span style="animation-delay:${.25+.12*w++}s">${x}</span>`).join(' ')}</div>`).join('');
  st.innerHTML=`<div class="scn"><div class="eb">${e}</div><h3 class="hl">${hl}</h3><p class="sub">${s}</p>${MK[m]}</div>`};
 let mast,dry,nb;
 const init=()=>{ctx=new(window.AudioContext||window.webkitAudioContext)();const cp=ctx.createDynamicsCompressor();mast=ctx.createGain();mast.connect(cp);cp.connect(ctx.destination);
  const rv=ctx.createConvolver(),n=ctx.sampleRate*2.6|0,bf=ctx.createBuffer(2,n,ctx.sampleRate);for(let c=0;c<2;c++){const d=bf.getChannelData(c);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n)**2.5}rv.buffer=bf;const rg=ctx.createGain();rg.gain.value=.4;rv.connect(rg);rg.connect(mast);
  dry=ctx.createGain();dry.connect(mast);dry.connect(rv);nb=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate);const d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1};
 const osc=(type,f,t,d,v,att,dest,flt)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+att);g.gain.exponentialRampToValueAtTime(.0001,t+d);let n=o;if(flt){const b=ctx.createBiquadFilter();b.type='lowpass';b.frequency.value=flt;o.connect(b);n=b}n.connect(g);g.connect(dest);o.start(t);o.stop(t+d+.05)};
 const pluck=(f,t,v)=>{osc('sine',f,t,1.6,v,.008,dry,2800);osc('triangle',f*2,t,.5,v*.25,.005,dry,3500)};
 const kick=t=>{const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(42,t+.18);g.gain.setValueAtTime(.55,t);g.gain.exponentialRampToValueAtTime(.001,t+.28);o.connect(g);g.connect(mast);o.start(t);o.stop(t+.3)};
 const nz=(t,d,fl,fr,v,rise)=>{const s=ctx.createBufferSource();s.buffer=nb;s.loop=true;const f=ctx.createBiquadFilter();f.type=fl;f.frequency.setValueAtTime(fr,t);if(rise){f.Q.value=2;f.frequency.exponentialRampToValueAtTime(7000,t+d)}const g=ctx.createGain();g.gain.setValueAtTime(rise?.0001:v,t);g.gain.exponentialRampToValueAtTime(rise?v:.001,t+d);g.gain.linearRampToValueAtTime(0,t+d+.05);s.connect(f);f.connect(g);g.connect(rise?dry:mast);s.start(t);s.stop(t+d+.1)};
 const S=(s,t)=>{const bar=s>>3,b=s&7,k=bar==15?0:bar%4,c=CH[k];
  if(b==0){c.slice(0,3).forEach(f=>osc('sine',f,t,2.2,.035,.5,dry,1500));osc('sine',R[k],t,1.2,.3,.01,mast);if(bar==15)c.forEach(f=>osc('sine',f,t,3.4,.06,.15,dry,2200))}
  if(bar<15&&(bar>1||!(b&1)))pluck(c[P[b]]*2,t,b&1?.05:.09);
  if(bar>1&&bar<15&&b==5)osc('sine',R[k]*2,t,.4,.16,.01,mast);
  if(bar>1&&bar<15&&(b==0||b==4))kick(t);
  if(bar>3&&bar<15&&(b&1))nz(t,.05,'highpass',7500,.05);
  if((bar==3||bar==13)&&b==0)nz(t,2,'bandpass',400,.12,1)};
 pl.onclick=()=>{if(!ctx)init();ctx.resume();const T0=ctx.currentTime+.15,dur=32;let nx=0;
  mast.gain.cancelScheduledValues(0);mast.gain.setValueAtTime(1,ctx.currentTime);mast.gain.setValueAtTime(1,T0+dur-1);mast.gain.linearRampToValueAtTime(0,T0+dur+1.2);
  pb.style.transition='none';pb.style.width='0';pb.offsetWidth;pb.style.transition=`width ${dur}s linear`;pb.style.width='100%';pl.hidden=true;
  const at=(t,fn)=>setTimeout(fn,Math.max(0,(t-ctx.currentTime)*1000));
  const iv=setInterval(()=>{while(nx<128&&T0+nx*.25<ctx.currentTime+.5){const t=T0+nx*.25;S(nx,t);if(nx%16==0){const k=nx/16;at(t,()=>show(k));at(t+3.55,()=>st.firstElementChild.classList.add('out'))}nx++}
   if(nx>=128){clearInterval(iv);at(T0+dur+.8,()=>{pl.hidden=false;pl.textContent='↻ Replay'})}},80)};
 show(0);
}
document.addEventListener('DOMContentLoaded',()=>{if(document.body.dataset.page=='index')promo()});
