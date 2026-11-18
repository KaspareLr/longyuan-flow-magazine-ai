// Reuse the shared hinged cover and publication opening interactions.
(()=>{
 function mount(){
  document.querySelectorAll('.mh-issue,.mh-latest-cover').forEach(link=>{
   if(link.querySelector('.hinged-cover'))return;
   const image=link.querySelector('img');if(!image)return;
   const cover=document.createElement('span');cover.className='hinged-cover';
   image.before(cover);cover.append(image);link.dataset.publicationOpening='';
  });
 }
 mount();new MutationObserver(mount).observe(document.querySelector('#archive-grid'),{childList:true});
})();
