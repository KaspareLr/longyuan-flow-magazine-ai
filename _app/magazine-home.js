(()=>{
 const e=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const icon=name=>`<i class="iconfont icon-${name}" aria-hidden="true"></i>`;
 const back=document.querySelector('.portal-back');
 clubNavigation.setBack(back,true);
 back?.addEventListener('click',async()=>{
  const destination='index.html#/magazines';
  await clubNavigation.exitTo(destination);
  location.href=destination;
 });
 document.querySelector('.club-account-dialog .club-dialog-close')?.replaceChildren(Object.assign(document.createElement('i'),{className:'iconfont icon-Close'}));
 const issue='portal.html#/article/0?context=magazine&resource='+encodeURIComponent('第一财经');
 const list=window.periodicalReference.groups.flatMap(g=>g.articles.map(a=>({...a,group:g.title})));
 const full=window.clubEditorialArticleData;
 function articleHref(index,detail=false){return issue.replace('/article/0?','/article/'+index+'?')+(detail?'&full=1':'');}
 document.querySelectorAll('[data-latest]').forEach(a=>a.href=issue);
 const stories = document.querySelector('#latest-stories');
 let previousGroup;
 stories.innerHTML = list.slice(0, 4).map((article, index) => {
  const label = article.group !== previousGroup
   ? `<span class="mh-story-group">${e(article.group)}</span>` : '';
  previousGroup = article.group;
  return `${label}<a class="mh-latest-story" href="${articleHref(index)}"><strong>${e(article.title)}</strong>${icon('Arrow_Forward-2')}</a>`;
 }).join('');

 const picks = ['dycy20260912', 'dycy20260904', 'dycy20260905', 'dycy20260901'];
 document.querySelector('#picks-grid').innerHTML = picks.map((id, slot) => {
  const article = full.find(entry => entry.id === id);
  const index = list.findIndex(entry => entry.url.includes(id));
  if (!article || index < 0) return '';
  const picture = article.blocks.find(block => block.type === 'figure');
  const paragraphs = article.blocks.filter(block => block.type === 'paragraph').slice(0, 4);
  const art = slot < 3 && picture
   ? `<span class="mh-pick-frame"><img src="${e(picture.src)}" alt="${e(picture.alt || '')}" loading="lazy"></span>` : '';
  return `<a class="mh-pick mh-pick-${slot+1}${art ? ' mh-pick-with-image' : ''}" href="${articleHref(index, true)}">
   ${art}
   <div class="mh-pick-heading">
    <span class="mh-pick-index" aria-hidden="true">${String(slot + 1).padStart(2, '0')}</span>
    <h3>${e(article.title)}</h3>
    <span class="mh-pick-byline">${e(article.authors.join('、'))}<span>2026年09期</span></span>
   </div>
   ${slot < 2 ? `<div class="mh-pick-excerpt">${paragraphs.map(block => `<p>${e(block.text)}</p>`).join('')}</div>` : ''}
   ${slot >= 2 ? `<span class="mh-pick-arrow">${icon('Arrow_Forward-2')}</span>` : ''}
  </a>`;
 }).join('');
 const archiveRows=window.magazineArchiveData||[],years=[...new Set(archiveRows.map(a=>a.year))].sort((a,b)=>b-a),yearTabs=document.querySelector('.mh-archive-years');
 yearTabs.innerHTML=years.map((year,i)=>`<button type="button" role="tab" id="archive-year-${year}" aria-controls="archive-grid" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-year="${year}">${year}</button>`).join('');
 function archive(year){const rows=archiveRows.filter(a=>a.year===Number(year)).sort((a,b)=>b.issue-a.issue);yearTabs.querySelectorAll('button').forEach(b=>{const active=Number(b.dataset.year)===Number(year);b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});const grid=document.querySelector('#archive-grid');grid.setAttribute('aria-labelledby','archive-year-'+year);grid.innerHTML=rows.map((a,i)=>{const current=a.year===2026&&a.issue===9;return `<a class="mh-issue" href="${current?issue:a.url}" ${current?'':'target="_blank" rel="noopener"'} aria-label="阅读第一财经${e(a.label)}"><img src="${e(a.cover)}" alt="第一财经${e(a.label)}封面" loading="lazy"><strong>${e(a.label)}</strong></a>`;}).join('');}
 yearTabs.addEventListener('click',event=>{const tab=event.target.closest('[data-year]');if(tab)archive(tab.dataset.year);});
 yearTabs.addEventListener('keydown',event=>{const tabs=[...yearTabs.querySelectorAll('button')],index=tabs.indexOf(document.activeElement);if(index<0)return;let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();archive(tabs[next].dataset.year);tabs[next].focus();});archive(years[0]);
 let following=false;try{following=localStorage.getItem('magazine-home:follow:yimagazine')==='true';}catch{}
 const follow=document.querySelector('#mh-follow');function syncFollow(){follow.setAttribute('aria-pressed',String(following));follow.textContent=following?'已关注':'关注';}syncFollow();
 let timer;function toast(text){const t=document.querySelector('.mh-toast');t.textContent=text;t.classList.add('visible');clearTimeout(timer);timer=setTimeout(()=>t.classList.remove('visible'),2200);}
 follow.addEventListener('click',()=>{following=!following;try{localStorage.setItem('magazine-home:follow:yimagazine',String(following));}catch{}syncFollow();toast(following?'已关注《第一财经》':'已取消关注');});
 window.magazineCheckout.mount(document.querySelector('#mh-subscribe'),document.querySelector('#mh-subscribe-dialog'),{
  title:'订阅《第一财经》全年', product:'全年电子版', price:188,
  issue:'2026 年第 11 期至 2027 年第 10 期',success:'模拟订阅成功'
 });
 const dialog=document.querySelector('#mh-share-dialog'),input=document.querySelector('#mh-share-url');document.querySelector('#mh-share').addEventListener('click',async()=>{if(matchMedia('(max-width:760px)').matches&&navigator.share){try{await navigator.share({title:'第一财经 · 探索一个明亮的商业世界',url:location.href});return;}catch(error){if(error.name==='AbortError')return;}}input.value=location.href.split('#')[0];dialog.showModal();});
 document.querySelector('#mh-close-share').addEventListener('click',()=>dialog.close());document.querySelector('#mh-copy').addEventListener('click',async()=>{input.select();try{await navigator.clipboard.writeText(input.value);toast('链接已复制');}catch{toast('请复制已选中的链接');}});
})();
