/* Add original/text modes to the existing detail/reader UI, without replacing it. */
(()=>{
 const base=new URL('.',document.currentScript.src),states=new WeakMap();
 const icon=n=>`<i class="iconfont club-local-icon icon-${n}" aria-hidden="true"></i>`;
 const pageFigures=data=>data.pages.map(p=>`<figure data-native-page="${p.page}"><div class="native-original-tiles" role="img" aria-label="原貌试读第${p.page}页" style="aspect-ratio:${p.width}/${p.height};grid-template-columns:${p.columns.map(x=>x+'fr').join(' ')};grid-template-rows:${p.rows.map(x=>x+'fr').join(' ')}">${p.tiles.map(t=>`<img data-src="${new URL(t.src,base).href}" alt="" aria-hidden="true" width="${t.width}" height="${t.height}" style="grid-column:${t.col+1};grid-row:${t.row+1}" loading="lazy">`).join('')}</div><figcaption>${String(p.page).padStart(2,'0')} / ${data.pages.length}</figcaption></figure>`).join('');
 const artwork=name=>`<img src="assets/original-reader-ui/${name}.svg" alt="">`;
 function mountSpread(host,tools,data,trigger){
  const dialog=document.createElement('dialog');
  dialog.className='native-original-spread';
  dialog.setAttribute('aria-label','第一财经原貌阅读');
  const colors={white:'白色',paper:'暖纸色',mist:'雾蓝色',charcoal:'炭灰色'};
  const spreads=[[data.pages[0]],...data.pages.slice(1).filter((_,i)=>i%2===0).map((_,i)=>data.pages.slice(i*2+1,i*2+3))];
  const thumbnails=spreads.map(pages=>{
   const first=pages[0].page,last=pages.at(-1).page,label=first===1?'封面':`第 ${first}–${last} 页`;
   return `<button type="button" data-original-jump="${first}" aria-label="${label}">
    <span class="original-thumbnail-pages">${pageFigures({pages}).replaceAll('data-src=', 'src=')}</span><span>${label}</span></button>`;
  }).join('');
  dialog.innerHTML=`
   <div class="original-rail original-rail-left" aria-label="向前翻页">
    <button data-original-step="-1" aria-label="上一原貌页">${artwork('5623e')}</button>
    <button data-original-edge="first" aria-label="跳到首页">${artwork('98641')}</button>
   </div>
   <div class="native-original-pages original-spread-pages">${pageFigures(data)}<button class="original-open-cover" type="button" aria-label="打开杂志封面"></button></div>
   <div class="original-rail original-rail-right" aria-label="原貌阅读工具">
    <button data-original-directory aria-label="原貌目录" aria-expanded="false">${artwork('8d639')}</button>
    <div class="original-rail-group">
     <button data-original-step="1" aria-label="下一原貌页">${artwork('5623e')}</button>
     <button data-original-edge="last" aria-label="跳到末页">${artwork('0fb05')}</button>
    </div>
    <button class="original-mode-active" data-original-close aria-label="切换为文本阅读">${icon('double')}</button>
    <button data-original-more aria-label="更多阅读选项" aria-expanded="false">${artwork('cc41b')}</button>
   </div>
   <output class="original-spread-number" aria-live="polite"></output>
   <section class="original-thumbnail-directory" aria-label="原貌目录" hidden>${thumbnails}</section>
   <div class="original-spread-panel" aria-label="背景色" hidden>
    <strong>阅读背景</strong>
    <div class="original-color-options">${Object.entries(colors).map(([color,label])=>`<button type="button" data-original-color="${color}" aria-pressed="${color==='white'}"><span></span>${label}</button>`).join('')}</div>
    <a href="${data.source}" target="_blank" rel="noopener">在官网查看原貌</a>
   </div>`;
  const stage=dialog.querySelector('.original-spread-pages');
  const figures=[...stage.querySelectorAll('figure')];
  const panel=dialog.querySelector('.original-spread-panel');
  const directory=dialog.querySelector('.original-thumbnail-directory');
  const coverButton=stage.querySelector('.original-open-cover');
  const breakpoint=matchMedia('(max-width:760px)');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let current=0, opening=null;
  function loadPage(figure){
   figure.querySelectorAll('img[data-src]').forEach(img=>{img.src=img.dataset.src;delete img.dataset.src;});
  }
  const spreadSize=()=>breakpoint.matches?1:2;
  const startAt=index=>index===0?0:1+Math.floor((index-1)/spreadSize())*spreadSize();
  const lastStart=()=>startAt(figures.length-1);
  function showPanel(mode){
   directory.hidden=mode!=='directory';panel.hidden=mode!=='more';
   dialog.querySelector('[data-original-directory]').setAttribute('aria-expanded',String(!directory.hidden));
   dialog.querySelector('[data-original-more]').setAttribute('aria-expanded',String(!panel.hidden));
   stage.inert=!directory.hidden;
   dialog.classList.toggle('is-directory',!directory.hidden);
  }
  function enterCover(){
   if(reduced.matches)return;
   figures[0].animate([
    {transform:'perspective(1100px) translateY(110dvh) rotateX(26deg) rotateY(-14deg)',opacity:.45},
    {transform:'translateY(-2%) var(--original-cover-pose)',opacity:1,offset:.82},
    {transform:'var(--original-cover-pose)',opacity:1}
   ],{duration:650,easing:'cubic-bezier(.2,.75,.25,1)'});
  }
  function draw(){
   if(!dialog.open)return;
   const start=startAt(current),size=start===0?1:spreadSize();
   dialog.classList.toggle('is-cover',start===0);coverButton.hidden=start!==0;
   const visible=data.pages.slice(start,start+size);
   const widthLimit=stage.clientWidth/size;
   const height=Math.min(stage.clientHeight,...visible.map(p=>widthLimit*p.height/p.width));
   if(start===0){coverButton.style.width=height*visible[0].width/visible[0].height+"px";coverButton.style.height=height+"px";}
   figures.forEach((figure,index)=>{
    figure.hidden=index<start||index>=start+visible.length;
    if(figure.hidden)return;
    const page=data.pages[index], tiles=figure.querySelector('.native-original-tiles');
    tiles.style.width=height*page.width/page.height+'px';
    tiles.style.height=height+'px';
    loadPage(figure);
   });
   const first=visible[0].page,last=visible.at(-1).page;
   dialog.querySelector('output').textContent=(first===last?first:first+'–'+last)+'  共 '+figures.length+' 页';
   directory.querySelectorAll('[data-original-jump]').forEach(item=>item.setAttribute('aria-current',String(Number(item.dataset.originalJump)===data.pages[startAt(current)].page)));
   dialog.querySelectorAll('[data-original-step="-1"],[data-original-edge="first"]').forEach(button=>button.disabled=start===0);
   dialog.querySelectorAll('[data-original-step="1"],[data-original-edge="last"]').forEach(button=>button.disabled=start===lastStart());
  }
  async function openCover(){
   const cover=figures[0], left=figures[1], right=figures[2];
   const front=cover.querySelector('.native-original-tiles');
   const initialWidth=front.offsetWidth,initialHeight=front.offsetHeight;
   const [leftPage,rightPage]=data.pages.slice(1,3);
   const height=Math.min(stage.clientHeight,stage.clientWidth/2*leftPage.height/leftPage.width,
    stage.clientWidth/2*rightPage.height/rightPage.width);
   const leftWidth=height*leftPage.width/leftPage.height,rightWidth=height*rightPage.width/rightPage.height;
   const shift=(leftWidth-rightWidth)/2+initialWidth/2;
   const pose=getComputedStyle(cover).transform;
   cover.getAnimations().forEach(animation=>animation.cancel());
   const reset=cover.animate([
    {transform:pose},
    {transform:`translateX(${shift}px) scale(${rightWidth/initialWidth}, ${height/initialHeight})`}
   ],{duration:240,easing:'cubic-bezier(.2,.7,.25,1)',fill:'forwards'});
   opening=reset;
   try {await reset.finished;} catch {return;}
   if(!dialog.open||opening!==reset)return;
   current=1;draw();
   const leaf=document.createElement('div');
   leaf.className='original-turning-leaf';
   leaf.setAttribute('aria-hidden','true');
   leaf.style.left=right.offsetLeft+'px';
   leaf.style.top=right.offsetTop+'px';
   leaf.style.width=rightWidth+'px';leaf.style.height=height+'px';
   const back=left.querySelector('.native-original-tiles').cloneNode(true);
   const face=front.cloneNode(true);
   face.classList.add('original-leaf-front');back.classList.add('original-leaf-back');
   for(const side of [face,back]){
    side.style.width='100%';side.style.height='100%';
    side.querySelectorAll('img').forEach(img=>img.loading='eager');
   }
   leaf.append(face,back);stage.append(leaf);
   left.style.visibility='hidden';
   reset.cancel();
   const flip=leaf.animate([
    {transform:'rotateY(0deg)'},{transform:'rotateY(-180deg)'}
   ],{duration:610,easing:'cubic-bezier(.35,.12,.25,1)',fill:'forwards'});
   opening=flip;
   try {await flip.finished;} catch {} finally {
    leaf.remove();left.style.visibility='';
    if(opening===flip)opening=null;
   }
  }
  function go(index){
   if(opening)return;
   const next=Math.max(0,Math.min(figures.length-1,index));
   if(current===0&&next===1&&spreadSize()===2&&figures.length>=3&&!reduced.matches){
    void openCover();return;
   }
   current=next;draw();
  }
  function step(direction){
   showPanel(null);
   const start=startAt(current);
   go(direction>0?(start===0?1:start+spreadSize()):start-spreadSize());
  }
  const observer=new ResizeObserver(draw);
  dialog.addEventListener('click',event=>{
   const button=event.target.closest('button');
   if(!button)return;
   if(button.hasAttribute('data-original-close'))dialog.close();
   if(button===coverButton)step(1);
   if(button.dataset.originalStep)step(Number(button.dataset.originalStep));
   if(button.dataset.originalEdge){showPanel(null);go(button.dataset.originalEdge==='first'?0:lastStart());}
   if(button.hasAttribute('data-original-directory'))showPanel(directory.hidden?'directory':null);
   if(button.hasAttribute('data-original-more'))showPanel(panel.hidden?'more':null);
   if(button.dataset.originalJump){
    showPanel(null);go(data.pages.findIndex(page=>page.page===Number(button.dataset.originalJump)));
    dialog.querySelector('[data-original-directory]').focus();
   }
   if(button.dataset.originalColor){
    dialog.dataset.background=button.dataset.originalColor;
    panel.querySelectorAll('button').forEach(option=>option.setAttribute('aria-pressed',String(option===button)));
   }
  });
  dialog.addEventListener('keydown',event=>{
   if(event.key==='Escape'&&(!directory.hidden||!panel.hidden)){
    event.preventDefault();
    const control=dialog.querySelector('[aria-expanded="true"]');showPanel(null);control?.focus();
   }
   if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
   event.preventDefault();step(event.key==='ArrowLeft'?-1:1);
  });
  trigger.addEventListener('click',()=>{
   if(dialog.open)return;
   const from=tools.getBoundingClientRect();
   current=0;
   host.classList.add('native-spread-open');
   trigger.setAttribute('aria-pressed','true');
   dialog.showModal();observer.observe(stage);draw();enterCover();
   figures.slice(1,3).forEach(loadPage);
   if(!reduced.matches){
    const rail=dialog.querySelector('.original-rail-right'),to=rail.getBoundingClientRect();
    rail.animate([
     {translate:`${from.x+from.width/2-to.x-to.width/2}px ${from.y+from.height/2-to.y-to.height/2}px`},
     {translate:'0 0'}
    ],{duration:450,easing:'cubic-bezier(.2,.75,.25,1)'});
   }
  });
  dialog.addEventListener('close',()=>{
   opening?.cancel();opening=null;
   observer.disconnect();host.classList.remove('native-spread-open');trigger.setAttribute('aria-pressed','false');showPanel(null);
  });
  states.set(host,dialog);tools.append(trigger);host.append(dialog);
 }
 function mount(host,tools){
  if(!host||!tools||states.has(host))return;
  const data=window.magazineOriginalData;if(!data?.pages?.length)return;
  const button=document.createElement('button');button.type='button';button.className='native-original-toggle rd-button pe-icon-button';button.setAttribute('aria-label','切换为原貌阅读');button.setAttribute('title','原貌阅读');button.setAttribute('aria-pressed','false');button.innerHTML=icon('double')+'<span class="pe-tooltip">原貌阅读</span>';
  if(tools.matches('.portal-reader-tools')){mountSpread(host,tools,data,button);return;}
  const view=document.createElement('section');view.className='native-original-view';view.hidden=true;view.setAttribute('aria-label','第一财经原貌试读');
  view.innerHTML=`<header class="native-original-heading"><div><span class="pe-kicker">ORIGINAL EDITION</span><h2>第一财经 · 原貌阅读</h2><p>2026年09期 · 已收录11页试读</p></div></header><div class="native-original-controls"><button type="button" data-native-prev aria-label="上一原貌页">${icon('Arrow_Forward-2')}</button><label>原貌页 <select aria-label="跳转原貌页">${data.pages.map(p=>`<option value="${p.page}">${String(p.page).padStart(2,'0')}</option>`).join('')}</select> / ${data.pages.length}</label><button type="button" data-native-next aria-label="下一原貌页">${icon('Arrow_Forward-2')}</button></div><div class="native-original-pages">${pageFigures(data)}</div><p class="native-original-end">已读完本地收录的试读部分。<a href="${data.source}" target="_blank" rel="noopener">前往官方继续阅读</a></p>`;
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
   state.original=!state.original;host.classList.toggle('native-original-mode',state.original);view.hidden=!state.original;button.setAttribute('aria-pressed',String(state.original));button.setAttribute('aria-label',state.original?'切换为文本阅读':'切换为原貌阅读');button.title=state.original?'文本阅读':'原貌阅读';button.innerHTML=icon(state.original?'FontNew':'double')+`<span class="pe-tooltip">${state.original?'文本阅读':'原貌阅读'}</span>`;
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
