/* Cover entries represent the publication; issue reading remains a separate destination. */
(()=>{
 window.addEventListener('click',event=>{if(event.defaultPrevented||event.button||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;const a=event.target.closest('a');if(!a)return;let url;try{url=new URL(a.href,location.href);}catch{return;}if(decodeURIComponent(url.hash)==='#/magazine/第一财经'){event.preventDefault();event.stopImmediatePropagation();location.href=new URL('magazine-home.html',location.href).href;}},true);
})();
