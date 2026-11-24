/* Shared route motion for local documents, hash routes, and browser history. */
(()=>{
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const root=()=>document.querySelector('#app > .view.active,#portal-main,body > main:not(#app)');
 const easing='cubic-bezier(.23,1,.32,1)';
 const handoffKey='club-publication-arrival';
 let coverFlight=null,historyRestore=null;
 const content=main=>main?.querySelector('.oc-publication .oc-main')||main;
 const special=()=>!!document.querySelector('.book-opening-stage,.publication-entry-stage,.book-entry-veil');
 let sequence=0,exitAnimation=null,entryAnimation=null,routeFrame=0,lastURL=location.href;
 const boot=document.documentElement;
 boot.classList.add('club-motion-boot');
 function cancel(){
  coverFlight?.remove();coverFlight=null;
  entryAnimation?.cancel();
  entryAnimation=null;
  exitAnimation?.cancel();
  exitAnimation=null;
  cancelAnimationFrame(routeFrame);
 }
 function remember(){
  if(!document.querySelector('#view-find.active,#view-magazines.active'))return;
  try{history.replaceState({...history.state,clubScroll:scrollY},'');}catch{}
 }
 function restore(){
  if(historyRestore===null)return;
  const y=historyRestore;
  historyRestore=null;
  requestAnimationFrame(()=>scrollTo({top:y,behavior:'instant'}));
 }
 function enter(){
  const main=root();
  let arrival=false;
  try{
   const pending=JSON.parse(sessionStorage.getItem(handoffKey)||'null');
   arrival=pending?.url===location.href&&Date.now()-pending.at<10000;
   if(arrival)sessionStorage.removeItem(handoffKey);
  }catch{}
  if(main&&!reduced()&&!special()){
   if(arrival){
    main.querySelector('.mh-identity')?.animate([{opacity:0,translate:'0 9px'},{opacity:1,translate:'0 0'}],{duration:220,easing});
    main.querySelector('.mh-shelf')?.animate([{opacity:0},{opacity:1}],{duration:220,easing});
   }else if(!main.matches('#view-home')&&!main.querySelector('.people-guide-hero,.books-home-hero,.magazines-home-hero')){
    entryAnimation=content(main).animate([{opacity:.35},{opacity:1}],{duration:200,easing});
   }
  }
  boot.classList.remove('club-motion-boot','club-motion-pending');
  if(!document.querySelector('#view-find.active'))restore();
 }
 async function publicationHome(destination,image){
  const target=new URL(destination,location.href);
  remember();
  const token=++sequence;cancel();
  if(!reduced()&&image?.complete&&image.naturalWidth){
   const bounds=image.getBoundingClientRect();
   if(bounds.width&&bounds.height){
    const proxy=image.cloneNode();
    proxy.removeAttribute('id');proxy.removeAttribute('class');
    proxy.className='club-publication-flight';
    proxy.setAttribute('aria-hidden','true');
    Object.assign(proxy.style,{left:bounds.left+'px',top:bounds.top+'px',width:bounds.width+'px',height:bounds.height+'px'});
    coverFlight=proxy;document.body.append(proxy);
    exitAnimation=image.animate([{opacity:0},{opacity:0}],{duration:140,fill:'both'});
    const x=(innerWidth/2-bounds.left-bounds.width/2)*.09;
    await proxy.animate([{transform:'perspective(1000px) rotateY(-12deg)',opacity:1},{transform:`perspective(1000px) translate(${x}px,-10px) rotateY(0deg) scale(1.025)`,opacity:0}],{duration:140,easing,fill:'forwards'}).finished.catch(()=>{});
   }
  }
  if(token!==sequence)return;
  try{sessionStorage.setItem(handoffKey,JSON.stringify({url:target.href,at:Date.now()}));}catch{}
  location.assign(target.href);
 }
 function scheduleEntry(){
  cancelAnimationFrame(routeFrame);
  routeFrame=requestAnimationFrame(enter);
 }
 async function navigate(destination){
  const target=new URL(destination,location.href);if(target.href===location.href)return;
  if(target.origin!==location.origin||target.protocol!==location.protocol){location.assign(target.href);return;}
  remember();
  const sameDocument=target.pathname===location.pathname&&target.search===location.search;
  if(sameDocument){
   const token=++sequence;cancel();
   const surface=content(root());
   const navigationExit=window.clubNavigation?.exitTo(target);
   if(surface&&!reduced()&&!special()){
    exitAnimation=surface.animate([{opacity:1},{opacity:.55}],{duration:90,easing,fill:'forwards'});
    await Promise.all([exitAnimation.finished.catch(()=>{}),navigationExit]);
   }else if(navigationExit)await navigationExit;
   if(token===sequence)location.hash=target.hash;
   return;
  }
  const token=++sequence;cancel();const main=root();
  const navigationExit=window.clubNavigation?.exitTo(target);
  if(main&&!reduced()&&!special()){
   exitAnimation=main.animate([{opacity:1},{opacity:.55}],{duration:110,easing,fill:'forwards'});await Promise.all([exitAnimation.finished.catch(()=>{}),navigationExit]);
  }else await navigationExit;
  if(token===sequence)location.assign(target.href);
 }
 async function back(fallback){const token=++sequence;cancel();const main=root();
  const previous=window.navigation?.entries().find(entry=>entry.index===window.navigation.currentEntry?.index-1)?.url;
  const navigationExit=window.clubNavigation?.exitTo(previous||fallback);
  if(main&&!reduced()){
   exitAnimation=main.animate([{opacity:1},{opacity:.55}],{duration:110,easing,fill:'forwards'});
   await Promise.all([exitAnimation.finished.catch(()=>{}),navigationExit]);
  }else await navigationExit;if(token!==sequence)return;if(history.length>1)history.back();else navigate(fallback||new URL('index.html',document.currentScript?.src||location.href));}
 window.clubPageMotion={navigate,back,publicationHome,restore,update(callback){++sequence;cancel();callback();scheduleEntry();}};
 window.addEventListener('hashchange',()=>{
  if(lastURL===location.href)return;
  const previous=new URL(lastURL);lastURL=location.href;
  if(previous.hash.split('?')[0]===location.hash.split('?')[0]&&location.hash.startsWith('#/find'))return;if(!document.querySelector('#app,#portal-main')&&!location.hash.startsWith('#/'))return;++sequence;cancel();
  scheduleEntry();
 },true);
 document.addEventListener('click',event=>{
  const link=event.target.closest('a[href]');if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.hasAttribute('download')||link.target&&link.target!=='_self')return;
  if(link.matches('.login,.nav-login,[data-club-login],[data-publication-opening]'))return;
  const target=new URL(link.href,location.href);if(target.origin!==location.origin||target.protocol!==location.protocol||target.href===location.href)return;
  const sameDocument=target.pathname===location.pathname&&target.search===location.search;
  if(sameDocument&&!link.closest('body > header .qikan-nav nav,.oc-dock')){remember();return;}
  // Specialized magazine links outside the header retain their route handlers.
  event.preventDefault();event.stopImmediatePropagation();navigate(target.href);
 },true);
 window.addEventListener('popstate',()=>{historyRestore=history.state?.clubScroll??null;});
 document.addEventListener('DOMContentLoaded',()=>{
  if(performance.getEntriesByType('navigation')[0]?.type==='back_forward')historyRestore=history.state?.clubScroll??null;
  scheduleEntry();
 },{once:true});
 window.addEventListener('pageshow',event=>{if(event.persisted){cancel();lastURL=location.href;}});
 window.addEventListener('pagehide',()=>{++sequence;cancel();boot.classList.remove('club-motion-boot');});
 // A failed optional page initializer must never leave the content hidden.
 setTimeout(()=>boot.classList.remove('club-motion-boot'),1800);
})();
