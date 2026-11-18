/* Reading pages stay within the original periodical network's navigation system. */
(()=>{
 const normalize=()=>document.querySelectorAll('a[href]').forEach(a=>{if(a.dataset.networkAdapted)return;const raw=a.getAttribute('href');if(raw?.includes('index.html?nav=club'))a.href=raw.replace('index.html?nav=club','index.html');a.dataset.networkAdapted='true';});normalize();new MutationObserver(normalize).observe(document.body,{childList:true,subtree:true});
function activeNavigation(){const parts=location.hash.split('?'),path=parts[0],context=new URLSearchParams(parts[1]);const active=path.startsWith('#/book/')||context.get('context')==='book'?'books':path.startsWith('#/article/')?'magazines':'';document.querySelectorAll('.site-header nav a').forEach(a=>{if(active&&a.hash==='#/'+active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});}window.addEventListener('hashchange',activeNavigation);activeNavigation();
})();
