/* Add original/text modes to the existing detail/reader UI, without replacing it. */
(()=>{
 const base=new URL('.',document.currentScript.src),states=new WeakMap();
 const icon=n=>`<i class="iconfont club-local-icon icon-${n}" aria-hidden="true"></i>`;
 function mount(host,tools){
  if(!host||!tools||states.has(host))return;
  const data=window.magazineOriginalData;if(!data?.pages?.length)return;
  const button=document.createElement('button');button.type='button';button.className='native-original-toggle rd-button pe-icon-button';button.setAttribute('aria-label','切换为原貌阅读');button.setAttribute('title','原貌阅读');button.setAttribute('aria-pressed','false');button.innerHTML=icon('Book')+'<span class="pe-tooltip">原貌阅读</span>';
  const view=document.createElement('section');view.className='native-original-view';view.hidden=true;view.setAttribute('aria-label','第一财经原貌试读');
  view.innerHTML=`<header class="native-original-heading"><div><span class="pe-kicker">ORIGINAL EDITION</span><h2>第一财经 · 原貌阅读</h2><p>2026年09期 · 已收录11页试读</p></div></header><div class="native-original-controls"><button type="button" data-native-prev aria-label="上一原貌页">${icon('Arrow_Forward-2')}</button><label>原貌页 <select aria-label="跳转原貌页">${data.pages.map(p=>`<option value="${p.page}">${String(p.page).padStart(2,'0')}</option>`).join('')}</select> / ${data.pages.length}</label><button type="button" data-native-next aria-label="下一原貌页">${icon('Arrow_Forward-2')}</button></div><div class="native-original-pages">${data.pages.map(p=>`<figure data-native-page="${p.page}"><div class="native-original-tiles" role="img" aria-label="原貌试读第${p.page}页" style="aspect-ratio:${p.width}/${p.height};grid-template-columns:${p.columns.map(x=>x+'fr').join(' ')};grid-template-rows:${p.rows.map(x=>x+'fr').join(' ')}">${p.tiles.map(t=>`<img data-src="${new URL(t.src,base).href}" alt="" aria-hidden="true" width="${t.width}" height="${t.height}" style="grid-column:${t.col+1};grid-row:${t.row+1}" loading="lazy">`).join('')}</div><figcaption>${String(p.page).padStart(2,'0')} / ${data.pages.length}</figcaption></figure>`).join('')}</div><p class="native-original-end">已读完本地收录的试读部分。<a href="${data.source}" target="_blank" rel="noopener">前往官方继续阅读</a></p>`;
  const state={button,view,original:false,page:1,textY:0,originalY:0};states.set(host,state);tools.append(button);host.append(view);
  function fit(){
   if(!state.original)return;
   const topbar=document.querySelector('.site-header,body>.topbar');
   const bottom=topbar?.getBoundingClientRect().bottom||0;
   const top=Math.max(16,Math.min(innerHeight*.35,bottom+16));
   view.style.setProperty('--native-top',top+'px');
   const stage=view.querySelector('.native-original-pages'),tile=view.querySelector(`[data-native-page="${state.page}"] .native-original-tiles`);
   const page=data.pages[state.page-1],height=Math.max(40,stage.clientHeight-28),width=Math.min(stage.clientWidth,height*page.width/page.height);
   tile.style.width=width+'px';tile.style.height=(width*page.height/page.width)+'px';
  }
  function controls(){
   view.querySelector('select').value=String(state.page);view.querySelector('[data-native-prev]').disabled=state.page===1;view.querySelector('[data-native-next]').disabled=state.page===data.pages.length;
   view.querySelectorAll('[data-native-page]').forEach(fig=>{fig.hidden=Number(fig.dataset.nativePage)!==state.page;if(!fig.hidden&&state.original)fig.querySelectorAll('img[data-src]').forEach(img=>{img.src=img.dataset.src;delete img.dataset.src});});
   requestAnimationFrame(fit);
  }
  function go(n){state.page=Math.max(1,Math.min(data.pages.length,Number(n)));controls();}
  button.addEventListener('click',()=>{
   if(state.original)state.originalY=scrollY;else state.textY=scrollY;
   state.original=!state.original;host.classList.toggle('native-original-mode',state.original);view.hidden=!state.original;button.setAttribute('aria-pressed',String(state.original));button.setAttribute('aria-label',state.original?'切换为文本阅读':'切换为原貌阅读');button.title=state.original?'文本阅读':'原貌阅读';button.innerHTML=icon(state.original?'FontNew':'Book')+`<span class="pe-tooltip">${state.original?'文本阅读':'原貌阅读'}</span>`;
   if(state.original){controls();requestAnimationFrame(()=>{fit();const top=parseFloat(view.style.getPropertyValue('--native-top'));window.scrollTo({top:scrollY+view.getBoundingClientRect().top-top,behavior:'instant'});requestAnimationFrame(fit);});}
   else requestAnimationFrame(()=>window.scrollTo({top:state.textY,behavior:'instant'}));
  });
  view.querySelector('select').addEventListener('change',ev=>go(ev.target.value));view.querySelector('[data-native-prev]').addEventListener('click',()=>go(state.page-1));view.querySelector('[data-native-next]').addEventListener('click',()=>go(state.page+1));
  new ResizeObserver(fit).observe(view.querySelector('.native-original-pages'));
  window.addEventListener('resize',fit,{passive:true});
  view.addEventListener('keydown',event=>{if(event.target.matches('select,input,textarea'))return;if(event.key==='ArrowRight'){event.preventDefault();go(state.page+1);}if(event.key==='ArrowLeft'){event.preventDefault();go(state.page-1);}});
  controls();
 }
 function sync(){
  const hash=decodeURIComponent(location.hash);
  if(location.pathname.endsWith('/portal.html')&&hash.includes('context=magazine')&&hash.includes('resource=第一财经'))mount(document.querySelector('.portal-reader-content:not(.issue-preview-stream)'),document.querySelector('.portal-reader-tools'));
  document.querySelectorAll('.view.active .pe-resource-detail').forEach(detail=>{if(detail.querySelector('.pe-identity-top h1')?.textContent.trim()!=='第一财经'||!/2026.*0?9\s*期/.test(detail.querySelector('.pe-metadata')?.textContent||''))return;mount(detail.querySelector('.pe-reading'),detail.querySelector('.pe-social'));});
 }
 let pending=false;new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;sync();});}).observe(document.body,{childList:true,subtree:true});addEventListener('hashchange',sync);sync();
})();
