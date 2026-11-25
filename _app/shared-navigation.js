/* Split the back control out of the navigation island without moving page content. */
(()=>{
 const running=new WeakMap();
 const exiting=new WeakMap();
 const mobile=matchMedia('(max-width:760px)');
 const backControls=new Map();
 let pendingExit;
 const enterDuration=680, exitDuration=420;
 const enterEase='cubic-bezier(.22,1,.36,1)';
 const exitEase='cubic-bezier(.64,0,.78,0)';
 function splitFrames(offset){
  return [
   {opacity:0,transform:`translateX(${offset}px) scale(.32,.78)`,borderRadius:'20px',offset:0},
   {opacity:.8,transform:`translateX(${offset*.3}px) scale(1.14,.88)`,borderRadius:'40px',offset:.38},
   {opacity:1,transform:'translateX(0) scale(1)',borderRadius:'100px',offset:1}
  ];
 }

 window.clubNavigation={setBack(back,visible,updateLayout){
  if(!back)return;
  backControls.set(back,{visible,updateLayout});
  visible=visible&&mobile.matches;
  if(!mobile.matches){
   exiting.get(back)?.remove();
   exiting.delete(back);
   running.get(back)?.cancel();
   running.get(back.parentElement.querySelector('.nav-shell,.nav-island'))?.cancel();
   back.hidden=true;
   updateLayout?.(false);
   return;
  }
  if(back.hidden===!visible){updateLayout?.(visible);return;}
  const header=back.parentElement,island=header.querySelector('.nav-shell,.nav-island');
  const before=island.getBoundingClientRect(), oldBack=back.getBoundingClientRect();
  const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  exiting.get(back)?.remove();
  exiting.delete(back);
  for(const el of [back,island]){running.get(el)?.cancel();running.delete(el)}
  back.hidden=!visible;
  updateLayout?.(visible);
  if(reduced)return;
  const after=island.getBoundingClientRect();
  const easing=visible?enterEase:exitEase;
  const duration=visible?enterDuration:exitDuration;
  const body=island.animate([{transform:`translateX(${before.left-after.left}px)`},{transform:'translateX(0)'}],{duration,easing});running.set(island,body);
  if(!visible){
   const visual=back.cloneNode(true);
   visual.hidden=false;
   visual.inert=true;
   visual.setAttribute('aria-hidden','true');
   Object.assign(visual.style,{position:'fixed',inset:'auto',left:oldBack.left+'px',top:oldBack.top+'px',
    width:oldBack.width+'px',height:oldBack.height+'px',pointerEvents:'none',zIndex:'1'});
   header.append(visual);
   exiting.set(back,visual);
   const offset=after.left+14-oldBack.left;
   const clearance=Math.max(0,before.left-oldBack.right);
   const fadeTravel=Math.min(Math.max(0,offset),clearance*.45);
   const exit=visual.animate([
    {opacity:1,transform:'translateX(0) scale(1)',offset:0},
    {opacity:0,transform:`translateX(${fadeTravel}px) scale(.82)`,offset:.45},
    {opacity:0,transform:`translateX(${offset}px) scale(.32,.78)`,offset:1}
   ],{duration,easing:'linear',fill:'forwards'});
   exit.onfinish=()=>{
    visual.remove();
    if(exiting.get(back)===visual)exiting.delete(back);
   };
   return exit.finished.catch(()=>{});
  }
  const offset=before.left+14-back.getBoundingClientRect().left;
  const split=back.animate(splitFrames(offset),{duration,easing});running.set(back,split);
  const arrow=back.querySelector('img');if(arrow)arrow.animate([{opacity:0,translate:'5px 0'},{opacity:1,translate:'0 0'}],{duration:330,delay:170,easing,fill:'backwards'});
 },exitTo(target){
  if(!target)return;
  const url=new URL(target,location.href);
  const route=url.hash.replace(/^#\/?/,'').split('?')[0];
  const noBack=/\/index\.html$|\/$/.test(url.pathname)&&['','frontpage','home','magazines','academic','books','topics','search','find','kexin'].includes(route);
  if(!noBack)return;
  if(pendingExit)return pendingExit;
  const back=document.querySelector('body > header > :is(.portal-back,.detail-page-back):not([hidden])');
  const animation=this.setBack(back,false,()=>back.parentElement.classList.remove('has-detail-back'));
  if(animation)pendingExit=animation.finally(()=>{pendingExit=null;});
  return pendingExit;
 }};
 mobile.addEventListener('change',()=>{
  for(const [back,options] of backControls){
   if(back.isConnected)window.clubNavigation.setBack(back,options.visible,options.updateLayout);
   else backControls.delete(back);
  }
 });
})();
