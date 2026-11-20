/* Adapt resource routes while retaining the original catalogue and its navigation. */
(()=>{
 const bookId=id=>({'8':'ebooks-8'}[id]||id);
 function normalize(){document.querySelectorAll('a[href]').forEach(a=>{const raw=a.getAttribute('href'),match=raw.match(/#\/book\/([^?&#]+)/);if(match&&!raw.startsWith('portal.html')){a.href='portal.html#/book/'+bookId(match[1]);a.removeAttribute('target');}});}
 normalize();new MutationObserver(normalize).observe(document.body,{childList:true,subtree:true});
 const guide=document.createElement('div');guide.className='catalog-reading-guide rd-periodical pe-figma-detail';guide.innerHTML=renderResourceChat();document.body.append(guide);
 function updateGuide(){
  const active=document.querySelector('.view.active');
  const visible=active?.dataset.view!=='search'&&!active?.querySelector('.pe-chat');
  guide.hidden=!visible;
  document.body.classList.toggle('catalog-guide-visible',visible);
 }
 new MutationObserver(updateGuide).observe(document.querySelector('main'),{childList:true,subtree:true});
 function sync(){const [path]=location.hash.split('?');updateGuide();if(/^#\/book\//.test(path)){location.replace('portal.html#/book/'+bookId(path.split('/')[2]));return;}if(/^#\/(reader|article)\//.test(path)){const index=Number(path.split('/')[2])||0;location.replace('portal.html#/article/'+index+'?context=magazine&resource='+encodeURIComponent('第一财经'));}}
 document.addEventListener('click',event=>{const article=event.target.closest('a[href],button[data-rd-article]');if(!article)return;
 const raw=article.getAttribute('href')||'';if(article.hasAttribute('data-rd-article')||(/qikan\.com\.cn\/(article|articleinfo)/.test(raw)&&article.closest('.pe-article,.rd-article-group'))){event.preventDefault();event.stopImmediatePropagation();const rows=[...document.querySelectorAll('.view.active .pe-article')],row=article.closest('.pe-article'),i=Math.max(0,rows.indexOf(row)),publication=document.querySelector('.view.active .pe-identity h1')?.textContent||'第一财经';clubPageMotion.navigate('portal.html#/article/'+i+'?context=magazine&resource='+encodeURIComponent(publication));}
 },true);
 window.addEventListener('hashchange',sync);sync();
 function section(){if(new URLSearchParams(location.hash.split('?')[1]).get('section')==='membership')requestAnimationFrame(()=>requestAnimationFrame(()=>document.querySelector('#oc-membership')?.scrollIntoView({block:'start',behavior:'instant'})));}window.addEventListener('hashchange',section);section();
})();
