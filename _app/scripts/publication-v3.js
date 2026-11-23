/* V3 reading-club sections, with per-publication content and existing destinations. */
(()=>{
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const arrow='<i class="iconfont icon-Arrow_Forward-2" aria-hidden="true"></i>';
 function publication(name){
  const finance=name==='第一财经',reference=finance?window.periodicalReference:window.nanfcIssueReference;
  const cover=finance?'assets/magazine-home/dycy202609-z.jpg':reference.cover;
  const path=index=>'portal.html#/article/'+index+'?context=magazine&resource='+encodeURIComponent(name);
  const articles=reference.groups.flatMap(group=>group.articles).map((article,index)=>({
   ...article,href:path(index)+'&full=1',
   image:article.cover||octoberClubData.daily[index%octoberClubData.daily.length]?.cover||cover
  }));
  const href=finance?path(0):'#/magazine/'+encodeURIComponent(name)+'?claimed=1&issue=0&club=1';
  return {name,cover,href,articles,issue:'2026年09期',
   summary:reference.intro,question:finance?'消费需求如何变成一个市场？':'报道中的细节如何帮助我们理解社会变化？'};
 }
 const header=(en,cn)=>`<header class="oc-heading"><span>${en}</span><h2>${cn}</h2></header>`;
 function cover(data,cls){
  return `<a class="${cls}" href="${data.href}" aria-label="阅读${data.name}"><span class="hinged-cover"><span class="cover-pages" aria-hidden="true"></span><img src="${escape(data.cover)}" alt="${data.name}封面"></span></a>`;
 }
 function recommendation(data){
  return `<section class="v3-recommendation v3-recommendation-magazine" aria-label="编辑推荐">
   <div class="v3-recommendation-copy"><h2>本期推荐</h2><p>${escape(data.summary)}</p><a class="oc-button oc-dark" href="${data.href}">立即阅读</a></div>
   <div class="v3-resource"><div class="v3-resource-copy">
    <div class="v3-resource-top"><div><h3>${data.name}</h3><p>${data.issue}</p></div><blockquote><strong>导读</strong><p>${data.question}</p></blockquote></div>
    <div class="v3-reason"><h3>为什么选它？</h3><p>从本期报道出发，带着一个问题读下去。</p></div>
   </div>${cover(data,'v3-cover-link magazine')}</div>
  </section>`;
 }
 function daily(data){
  return `<section class="oc-section oc-v3-daily" aria-label="每日一读">${header('DAILY READING','每日一读')}
   <div class="daily-window" tabindex="0" aria-label="横向浏览每日一读"><div class="daily-track">
   ${data.articles.slice(0,6).map(a=>`<a class="v3-daily" href="${escape(a.href)}"><img src="${escape(a.image)}" alt="" loading="lazy"><div><span class="v3-daily-progressive-blur" aria-hidden="true">${Array.from({length:8},(_,index)=>{
     const center=(index+1)*12.5;
     return `<span style="--daily-blur:${(index+1)*6.25}px;--daily-mask:linear-gradient(transparent ${center-12.5}%,black ${center}%${index<7?',transparent '+(center+12.5)+'%':''})"></span>`;
    }).join('')}</span><h3>${escape(a.title)}</h3><p>${data.name} · ${data.issue}</p></div></a>`).join('')}
   </div></div>
  </section>`;
 }
 function selected(data){
  return `<section class="oc-section oc-v3-selected">${header('SELECTED ARTICLES','精选文章')}<div class="v3-article-list">
   ${data.articles.slice(0,4).map((a,index)=>`<article class="v3-mixed-item"><a class="v3-mixed-cover" href="${escape(a.href)}"><span><img src="${escape(a.image)}" alt="" loading="lazy"></span></a>
    <div class="v3-mixed-content"><div class="v3-mixed-meta"><strong>${String(index+1).padStart(2,'0')}</strong><p>${data.name} · ${data.issue}</p></div>
    <div class="v3-mixed-summary"><h3><a href="${escape(a.href)}">${escape(a.title)}</a></h3><p>${escape(a.excerpt)}</p>
    <a class="v3-arrow" href="${escape(a.href)}" aria-label="阅读${escape(a.title)}">${arrow}</a></div></div></article>`).join('')}
  </div></section>`;
 }
 function topic(data){
  return `<section class="oc-feature" data-topic-static style="background-image:linear-gradient(90deg,#131921dd,#13192140),url('${escape(data.articles[0].image)}')">
   <div><span>本期专题 · ${data.issue}</span><h2>${data.name}</h2><p>${data.question}</p></div>
   <a class="oc-button oc-dark" href="${data.href}">阅读本期 ${arrow}</a></section>`;
 }
 window.publicationV3={publication,recommendation,daily,selected,topic};
})();
