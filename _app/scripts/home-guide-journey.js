/* The homepage composer becomes the real reading guide through one scroll scene. */
(()=>{
 const view=document.querySelector('#view-home'),stage=view?.querySelector('.home-hero-scroll'),hero=view?.querySelector('.hero-break'),guide=document.querySelector('.catalog-reading-guide');if(!stage||!guide)return;
 const chat=guide.querySelector('.pe-chat'),messages=chat.querySelector('.pe-chat-messages'),heading=chat.querySelector('.pe-guide-heading'),wrap=chat.querySelector('.pe-chat-form-wrap'),ownForm=wrap.querySelector('form'),search=hero.querySelector('.hero-search'),form=search.querySelector('form'),input=form.querySelector('textarea'),title=hero.querySelector('.home-title'),reopen=guide.querySelector('.pe-chat-reopen');

 const examples=[
  {kind:'杂志',question:'我想看一本能读懂商业变化的杂志。',answer:'可以从《第一财经》开始。从公司与产业，到消费和城市生活，沿着这一期的报道，看看变化正在怎样发生。',title:'第一财经',meta:'杂志 · 2026 年第 09 期',description:'从这一期开始，发现值得继续追问的商业故事。',cover:'assets/shelf-2026/dycy202609-z.jpg',href:'#/magazine/第一财经'},
  {kind:'读书会',question:'南风窗读书会最近一期的领读活动进度怎么样了？',answer:'最近一期《南风窗》的领读已完成，阅读进度为 100%。可以回顾本期领读语和共读记录，也可以进入读书会，继续关注后续的领读安排。',title:'南风窗读书会',meta:'读书会 · 阅读与交流',description:'本期共读、领读人、共读活动，在这里相遇。',cover:'assets/shelf-2026/nafc202609-z.jpg',href:'#/magazine/南风窗?claimed=1'},
  {kind:'图书',question:'我想读一本书，了解科学是怎样发展起来的。',answer:'推荐《科学的历程》。从古希腊的自然哲学到不同文明之间的知识交流，沿着科学史的线索，慢慢理解我们如何认识世界。',title:'科学的历程',meta:'图书 · 北师大出版社',description:'跟着章节阅读，也可以借助音频课、自测与知识地图加深理解。',cover:'assets/book-reader/science-cover.png',href:'portal.html#/book/ebooks-8'},
  {kind:'学术',question:'青少年数字素养领域，有哪些前沿学术文章值得关注？',answer:'可以先从数字素养教育的现状、问题和提升路径读起。下面这篇研究提供了一个切入点，你也可以沿着作者、关键词和参考文献，继续追踪相关讨论。',title:'我国青少年数字素养教育的现状问题与提升路径',meta:'学术文章 · 中国电化教育',description:'李晓静、刘祎宁、冯紫薇',cover:'assets/academic-home/paper-4.jpg',href:'portal.html#/article/0?context=magazine&resource=中国电化教育'},
  {kind:'专题',question:'自然界有哪些对人类天然友好的动物？',answer:'犬、马等与人类长期相伴的动物，留下了许多彼此信任的故事。动物是否亲近人，也与环境和相处方式有关。可以先读这个专题，从故事里感受人与动物的关系。',title:'迷人的大自然之歌',meta:'自然 · ANIMAL STORIES',description:'从创刊号的猞猁到赛汗塔拉的牧羊犬，动物小说是这本杂志最野性的基因。',cover:'assets/claimed-october/topic.png',href:'#/topic/topic-mudsnwbq'}
 ];
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const designAsset='assets/home-chat-design/';
 const designArrow=(name,cls='')=>`<span class="home-demo-design-arrow ${cls}" aria-hidden="true"><img src="${designAsset+name}" width="10.5" height="9.99983" alt=""></span>`;
 const magazineItems=[examples[0],{title:'财经',meta:'杂志 · 2025 年第 27 期',cover:'assets/home-magazine-wall/caij202527-z.webp',href:'#/magazine/财经'},{title:'中国新闻周刊',meta:'杂志 · 2026 年第 29 期',cover:'assets/home-magazine-wall/xwzk202629-z.webp',href:'#/magazine/中国新闻周刊'}];
 const smallMagazine=x=>`<a class="home-demo-resource" href="${escape(x.href)}"><img class="home-demo-resource-cover" src="${escape(x.cover)}" alt="《${escape(x.title)}》封面"><div><h3>${escape(x.title)}</h3><span>${escape(x.meta)}</span></div>${designArrow('5623e.svg','is-circle')}</a>`;
 const clubPlan=(window.octoberGuidedPlans||[]).filter(p=>p.bookTitle==='南风窗'&&p.contentType==='journal').sort((a,b)=>b.start.localeCompare(a.start))[0];
 const clubHref=clubPlan?window.octoberCommunityRoute('reading',clubPlan.id):examples[1].href;
 function resourceCard(x,index){
  if(index===0)return `<div class="home-demo-magazines">${magazineItems.map(smallMagazine).join('')}</div>`;
  if(index===1)return `<div class="club-reading-list home-demo-reading"><a class="oc-reading-list-card" href="${escape(clubHref)}"><div class="home-demo-reading-top"><span class="oc-reading-list-book"><span class="oc-reading-list-paper" aria-hidden="true"></span><img class="oc-reading-list-cover" src="${escape(clubPlan?.cover||x.cover)}" alt="南风窗封面" width="84" height="114"></span><div class="oc-reading-list-content"><div class="oc-reading-list-heading"><span class="oc-reading-list-status is-complete">已完结</span><div><h3>南风窗</h3><p>${escape(clubPlan?.issue||'2026 年第 09 期')}</p></div></div><blockquote class="oc-reading-list-message"><strong>领读语</strong><p>${escape(clubPlan?.todayTask.question||'文章中哪个观点或细节让你印象最深？结合原文分享你的理解。')}</p></blockquote></div></div><div class="oc-reading-list-summary"><div class="oc-reading-list-summary-copy"><div><div class="home-demo-progress-heading"><strong>阅读进度</strong><span class="oc-reading-list-status is-complete">已完结</span></div><small>${escape(clubPlan?.start||'2026-09-07')} 至 ${escape(clubPlan?.end||'2026-10-04')}</small></div><div class="oc-reading-participants"><span class="oc-reading-avatars"><img src="${designAsset}b0860.png" alt="" width="20" height="20"><img src="${designAsset}db1be.png" alt="" width="20" height="20"></span><span>12 人参与</span></div></div><div class="oc-reading-list-ring" role="progressbar" aria-label="阅读进度" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"><svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="35" class="oc-list-ring-track"/><circle cx="40" cy="40" r="35" class="oc-list-ring-value" pathLength="100" stroke-dasharray="100 100"/></svg><strong>100%</strong></div></div></a></div>`;
  if(index===2)return `<a class="home-demo-book" href="portal.html#/book/ebooks-8"><img class="home-demo-book-cover" src="${escape(x.cover)}" alt="科学的历程封面" width="84" height="114"><div class="home-demo-book-info"><header><h3>${escape(x.title)}</h3><div><span>科学史</span><span>北师大出版社</span></div></header><div class="home-demo-book-tools">${[['7904d.png','原文本'],['5fc5c.png','增强文本'],['573f6.png','音频课'],['f8730.png','自测卡片'],['95bd9.png','知识地图'],['b601a.png','阅读向导']].map(([file,title])=>`<span title="${title}" aria-label="${title}"><img src="${designAsset+file}" alt="${title}" width="20" height="20"></span>`).join('')}</div></div>${designArrow('5623e.svg','is-circle')}</a>`;
  if(index===3)return `<a class="home-demo-academic" href="${escape(x.href)}"><span class="home-demo-academic-author">李晓静 刘祎宁 冯紫薇</span><h3>${escape(x.title)}</h3><div><span>中国电化教育<br>数字素养教育</span>${designArrow('5623e.svg','is-circle')}</div></a>`;
  return `<a class="home-demo-topic" href="${escape(x.href)}"><img src="${escape(x.cover)}" alt="猞猁眺望草原与山谷"><div class="home-demo-topic-footer"><div><span>${escape(x.meta)}</span><h3>${escape(x.title)}</h3><p>${escape(x.description)}</p></div><span class="home-demo-topic-button">进入专题${designArrow('78240.svg')}</span></div></a>`;
 }
 const scripted=document.createElement('section');scripted.className='home-journey-script';scripted.hidden=true;scripted.setAttribute('aria-label','阅读向导对话');
 scripted.innerHTML=`<div class="home-demo-flow" role="log" aria-live="polite">${examples.map((x,i)=>`<article class="home-demo-exchange" data-demo-exchange="${i}" hidden><div class="home-demo-user"><p>${escape(x.question)}</p></div><div class="home-demo-answer"><p>${escape(x.answer)}</p>${resourceCard(x,i)}</div></article>`).join('')}</div>`;
 chat.append(scripted);const demoFlow=scripted.querySelector('.home-demo-flow');let shownExample=-1,demoScrollTimer=0;
 const ending=document.createElement('div');ending.className='home-journey-ending pe-chat-messages';ending.hidden=true;ending.inert=true;ending.setAttribute('aria-label','阅读向导初始欢迎');const initialWelcome=messages.querySelector('.guide-unified-welcome,.pe-guide-welcome');if(initialWelcome)ending.append(initialWelcome.cloneNode(true));chat.append(ending);
 function showExample(index){if(index===shownExample)return;const forward=index>shownExample;shownExample=index;guide.dataset.demoIndex=String(index+1);clearTimeout(demoScrollTimer);scripted.querySelectorAll('[data-demo-exchange]').forEach((row,i)=>{row.hidden=i>index;row.classList.toggle('is-current',i===index);});const current=scripted.querySelector('.home-demo-exchange.is-current');demoFlow.scrollTop=Math.max(0,current.offsetTop-parseFloat(getComputedStyle(demoFlow).paddingTop));demoScrollTimer=setTimeout(()=>{if(shownExample===index&&!scripted.hidden)demoFlow.scrollTo({top:demoFlow.scrollHeight,behavior:forward&&!reduced.matches?'smooth':'instant'});},forward?700:0);}
 const coverWall=document.createElement('div');coverWall.className='home-guide-cover-wall';coverWall.setAttribute('aria-hidden','true');
 const coverGrid=document.createElement('div');coverGrid.className='home-guide-cover-grid';
 const wallCovers=[{"title":"21世纪商业评论","issue":"2026年09期","src":"assets/home-magazine-wall/sjpl202609-z.webp"},{"title":"世界博览","issue":"2026年18期","src":"assets/home-magazine-wall/jblz202618-z.webp"},{"title":"世界知识","issue":"2026年14期","src":"assets/home-magazine-wall/sjzs202614-z.webp"},{"title":"世纪人物","issue":"2026年03期","src":"assets/home-magazine-wall/sjrw202603-z.webp"},{"title":"中国会展","issue":"2026年18期","src":"assets/home-magazine-wall/zghz202618-z.webp"},{"title":"中国商人","issue":"2026年19期","src":"assets/home-magazine-wall/zgsr202619-z.webp"},{"title":"中国商界","issue":"2026年17期","src":"assets/home-magazine-wall/zgsj202617-z.webp"},{"title":"中国新闻周刊","issue":"2026年29期","src":"assets/home-magazine-wall/xwzk202629-z.webp"},{"title":"中国经济周刊","issue":"2026年18期","src":"assets/home-magazine-wall/zjzk202618-z.webp"},{"title":"互联网周刊","issue":"2026年19期","src":"assets/home-magazine-wall/hlzk202619-z.webp"},{"title":"人民周刊","issue":"2026年15期","src":"assets/home-magazine-wall/rmwz202615-z.webp"},{"title":"人民论坛","issue":"2026年17期","src":"assets/home-magazine-wall/rmlt202617-z.webp"},{"title":"党员文摘","issue":"2026年18期","src":"assets/home-magazine-wall/dywz202618-z.webp"},{"title":"共产党人","issue":"2026年17期","src":"assets/home-magazine-wall/gcdr202617-z.webp"},{"title":"出版人","issue":"2026年10期","src":"assets/home-magazine-wall/cbrn202610-z.webp"},{"title":"北京文学","issue":"2026年09期","src":"assets/home-magazine-wall/bjwx202609-z.webp"},{"title":"南方人物周刊","issue":"2025年03期","src":"assets/home-magazine-wall/nfrw202503-z.webp"},{"title":"南都周刊","issue":"2026年04期","src":"assets/home-magazine-wall/ndzk202604-z.webp"},{"title":"南风窗","issue":"2026年09期","src":"assets/home-magazine-wall/nafc202609-z.webp"},{"title":"参花（上）","issue":"2026年10期","src":"assets/home-magazine-wall/shzk202610-z.webp"},{"title":"商界","issue":"2026年09期","src":"assets/home-magazine-wall/shji202609-z.webp"},{"title":"当代","issue":"2025年05期","src":"assets/home-magazine-wall/dada202505-z.webp"},{"title":"意林","issue":"2026年14期","src":"assets/home-magazine-wall/yili202614-z.webp"},{"title":"方圆","issue":"2026年16期","src":"assets/home-magazine-wall/fany202616-z.webp"},{"title":"民生周刊","issue":"2026年20期","src":"assets/home-magazine-wall/mszk202620-z.webp"},{"title":"海外文摘","issue":"2026年01期","src":"assets/home-magazine-wall/hwwz202601-z.webp"},{"title":"海外文摘·文学版","issue":"2025年04期","src":"assets/home-magazine-wall/hwzz202504-z.webp"},{"title":"海外星云","issue":"2026年09期","src":"assets/home-magazine-wall/hwxy202609-z.webp"},{"title":"环球美酒","issue":"2026年03期","src":"assets/home-magazine-wall/b5c9202603-z.webp"},{"title":"看世界","issue":"2026年11期","src":"assets/home-magazine-wall/kasj202611-z.webp"},{"title":"瞭望东方周刊","issue":"2026年20期","src":"assets/home-magazine-wall/lwdf202620-z.webp"},{"title":"第一财经","issue":"2026年09期","src":"assets/home-magazine-wall/dycy202609-z.webp"},{"title":"董事会","issue":"2026年07期","src":"assets/home-magazine-wall/dons202607-z.webp"},{"title":"读者","issue":"2026年19期","src":"assets/home-magazine-wall/duzh202619-z.webp"},{"title":"读者欣赏","issue":"2026年05期","src":"assets/home-magazine-wall/duzx202605-z.webp"},{"title":"财经","issue":"2025年27期","src":"assets/home-magazine-wall/caij202527-z.webp"},{"title":"都市人","issue":"2026年08期","src":"assets/home-magazine-wall/dusr202608-z.webp"},{"title":"青年文摘","issue":"2026年18期","src":"assets/home-magazine-wall/qnwh202618-z.webp"},{"title":"风流一代·TOP青商","issue":"2026年10期","src":"assets/home-magazine-wall/fyqs202610-z.webp"}];
 const featuredTitles=["第一财经", "读者", "财经", "中国新闻周刊", "世界博览", "意林", "南都周刊", "南方人物周刊", "看世界", "21世纪商业评论", "人民论坛", "瞭望东方周刊"];
 const featuredCovers=featuredTitles.map(title=>wallCovers.find(item=>item.title===title));
 const wallColumns=[],featuredCards=[];let flankCount=-1;
 function buildWall(flanks){
 if(flanks===flankCount)return;flankCount=flanks;coverGrid.replaceChildren();wallColumns.length=0;featuredCards.length=0;
 const placements=[];
 for(let column=-flanks;column<6+flanks;column++)for(let row=0;row<8;row++)placements.push({column,row,featured:column>=0&&column<6&&(row===3||row===4)});
 // Allocate unique covers around the visible centre first; only distant rows repeat.
 const unused=wallCovers.filter(item=>!featuredTitles.includes(item.title));let nextCover=0;
 const ordered=placements.filter(p=>!p.featured).sort((a,b)=>(Math.abs(a.row-3.5)*1.36+Math.abs(a.column-2.5))-(Math.abs(b.row-3.5)*1.36+Math.abs(b.column-2.5)));
 const assigned=new Map();for(const placement of ordered){const item=nextCover<unused.length?unused[nextCover]:wallCovers[(nextCover-unused.length)%wallCovers.length];assigned.set(`${placement.column}:${placement.row}`,item);nextCover++;}
 for(let column=-flanks;column<6+flanks;column++){
  const strip=document.createElement('div');strip.className='home-guide-cover-column';strip.dataset.wallColumn=String(column);
  for(let row=0;row<8;row++){
   const featured=column>=0&&column<6&&(row===3||row===4),item=featured?featuredCovers[column+(row-3)*6]:assigned.get(`${column}:${row}`);
   const card=document.createElement(featured?'a':'div');card.className='home-guide-wall-card';card.dataset.wallTitle=item.title;
   if(featured){card.href='#/magazine/'+encodeURIComponent(item.title);card.tabIndex=-1;card.setAttribute('aria-label',item.title);featuredCards.push(card);}
   const image=document.createElement('img');image.src=item.src;image.alt='';image.decoding='async';image.draggable=false;
   const face=document.createElement('span');face.className='home-guide-wall-cover';face.append(image);card.append(face);
   const label=document.createElement('span');label.className='home-guide-wall-name';label.textContent=featured?item.title:'';card.append(label);strip.append(card);
  }wallColumns.push(strip);coverGrid.append(strip);
 }}
 const wallTitle=document.createElement('h2');wallTitle.className='home-guide-wall-title';wallTitle.textContent='精选杂志';
 const wallMore=document.createElement('a');wallMore.className='home-guide-wall-more';wallMore.href='#/magazines';wallMore.textContent='查看更多';wallMore.tabIndex=-1;
 coverWall.append(coverGrid,wallTitle,wallMore);stage.querySelector('.home-hero-pin').append(coverWall);
 const clamp=x=>Math.max(0,Math.min(1,x)),mix=(a,b,t)=>a+(b-a)*t,reduced=matchMedia('(prefers-reduced-motion:reduce)');let transferred=false,start=null,manual=null,lastPhase=-1,previousCollapsed=false,manualScroll=0;
 form.querySelector('.home-add-content').innerHTML='<img src="assets/home-composer/attach.svg" alt="" width="24" height="24">';
 function transfer(offsetY){if(transferred)return;const rect=search.getBoundingClientRect();start={left:rect.left,top:rect.top+offsetY,width:rect.width};previousCollapsed=guide.classList.contains('pe-chat-collapsed');ownForm.remove();wrap.append(search);form.classList.add('pe-chat-form','guide-unified-composer');input.wrap='soft';guide.classList.add('home-journey-guide');guide.hidden=false;guide.querySelectorAll('[data-pe-chat-toggle]').forEach(b=>{b.removeAttribute('data-pe-chat-toggle');b.setAttribute('data-home-guide-toggle','');});transferred=true;}
 function restore(){clearTimeout(demoScrollTimer);scripted.hidden=true;ending.hidden=true;messages.inert=false;delete guide.dataset.journeyEnding;delete guide.dataset.journeyDemo;delete guide.dataset.demoIndex;shownExample=-1;form.inert=false;heading.inert=false;messages.removeAttribute('aria-hidden');coverWall.style.opacity='0';coverWall.style.visibility='hidden';coverWall.setAttribute('aria-hidden','true');wallMore.tabIndex=-1;featuredCards.forEach(card=>{card.tabIndex=-1;card.style.pointerEvents='none';});if(!transferred)return;title.append(search);wrap.append(ownForm);form.classList.remove('pe-chat-form','guide-unified-composer');form.removeAttribute('style');search.removeAttribute('style');input.wrap='off';input.rows=1;input.value=input.value.replace(/[\r\n]+/g,' ');guide.classList.remove('home-journey-guide','pe-chat-collapsed');guide.classList.toggle('pe-chat-collapsed',previousCollapsed);guide.querySelectorAll('[data-home-guide-toggle]').forEach(b=>{b.removeAttribute('data-home-guide-toggle');b.setAttribute('data-pe-chat-toggle','');});for(const el of [chat,messages,heading,wrap,reopen])el.removeAttribute('style');chat.hidden=previousCollapsed;chat.inert=previousCollapsed;guide.hidden=!/^#\/(books|magazines|frontpage)(?:\?|$)/.test(location.hash);transferred=false;start=null;manual=null;document.body.classList.remove('home-guide-journey-active');}
 function update({w,h,range,scroll}){
  if(!view.classList.contains('active')){restore();return;}if(reduced.matches){stage.style.setProperty('--home-journey-range','0px');restore();hero.style.removeProperty('transform');return;}
  const departure=h*.8,arrivalHold=h*.12,expansion=h*.28,welcomeHold=h*((examples.length+1)*.8),docking=h*.7,panelHold=h*1.0,folding=h*.6,tail=h*.15;
  const arrive=range+departure,expandStart=arrive+arrivalHold,expandEnd=expandStart+expansion,dockStart=expandEnd+welcomeHold,dockEnd=dockStart+docking,foldStart=dockEnd+panelHold,foldEnd=foldStart+folding;
  stage.style.setProperty('--home-journey-range',(foldEnd-range+tail)+'px');
  const smooth=t=>{const x=clamp(t);return x*x*(3-2*x);},b=smooth((scroll-range)/departure),expanded=smooth((scroll-expandStart)/expansion),dock=smooth((scroll-dockStart)/docking),fold=smooth((scroll-foldStart)/folding);
  const settled=smooth((scroll-dockEnd)/(h*.6));
  const wallPresence=dock,wallTravel=clamp((scroll-dockStart)/(foldEnd-dockStart)),wallGap=w<=760?14:24;
  const finalWallWidth=Math.min(1200,w-2*(w<=760?16:64),6*Math.max(40,(h-344-wallGap)/2)*14/19+5*wallGap);
  const coverWidth=(finalWallWidth-5*wallGap)/6,coverHeight=coverWidth*19/14,finalCoverHeight=coverHeight;
  buildWall(Math.max(1,Math.ceil((w-finalWallWidth)/2/(coverWidth+wallGap))+1));
  const totalColumns=6+2*flankCount,wallWidth=totalColumns*(coverWidth+wallGap)-wallGap;
  const cardCaption=32,wallCaption=cardCaption*settled,finalGridTop=(h-(2*(finalCoverHeight+cardCaption)+wallGap))/2+8;
  coverWall.style.opacity=String(wallPresence);coverWall.style.visibility=wallPresence>.001?'visible':'hidden';
  coverGrid.style.gridTemplateColumns=`repeat(${totalColumns},minmax(0,1fr))`;coverGrid.style.width=wallWidth+'px';coverGrid.style.left=(w-wallWidth)/2+'px';coverGrid.style.top=finalGridTop+'px';
  wallColumns.forEach((column,index)=>{const columnIndex=index-flankCount,central=columnIndex>=0&&columnIndex<6,direction=index%2?1:-1,offset=(index%2?-70:-10)+direction*wallTravel*(100+(index%3)*32);column.style.transform=`translateY(${-3*(coverHeight+wallCaption+wallGap)+offset*(1-settled)}px)`;Array.from(column.children).forEach((card,row)=>card.style.opacity=String(central&&(row===3||row===4)?1:1-settled));});
  coverWall.style.setProperty('--wall-settled',String(settled));featuredCards.forEach(card=>{card.tabIndex=fold>.99?0:-1;card.style.pointerEvents=fold>.99?'auto':'none';});
  wallTitle.style.top=(finalGridTop-62)+'px';wallMore.style.top=(finalGridTop+2*(finalCoverHeight+cardCaption)+wallGap+28)+'px';
  wallTitle.style.opacity=wallMore.style.opacity=String(fold);wallMore.style.pointerEvents=fold>.99?'auto':'none';wallMore.tabIndex=fold>.99?0:-1;coverWall.setAttribute('aria-hidden',String(fold<.99));
  hero.style.transform=`translateY(${-b*(h+80)}px)`;
  if(scroll<=range+.5){restore();lastPhase=0;return;}
  transfer(b*(h+80));document.body.classList.add('home-guide-journey-active');guide.hidden=false;
  if(manual!==null&&Math.abs(scroll-manualScroll)>2)manual=null;
  const collapsed=manual===null?fold>=.999:!manual,shownFold=manual===true?0:manual===false?1:fold;
  guide.classList.toggle('pe-chat-collapsed',collapsed);guide.dataset.journeyPhase=collapsed?'collapsed':shownFold>0?'folding':scroll>=dockEnd?'panel':scroll>dockStart?'docking':scroll>=expandEnd+h*examples.length*.8?'welcome':scroll>=expandEnd?'conversation':scroll>expandStart?'expanding':scroll>=arrive?'arrived':'departure';
  const pad=w<=760?16:24,fullWidth=Math.min(800,w-pad*2),panelWidth=Math.min(460,w-20),panelX=(w-panelWidth)/2,panelMargin=w<=900?136:88,panelHeight=Math.max(320,h-panelMargin-10),panelY=panelMargin;
  const shellX=mix(0,panelX,dock),shellY=mix(0,panelY,dock),shellW=mix(w,panelWidth,dock),shellH=mix(h,panelHeight,dock);
  const sx=mix(shellX,w-72,shownFold),sy=mix(shellY,24,shownFold),sw=mix(shellW,48,shownFold),sh=mix(shellH,48,shownFold),contentOpacity=1-clamp(shownFold*1.8);
  Object.assign(chat.style,{display:collapsed?'none':'flex',left:sx+'px',top:sy+'px',right:'auto',bottom:'auto',width:sw+'px',height:sh+'px',borderRadius:mix(0,24,Math.max(dock,shownFold))+'px',background:`rgba(255,255,255,${dock})`,borderColor:`rgba(255,255,255,${.85*dock})`,boxShadow:dock>.01?'0 2px 6px #0000001a':'none',transform:'none',opacity:'1'});chat.style.setProperty('width',sw+'px','important');chat.hidden=collapsed;chat.inert=collapsed;
  const formWidth=mix(mix(start.width,fullWidth,b),panelWidth-20,dock),formX=mix(mix(start.left,(w-fullWidth)/2,b),panelX+10,dock),formY=mix(mix(start.top,h-pad-70,b)-60*expanded,panelY+panelHeight-140,dock);
  Object.assign(search.style,{position:'absolute',left:(formX-shellX)+'px',top:(formY-shellY)+'px',width:formWidth+'px',maxWidth:'none',margin:'0',padding:'0',transform:`scale(${1-shownFold*.65})`,transformOrigin:'right top',opacity:String(contentOpacity),visibility:'visible',pointerEvents:shownFold>.05?'none':'auto'});
  form.style.setProperty('--home-form-expand',String(expanded));form.querySelector('.switch').inert=expanded<.5;form.querySelector('.home-add-content').inert=expanded<.5;
  const welcome=expanded*contentOpacity,copyWidth=mix(Math.min(580,w-40),panelWidth-20,dock),copyX=mix((w-Math.min(580,w-40))/2,panelX+10,dock),copyY=mix(Math.max(150,h*.25),panelY+104,dock);
  Object.assign(messages.style,{position:'absolute',left:(copyX-shellX)+'px',top:(copyY-shellY)+'px',width:copyWidth+'px',height:Math.max(180,formY-copyY-mix(30,12,dock))+'px',padding:'0',opacity:String(welcome),transform:`translateY(${(1-expanded)*28}px) scale(${1-shownFold*.65})`,transformOrigin:'right top',pointerEvents:welcome>.95?'auto':'none'});
  const finalWelcome=scroll>=expandEnd+h*examples.length*.8,isAutomated=manual!==true,isScripted=isAutomated&&!finalWelcome,showEnding=isAutomated&&finalWelcome&&!collapsed;guide.dataset.journeyDemo=String(isScripted);guide.dataset.journeyEnding=String(showEnding);form.inert=isAutomated;heading.inert=isAutomated;messages.inert=isAutomated;messages.setAttribute('aria-hidden',String(isScripted||showEnding));messages.style.visibility=isScripted||showEnding?'hidden':'';scripted.hidden=!isScripted||expanded<.001||collapsed;ending.hidden=!showEnding;Object.assign(ending.style,{position:messages.style.position,left:messages.style.left,top:messages.style.top,width:messages.style.width,height:messages.style.height,padding:'0',opacity:String(welcome),transform:messages.style.transform,transformOrigin:'right top',pointerEvents:'none'});ending.style.visibility='visible';
  if(isScripted){
   const demoWidth=mix(Math.min(760,w-40),panelWidth-28,dock),demoX=mix((w-Math.min(760,w-40))/2,panelX+14,dock),demoY=mix(0,panelY+84,dock),demoHeight=Math.max(160,formY-demoY-mix(22,12,dock));
   scripted.style.setProperty('--home-demo-start',Math.max(112,h*.16)+'px');
   Object.assign(scripted.style,{position:'absolute',left:(demoX-shellX)+'px',top:(demoY-shellY)+'px',width:demoWidth+'px',height:demoHeight+'px',opacity:String(welcome),transform:`translateY(${(1-expanded)*20}px) scale(${1-shownFold*.65})`,transformOrigin:'right top',pointerEvents:welcome>.95?'auto':'none'});
   showExample(Math.max(0,Math.min(examples.length-1,Math.floor((scroll-expandEnd)/(h*.8)))));
   if(dock>0)demoFlow.scrollTop=demoFlow.scrollHeight;
  }
  guide.style.setProperty('--home-guide-dock',String(dock));Object.assign(heading.style,{transform:`scale(${1-shownFold*.65})`,transformOrigin:'right top',opacity:String(dock*contentOpacity),pointerEvents:dock>.9&&shownFold<.05?'auto':'none'});
  Object.assign(wrap.style,{position:'static',padding:'0',margin:'0',background:'transparent'});
  Object.assign(reopen.style,{display:shownFold>0?'inline-flex':'none',position:'fixed',right:'24px',top:'24px',bottom:'auto',width:'48px',height:'48px',padding:'2px',opacity:String(clamp(shownFold*2-1)),transform:`scale(${mix(.7,1,shownFold)})`,pointerEvents:collapsed?'auto':'none'});
  guide.querySelectorAll('[data-home-guide-toggle]').forEach(button=>button.setAttribute('aria-expanded',String(!collapsed)));
  const phase=Math.round(expanded)+Math.round(dock)+Math.round(shownFold);if(lastPhase!==phase){lastPhase=phase;input.rows=expanded>.5?2:1;}
 }
 document.addEventListener('click',event=>{const toggle=event.target.closest('[data-home-guide-toggle]');if(!toggle||!view.classList.contains('active'))return;event.preventDefault();event.stopImmediatePropagation();manual=guide.classList.contains('pe-chat-collapsed');manualScroll=Math.max(0,-stage.getBoundingClientRect().top);window.longyuanHomeHeroRefresh?.();},true);
 window.addEventListener('hashchange',()=>{if(!view.classList.contains('active')){restore();hero.style.removeProperty('transform');}window.longyuanHomeHeroRefresh?.();});
 // A deliberate gesture advances one complete scene, then waits for a new gesture.
 let stepFrame=0,lastGesture=0,pendingDelta=0,cooldownUntil=0,touchStartY=null;
 const scenePosition=()=>Math.max(0,-stage.getBoundingClientRect().top);
 const stops=()=>{const h=innerHeight,r=Math.max(360,h*.8);const dockEnd=1.2+(examples.length+1)*.8+.7;return [r,...examples.map((_,i)=>r+h*(1.5+i*.8)),r+h*(1.5+examples.length*.8),r+h*(dockEnd+.15),r+h*(dockEnd+.8),r+h*(dockEnd+1.6)];};
 function stopStep(){cancelAnimationFrame(stepFrame);stepFrame=0;}
 function playStep(destination){
  stopStep();manual=null;pendingDelta=0;const from=scenePosition(),origin=scrollY-from,startTime=performance.now(),distance=destination-from,duration=Math.abs(distance)>innerHeight*1.2?1450:1100;
  guide.dataset.journeyAnimating='true';
  function tick(now){if(!view.classList.contains('active')){stopStep();delete guide.dataset.journeyAnimating;return;}const t=Math.min(1,(now-startTime)/duration),ease=t*t*(3-2*t);window.scrollTo({top:origin+from+distance*ease,behavior:'instant'});window.longyuanHomeHeroRefresh?.();
   if(t<1)stepFrame=requestAnimationFrame(tick);else{stepFrame=0;cooldownUntil=performance.now()+320;delete guide.dataset.journeyAnimating;}
  }stepFrame=requestAnimationFrame(tick);
 }
 function intent(delta,event,discrete=false){
  if(!view.classList.contains('active')||reduced.matches||event.ctrlKey||Math.abs(delta)<1)return;
  const target=event.target;if(target?.closest?.('[contenteditable=true],.nav-island')||(target?.closest?.('input,textarea')&&!target.closest('.home-journey-guide[data-journey-demo=true]')))return;
  const inner=target?.closest?.('.pe-chat-messages');if(inner&&inner.scrollHeight>inner.clientHeight+2&&((delta>0&&inner.scrollTop+inner.clientHeight<inner.scrollHeight-2)||(delta<0&&inner.scrollTop>2)))return;
  const position=scenePosition(),nodes=stops(),now=performance.now(),gap=now-lastGesture;lastGesture=now;
  if(stepFrame){event.preventDefault();return;}
  if(position<nodes[0]-2){
   if(delta>0&&position+delta>=nodes[0]){event.preventDefault();window.scrollTo({top:scrollY+nodes[0]-position,behavior:'instant'});cooldownUntil=now+200;}return;
  }
  if(delta<0&&position<=nodes[0]+2)return;
  if(position>nodes.at(-1)+2)return;
  if(delta>0&&position>=nodes.at(-1)-2)return;
  event.preventDefault();
  if(now<cooldownUntil){pendingDelta=0;return;}
  // Trackpads emit a continuous stream: a quiet gap must not be required to advance.
  if(gap>180||Math.sign(pendingDelta)!==Math.sign(delta))pendingDelta=0;
  pendingDelta+=delta;
  if(!discrete&&Math.abs(pendingDelta)<48)return;
  pendingDelta=0;
  const destination=delta>0?nodes.find(x=>x>position+2):nodes.slice().reverse().find(x=>x<position-2);if(destination!==undefined)playStep(destination);
 }
 window.addEventListener('wheel',event=>{if(Math.abs(event.deltaX)>Math.abs(event.deltaY))return;const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);intent(delta,event);},{passive:false});
 window.addEventListener('keydown',event=>{const delta={ArrowDown:60,PageDown:innerHeight*.8,' ':innerHeight*.8,ArrowUp:-60,PageUp:-innerHeight*.8}[event.key];if(delta!==undefined)intent(delta,event,true);});
 window.addEventListener('touchstart',event=>{touchStartY=event.touches[0]?.clientY;lastGesture=0;},{passive:true});
 window.addEventListener('touchmove',event=>{const y=event.touches[0]?.clientY;if(y===undefined||touchStartY===null)return;const delta=touchStartY-y;if(Math.abs(delta)<8)return;intent(delta,event);touchStartY=y;},{passive:false});
 window.addEventListener('hashchange',()=>{stopStep();delete guide.dataset.journeyAnimating;});
 window.addEventListener('resize',stopStep);
 window.longyuanHomeJourney={update};window.longyuanHomeHeroRefresh?.();
})();
