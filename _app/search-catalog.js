/* Reading Club search adapter for the periodical demo. */
(()=>{
 const root=new URL('.',document.currentScript.src),url=p=>{const u=new URL(p,root);if(window.clubSession?.isFilledPreview&&u.pathname.endsWith('/portal.html'))u.searchParams.set('personalPreview','filled');return u.href;};
 const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const icon=n=>`<i class="iconfont icon-${n}" aria-hidden="true"></i>`;
 async function data(){for(const [global,file] of [['clubCatalogData','catalog-content.js'],['clubSharedContent','shared-content.js'],['clubPortalData','portal-data.js'],['periodicalReference','scripts/periodical-data.js'],['nanfcIssueReference','scripts/nanfc-reference.js']])if(!window[global])await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=url(file);s.onload=resolve;s.onerror=reject;document.head.append(s)});}
 function catalog(){const rows=[],add=(type,title,meta,cover,href,summary='')=>{if(title&&!rows.some(r=>r.type===type&&r.title===title))rows.push({type,title,meta:meta||'',cover:cover?url(cover):'',href:url(href),summary});};
 [...(window.clubPortalData?.books||[]),...(window.clubCatalogData?.books||[])].forEach(b=>add('图书',b.title,b.author,b.cover,'portal.html#/book/'+encodeURIComponent(b.id),b.summary));
 (window.clubCatalogData?.magazines||[]).forEach(m=>add('杂志',m.title,m.issue,m.cover,'index.html#/magazine/'+encodeURIComponent(m.title)+'?claimed=0',m.summary));
 for(const key of ['daily','articles'])(window.clubSharedContent?.[key]||[]).forEach((a,i)=>add('文章',a.title,a.author,a.cover,'portal.html#/article/'+(key==='daily'?'daily-':'shared-')+i,a.summary||a.excerpt));
 for(const [name,issue] of [['第一财经',window.periodicalReference],['南风窗',window.nanfcIssueReference],['十月少年文学',window.octoberIssueReference]]){let index=0;(issue?.groups||[]).forEach(g=>(g.articles||[]).forEach(a=>{add('文章',a.title,name+' · '+g.title,'','portal.html#/article/'+index+'?context=magazine&resource='+encodeURIComponent(name)+'&full=1',a.excerpt||'');index++;}));}
 return rows;}
 window.qikanSearchCatalog={escape:e,icon,url,loadData:data,catalog};
 const view=document.querySelector('#view-find');
 function renderSearch(){
   if(!view.classList.contains('active')){
     view.replaceChildren();
     return;
   }
   view.innerHTML=window.clubSearch.render();
   window.clubSearch.mount();
 }
 window.addEventListener('hashchange',renderSearch);
 renderSearch();
})();
