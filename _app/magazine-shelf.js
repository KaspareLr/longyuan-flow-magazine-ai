/* Reuses the discovery shelf RAF, drag, hover-wave, entrance and keyboard engine. */
const flowShelfData=window.magazineHomePublication.archiveRows
 .slice().sort((a,b)=>b.year-a.year||b.issue-a.issue).slice(0,20)
 .map(item=>({title:window.magazineHomePublication.name,issue:item.label,src:item.cover,url:item.label===window.magazineHomePublication.edition?window.magazineHomePublication.issue:item.url}));
(() => {
  const root=document.querySelector('.hero-shelf');
  const stage=root.querySelector('.shelf-stage');
  const count=flowShelfData.length;
  const issueTip=document.createElement('span');issueTip.className='mh-shelf-issue-tip';issueTip.setAttribute('aria-hidden','true');root.append(issueTip);let tipIndex=null;
  function updateIssueTip(){
   if(tipIndex===null||root.inert||root.classList.contains('is-dragging')){issueTip.classList.remove('is-visible');return;}
   const box=cards[tipIndex].getBoundingClientRect(),area=root.getBoundingClientRect(),offset=wrap(tipIndex-position),align=offset<-.5?'left':offset>.5?'right':'center';
   issueTip.textContent=flowShelfData[tipIndex].issue;issueTip.dataset.align=align;
   const x=align==='left'?box.left-area.left:align==='right'?box.right-area.left:box.left+box.width/2-area.left;
   issueTip.style.left=Math.max(8,Math.min(area.width-8,x))+'px';issueTip.style.top=Math.max(4,box.top-area.top-32)+'px';issueTip.classList.add('is-visible');
  }

  root.addEventListener('pointermove',event=>{if(event.pointerType==='touch')return;const card=event.target.closest('.shelf-cover');tipIndex=card?Number(card.dataset.index):null;updateIssueTip();});root.addEventListener('pointerleave',()=>{tipIndex=null;updateIssueTip();});root.addEventListener('focusin',event=>{const card=event.target.closest('.shelf-cover');tipIndex=card?Number(card.dataset.index):null;updateIssueTip();});root.addEventListener('focusout',()=>{tipIndex=null;updateIssueTip();});

  const initialIndex=0;
  let position=initialIndex,selected=initialIndex,frame=0,drag=null,suppressClick=false,wheelUntil=0,scrollScale=1,scrollSpread=1;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const normalize=n=>((n%count)+count)%count;
  const wrap=n=>normalize(n+count/2)-count/2;
  const cards=flowShelfData.map((item,index)=>{
    const button=document.createElement('button');
    button.type='button';button.className='shelf-cover';button.dataset.index=index;
    // Position is animated by requestAnimationFrame; CSS interpolation would sweep wrapped leaves through the shelf.
    button.style.transition='none';
    button.setAttribute('aria-label',item.title+' '+item.issue+'，点击阅读本期');
    const image=document.createElement('img');image.decoding='async';image.loading='eager';image.fetchPriority=index===initialIndex?'high':'low';image.src=item.src;image.alt=item.title+' '+item.issue+'封面';image.draggable=false;
    button.style.setProperty('--cover-art',`url("${new URL(item.src,document.baseURI).href}")`);image.className='shelf-front';const back=image.cloneNode(true);back.className='shelf-back';back.alt='';back.setAttribute('aria-hidden','true');const frontShadow=document.createElement('span');frontShadow.className='shelf-contact-shadow shelf-contact-front';frontShadow.setAttribute('aria-hidden','true');const backShadow=frontShadow.cloneNode();backShadow.className='shelf-contact-shadow shelf-contact-back';button.append(frontShadow,backShadow,image,back);stage.append(button);return button;
  });
  let hovered=null,waveFrame=0,waveTime=0;
  const lifts=cards.map(()=>0);
  function waveTarget(index){
    if(hovered===null||introPending||drag||reduced.matches)return 0;
    const distance=Math.abs(wrap(index-hovered));
    return Math.min(76,(cards[0].offsetHeight||400)*.085)*Math.exp(-distance*distance/1.65);
  }
  function animateWave(now){
    waveFrame=0;
    // Extraction owns the transforms until the magazine returns to the shelf.
    if(document.body.classList.contains('is-reading-publication')){waveTime=0;return}
    const dt=waveTime?Math.min(40,now-waveTime):16;waveTime=now;
    const blend=1-Math.exp(-dt/105);let moving=false;
    lifts.forEach((value,index)=>{const target=waveTarget(index);lifts[index]=value+(target-value)*blend;if(Math.abs(target-lifts[index])<.1)lifts[index]=target;else moving=true});
    render();if(moving)waveFrame=requestAnimationFrame(animateWave);else waveTime=0;
  }
  function setHover(index){if(root.inert){hovered=null;cancelAnimationFrame(waveFrame);waveFrame=0;waveTime=0;lifts.fill(0);return;}hovered=index;if(!waveFrame)waveFrame=requestAnimationFrame(animateWave)}
  new MutationObserver(()=>{if(!document.body.classList.contains('is-reading-publication'))setHover(null)}).observe(document.body,{attributes:true,attributeFilter:['class']});
  let introPending=!reduced.matches,introStart=null,introFrame=0;
  const entranceOrder=[...cards].sort((a,b)=>wrap(Number(a.dataset.index)-initialIndex)-wrap(Number(b.dataset.index)-initialIndex));
  const entranceRank=new Map(entranceOrder.map((card,i)=>[card,i]));
  function finishEntrance(){introPending=false;introStart=null;cancelAnimationFrame(introFrame);introFrame=0;root.removeAttribute('aria-busy');render()}
  function entranceOffset(card,offset){
    if(!introPending)return 0;
    const travel=stage.clientWidth*1.15+(count/2-offset)*spacing();
    if(introStart===null)return travel;
    const t=Math.max(0,Math.min(1,(performance.now()-introStart-entranceRank.get(card)*48)/1050));
    const u=t-1,overshoot=.58;
    const eased=1+(overshoot+1)*u*u*u+overshoot*u*u;
    return travel*(1-eased);
  }
  function startEntrance(){
    if(!introPending||introStart!==null)return;
    introStart=performance.now();root.setAttribute('aria-busy','true');
    function tick(){render();if(performance.now()-introStart<1050+(count-1)*48)introFrame=requestAnimationFrame(tick);else finishEntrance()}
    introFrame=requestAnimationFrame(tick);
  }
  function spacing(){return (cards[0].offsetHeight||400)*.14*scrollScale*scrollSpread}
  let announced=-1;
  function render(){
    if(announced!==selected){announced=selected;root.dispatchEvent(new CustomEvent("shelfchange",{detail:{index:selected}}));}
    const width=stage.clientWidth;if(!width)return;
    const baseHeight=cards[0].offsetHeight||400,gap=spacing(),topShift=baseHeight*(1-scrollScale)/2;
    stage.style.perspective=width*.78+'px';
    cards.forEach((card,index)=>{
      if(card.classList.contains('is-opening')||card.classList.contains('is-withdrawn'))return;
      const offset=wrap(index-position),distance=Math.abs(offset);
      // Fan outward progressively so peripheral covers present more area to the viewer.
      const yaw=90+26*Math.tanh(offset/2.6);
      card.style.transform=`translateX(calc(-50% + ${offset*gap+entranceOffset(card,offset)}px)) translateY(${-lifts[index]-topShift}px) rotateY(${yaw}deg) scale(${scrollScale})`;
      card.style.zIndex=String(Math.round(1000-distance*40));
      card.style.filter='';card.tabIndex=index===selected?0:-1;
      card.setAttribute('aria-pressed',String(index===selected));
    });
    updateIssueTip();
  }
  root.addEventListener('pointermove',event=>{
    if(introPending||drag||reduced.matches||event.pointerType==='touch')return;
    const card=event.target.closest('.shelf-cover');
    const index=card?Number(card.dataset.index):null;if(index!==hovered)setHover(index);
  });
  root.addEventListener('pointerleave',()=>setHover(null));
  root.addEventListener('focusin',event=>{const card=event.target.closest('.shelf-cover');if(card)setHover(Number(card.dataset.index))});
  root.addEventListener('focusout',()=>setHover(null));
  function stop(){cancelAnimationFrame(frame);frame=0}
  function settle(target){
    if(introPending)finishEntrance();
    setHover(null);stop();selected=normalize(Math.round(target));
    const start=position,end=position+wrap(target-position),delta=end-start;
    if(reduced.matches||Math.abs(delta)<.001){position=normalize(end);render();return}
    const began=performance.now(),duration=Math.min(650,380+Math.abs(delta)*55);
    function tick(now){const t=Math.min(1,(now-began)/duration);position=start+delta*(1-Math.pow(1-t,5));render();if(t<1)frame=requestAnimationFrame(tick);else{position=normalize(end);frame=0;render()}}
    frame=requestAnimationFrame(tick);
  }
  root.addEventListener('pointerdown',event=>{
    if(event.button!==0||event.isPrimary===false)return;
    if(introPending)finishEntrance();
    stop();drag={x:event.clientX,y:event.clientY,position,id:event.pointerId,axis:null};suppressClick=false;
  });
  root.addEventListener('pointermove',event=>{
    if(!drag||event.pointerId!==drag.id)return;
    const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
    if(!drag.axis&&Math.max(Math.abs(dx),Math.abs(dy))>6)drag.axis=Math.abs(dx)>Math.abs(dy)?'x':'y';
    if(drag.axis!=='x')return;
    setHover(null);suppressClick=true;root.setPointerCapture(event.pointerId);root.classList.add('is-dragging');
    position=drag.position-dx/spacing();render();
  });
  function finish(event){
    if(!drag||event.pointerId!==drag.id)return;
    const moved=drag.axis==='x';drag=null;root.classList.remove('is-dragging');
    if(root.hasPointerCapture(event.pointerId))root.releasePointerCapture(event.pointerId);
    if(moved)settle(Math.round(position));
  }
  root.addEventListener('pointerup',finish);root.addEventListener('pointercancel',finish);
  root.addEventListener('pointerleave',event=>{if(drag&&!root.hasPointerCapture(event.pointerId))finish(event)});
  root.addEventListener('click',event=>{
    if(suppressClick){suppressClick=false;return}
    const card=event.target.closest('.shelf-cover');if(!card)return;
    const index=Number(card.dataset.index);
    if(window.openShelfMagazine)window.openShelfMagazine(index);
  });
  root.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();settle(event.key==='Home'?0:event.key==='End'?count-1:selected+(event.key==='ArrowRight'?1:-1));root.focus({preventScroll:true});
  });
  root.addEventListener('wheel',event=>{
    // Horizontal trackpad gestures browse the shelf; vertical gestures keep normal page scrolling.
    if(Math.abs(event.deltaX)<=Math.abs(event.deltaY)||Math.abs(event.deltaX)<8)return;
    event.preventDefault();if(performance.now()<wheelUntil)return;
    wheelUntil=performance.now()+350;settle(selected+(event.deltaX>0?1:-1));
  },{passive:false});
  new ResizeObserver(render).observe(stage);window.addEventListener('hashchange',()=>{requestAnimationFrame(render);startEntrance()});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){if(introPending)finishEntrance();stop();position=selected;render()}});render();
  // Let local cover images decode before their first entrance, with a bounded fallback.
  Promise.race([Promise.allSettled(cards.flatMap(card=>Array.from(card.querySelectorAll('img')).map(img=>img.decode()))),new Promise(resolve=>setTimeout(resolve,1200))]).then(startEntrance);
  reduced.addEventListener('change',()=>{if(reduced.matches){if(introPending)finishEntrance();cancelAnimationFrame(waveFrame);waveFrame=0;hovered=null;lifts.fill(0);render()}});
  window.longyuanShelf={setScrollGeometry(scale,spread){scrollScale=scale;scrollSpread=spread;render();},setInteractive(enabled){root.inert=!enabled;if(!enabled){if(introPending)finishEntrance();setHover(null);stop();if(drag&&root.hasPointerCapture(drag.id))root.releasePointerCapture(drag.id);drag=null;root.classList.remove('is-dragging');}},move:delta=>{if(!root.inert)settle(selected+delta)},getState:()=>({selected,position,title:flowShelfData[selected].title,count})};

})();

(()=>{
 const shelf=document.querySelector('.mh-shelf');
 let opening=false;
 window.openShelfMagazine=async index=>{
  if(opening)return;
  const card=shelf.querySelector('[data-index="'+index+'"]'),item=flowShelfData[index];
  if(!card||!item||!window.longyuanOpenPublication)return;
  opening=true;
  window.longyuanShelf.setInteractive(false);
  // Render the flight in the shared viewport overlay, outside the shelf's 3D stack and mask.
  try{await window.longyuanOpenPublication(card.querySelector('.shelf-front'),item.url,card);}
  finally{opening=false;window.longyuanShelf.setInteractive(true);}
 };
})();
