/* Existing historical directory/details become an issue preview stream. */
(()=>{
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function fullArticle(a){const id=a.url?.match(/dycy\d+/)?.[0];return (window.clubEditorialArticleData||[]).find(x=>x.id===id||x.title===a.title);}
 function issueExcerpt(content){
  const total=content.reduce((length,block)=>length+(block.type==='paragraph'?block.text.length:0),0);
  const budget=Math.min(560,Math.floor(total*0.7));
  let remaining=budget;
  const excerpt=[];
  for(const block of content){
   if(remaining<=0)break;
   if(block.type!=='paragraph'){
    if(block.type!=='figure'||!excerpt.some(item=>item.type==='figure'))excerpt.push(block);
    continue;
   }
   if(block.text.length<=remaining){
    excerpt.push(block);
    remaining-=block.text.length;
    continue;
   }
   const text=block.text.slice(0,remaining);
   const end=Math.max(text.lastIndexOf('。'),text.lastIndexOf('！'),text.lastIndexOf('？'));
   if(end>=remaining*0.55)excerpt.push({...block,text:text.slice(0,end+1)});
   else if(remaining>40)excerpt.push({...block,text:text.slice(0,-1).trimEnd()+'…'});
   break;
  }
  while(excerpt.at(-1)?.type==='heading')excerpt.pop();
  return excerpt;
 }
 function blocks(a,content){
  return content.map(b=>b.type==='figure'?`<figure><img src="${esc(b.src)}" alt="${esc(b.alt||b.caption||a.title+'配图')}" loading="lazy" ${b.width?`width="${b.width}"`:''} ${b.height?`height="${b.height}"`:''}>${b.caption?`<figcaption>${esc(b.caption)}</figcaption>`:''}</figure>`:b.type==='heading'?`<h2>${esc(b.text)}</h2>`:`<p>${esc(b.text)}</p>`).join('');}
 function trial(a){const id=a.url?.match(/dycy\d+/)?.[0];return (window.clubIssueTrialData||[]).find(x=>x.id===id||x.title===a.title);}
 function trialBody(a){const sample=trial(a);return sample?sample.paragraphs.map(p=>`<p>${esc(p)}</p>`).join(''):`<p>${esc(a.summary||a.excerpt||'试读内容暂未加载。')}</p>`;}
 function previewBody(a){
  const full=fullArticle(a);
  return full?blocks(a,issueExcerpt(full.blocks)):trialBody(a);
 }
 let railFrame=0;
 const railOffsets=new WeakMap();
 function updateRails(){
  railFrame=0;
  if(!document.body.classList.contains('issue-preview-page'))return;
  const footer=document.querySelector('.club-site-footer');
  if(!footer)return;
  const boundary=footer.getBoundingClientRect().top-16;
  const rails=document.querySelectorAll('.issue-toc-slot > .portal-toc,.reader-guide-widget .pe-chat,.issue-directory-toggle');
  for(const rail of rails){
   const previous=railOffsets.get(rail)||0;
   const fixed=getComputedStyle(rail).position==='fixed'&&rail.getClientRects().length;
   const nominalBottom=rail.getBoundingClientRect().bottom-previous;
   const offset=fixed?Math.min(0,boundary-nominalBottom):0;
   railOffsets.set(rail,offset);
   rail.style.setProperty('--issue-rail-offset',offset+'px');
  }
 }
 function scheduleRails(){
  if(!railFrame)railFrame=requestAnimationFrame(updateRails);
 }
 window.addEventListener('scroll',scheduleRails,{passive:true});
 window.addEventListener('resize',scheduleRails);
 function guidePurchaseKey(){
  const profile=window.clubSession?.profile;
  return 'issue-purchase:dycy202609:'+(profile?.dsuId||profile?.email||profile?.nickname||'guest');
 }
 let lastLocalPurchase='';
 function hasGuideAccess(){
  const key=guidePurchaseKey();
  return lastLocalPurchase===key||window.clubSession?.read(key,false)===true;
 }
 function refreshGuideAccess(){
  const preview=document.body.classList.contains('issue-preview-page');
  document.body.classList.toggle('issue-guide-locked',preview&&!hasGuideAccess());
  const purchase=document.querySelector('body > .issue-purchase-entry [data-issue-purchase]');
  if(purchase){
   const owned=hasGuideAccess();
   purchase.disabled=owned;
   purchase.textContent=owned?'本期已购买':'购买本期：￥48.00';
  }
  window.syncReaderGuide?.();
 }
 window.addEventListener('club-session-change',refreshGuideAccess);
 window.addEventListener('storage',event=>{
  if(event.key===null||event.key?.startsWith('club-demo:issue-purchase:'))refreshGuideAccess();
 });
 const api={
 hasGuideAccess,
 isPreview:(a,params)=>a.context==='magazine'&&a.rid==='第一财经'&&params.get('full')!=='1',
 hasFull:a=>Boolean(fullArticle(a)),
 previewBody,
 fullBody:a=>{const full=fullArticle(a);return full?blocks(a,full.blocks):trial(a)?previewBody(a):null;},
 render(a,toc){
  const list=a.list;const mk=i=>'#issue-preview-'+i;
  const rows=list.map((item,index)=>({...item,index,summary:item.excerpt||item.summary,resource:a.resource,group:item.group||'本期文章'}));
  const tocData={...a,list:list.map(item=>({...item,excerpt:'',summary:''}))};
  return `<div class="portal-reader issue-preview-reader"><button type="button" class="issue-directory-toggle" aria-expanded="false" aria-controls="issue-preview-directory">本期目录 <span aria-hidden="true">☰</span></button><div class="issue-toc-slot" id="issue-preview-directory">${toc(tocData,mk).replace(/<img[^>]*>/g,'').replace(/aria-label="返回期刊详情"/,'aria-label="返回刊物首页"')}</div><section class="portal-reader-content issue-preview-stream" aria-label="本期文章预览"><nav class="issue-purchase-entry" aria-label="本期购买和会员">
   <button type="button" class="button" data-issue-purchase aria-haspopup="dialog">购买本期：￥48.00</button>
   <a class="button dark" href="index.html#/magazine/${encodeURIComponent(a.rid)}?page=membership"><img src="assets/magazine-home/member-dock.svg" alt="" width="24" height="24">成为会员</a>
  </nav>
  <dialog class="issue-purchase-dialog"></dialog>${rows.map(item=>{const full=fullArticle(item);return `<article class="issue-preview-article" id="issue-preview-${item.index}" data-preview-index="${item.index}"><header class="portal-article-head"><span class="club-overline">${String(item.index+1).padStart(2,'0')} · ${esc(item.group)}</span><h1>${esc(item.title)}</h1><div class="portal-article-meta">${full?.authors?.length?`<span>${esc(full.authors.join(' / '))}</span>`:''}<span>${esc(a.resource)} · 2026年09期</span></div></header><div class="issue-preview-excerpt portal-prose">${previewBody(item)}</div><footer class="issue-preview-bottom"><a class="button" href="portal.html#/article/${item.index}?context=magazine&resource=${encodeURIComponent(a.rid)}&full=1">${full?'继续阅读全文':'查看试读'}</a></footer></article>`;}).join('')}</section></div>`;
 },
 mount(a,params){
  const preview=api.isPreview(a,params);if(params.get('full')==='1'&&a.rid==='第一财经'){try{localStorage.setItem('magazine-home:last-read',JSON.stringify({index:a.index}));}catch{}}document.body.classList.toggle('issue-preview-page',preview);document.body.classList.toggle('issue-full-page',a.context==='magazine'&&params.get('full')==='1');
  refreshGuideAccess();
  if(api.directoryObserver){api.directoryObserver.disconnect();api.directoryObserver=null;}
  document.querySelector('body > .issue-purchase-entry')?.remove();
  if(!preview)return;
  document.body.append(document.querySelector('.issue-purchase-entry'));
  const purchaseDialog=document.querySelector('.issue-purchase-dialog');
  const purchase=document.querySelector('[data-issue-purchase]');
  window.magazineCheckout.mount(purchase,purchaseDialog,{
   title:'购买《第一财经》本期',product:'单期电子版',price:48,
   issue:'2026 年第 09 期',success:'模拟购买成功',
   onPaid(){
    lastLocalPurchase=guidePurchaseKey();
    window.clubSession?.write(lastLocalPurchase,true);
    refreshGuideAccess();
   }
  });
  purchaseDialog.addEventListener('close',()=>{
   if(hasGuideAccess())document.querySelector('[data-issue-mode=jev]')?.focus({preventScroll:true});
  });
  refreshGuideAccess();
  document.querySelectorAll('.issue-toc-slot .reader-toc-article').forEach(link=>{link.title=link.querySelector('strong')?.textContent||'';});
  const slot=document.querySelector('.issue-toc-slot');
  const fit=()=>{scheduleRails();if(!slot||!slot.isConnected)return;const box=slot.getBoundingClientRect();slot.style.setProperty('--toc-left',box.left+'px');slot.style.setProperty('--toc-width',box.width+'px');};
  if(slot){fit();api.directoryObserver=new ResizeObserver(fit);api.directoryObserver.observe(document.querySelector('.issue-preview-reader'));}

  const target=document.getElementById('issue-preview-'+a.index);if(target&&a.index>0)requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:'instant'}));
  let observer=new IntersectionObserver(entries=>{for(const en of entries)if(en.isIntersecting){const i=en.target.dataset.previewIndex;document.querySelectorAll('.issue-preview-reader .reader-toc-article').forEach(link=>{if(link.getAttribute('href')==='#issue-preview-'+i)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});}},{rootMargin:'-16% 0px -66% 0px'});
  document.querySelectorAll('[data-preview-index]').forEach(n=>observer.observe(n));
 }
 };
 window.clubIssuePreview=api;
 window.addEventListener('keydown',event=>{if(event.key==='Escape'){document.querySelector('.issue-toc-slot')?.classList.remove('is-open');document.querySelector('.issue-directory-toggle')?.setAttribute('aria-expanded','false');}});
 window.addEventListener('click',event=>{const toggle=event.target.closest('.issue-directory-toggle');if(toggle){const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));document.querySelector('.issue-toc-slot')?.classList.toggle('is-open',open);scheduleRails();return;}const link=event.target.closest('a[href^="#issue-preview-"]');if(!link||!document.body.classList.contains('issue-preview-page'))return;if(event.button||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();event.stopImmediatePropagation();document.querySelector('.issue-toc-slot')?.classList.remove('is-open');document.querySelector('.issue-directory-toggle')?.setAttribute('aria-expanded','false');document.querySelector(link.getAttribute('href'))?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});},true);
})();
