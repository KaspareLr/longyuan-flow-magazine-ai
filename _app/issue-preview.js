/* Existing historical directory/details become an issue preview stream. */
(()=>{
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function fullArticle(a){const id=a.url?.match(/dycy\d+/)?.[0];return (window.clubEditorialArticleData||[]).find(x=>x.id===id||x.title===a.title);}
 function blocks(a,preview=false){const full=fullArticle(a);if(!full)return `<p>${esc(a.summary||a.excerpt||'本地暂未收录本篇正文。')}</p>`;let content=full.blocks;if(preview){content=[...content];const i=content.findIndex(b=>b.type==='figure');if(i>2){const pic=content.splice(i,1)[0];content.splice(2,0,pic);}}return content.map(b=>b.type==='figure'?`<figure><img src="${esc(b.src)}" alt="${esc(b.alt||b.caption||a.title+'配图')}" loading="lazy" ${b.width?`width="${b.width}"`:''} ${b.height?`height="${b.height}"`:''}>${b.caption?`<figcaption>${esc(b.caption)}</figcaption>`:''}</figure>`:b.type==='heading'?`<h2>${esc(b.text)}</h2>`:`<p>${esc(b.text)}</p>`).join('');}
 function trial(a){const id=a.url?.match(/dycy\d+/)?.[0];return (window.clubIssueTrialData||[]).find(x=>x.id===id||x.title===a.title);}
 function trialBody(a){const sample=trial(a);return sample?sample.paragraphs.map(p=>`<p>${esc(p)}</p>`).join(''):`<p>${esc(a.summary||a.excerpt||'试读内容暂未加载。')}</p>`;}
 const api={
 isPreview:(a,params)=>a.context==='magazine'&&a.rid==='第一财经'&&params.get('full')!=='1',
 fullBody:a=>fullArticle(a)?blocks(a):trial(a)?trialBody(a)+`<p class="issue-trial-notice">本地目前仅收录本篇试读。<a href="${esc(trial(a).source)}" target="_blank" rel="noopener">前往龙源网阅读完整原文</a></p>`:null,
 render(a,toc){
  const list=a.list;const mk=i=>'#issue-preview-'+i;
  const rows=list.map((item,index)=>({...item,index,summary:item.excerpt||item.summary,resource:a.resource,group:item.group||'本期文章'}));
  const tocData={...a,list:list.map(item=>({...item,excerpt:'',summary:''}))};
  return `<div class="portal-reader issue-preview-reader"><button type="button" class="issue-directory-toggle" aria-expanded="false" aria-controls="issue-preview-directory">本期目录 <span aria-hidden="true">☰</span></button><div class="issue-toc-slot" id="issue-preview-directory">${toc(tocData,mk).replace(/<img[^>]*>/g,'').replace(/aria-label="返回期刊详情"/,'aria-label="返回刊物首页"')}</div><section class="portal-reader-content issue-preview-stream" aria-label="本期文章预览">${rows.map(item=>{const full=fullArticle(item),sample=trial(item);return `<article class="issue-preview-article" id="issue-preview-${item.index}" data-preview-index="${item.index}"><header class="portal-article-head"><span class="club-overline">${String(item.index+1).padStart(2,'0')} · ${esc(item.group)}</span><h1>${esc(item.title)}</h1><div class="portal-article-meta">${full?.authors?.length?`<span>${esc(full.authors.join(' / '))}</span>`:''}<span>${esc(a.resource)} · 2026年09期</span></div></header><div class="issue-preview-excerpt portal-prose">${full?blocks(item,true):trialBody(item)}</div><footer class="issue-preview-bottom"><a class="button dark" href="portal.html#/article/${item.index}?context=magazine&resource=${encodeURIComponent(a.rid)}&full=1">阅读全文 <i class="iconfont icon-Arrow_Forward-2" aria-hidden="true"></i></a></footer></article>`;}).join('')}</section></div>`;
 },
 mount(a,params){
  const preview=api.isPreview(a,params);if(params.get('full')==='1'&&a.rid==='第一财经'){try{localStorage.setItem('magazine-home:last-read',JSON.stringify({index:a.index}));}catch{}}document.body.classList.toggle('issue-preview-page',preview);document.body.classList.toggle('issue-full-page',a.context==='magazine'&&params.get('full')==='1');
  const widget=document.querySelector('.demo-reading-widget');if(widget){widget.hidden=params.get('full')==='1';widget.inert=params.get('full')==='1';}
  if(api.directoryObserver){api.directoryObserver.disconnect();api.directoryObserver=null;}
  if(!preview)return;
  document.querySelectorAll('.issue-toc-slot .reader-toc-article').forEach(link=>{link.title=link.querySelector('strong')?.textContent||'';});
  const slot=document.querySelector('.issue-toc-slot');
  const fit=()=>{if(!slot||!slot.isConnected)return;const box=slot.getBoundingClientRect();slot.style.setProperty('--toc-left',box.left+'px');slot.style.setProperty('--toc-width',box.width+'px');};
  if(slot){fit();api.directoryObserver=new ResizeObserver(fit);api.directoryObserver.observe(document.querySelector('.issue-preview-reader'));}

  const target=document.getElementById('issue-preview-'+a.index);if(target&&a.index>0)requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:'instant'}));
  let observer=new IntersectionObserver(entries=>{for(const en of entries)if(en.isIntersecting){const i=en.target.dataset.previewIndex;document.querySelectorAll('.issue-preview-reader .reader-toc-article').forEach(link=>{if(link.getAttribute('href')==='#issue-preview-'+i)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});}},{rootMargin:'-16% 0px -66% 0px'});
  document.querySelectorAll('[data-preview-index]').forEach(n=>observer.observe(n));
 }
 };
 window.clubIssuePreview=api;
 window.addEventListener('keydown',event=>{if(event.key==='Escape'){document.querySelector('.issue-toc-slot')?.classList.remove('is-open');document.querySelector('.issue-directory-toggle')?.setAttribute('aria-expanded','false');}});
 window.addEventListener('click',event=>{const toggle=event.target.closest('.issue-directory-toggle');if(toggle){const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));document.querySelector('.issue-toc-slot')?.classList.toggle('is-open',open);return;}const link=event.target.closest('a[href^="#issue-preview-"]');if(!link||!document.body.classList.contains('issue-preview-page'))return;if(event.button||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();event.stopImmediatePropagation();document.querySelector('.issue-toc-slot')?.classList.remove('is-open');document.querySelector('.issue-directory-toggle')?.setAttribute('aria-expanded','false');document.querySelector(link.getAttribute('href'))?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});},true);
})();
