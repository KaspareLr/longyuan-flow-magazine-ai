/* Publication home destinations, distinct from reading and membership routes. */
(()=>{
 const destinations={'第一财经':'magazine-home.html','南风窗':'magazine-home.html?publication=nanfc'};
 window.magazineHomeDestination=name=>Object.hasOwn(destinations,name)?destinations[name]:null;

 window.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const link=event.target.closest('a');
  if(!link||link.target==='_blank')return;
  const destination=link.matches('.magazines-home-cover-link')&&Object.values(destinations).includes(link.getAttribute('href'))
   ?link.getAttribute('href')
   :link.hash.startsWith('#/magazine/')&&window.magazineHomeDestination(decodeURIComponent(link.hash.slice('#/magazine/'.length)));
  if(!destination)return;
  event.preventDefault();
  event.stopImmediatePropagation();
  const image=link.querySelector('img');
  if(image&&window.longyuanOpenPublication)window.longyuanOpenPublication(image,destination,image.closest('[data-book-tilt],.hinged-cover')||image);
  else location.assign(destination);
 },true);
})();
