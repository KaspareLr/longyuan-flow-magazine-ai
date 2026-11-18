/* Editorial homepage: central lead, balanced supporting stories, and section-led browsing. */
(()=>{
 const view=document.querySelector('#view-frontpage');if(!view)return;
 const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const all=(window.nanfcIssueReference?.groups||[]).flatMap(g=>g.articles.map(a=>({...a,category:g.title}))).map((a,index)=>({...a,index,href:'portal.html#/article/'+index+'?context=magazine&resource='+encodeURIComponent('南风窗')}));
 const pictured=all.filter(a=>a.cover?.startsWith('assets/'));if(!pictured.length)return;
 const arrow='<i class="iconfont icon-Arrow_Forward-2" aria-hidden="true"></i>';
 const galleryImage=a=>window.articleImageSets?.[a.url]?.[0]?.src||'';
 const photo=a=>`<span class="frontpage-picture"><img src="${e(galleryImage(a))}" alt="" loading="lazy"></span>`;
 const byline=a=>`<span class="frontpage-byline">南风窗 · ${e(a.category)}</span>`;
 const story=(a,cls='',summary=false)=>`<a class="frontpage-story ${cls}" href="${e(a.href)}">${photo(a)}<div><h3>${e(a.title)}</h3>${summary&&wiredExcerpt(a)?`<p>${e(wiredExcerpt(a))}</p>`:''}${byline(a)}</div></a>`;
 const textRow=items=>`<div class="frontpage-text-row">${items.map(a=>`<a href="${e(a.href)}"><span class="frontpage-tag">${e(a.category)}</span><h3>${e(a.title)}</h3></a>`).join('')}</div>`;
 const sectionEnglish={'人物与生活':'PEOPLE & LIFE','观点':'PERSPECTIVES','社会观察':'SOCIETY','科技与未来':'TECHNOLOGY & FUTURE'};
 const title=(name,id,more='#/magazines')=>`<header class="frontpage-section-heading"><div class="frontpage-module-title"><span>${sectionEnglish[name]||''}</span><h2 id="${id}">${name}</h2></div></header>`;
 const moreButton=href=>`<a class="home-discovery-more frontpage-more" href="${href}">查看更多</a>`;
 const categoryLinks=items=>`<div class="frontpage-category-extra">${items.map(a=>`<a href="${e(a.href)}"><h3>${e(a.title)}</h3>${byline(a)}</a>`).join('')}</div>`;
 const category=(name,id,lead,side,extra,items)=>{
  const supplements=id==='frontpage-society'?{left:[pictured[22],pictured[23]],middle:[pictured[28],pictured[9]],right:[pictured[25],pictured[10],pictured[29]]}:{left:[pictured[17],pictured[6]],middle:[pictured[0],pictured[1]],right:[pictured[4],pictured[5],pictured[7],pictured[2],pictured[8],pictured[9]]};
  return `<section class="frontpage-category" id="${id}" aria-labelledby="${id}-heading">${title(name,id+'-heading')}<div class="frontpage-category-grid"><div class="frontpage-category-lead">${story(lead)}${categoryLinks(supplements.left)}</div><div class="frontpage-category-list">${[...items,extra,...supplements.middle].map(a=>`<a href="${e(a.href)}"><h3>${e(a.title)}</h3>${byline(a)}</a>`).join('')}</div><aside class="frontpage-category-side">${story(side)}${categoryLinks(supplements.right)}</aside></div></section>`;
 };
 const covers=[{title:'第一财经',file:'dycy202609-z',issue:'2026年第09期',copy:'探索一个明亮的商业世界。从公司、产业到消费与城市，在报道中理解身边的变化。'},{title:'读者',file:'duzh202619-z',issue:'2026年第19期',copy:'把阅读留给日常。从一个故事、一段文字开始，感受生活中细小而丰盈的时刻。'},{title:'财经',file:'caij202527-z',issue:'2025年第27期',copy:'以专业视角观察经济与商业，理解市场的脉动与时代的变化。'},{title:'中国新闻周刊',file:'xwzk202629-z',issue:'2026年第29期',copy:'在新闻背后，读懂人物、社会与正在发生的改变。'},{title:'世界博览',file:'jblz202618-z',issue:'2026年第18期',copy:'把视线投向世界，在不同的文化与生活中拓展认识。'},{title:'意林',file:'yili202614-z',issue:'2026年第14期',copy:'从故事里汲取成长的力量，在阅读中与新的自己相遇。'}];
 const wiredLead=pictured[16];
 const wiredExcerpt=a=>{
  const normalize=s=>String(s||'').replace(/[\s，。！？、：；“”‘’「」《》…,.!?:;"'·—（）()]/g,'');
  const title=normalize(a.title),seen=new Set();
  return (a.excerpt||'').split('\n').map(x=>x.trim().replace(/\.\.\.$/,'')).find(x=>{
   const key=normalize(x);if(!key||seen.has(key))return false;seen.add(key);
   return key!==title&&!title.startsWith(key)&&!/(剧照|供图|摄影|制作|创意图|图片|图源|^20\d\d年\d)/.test(x);
  })||'';
 };
 const wiredMeta=a=>`<span class="wired-byline">南风窗</span>`;
 const wiredPhoto=a=>`<span class="wired-photo"><img src="${e(galleryImage(a))}" alt="" loading="lazy"></span>`;
 const wiredSmall=a=>`<a class="wired-small-story" href="${e(a.href)}">${wiredPhoto(a)}<div><span class="wired-kicker">${e(a.category)}</span><h3>${e(a.title)}</h3>${wiredMeta(a)}</div></a>`;
 const wiredText=a=>`<a class="wired-text-story" href="${e(a.href)}"><span class="wired-kicker">${e(a.category)}</span><h3>${e(a.title)}</h3>${wiredExcerpt(a)?`<p>${e(wiredExcerpt(a))}</p>`:''}${wiredMeta(a)}</a>`;
 const wiredHero=`<section class="wired-firstscreen" aria-label="首页精选"><header class="wired-picks-heading"><span>TODAY’S PICKS</span><h2>今日精选</h2></header><header class="wired-rail-heading"><span>IN-DEPTH READS</span><h2>深度选读</h2></header><div class="wired-main"><a class="wired-lead" href="${e(wiredLead.href)}"><span class="wired-kicker">科技 · 时代观察</span><h3>${e(wiredLead.title)}</h3><p>${e(wiredExcerpt(wiredLead))}</p>${wiredMeta(wiredLead)}<span class="wired-main-picture"><img src="${e(galleryImage(wiredLead))}" alt="" fetchpriority="high" decoding="async"></span></a><div class="wired-main-bottom">${[pictured[26],pictured[3],pictured[6],pictured[10]].map(wiredText).join('')}</div></div><div class="wired-left">${[pictured[27],pictured[12],pictured[11],pictured[14],pictured[15],pictured[17],pictured[18],pictured[25]].map(wiredSmall).join('')}</div><aside class="wired-rail"><div class="wired-rail-list">${[pictured[22],pictured[23],pictured[24]].map(a=>`<a href="${e(a.href)}"><span class="wired-kicker">${e(a.category)}</span><h3>${e(a.title)}</h3>${wiredMeta(a)}</a>`).join('')}</div><a class="wired-interview" href="${e(pictured[21].href)}">${wiredPhoto(pictured[21])}<div><span class="wired-kicker">人物 · 思想</span><h3>${e(pictured[21].title)}</h3>${wiredMeta(pictured[21])}</div></a></aside></section>`;
 view.innerHTML=`<div class="frontpage frontpage-wired"><h1 class="frontpage-sr-only">龙源期刊网首页</h1>${wiredHero}

 <section id="frontpage-feature" class="frontpage-shared-topic topics-home-feature oc-publication" aria-label="深度专题"></section>
 <section id="frontpage-covers" class="frontpage-covers" aria-labelledby="frontpage-cover-title"><header class="frontpage-cover-heading"><div class="frontpage-module-title"><span>LATEST ISSUES</span><h2 id="frontpage-cover-title">最新期刊封面</h2></div></header><div class="frontpage-cover-layout"><div class="frontpage-cover-copy" aria-live="polite"><div><span data-front-cover-issue></span><h3 data-front-cover-name></h3><p data-front-cover-copy></p><a data-front-cover-link>阅读本期 ${arrow}</a></div></div><div class="frontpage-cover-carousel"><div class="frontpage-cover-window"><div class="frontpage-cover-track">${covers.map((c,i)=>`<a class="frontpage-cover-slide" href="#/magazine/${encodeURIComponent(c.title)}" aria-label="阅读${c.title}"><span class="books-library-volume"><span class="books-library-paper" aria-hidden="true"></span><img class="books-library-cover" src="assets/home-magazine-wall/${c.file}.webp" alt="${c.title}封面" loading="lazy"></span><span>${c.title} · ${c.issue}</span></a>`).join('')}</div></div><div class="frontpage-cover-controls"><button type="button" data-front-cover-prev aria-label="上一本期刊"><i class="iconfont icon-Arrow_Forward-2" aria-hidden="true"></i></button><div class="frontpage-cover-dots">${covers.map((c,i)=>`<button type="button" data-front-cover-index="${i}" aria-label="切换到${c.title}" aria-pressed="${i===0}"></button>`).join('')}</div><button type="button" data-front-cover-next aria-label="下一本期刊">${arrow}</button></div></div></div></section>
 <section id="frontpage-people" class="frontpage-people" aria-labelledby="frontpage-people-heading">${title('人物与生活','frontpage-people-heading','#/magazine/南风窗?claimed=1')}<div class="frontpage-people-grid">${[pictured[21],pictured[17],pictured[25],pictured[13]].map(a=>story(a)).join('')}</div></section>
 <section id="frontpage-ideas" class="frontpage-ideas" aria-labelledby="frontpage-ideas-heading">${title('观点','frontpage-ideas-heading','#/academic')}${textRow([pictured[6],pictured[10],pictured[22],pictured[23]])}</section>
 ${category('社会观察','frontpage-society',pictured[11],pictured[14],pictured[15],[pictured[12],pictured[18],pictured[19],pictured[20]])}
 ${category('科技与未来','frontpage-technology',pictured[16],pictured[26],pictured[27],[pictured[3],pictured[22],pictured[24],pictured[29]])}
 </div>`;
 const topicTemplate=document.createElement('template');
 topicTemplate.innerHTML=`<section class="oc-feature" style="background-image:url('assets/claimed-october/topic.png')"><div><span>自然 · ANIMAL STORIES</span><h2>迷人的大自然之歌</h2><p>从创刊号的猞猁到赛汗塔拉的牧羊犬，动物小说是这本杂志最野性的基因。</p></div><a class="oc-button oc-dark" href="#/topic/topic-mudsnwbq">进入专题 ${arrow}</a><div class="oc-topic-articles" aria-label="专题文章"></div></section>`;
 const topicFeature=topicTemplate.content.querySelector('.oc-feature');
 topicFeature.setAttribute('data-topic-static','');
 topicFeature.querySelector('.oc-feature-tag')?.remove();
 topicFeature.querySelector('div>span').textContent='自然 · ANIMAL STORIES';
 const topicEntry=topicFeature.querySelector('a.oc-button');topicEntry.href='#/topic/topic-mudsnwbq';topicEntry.removeAttribute('target');topicEntry.removeAttribute('rel');
 const topicArticles=window.natureTopicData?.articles;
 if(topicArticles?.length)topicFeature.querySelector('.oc-topic-articles').innerHTML=topicArticles.map((a,i)=>`<a class="oc-topic-article" href="portal.html#/article/${i}?context=magazine&resource=${encodeURIComponent('十月少年文学')}&topic=topic-mudsnwbq"><div class="oc-topic-top"><span>${String(i+1).padStart(2,'0')}</span><i class="iconfont icon-Arrow_Forward-2" aria-hidden="true"></i></div><h3>${e(a.title)}</h3><p class="oc-topic-author">${e(a.author)}</p><p class="oc-topic-issue">${e(a.issueLabel)}</p></a>`).join('');
 view.querySelector('.frontpage-shared-topic').append(topicFeature);
 let selected=0;const track=view.querySelector('.frontpage-cover-track'),prev=view.querySelector('[data-front-cover-prev]'),next=view.querySelector('[data-front-cover-next]');
 const scroller=view.querySelector('.frontpage-cover-window'),slides=[...track.children];
 function select(index,scroll=true){selected=Math.max(0,Math.min(covers.length-1,index));const c=covers[selected];if(scroll)scroller.scrollTo({left:slides[selected].offsetLeft-track.offsetLeft,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});view.querySelector('[data-front-cover-issue]').textContent=c.issue;view.querySelector('[data-front-cover-name]').textContent=c.title;view.querySelector('[data-front-cover-copy]').textContent=c.copy;view.querySelector('[data-front-cover-link]').href='#/magazine/'+encodeURIComponent(c.title);prev.disabled=selected===0;next.disabled=selected===covers.length-1;view.querySelectorAll('[data-front-cover-index]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===selected)));view.querySelectorAll('.frontpage-cover-slide').forEach((a,i)=>{a.tabIndex=i===selected||i===selected+1?0:-1;});}
 let scrollFrame=0;
 scroller.addEventListener('scroll',()=>{cancelAnimationFrame(scrollFrame);scrollFrame=requestAnimationFrame(()=>{
  const end=scroller.scrollWidth-scroller.clientWidth;
  const index=end>0&&scroller.scrollLeft>=end-2?slides.length-1:Math.round(scroller.scrollLeft/(slides[0].getBoundingClientRect().width||1));
  select(index,false);
 });},{passive:true});
 let drag=null,suppressClick=false;
 scroller.addEventListener('pointerdown',event=>{if(event.pointerType!=='mouse'||event.button!==0)return;drag={x:event.clientX,left:scroller.scrollLeft,moved:false};});
 scroller.addEventListener('pointermove',event=>{if(!drag)return;const dx=event.clientX-drag.x;if(Math.abs(dx)>6){drag.moved=true;scroller.classList.add('is-dragging');scroller.setPointerCapture(event.pointerId);}if(drag.moved)scroller.scrollLeft=drag.left-dx;});
 const endDrag=()=>{if(!drag)return;suppressClick=drag.moved;drag=null;scroller.classList.remove('is-dragging');setTimeout(()=>suppressClick=false,0);};
 scroller.addEventListener('pointerup',endDrag);scroller.addEventListener('pointercancel',endDrag);
 scroller.addEventListener('click',event=>{if(suppressClick){event.preventDefault();event.stopPropagation();}},true);
 scroller.addEventListener('dragstart',event=>event.preventDefault());
 select(0);
 view.addEventListener('click',event=>{const b=event.target.closest('button');if(!b)return;if(b.hasAttribute('data-front-close')){b.closest('.frontpage-announcement').hidden=true;return;}if(b.dataset.frontAnchor){view.querySelector('#'+b.dataset.frontAnchor)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});return;}if(b.hasAttribute('data-front-cover-prev'))select(selected-1);if(b.hasAttribute('data-front-cover-next'))select(selected+1);if(b.hasAttribute('data-front-cover-index'))select(Number(b.dataset.frontCoverIndex));});
 view.querySelector('.frontpage-cover-carousel').addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();select(selected+(event.key==='ArrowRight'?1:-1));}});
})();
