/* Publication home destinations, distinct from reading and membership routes. */
(()=>{
 const destinations={'第一财经':'magazine-home.html','南风窗':'magazine-home.html?publication=nanfc'};
 window.magazineHomeDestination=name=>Object.hasOwn(destinations,name)?destinations[name]:window.magazinesHomeData?.magazines.some(m=>m.title===name)?'magazine-home.html?publication='+encodeURIComponent(name):null;

 window.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const link=event.target.closest('a');
  if(!link||link.target==='_blank')return;
  const destination=link.matches('.magazines-home-cover-link,.magazines-home-read,.magazines-all-card')&&link.getAttribute('href')?.startsWith('magazine-home.html')
   ?link.getAttribute('href')
   :link.hash.startsWith('#/magazine/')&&window.magazineHomeDestination(decodeURIComponent(link.hash.slice('#/magazine/'.length)));
  if(!destination)return;
  event.preventDefault();
  event.stopImmediatePropagation();
  const image=link.querySelector('img')||link.closest('.magazines-home-feature')?.querySelector('.magazines-home-cover img');
  if(window.clubPageMotion)window.clubPageMotion.publicationHome(destination,image);
  else location.assign(destination);
 },true);
})();
