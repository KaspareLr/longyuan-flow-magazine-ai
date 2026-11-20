/* Continue through the issue in one document; source completeness remains unchanged. */
(()=>{
 const main=document.querySelector('#portal-main');if(!main)return;let state=null,frame=0;
 function eligible(){return document.body.classList.contains('issue-full-page')&&location.hash.includes('context=magazine');}
 function sync(){
  const reader=main.querySelector('.portal-reader');if(state?.first===reader)return;
  state=null;if(!reader||!eligible()||!window.clubArticleDetail)return;
  const index=Number(location.hash.match(/article\/(\d+)/)?.[1]||0),info=clubArticleDetail.infoAt(index),bar=document.querySelector('body > .portal-reading-progress');if(!bar)return;
  reader.dataset.continuousIndex=index;
  state={first:reader,bar,articles:[reader],last:index,current:index,total:info.list.length,loading:false,lastY:scrollY};update();
 }
 function update(){
  if(!state||!eligible())return;
  const edge=Math.min(180,innerHeight*.25);let active=state.articles[0];
  for(const article of state.articles){if(article.getBoundingClientRect().top<=edge)active=article;else break;}
  const index=Number(active.dataset.continuousIndex),info=clubArticleDetail.infoAt(index),rect=active.getBoundingClientRect();
  const progress=Math.max(0,Math.min(1,(edge-rect.top)/Math.max(1,rect.height-innerHeight+edge)));
  state.bar.style.transform='scaleX('+progress+')';
  if(index!==state.current){state.current=index;clubArticleDetail.setCurrent(index);document.title=info.title+' · 龙源期刊网';const url=new URL(location.href);url.hash=url.hash.replace(/article\/\d+/,'article/'+index);history.replaceState(null,'',url.href);
   const tools=state.first.querySelector('.portal-reader-tools');tools?.querySelectorAll('[data-reader-article]').forEach((button,n)=>{const target=index+(n===0?-1:1),valid=target>=0&&target<state.total;button.disabled=!valid;button.dataset.readerArticle=valid?'portal.html#/article/'+target+'?context=magazine&resource='+encodeURIComponent(info.rid)+(info.topicId?'&topic='+encodeURIComponent(info.topicId):'')+'&full=1':'';button.title=valid?(n===0?'上一篇：':'下一篇：')+info.list[target].title:'已经是'+(n===0?'第一':'最后一')+'篇';});
   document.querySelectorAll('#reader-directory .reader-toc-article').forEach((a,n)=>{if(n===index)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
   try{localStorage.setItem('magazine-home:last-read',JSON.stringify({index}));}catch{}
  }
 }
 function append(){
  if(!state||!eligible()||state.loading||state.last>=state.total-1)return;
  const last=state.articles.at(-1);if(last.getBoundingClientRect().bottom>innerHeight+120)return;
  state.loading=true;const index=state.last+1;try{
   const doc=new DOMParser().parseFromString(clubArticleDetail.renderAt(index),'text/html'),next=doc.querySelector('.portal-reader');if(!next)return;
   next.querySelectorAll('.portal-reader-tools,.portal-toc').forEach(n=>n.remove());next.dataset.continuousIndex=index;next.classList.add('issue-continuation');
   const size=state.first.style.getPropertyValue('--article-body-size'),leading=state.first.style.getPropertyValue('--article-body-leading');if(size){next.style.setProperty('--article-body-size',size);next.style.setProperty('--article-body-leading',leading);}
   if(state.first.classList.contains('night'))next.classList.add('night');main.append(next);state.articles.push(next);state.last=index;
  }finally{state.loading=false;}update();
 }
 function schedule(continueReading=false){cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{if(!state)return;if(continueReading)append();update();state.lastY=scrollY;});}
 addEventListener('scroll',()=>schedule(state&&scrollY>state.lastY),{passive:true});addEventListener('wheel',event=>{if(event.deltaY>0)schedule(true);},{passive:true});let touchY=null;addEventListener('touchstart',event=>{touchY=event.touches[0]?.clientY??null;},{passive:true});addEventListener('touchmove',event=>{const y=event.touches[0]?.clientY;if(touchY!==null&&y!==undefined&&y<touchY)schedule(true);touchY=y??null;},{passive:true});
 document.addEventListener('click',event=>{if(!state)return;const button=event.target.closest('[data-reader-font-cycle],[data-reader-night]');if(!button)return;requestAnimationFrame(()=>{state.articles.slice(1).forEach(article=>{for(const key of ['--article-body-size','--article-body-leading'])article.style.setProperty(key,state.first.style.getPropertyValue(key));article.classList.toggle('night',state.first.classList.contains('night'));});});});
 new MutationObserver(sync).observe(main,{childList:true});addEventListener('hashchange',()=>requestAnimationFrame(sync));sync();
})();
