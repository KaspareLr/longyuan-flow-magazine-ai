/* Shared route motion for local documents, hash routes, and browser history. */
(()=>{
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const root=()=>document.querySelector('#view-home.active')?null:document.querySelector('#portal-main,#app,body>main');
 const special=()=>!!document.querySelector('.book-opening-stage,.publication-entry-stage,.book-entry-veil');
 let sequence=0,exitAnimation=null,entryAnimation=null,routeFrame=0,lastURL=location.href;
 const boot=document.documentElement;
 boot.classList.add('club-motion-boot');
 function cancel(){
  entryAnimation?.cancel();
  entryAnimation=null;
  exitAnimation?.cancel();
  exitAnimation=null;
  cancelAnimationFrame(routeFrame);
  boot.classList.remove('club-motion-pending');
 }
 function enter(){
  const main=root();
  if(main&&!reduced()&&!special()&&!main.querySelector('.people-guide-hero,.view.active .books-home-hero,.view.active .magazines-home-hero')){
   entryAnimation=main.animate([{opacity:0},{opacity:1}],{duration:280,easing:'cubic-bezier(.2,.8,.2,1)'});
  }
  boot.classList.remove('club-motion-boot','club-motion-pending');
 }
 function scheduleEntry(){
  cancelAnimationFrame(routeFrame);
  if(!reduced()&&!special())boot.classList.add('club-motion-pending');
  routeFrame=requestAnimationFrame(enter);
 }
 async function navigate(destination){
  const target=new URL(destination,location.href);if(target.href===location.href)return;
  if(target.origin!==location.origin||target.protocol!==location.protocol){location.assign(target.href);return;}
  const sameDocument=target.pathname===location.pathname&&target.search===location.search;
  if(sameDocument){
   const token=++sequence;
   const navigationExit=window.clubNavigation?.exitTo(target);
   if(navigationExit)await navigationExit;
   if(token===sequence)location.hash=target.hash;
   return;
  }
  const token=++sequence;cancel();const main=root();
  const navigationExit=window.clubNavigation?.exitTo(target);
  if(main&&!reduced()&&!special()){
   exitAnimation=main.animate([{opacity:1},{opacity:0}],{duration:180,easing:'ease-in',fill:'forwards'});await Promise.all([exitAnimation.finished.catch(()=>{}),navigationExit]);
  }else await navigationExit;
  if(token===sequence)location.assign(target.href);
 }
 async function back(fallback){const token=++sequence;cancel();const main=root();
  const previous=window.navigation?.entries().find(entry=>entry.index===window.navigation.currentEntry?.index-1)?.url;
  const navigationExit=window.clubNavigation?.exitTo(previous||fallback);
  if(main&&!reduced()){
   exitAnimation=main.animate([{opacity:1},{opacity:0}],{duration:160,easing:'ease-in',fill:'forwards'});
   await Promise.all([exitAnimation.finished.catch(()=>{}),navigationExit]);
  }else await navigationExit;if(token!==sequence)return;if(history.length>1)history.back();else navigate(fallback||new URL('index.html',document.currentScript?.src||location.href));}
 window.clubPageMotion={navigate,back,update(callback){++sequence;cancel();callback();scheduleEntry();}};
 window.addEventListener('hashchange',()=>{
  if(lastURL===location.href)return;lastURL=location.href;if(!document.querySelector('#app,#portal-main')&&!location.hash.startsWith('#/'))return;++sequence;cancel();
  scheduleEntry();
 },true);
 document.addEventListener('click',event=>{
  const link=event.target.closest('a[href]');if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.hasAttribute('download')||link.target&&link.target!=='_self')return;
  if(link.matches('.login,.nav-login,[data-club-login]'))return;
  const target=new URL(link.href,location.href);if(target.origin!==location.origin||target.protocol!==location.protocol||target.href===location.href)return;
  const sameDocument=target.pathname===location.pathname&&target.search===location.search;
  if(sameDocument&&!link.closest('body > header .qikan-nav nav'))return;
  // Specialized magazine links outside the header retain their route handlers.
  event.preventDefault();event.stopImmediatePropagation();navigate(target.href);
 },true);
 document.addEventListener('DOMContentLoaded',scheduleEntry,{once:true});
 window.addEventListener('pageshow',event=>{if(event.persisted){cancel();lastURL=location.href;}});
 window.addEventListener('pagehide',()=>{++sequence;cancel();boot.classList.remove('club-motion-boot');});
 // A failed optional page initializer must never leave the content hidden.
 setTimeout(()=>boot.classList.remove('club-motion-boot'),1800);
})();
