/* Only resource details reserve layout space for the reading guide. */
(()=>{
 function sync(){const [path,query='']=location.hash.replace(/^#\/?/,'').split('?'),params=new URLSearchParams(query),portal=document.body.classList.contains('portal-body');const detail=portal?/^(book|article)\//.test(path):/^magazine\//.test(path)&&!params.has('page');document.body.classList.toggle('guide-layout-push',detail);document.body.classList.toggle('guide-layout-overlay',!detail);}
 window.addEventListener('hashchange',sync);sync();
})();
