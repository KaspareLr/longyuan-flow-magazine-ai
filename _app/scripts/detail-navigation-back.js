/* Detail pages share the existing independent navigation back control. */
(()=>{
 const header=document.querySelector('body>.topbar');if(!header)return;
 const back=document.createElement('button');back.className='detail-page-back';back.type='button';back.hidden=true;back.setAttribute('aria-label','返回上一级');back.title='返回上一级';back.innerHTML='<img src="assets/navigation/back-arrow.svg" alt="" width="10.5" height="10">';header.prepend(back);
 function sync(){
  const [path,query]=location.hash.replace(/^#\/?/,'').split('?'),[type,id]=path.split('/'),q=new URLSearchParams(query);
  let fallback=null;
  if(type==='package'&&id)fallback='#/magazines';
  if(type==='topic'&&id)fallback='#/topics';
  if(type==='book'&&id)fallback='#/books';
  if(type==='magazine'&&id&&!q.has('page')&&q.get('club')!=='1'&&(q.get('claimed')==='0'||(q.get('claimed')!=='1'&&decodeURIComponent(id)!=='南风窗')))fallback='#/magazines';
  back.dataset.fallback=fallback||'';header.classList.toggle('has-detail-back',!!fallback);window.clubNavigation.setBack(back,!!fallback);
 }
 back.onclick=()=>{if(back.dataset.fallback)window.clubPageMotion.back(back.dataset.fallback);};
 window.addEventListener('hashchange',sync);sync();
})();
