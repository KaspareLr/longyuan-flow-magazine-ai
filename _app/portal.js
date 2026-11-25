(()=>{
 const data=clubPortalData,session=clubSession,main=document.querySelector('#portal-main');
 const readingProgress=document.createElement('div');
 readingProgress.className='portal-reading-progress';
 readingProgress.setAttribute('aria-hidden','true');
 readingProgress.hidden=true;
 document.body.append(readingProgress);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const href=(route)=>'portal.html#/'+route;
 const resource=(page,id)=>'index.html#/magazine/'+encodeURIComponent('南风窗')+'?claimed=1&page='+page+'&id='+encodeURIComponent(id);
 const book=id=>data.books.find(b=>String(b.id)===String(id))||data.books[0];
 const chapterNames=b=>clubBookContents.flatten(b).map(item=>item.title);
 const chapterLink=(b,i)=>href('article/'+i+'?context=book&resource='+encodeURIComponent(b.id));
 const magazineArticles=(rid='第一财经')=>window.academicJournalArticles?.[rid]||(rid==='南风窗'?window.nanfcIssueReference:rid==='十月少年文学'?window.octoberIssueReference:periodicalReference)?.groups.flatMap((g,gi)=>g.articles.map(a=>({...a,group:g.title,groupIndex:gi})));
 let route='',routeId='',params=new URLSearchParams(),filter='全部',accountTab='overview',readingTab='follow',toastTimer;
 function toast(t){const el=document.querySelector('.toast');el.textContent=t;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),2400)}
 function modal(title,html){document.querySelector('#portal-dialog-content').innerHTML=`<span class="club-overline">LONGYUAN READING CLUB</span><h2 id="portal-dialog-title">${esc(title)}</h2>${html}`;document.querySelector('#portal-dialog').showModal()}
 const title=(en,cn,description)=>`<header class="portal-heading"><div><span class="club-overline">${en}</span><h1>${cn}</h1></div><p>${description}</p></header>`;
 const section=(en,cn,body,extra='')=>`<section class="portal-section"><header class="portal-section-heading"><div><span class="club-overline">${en}</span><h2>${cn}</h2></div>${extra}</header>${body}</section>`;
 const tabs=items=>`<div class="portal-tabs" aria-label="筛选">${items.map(t=>`<button data-filter="${esc(t)}" aria-pressed="${filter===t}">${t}</button>`).join('')}</div>`;
 const arrow='↗';
 const uiIcon=name=>`<i class="iconfont icon-${name}" aria-hidden="true"></i>`;
 const plans=[...data.books.slice(0,6).map((b,i)=>({title:b.title,sub:b.author,cover:b.cover,type:'图书',status:i===0?'进行中':'即将开始',progress:i===0?40:0,id:'book-'+b.id,person:i%2})),...clubCatalogData.magazines.slice(0,3).map((m,i)=>({title:m.title,sub:m.issue,cover:m.cover,type:'期刊',status:'已完结',progress:100,id:'magazine-'+m.title,person:i%2}))];
 const eventData=data.events;
 function readingCard(p){const e=esc,complete=p.status==='已完结',start=complete?'2026-09-07':p.status==='进行中'?'2026-10-12':'2026-11-09',end=complete?'2026-10-04':p.status==='进行中'?'2026-11-08':'2026-12-06';return `<a class="oc-reading-list-card" href="${e(resource('reading',p.id))}" aria-label="${e(p.title)} · ${e(p.status)} · 查看共读"><span class="oc-reading-list-book"><span class="oc-reading-list-paper" aria-hidden="true"></span><img class="oc-reading-list-cover" src="${e(p.cover)}" alt="《${e(p.title)}》封面" loading="lazy" width="210" height="285"></span><div class="oc-reading-list-content"><div class="oc-reading-list-heading"><span class="oc-reading-list-status ${complete?'is-complete':''}">${e(p.status)}</span><div><h3>${e(p.title)}</h3><p>${e(p.sub)}</p></div></div><blockquote class="oc-reading-list-message"><strong>领读语</strong><p>一起读懂文字里的细节，也听听彼此的想法。</p></blockquote><div class="oc-reading-list-summary"><div class="oc-reading-list-summary-copy"><div><strong>阅读进度</strong><small>${start} 至 ${end}</small></div><div class="oc-reading-participants"><span class="oc-reading-avatars"><img src="assets/figma-reading/participant-1.png" alt="" width="20" height="20"><img src="assets/figma-reading/participant-2.png" alt="" width="20" height="20"></span><span>12 人参与</span></div></div><div class="oc-reading-list-ring" role="progressbar" aria-label="${e(p.title)}阅读进度" aria-valuenow="${p.progress}" aria-valuemin="0" aria-valuemax="100"><svg viewBox="0 0 88 88" aria-hidden="true"><circle cx="44" cy="44" r="39" class="oc-list-ring-track"/><circle cx="44" cy="44" r="39" class="oc-list-ring-value" opacity="${p.progress===0?0:1}" pathLength="100" stroke-dasharray="${p.progress} 100"/></svg><strong>${p.progress}%</strong></div></div></div></a>`}
 function reading(){const selected=plans.filter(p=>filter==='全部'||p.type===filter||p.status===filter);return clubReadingHome.render(resource)+section('READING PROGRAMS','找到你的阅读节奏',tabs(['全部','进行中','即将开始','已完结','图书','期刊'])+`<div class="club-reading-list">${selected.map(readingCard).join('')}</div>`)}
 function people(){return clubPeoplePage.render(resource)}
 function events(){const list=eventData.filter(e=>filter==='全部'||e.status===filter),featured=eventData.find(e=>e.id==='oil')||eventData[0];return title('MEET THROUGH READING','把阅读，<br><em>带到生活里。</em>','一场对谈、一次共读、一个周末。让书页里的相遇，在生活中继续发生。')+`<section class="portal-event-feature" aria-label="精选活动"><article class="activity"><div class="activity-copy"><div><span class="badge">${esc(featured.status)}</span><h3>${esc(featured.title)}</h3><p>${esc(featured.summary)}</p></div><div class="activity-meta"><p>${uiIcon('Calendar')}${esc(featured.date)}</p><p>${uiIcon('Location')}${esc(featured.location)}</p><p>${uiIcon('Group')}主办：龙源读书会 · 嘉宾：曹文轩</p></div><div class="activity-bottom"><span>${uiIcon('Group')}<strong>12</strong> 人报名</span><a class="button dark" href="${href('event/'+featured.id)}">${featured.status==='报名中'?'我要报名':'查看回顾'} ${uiIcon('Arrow_Forward-2')}</a></div></div><a class="activity-image-frame" href="${href('event/'+featured.id)}" aria-label="查看${esc(featured.title)}"><img class="activity-image" src="${esc(featured.cover)}" alt="${esc(featured.title)}" fetchpriority="high"></a></article></section><section class="portal-event-list" aria-labelledby="event-list-title"><header class="portal-section-heading"><div><span class="club-overline">ALL EVENTS</span><h2 id="event-list-title">全部活动</h2></div>${tabs(['全部','报名中','即将开始','已结束'])}</header><div class="portal-events">${list.map(e=>`<article class="portal-event"><div class="portal-event-art"><img src="${e.cover}" alt="${esc(e.title)}" loading="lazy"></div><div><span class="badge">${e.status}${e.demo?'':''}</span><h2>${esc(e.title)}</h2><p>${esc(e.summary)}</p><div class="portal-event-meta"><time>${uiIcon('Calendar')}${esc(e.date)}</time><span>${uiIcon('Location')}${esc(e.location)}</span></div></div><a class="button ${e.status==='报名中'?'dark':''}" href="${href('event/'+e.id)}">${e.status==='已结束'?'查看回顾':'活动详情'} ${uiIcon('Arrow_Forward-2')}</a></article>`).join('')||'<div class="portal-empty"><i class="iconfont icon-Calendar" aria-hidden="true"></i><p>这个分类暂时没有活动，看看其他活动吧。</p></div>'}</div></section>`}

 function eventDetail(){const e=eventData.find(e=>e.id===routeId)||eventData[0];return `<div class="portal-event-detail"><img src="${e.cover}" alt="${e.title}"><article><span class="club-overline">READING EVENT · ${e.status}</span><h1>${e.title}</h1><p>${e.summary}</p><dl class="portal-facts"><div><dt>${uiIcon('Calendar')}活动时间</dt><dd>${e.date}</dd></div><div><dt>${uiIcon('Location')}活动地点</dt><dd>${e.location}</dd></div><div><dt>${uiIcon('Group')}参与方式</dt><dd>${e.status==='已结束'?'活动已结束，可查看回顾。':'读书会会员可参与，限额 30 人。'}</dd></div><div><dt>${uiIcon('Book')}活动安排</dt><dd>开场导读 · 作品共读 · 自由交流 · 阅读分享</dd></div></dl><button class="button dark" data-register="${e.id}">${e.status==='已结束'?'收藏活动回顾':session.read('event-'+e.id,false)?'已报名 · 查看报名信息':'报名参加'}</button>${e.demo?'':''}</article></div>`+section('ABOUT THE EVENT','在交流中，再读一遍',`<div class="portal-community"><article><h3>带着一个问题来</h3><p>你可以提前选读作品，标记感兴趣的段落。活动中，领读人将带领大家理解文字、交换观察。</p></article><article><h3>带走一份新发现</h3><p>不需要标准答案。试着听听不同的阅读经验，让一本书在交流中，呈现更多可能。</p></article></div>`)}
 function membership(){return qikanDSU.membership(params.get('plan'),params.get('period'));}
 function my(){if(!session.profile)return title('MY READING SPACE','你的阅读，<br><em>值得好好收藏。</em>','登录后管理个人资料、查看会员、收藏内容，把每天的阅读留在这里。')+`<div class="portal-empty"><h2>欢迎加入龙源读书会</h2><p>设置一个昵称，即可体验完整的个人空间。</p><button class="button dark" data-club-login>登录</button></div>`;const p=session.profile,m=session.membership;
 const tabs=[['overview','Book','我的阅读'],['profile','user_s','基本信息'],['dsu','Wallet','会员与 DSU']];
 const metrics=[['阅读天数',new Set(session.read('qikan-reading-history',[]).map(row=>row.day)).size],['我的收藏',session.read('savedArticles',[]).length],['可用 DSU',qikanDSU.summary().available]];
 const stats=`<div class="qikan-account-stats">${metrics.map(([label,value])=>`<div><strong>${value}</strong><span>${label}</span></div>`).join('')}</div>`;
 const avatar=`<img class="qikan-account-avatar" src="${esc(p.avatar||'assets/default-avatars/author-1.png')}" alt="">`;
 const tabLink=([key,icon,label])=>`<a href="#/me?tab=${key}" ${accountTab===key?'aria-current="page"':''}>${uiIcon(icon)}<span>${label}</span></a>`;
 const side=`<aside class="portal-account-side"><nav aria-label="个人中心">${tabs.map(tabLink).join('')}</nav></aside>`;
 const mobile=`<section class="qikan-account-hub" aria-label="个人中心">
  <a class="qikan-account-identity" href="#/me?tab=profile">${avatar}<span><strong>${esc(p.nickname)}</strong><small>编辑个人资料</small></span>${uiIcon('Arrow_Forward-3')}</a>
  ${stats}
  <a class="qikan-account-member" href="#/me?tab=dsu">${uiIcon('Wallet')}<span><strong>会员与 DSU</strong><small>会员额度、充值余额与消费明细</small></span>${uiIcon('Arrow_Forward-3')}</a>
  <button class="qikan-account-logout" type="button" data-logout>退出登录</button>
 </section>`;
 let panel='';
 if(accountTab==='dsu')panel=qikanDSU.panel(['article','ai'].includes(params.get('filter'))?params.get('filter'):'all');
 else if(accountTab==='profile')panel=`<h2>基本信息</h2><form class="portal-profile-form" id="profile-form"><div class="qikan-profile-avatar"><span>头像</span>${avatar}</div><label><span class="qikan-field-label">昵称 <small data-profile-count="nickname">${p.nickname.length} / 20</small></span><input name="nickname" value="${esc(p.nickname)}" maxlength="20" required></label><label><span class="qikan-field-label">所在城市 <small data-profile-count="city">${(p.city||'').length} / 30</small></span><input name="city" value="${esc(p.city||'')}" maxlength="30"></label><label class="full">邮箱<input type="email" name="email" autocomplete="email" value="${esc(p.email||'')}" placeholder="reader@example.com"></label><label class="full"><span class="qikan-field-label">个人简介 <small data-profile-count="bio">${(p.bio||'').length} / 160</small></span><textarea name="bio" maxlength="160">${esc(p.bio||'')}</textarea><small>一句话，介绍你的阅读世界。</small></label><label class="full">阅读兴趣<input name="interests" value="${esc((p.interests||[]).join('、'))}" placeholder="文学、生活、历史"></label><button class="button dark full">保存修改</button><p class="portal-form-status full" role="status"></p></form>`;
 else panel=readingOverview(p);
 return `<div class="qikan-account" data-account-tab="${esc(accountTab)}">
  <header class="qikan-account-header">${avatar}<h1>${esc(p.nickname)}</h1>${stats}</header>
  ${accountTab==='overview'?mobile:`<a class="qikan-account-return" href="#/me?tab=overview">${uiIcon('Arrow_Back')} 返回个人中心</a>`}
  <div class="portal-account">${side}<section class="portal-account-panel">${panel}</section></div>
 </div>`;
 }
 const readingTabs=[['follow','我的关注'],['saved','我的收藏'],['subscription','我的订购'],['issue','已购期刊'],['article','已购文章']];
 const readingIcon=name=>`<img class="qikan-reading-icon" src="assets/figma-identity/reading-${name}.svg" alt="">`;
 function readingOverview(profile){
  const recent=session.read('qikan-reading-history',[])[0];
  return `<h2>我的阅读</h2>
   <section class="qikan-reading-resume"><h3>继续上次的阅读</h3>
    ${recent?`<a class="qikan-account-recent-link" href="${esc(recent.route)}"><span><strong>${esc(recent.title)}</strong><small>上次读于 ${esc(recent.day.replaceAll('-','/'))} · 继续阅读</small></span><span class="qikan-reading-resume-arrow">${readingIcon('arrow')}</span></a>`:'<p class="qikan-account-empty">暂无阅读记录。</p>'}
   </section>
   <section class="qikan-reading-records"><h3>阅读记录</h3>${readingRecords(profile)}</section>`;
 }
 function subscriptionValidity(time){
  if(!Number.isFinite(time))return '一年有效期';
  const start=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(time);
  const [year,month,day]=start.split('-').map(Number);
  const end=new Date(Date.UTC(year+1,month-1,day));
  if(end.getUTCMonth()!==month-1)end.setUTCDate(0);
  return '有效期：'+start.replaceAll('-','.')+'-'+end.toISOString().slice(0,10).replaceAll('-','.');
 }
 function readingRecords(profile){
  const savedArticles=session.read('savedArticles',[]);
  const articleTitle=item=>typeof item==='string'?item:item.title;
  const articleDetails=(title,record)=>{
   const resource=new URLSearchParams((record.route||'').split('?')[1]).get('resource');
   const bookSource=data.books.find(item=>item.id===resource)?.title;
   const source=record.source||bookSource||resource;
   const publications=source?[source]:['第一财经','南风窗'];
   for(const name of publications){
    const article=magazineArticles(name)?.find(item=>item.title===title);
    if(article)return {summary:record.summary||article.excerpt||article.summary,meta:name};
   }
   const article=[...clubSharedContent.articles,...clubSharedContent.daily].find(item=>item.title===title);
   return {summary:record.summary||article?.excerpt||article?.summary,meta:source||article?.source};
  };
  const publication=row=>{
   const name=row.id==='dycy202609'?'第一财经':row.title;
   const catalog=window.magazinesHomeData.magazines.find(item=>item.title===name);
   const reference=name==='南风窗'?window.nanfcIssueReference:catalog;
   const route=row.route||(reference?'magazine-home.html?publication='+encodeURIComponent(name==='南风窗'?'nanfc':name):'');
   return {...row,title:name,route,cover:row.cover||reference?.cover,type:'期刊',meta:row.meta||catalog?.issue};
  };
  let rows,empty;
  switch(readingTab){
   case 'follow': {
    const books=session.read('savedBooks',[]).flatMap((id,index)=>{
     const item=data.books.find(b=>b.id===id);
     return item?[{index,kind:'book',type:'图书',title:item.title,cover:item.cover,meta:item.author||item.publisher,route:href('book/'+id)}]:[];
    });
    rows=[...books,...session.contentRows('follow').map(row=>publication({...row,kind:'magazine',meta:row.edition}))];
    empty='暂无关注的图书或期刊。';
    break;
   }
   case 'saved':
    rows=savedArticles.map((item,index)=>{
     const title=articleTitle(item);
     return {title,index,kind:'article',route:item.route,...articleDetails(title,item)};
    });
    empty='暂无收藏的文章。';
    break;
   case 'subscription':
    rows=session.contentRows('subscription').map(record=>{
     const row=publication({...record,meta:subscriptionValidity(record.time)});
     const archive=row.title==='南风窗'?window.nanfcIssues
      :row.title==='第一财经'?window.magazineArchiveData:[];
     const editions=new Map();
     for(const entry of archive||[]){
      const issue=Number(entry.issue??entry.label?.match(/(\d+)\s*期/)?.[1]);
      const cover=entry.cover||entry.src;
      if(cover&&Number.isInteger(entry.year)&&issue>0){
       editions.set(entry.year*1000+issue,cover);
      }
     }
     const [cover,alternate]=[...editions.keys()].sort((a,b)=>b-a).slice(0,2).map(key=>editions.get(key));
     return {...row,cover:cover||row.cover,alternate};
    });
    empty='暂无全年订购的期刊。';
    break;
   case 'issue':
    rows=[
     ...session.contentRows('issue').map(row=>publication({...row,meta:row.edition||row.title?.match(/\d{4}年\s*第?\s*\d{1,2}\s*期/)?.[0]||'单期购买'})),
     ...(profile.publicationRights||[]).map(row=>publication({title:row.name,meta:'继承权益 · 到期 '+row.expires}))
    ];
    empty='暂无已购期刊。';
    break;
   case 'article':
    rows=qikanDSU.readingUnlocks().map(row=>({
     title:row.description,route:row.route,...articleDetails(row.description,row)
    }));
    empty='暂无已购文章。';
    break;
  }
  return `<nav class="qikan-reading-tabs" aria-label="阅读记录">${readingTabs.map(([key,label])=>`<button type="button" data-reading-tab="${key}" aria-pressed="${readingTab===key}">${label}</button>`).join('')}</nav>
   ${rows.length?`<ul class="qikan-saved-list">${rows.map(row=>{
    const cover=row.cover?`<img class="qikan-saved-cover" src="${esc(row.cover)}" alt="" loading="lazy">`:'';
    const content=`${cover&&row.alternate?`<span class="qikan-subscription-covers">${cover}<img class="qikan-saved-cover" src="${esc(row.alternate)}" alt="" loading="lazy"></span>`:cover}
     <span class="qikan-saved-text"><span class="qikan-reading-item-head">
      ${row.type?`<small class="qikan-reading-type">${row.type}</small>`:''}<strong>${esc(row.title)}</strong>
      ${row.summary?`<span class="qikan-reading-summary">${esc(row.summary)}</span>`:''}
     </span>${row.meta?`<small class="qikan-reading-meta">${esc(row.meta)}</small>`:''}</span>`;
    const removal=['book','magazine','article'].includes(row.kind);
    const action=removal?`<button type="button" class="qikan-saved-remove" data-remove-saved="${row.kind}" data-index="${row.index??''}" data-content-id="${esc(row.id)}" aria-label="${row.kind==='article'?'取消收藏':'取消关注'} ${esc(row.title)}">${readingIcon(row.kind==='article'?'star':'mark')}</button>`
     :'';
    const layout=row.kind==='subscription'?'subscription':row.type==='图书'?'book':row.type==='期刊'?'periodical':'article';
    return `<li class="qikan-reading-item qikan-reading-item--${layout}">${row.route?`<a class="qikan-saved-link" href="${esc(row.route)}">${content}</a>`:`<div class="qikan-saved-link">${content}</div>`}${action}</li>`;
   }).join('')}</ul>`:`<p class="qikan-account-empty">${empty}</p>`}`;
 }
 function recordReading(a){
  if(!session.profile||document.body.classList.contains('issue-preview-page')||main.querySelector('.dsu-gate'))return;
  const route=location.hash;
  const day=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai'}).format(new Date());
  const recent=session.read('qikan-reading-history',[]);
  if(recent[0]?.route===route&&recent[0]?.day===day)return;
  session.write('qikan-reading-history',[{route,title:a.title,day},...recent.filter(row=>row.route!==route||row.day!==day)].slice(0,300));
 }
 const tools=[null,['Card','Anki 卡片','翻一张，记住一点'],['Knowledge','增强阅读','梳理重点与背景'],['Play','音频课程','用声音陪伴阅读'],['Paper2','章节自测','检验自己的理解'],['Knowledge','知识地图','串起一整本书']];
 function bookDetail(){const b=book(routeId),saved=session.read('savedBooks',[]).includes(b.id);return `<div class="portal-book-layout">${clubBookSidebar.render(b,{saved,chapter:chapterLink(b,0),reading:resource('reading','book-'+b.id)})}<div class="portal-book-content book-detail-refined"><header class="book-detail-byline"><span>${esc(b.author)}</span><span>${esc(b.publisher)}</span></header><section class="book-detail-introduction" aria-label="图书简介"><div class="book-detail-about"><span class="club-overline">ABOUT THE BOOK</span><p>${esc(b.summary)}</p></div><blockquote class="book-detail-quote"><span class="club-overline">EDITOR’S NOTE · 编辑推荐</span><p>${esc(b.reason)}</p></blockquote><span class="book-detail-divider" aria-hidden="true"></span></section><section class="book-detail-tools" aria-labelledby="book-tools-title"><span class="club-overline">READ & UNDERSTAND</span><h2 id="book-tools-title">读懂一本书，有更多路径</h2><div class="portal-tool-grid">${tools.flatMap((tool,i)=>{if(!tool)return [];const [ico,t,d]=tool;return `<button class="portal-tool" data-book-tool="${i}" data-book-id="${esc(b.id)}"><img class="book-tool-art" src="assets/book-capabilities/${['chat','anki','enhanced','audio','quiz','map'][i]}.png" width="40" height="40" alt=""><span><strong>${t}</strong><small>${d}</small></span></button>`;}).join('')}</div></section>${clubBookContents.render(b)}</div></div>`}

 function toolView(index,id){if(index===6){location.assign('https://ebooks.com.cn/reader/8/map?chapterId=806');return;}const mode=['text','anki','enhanced','audio','quiz','map','graph'][index]||'text';clubPageMotion.navigate(chapterLink(book(id),0)+'&mode='+mode);}
 function articleInfo(){const context=params.get('context')||'standalone',index=Math.max(0,Number(routeId)||0),rid=params.get('resource');if(context==='book'){const b=book(rid),list=chapterNames(b);const i=Math.min(index,list.length-1);return {context,index:i,title:list[i],author:b.author,resource:b.title,rid:b.id,list:clubBookContents.flatten(b).map(t=>({...t})),url:b.url,summary:b.summary,group:'章节阅读',book:b}}if(context==='magazine'){const list=(params.get('topic')==='topic-mudsnwbq'?window.natureTopicData?.articles:null)||magazineArticles(rid)||magazineArticles(),i=Math.min(index,list.length-1),a=list[i];return {...a,context,index:i,topicId:params.get('topic'),rid:rid||'第一财经',resource:rid||'第一财经',list,title:params.get('title')||a.title,author:a.author||'作者信息待补充',summary:a.excerpt||a.summary,url:a.url,group:a.group}}const key=routeId.startsWith('daily-')?'daily':'articles',i=Number(routeId.split('-').pop())||0,a=clubSharedContent[key][i]||clubSharedContent.articles[0];return {...a,context,index:i,title:a.title,author:a.author,summary:a.summary||a.excerpt||'停留在文字里，让阅读慢一点。',resource:'精选文章',list:[],url:a.url,group:'独立文章'}}
 function articleToc(a,mk){const magazine=clubCatalogData.magazines.find(m=>m.title===a.resource),cover=a.book?.cover||magazine?.cover,detail=a.topicId?'index.html#/topic/'+a.topicId:a.context==='book'?href('book/'+a.rid):'index.html#/magazine/'+encodeURIComponent(a.rid)+(a.rid==='南风窗'?'?issue=0&club=1':'?claimed=0');let groupIndex=0,sectionIndex=0;return `<aside class="portal-toc"><a class="reader-resource" href="${detail}" aria-label="返回${a.context==='book'?'图书':'期刊'}详情">${cover?`<img src="${esc(cover)}" width="49" height="66" alt="《${esc(a.resource)}》封面">`:''}<span><strong>${esc(a.resource)}</strong><small>${esc(a.book?.author||magazine?.issue||'期刊目录')}</small></span></a><nav aria-label="${a.context==='book'?'图书章节':'期刊文章'}目录">${a.list.map((t,i)=>{const group=i===0||t.group!==a.list[i-1]?.group;if(group){groupIndex++;sectionIndex=0;}sectionIndex++;return `${group?`<div class="portal-toc-group"><span>${String(groupIndex).padStart(2,'0')}</span><span>${esc(t.group||'章节目录')}${a.context==='book'?`<div class="reader-chapter-actions">${[['audio','音频课'],['anki','Anki 卡片']].map(([mode,label])=>`<a class="reader-chapter-tool" data-chapter-mode="${mode}" data-chapter-index="${t.groupIndex}" href="${mk(i)}&mode=${mode}" title="${label}" aria-label="${label}"><img src="assets/book-capabilities/${mode}.png" width="20" height="20" alt=""></a>`).join('')}</div>`:''}</span></div>`:''}<a class="reader-toc-article" href="${mk(i)}" ${i===a.index?'aria-current="page"':''}><span>${a.context==='book'?groupIndex+'.'+sectionIndex:String(i+1).padStart(2,'0')}</span><span><strong>${esc(t.title)}</strong>${t.excerpt||t.summary?`<small>${esc(t.excerpt||t.summary)}</small>`:''}</span></a>`}).join('')}</nav></aside>`}
 function demoArticleBody(article,previewOnly=false){
  const aiStory=article.title.includes('当AI学会');
  const aiOpening=`<h2>风险也取决于模型能接触什么</h2>
  <p>关于强模型的讨论，往往先问它有多聪明。但站在使用者的角度，还有一个更具体的问题：它能接触哪些资料，又能替人做哪些决定？同一个模型，在只能回答问题的对话框里，和在能读文件、调用服务的工作空间里，承担的责任不同。</p>
  <p>这也是为什么，「限制向公众开放」与「模型已经安全」是两件事。前者改变了使用者的范围，后者需要在具体场景里验证。对于使用者来说，除了看评测分数，更值得知道的是哪些操作需要人工确认，谁能追溯异常，以及发现问题后能否暂停相关权限。</p>
  <h2>公开范围如何决定</h2>
  <p>如果一项能力可能同时给运营者和研究者带来价值，又会放大误用的影响，开放就不只有全放开和全关闭两种选项。分阶段试用可以让团队先在有限的环境里观察真实用法，再根据反馈决定下一步。但这种做法能否起效，也取决于试用者能否报告问题，以及报告会不会改变部署决策。</p>
  <p>对读者而言，有用的追问是：评估结论依赖哪些使用条件？当产品接入新的工具或面向更多用户时，这些条件还成立吗？把问题放回具体的使用场景，比单凭模型名称或一次发布声明判断风险更有帮助。</p>`;
  const demoOpening=`
  <h2>从一个细节，慢慢读进去</h2>
  <p>一篇文章常常从一个很小的地方开始。一句交谈、一张旧照片，或者一件被忽略的日常物品，都可能比一个庞大的概念更容易把人带进故事。读到这样的开头，可以先想一想：作者为什么选择从这里写起？如果把这一幕拿掉，接下来的叙述会少掉什么？</p>
  <p>细节并不总是用来证明一个观点。有些只是让我们看见人物的处境。一个人在两种方案之间来回权衡，可能并不是因为缺少判断力，而是因为两种方案各自牵连着许多人。多停留一会儿，事情的纹理才会逐渐显现出来。</p>
  <p>阅读过程中，还可以留心那些看似不起眼的动词。人物是等待、寻找，还是已经作出了决定？动作的先后会改变一段叙述的方向。把这几个动词放回原来的句子里，就能看出作者怎样用最少的文字交代一段过程。</p>
  <h2>把局部放回时间里</h2>
  <p>理解变化的一个办法，是分清哪些事在缓慢积累，哪些事发生在一个具体时刻。很多今天看起来突然的决定，其实经历了长时间的尝试。报道从某一天写起，往往是因为那一天让积累已久的问题第一次变得可见。</p>
  <p>我们读到数字时，也可以问问它描述的是哪一段时间、哪一群人，以及与什么情况作比较。同样的数字，和上个月比可能意味着明显变化，放到更长的周期里也许只是一次波动。弄清比较的范围，通常比记住数字本身更有用。</p>
  `;
  const opening=aiStory?aiOpening:demoOpening;
  const bodyStart=`<div class="portal-demo-article"><p class="portal-demo-label">以下为演示正文</p>${opening}`;
  if(previewOnly)return bodyStart+'</div>';
  return `${bodyStart}
  <blockquote>读到一个结论时，可以先回头看看，它是从哪些证据一步步走过来的。</blockquote>
  <p>有时，最值得读的部分恰好是那些没有得到回答的问题。作者查证了什么？哪些材料仍然缺失？谁的意见还没有出现？把这些空白记下来，下一篇文章就有了可以继续追问的方向。阅读也因此从接收信息变成了主动寻找线索。</p>
  <h2>沿着另一条线索重读</h2>
  <p>第一次阅读时，不妨顺着叙述走，看作者怎样安排场景、解释背景和引出问题。第二次可以换一条线索，例如只看被采访的人是如何描述同一件事的。不同的人可能强调不同的风险和机会，这种差异本身就经常是理解文章的入口。</p>
  <p>也可以把其中一段放到自己熟悉的经验里。想起曾经遇到的相似场景时，别急着认定两者相同，先列出哪里相似、哪里不同。一篇文章常常只覆盖特定条件，正是这些边界决定它能帮助我们解释什么。</p>
  <p>如果两篇报道的判断不一样，可以试着把各自依赖的材料列在一起。有的从个人经历开始，有的需要把同一时期的变化放进更大的范围观察。保留这些不同的出发点，也许比为它们找出一个统一结论更接近事实。</p>
  <h2>带走一个还想弄明白的问题</h2>
  <p>读完之后，可以用自己的话写下一个具体发现，再留一个尚未回答的问题。发现不需要涵盖整篇文章，只要是确实读到了、能够在文章中找到依据的内容就好。下次回到这里，这两行字会比一句抽象的评价更容易接上思路。</p>
  <p>如果还想往下读，可以从同一期里选一篇角度不同的文章，对照其中使用的例子和问法。读完一篇文章带来的收获，有时是一条清楚的结论，也有时是知道下一步该去找什么。</p></div>`;
 }
 function saveArticleButton(a,articleRoute=''){
  const saved=session.read('savedArticles',[]).some(item=>(typeof item==='string'?item:item.title)===a.title);
  const label=saved?'取消收藏文章':'收藏文章';
  const star=`<i class="iconfont club-local-icon icon-${saved?'StarFill':'Star'}" aria-hidden="true"></i>`;
  if(!articleRoute)return `<button type="button" data-save-article aria-label="${label}" title="${label}" aria-pressed="${saved}">${star}</button>`;
  return `<div class="portal-article-save-group">
   <span class="portal-article-save-label" data-save-label>${saved?'已收藏':'收藏文章'}</span>
   <button type="button" class="portal-article-save" data-save-article data-article-index="${a.index}" data-article-route="${esc(articleRoute)}" aria-label="${label}" title="${label}" aria-pressed="${saved}">
    <img src="assets/reader-footer/star.svg" alt="" width="24" height="24">${star}
   </button>
   <p>如果喜欢这篇文章欢迎收藏</p>
  </div>`;
 }
 function article(){const a=articleInfo(),ctx=a.context!=='standalone'&&params.get('full')!=='1',mk=i=>href('article/'+i+'?context='+a.context+'&resource='+encodeURIComponent(a.rid)+(a.topicId?'&topic='+a.topicId:'')+(params.get('full')==='1'?'&full=1':''));if(window.clubIssuePreview?.isPreview(a,params))return clubIssuePreview.render(a,articleToc);
  const full=window.clubIssuePreview?.hasFull(a)||a.bodyHtml;
  const paidDemo=a.rid==='南风窗'||a.context==='standalone';
  const locked=a.context!=='book'&&(full||paidDemo)&&!qikanDSU.canRead(a);
  const suppliedBody=locked?null:window.clubIssuePreview?.fullBody(a);
  if(suppliedBody)a.bodyHtml=suppliedBody;
  const summary=`<p>${esc(a.summary)}</p>`;
  const excerpt=a.context!=='book'&&!full?`<div class="portal-prose">${a.bodyHtml||summary}${demoArticleBody(a)}</div>`:null;const prose=a.context==='book'?['我们读一部经典，不只是在追随故事的走向，也是在了解人物如何面对他们的生活。留意一个动作、一句对话，往往就能找到进入作品的线索。','先把目光放在这一章的人物身上：他们想要什么，又为什么作出这样的选择？试着用原文中的一个细节，解释你的判断。','阅读并不急于得出结论。遇到触动自己的地方，可以停下来，写一句摘录，记下此刻的感受。等到重读时，你也许会发现另一层意思。']:['读一篇文章时，我们可以先留意它从哪里开始：是一个日常的细节，一个具体的人，还是一个需要继续追问的问题？这些线索，往往决定了我们怎样进入文字。','当作者把不同的观察放在一起，文章的视角也随之展开。我们不必急着认同或反对，可以先找出论述的依据，再比较它与自己的经验。','把阅读带回生活，可能只需要一个很小的动作：记住一段话，重新观察熟悉的事物，或者和朋友聊一聊刚刚想到的问题。'];
 return `<div class="portal-reader ${ctx?'':'is-standalone'}">${ctx||params.get('full')==='1'?articleToc(a,mk):''}<article class="portal-reader-content"><div class="portal-reader-tools" role="group" aria-label="阅读工具">${a.list.length>1?`<div class="reader-tool-group" role="group" aria-label="篇目切换"><button type="button" data-reader-article="${a.index>0?esc(mk(a.index-1)):''}" ${a.index>0?'':'disabled'} aria-label="上一篇" title="${a.index>0?'上一篇：'+esc(a.list[a.index-1].title):'已经是第一篇'}"><span class="reader-arrow-up" aria-hidden="true"></span></button><button type="button" data-reader-article="${a.index<a.list.length-1?esc(mk(a.index+1)):''}" ${a.index<a.list.length-1?'':'disabled'} aria-label="下一篇" title="${a.index<a.list.length-1?'下一篇：'+esc(a.list[a.index+1].title):'已经是最后一篇'}"><span class="reader-arrow-down" aria-hidden="true"></span></button></div>`:`<div class="reader-tool-group" role="group" aria-label="滚动正文"><button type="button" data-reader-scroll="-1" aria-label="向上滚动"><span class="reader-arrow-up" aria-hidden="true"></span></button><button type="button" data-reader-scroll="1" aria-label="向下滚动"><span class="reader-arrow-down" aria-hidden="true"></span></button></div>`}<div class="reader-tool-section"><button type="button" data-reader-font-cycle aria-label="当前：标准 16/28，点击切换字号" title="当前：标准 16/28，点击切换字号"><i class="iconfont club-local-icon icon-FontNew" aria-hidden="true"></i></button><button type="button" data-reader-night aria-label="夜间阅读" title="夜间阅读" aria-pressed="false"><i class="iconfont club-local-icon icon-Moon" aria-hidden="true"></i></button></div>${a.context==='magazine'?'':saveArticleButton(a)}</div><header class="portal-article-head"><span class="club-overline">${String(a.index+1).padStart(2,'0')}</span><h1 tabindex="-1">${esc(a.title)}</h1><div class="portal-article-meta"><span>${esc(a.author)}</span><span>${esc(a.resource)} · ${esc(a.group)}</span><span>${a.issueLabel?esc(a.issueLabel):''}</span><span>约 ${a.readingMinutes||5} 分钟阅读</span></div></header>${locked?qikanDSU.gate(a,paidDemo&&!full?summary+demoArticleBody(a,true):window.clubIssuePreview?.previewBody(a)||summary):excerpt||`<div class="portal-prose ${a.academic?'is-academic':''}">${a.bodyHtml?a.bodyHtml:`<p class="lead">${esc(a.summary)}</p>${a.cover?`<img src="${esc(a.cover.startsWith('assets/')&&!a.cover.startsWith('assets/shared')?a.cover:a.cover)}" alt="${esc(a.title)}配图">`:''}<h2>从一个细节，慢慢读进去</h2><p>${prose[0]}</p><p>${prose[1]}</p><blockquote>读得慢一点，给理解多一点时间。</blockquote><h2>读完之后，再问一个问题</h2><p>${prose[2]}</p><p>这一页里，哪一个细节最值得你记下来？你可以在下方写下一点想法，也可以把它带到共读讨论中，听听其他读者的看法。</p>`}</div>`}${a.context==='magazine'?`<footer class="portal-article-actions">${saveArticleButton(a,mk(a.index).split('#')[1])}${locked?'':'<div class="portal-article-end">END</div>'}</footer>`:''}${ctx?`<nav class="portal-reader-next" aria-label="篇目切换">${a.index>0?`<a href="${mk(a.index-1)}"><small>上一篇</small>${esc(a.list[a.index-1].title)}</a>`:'<span></span>'}${a.index<a.list.length-1?`<a href="${mk(a.index+1)}"><small>下一篇</small>${esc(a.list[a.index+1].title)}</a>`:'<span>已经读到最后一篇</span>'}</nav>`:''}</article></div>`
 }
 window.clubArticleDetail={
  infoAt(index){const prev=routeId;routeId=String(index);try{return articleInfo();}finally{routeId=prev;}},
  renderAt(index){const prev=routeId;routeId=String(index);try{return article();}finally{routeId=prev;}},
  setCurrent(index){routeId=String(index);}
 };

 function render(){window.clubBookReader?.unmount();window.clubReadingHome?.unmount();window.clubPeoplePage?.unmount();const [path,query]=location.hash.replace(/^#\/?/,'').split('?');[route,routeId]=path.split('/');params=new URLSearchParams(query);route=route||'book';if(route==='me')accountTab=['membership','dsu'].includes(params.get('tab'))?'dsu':params.get('tab')==='profile'?'profile':'overview';if(!['book','article','me','membership'].includes(route)){const pages={reading:'reading',people:'lecturers',events:'activities',event:'activity',membership:'membership'};if(route==='membership'){location.replace('index.html#/magazine/'+encodeURIComponent('南风窗')+'?claimed=1&section=membership');return;}location.replace('index.html#/magazine/'+encodeURIComponent('南风窗')+'?claimed=1&page='+(pages[route]||'reading')+(routeId?'&id='+encodeURIComponent(routeId):''));return;}main.dataset.page=route;const funcs={reading,people,events,event:eventDetail,membership,me:my,book:bookDetail,article};main.innerHTML=(funcs[route]||reading)();
 readingProgress.hidden=route!=='article'||Boolean(main.querySelector('.issue-preview-reader'));
 readingProgress.style.transform='scaleX(0)'; requestAnimationFrame(updateReadingProgress);if(route==='article'){clubIssuePreview.mount(articleInfo(),params);if(!clubIssuePreview.isPreview(articleInfo(),params))clubBookReader.mount(articleInfo());window.clubEditorialReflow?.mount();recordReading(articleInfo());}else{document.body.classList.remove('issue-preview-page','issue-full-page');window.syncReaderGuide?.();}if(route==='people')clubPeoplePage.mount();if(route==='reading')clubReadingHome.mount();if(route==='book')clubBookSidebar.mount();document.title=({reading:'共读',people:'领读人',events:'活动',event:'活动详情',membership:'会员',me:'我的',book:book(routeId).title,article:route==='article'?articleInfo().title:''}[route]||'龙源读书会')+' · 龙源期刊网';document.querySelectorAll('[data-page]').forEach(a=>{if(a.dataset.page===route)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});clubNavigation.setBack(document.querySelector('.portal-back'),['book','article','event','me'].includes(route));document.querySelector('.portal-back').onclick=()=>{clubPageMotion.back(route==='article'&&params.get('full')==='1'?href('article/'+routeId+'?context=magazine&resource='+encodeURIComponent(params.get('resource'))):route==='article'&&params.get('context')==='magazine'?(params.get('resource')==='第一财经'?'magazine-home.html':params.get('resource')==='南风窗'?'magazine-home.html?publication=nanfc':'index.html#/magazine/'+encodeURIComponent(params.get('resource'))):params.get('topic')==='topic-mudsnwbq'?'index.html#/topic/topic-mudsnwbq':route==='article'&&params.get('context')==='book'?href('book/'+params.get('resource')):'index.html#/books')};if(route==='me'&&accountTab==='dsu'&&params.get('view')==='usage'){
  document.querySelector('#dsu-ledger')?.scrollIntoView({block:'start',behavior:'instant'});
 }else window.scrollTo({top:0,behavior:'instant'})}
 document.addEventListener('click',e=>{const el=e.target.closest('button');if(!el)return;
 if(el.dataset.filter){filter=el.dataset.filter;const y=scrollY;render();window.scrollTo({top:y,behavior:'instant'})}
 const readingRecordsSection=el.closest('.qikan-reading-records');
 if(el.dataset.readingTab){
  readingTab=el.dataset.readingTab;
  readingRecordsSection.innerHTML='<h3>阅读记录</h3>'+readingRecords(session.profile);
  readingRecordsSection.querySelector('[aria-pressed=true]').focus({preventScroll:true});
 }
 if(el.dataset.removeSaved){
  const kind=el.dataset.removeSaved;
  if(kind==='magazine')session.recordContent('follow',el.dataset.contentId,null);
  else {
   const key=kind==='book'?'savedBooks':'savedArticles';
   const index=Number(el.dataset.index);
   session.write(key,session.read(key,[]).filter((_,position)=>position!==index));
  }
  readingRecordsSection.innerHTML='<h3>阅读记录</h3>'+readingRecords(session.profile);
  (readingRecordsSection.querySelector('.qikan-saved-remove')||readingRecordsSection.querySelector('[aria-pressed=true]')).focus({preventScroll:true});
  toast(kind==='article'?'已取消收藏':'已取消关注');
 }
 if(el.hasAttribute('data-logout')){session.logout();accountTab='overview';location.hash='#/me';render();toast('已退出登录')}
 if(el.hasAttribute('data-plan')){if(!session.profile){session.login();return}const p=data.membership.plans[0].prices[Number(el.dataset.plan)];modal('确认体验'+p.periodLabel+'会员',`<p>你选择了${p.periodLabel}方案 · ${p.priceFen/100} DSU / ${p.durationDays} 天。</p><p>确认后即可开启所选会员权益。</p><button class="button dark" data-confirm-plan="${el.dataset.plan}">确认体验开通</button>`)}
 if(el.hasAttribute('data-confirm-plan')){const p=data.membership.plans[0].prices[Number(el.dataset.confirmPlan)],d=new Date('2026-10-15T12:00:00');d.setDate(d.getDate()+p.durationDays);session.member({label:p.periodLabel,period:p.periodCode,price:p.priceFen/100});const m=session.membership;m.expires=d.toISOString().slice(0,10);session.write('membership',m);document.querySelector('#portal-dialog').close();toast('会员体验已开启');accountTab='membership';location.hash='#/me?tab=membership'}
 if(el.hasAttribute('data-trial')){if(!session.profile){session.login();return}if(session.membership){accountTab='membership';location.hash='#/me?tab=membership';return}const d=new Date('2026-10-15T12:00:00');d.setDate(d.getDate()+7);session.member({label:'7 天体验',price:0});const m=session.membership;m.expires=d.toISOString().slice(0,10);session.write('membership',m);accountTab='membership';location.hash='#/me?tab=membership';toast('已领取 7 天体验会员')}
 if(el.dataset.register){if(!session.profile){session.login();return}const ev=eventData.find(x=>x.id===el.dataset.register);if(ev.status==='已结束'){toast('活动回顾已收藏');session.write('event-saved-'+ev.id,true);return}if(session.read('event-'+ev.id,false)){modal('报名信息',`<p>${ev.title}</p><p>参与人：${esc(session.profile.nickname)}</p><p>${ev.date} · ${ev.location}</p><p>状态：已报名</p>`);return}session.write('event-'+ev.id,true);render();toast('报名成功，可在“我的”查看')}
 if(el.dataset.saveBook){const ids=session.read('savedBooks',[]),id=el.dataset.saveBook;if(ids.includes(id)){session.write('savedBooks',ids.filter(x=>x!==id));if(!el.classList.contains('portal-bookmark'))el.textContent='关注图书';el.setAttribute('aria-pressed','false');el.setAttribute('aria-label','关注图书');toast('已取消关注')}else{session.write('savedBooks',[...ids,id]);if(!el.classList.contains('portal-bookmark'))el.textContent='已关注';el.setAttribute('aria-pressed','true');el.setAttribute('aria-label','取消关注');toast('已关注')}}
 if(el.hasAttribute('data-share-book')){const b=book(el.dataset.shareBook);modal('分享《'+esc(b.title)+'》',`<label>图书地址<input readonly value="${esc(new URL(href('book/'+b.id),location.href).href)}"></label>`)}
 if(el.hasAttribute('data-book-tool'))toolView(Number(el.dataset.bookTool),el.dataset.bookId);
 if(el.dataset.readerScroll){window.scrollBy({top:Number(el.dataset.readerScroll)*innerHeight*.7,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
  if(el.hasAttribute('data-reader-article')){if(!el.disabled&&el.dataset.readerArticle)location.hash=new URL(el.dataset.readerArticle,location.href).hash;return}
 if(el.hasAttribute('data-reader-font-cycle')){const reader=el.closest('.portal-reader'),steps=[{size:16,line:28,name:'标准'},{size:20,line:32,name:'大号'},{size:24,line:36,name:'特大号'}],current=Number(reader.dataset.readerFontStep||0),index=(current+1)%steps.length,next=steps[index];reader.dataset.readerFontStep=index;reader.style.setProperty('--article-body-size',next.size+'px');reader.style.setProperty('--article-body-leading',next.line+'px');reader.querySelectorAll('.portal-prose').forEach(prose=>{prose.style.setProperty('--reader-size',next.size+'px');prose.style.fontSize=next.size+'px';prose.style.lineHeight=next.line+'px'});el.title='当前：'+next.name+' '+next.size+'/'+next.line+'，点击切换字号';el.setAttribute('aria-label',el.title);return}
 if(el.dataset.readerAdjust){const prose=document.querySelector('.portal-prose'),size=parseFloat(getComputedStyle(prose).fontSize);prose.style.setProperty('--reader-size',Math.max(14,Math.min(24,size+Number(el.dataset.readerAdjust)))+'px')}
 if(el.dataset.readerSize){document.querySelector('.portal-prose').style.setProperty('--reader-size',el.dataset.readerSize+'px');document.querySelectorAll('[data-reader-size]').forEach(b=>b.setAttribute('aria-pressed',String(b===el)))}
 if(el.hasAttribute('data-reader-night')){const active=document.querySelector('.portal-reader').classList.toggle('night');el.setAttribute('aria-pressed',String(active));el.setAttribute('aria-label',active?'日间阅读':'夜间阅读');el.title=active?'日间阅读':'夜间阅读'}
 if(el.hasAttribute('data-save-article')){
  const index=el.dataset.articleIndex;
  const a=index===undefined?articleInfo():window.clubArticleDetail.infoAt(Number(index));
  const ids=session.read('savedArticles',[]),matches=item=>(typeof item==='string'?item:item.title)===a.title;
  const saved=!ids.some(matches),route=el.dataset.articleRoute?'#'+el.dataset.articleRoute:location.hash;
  session.write('savedArticles',saved?[...ids,{title:a.title,route,summary:a.summary,source:a.rid||a.resource}]:ids.filter(item=>!matches(item)));
  const label=saved?'取消收藏文章':'收藏文章';
  el.setAttribute('aria-label',label);el.setAttribute('aria-pressed',String(saved));el.title=label;
  el.querySelector('i').classList.toggle('icon-StarFill',saved);el.querySelector('i').classList.toggle('icon-Star',!saved);
  const text=el.closest('.portal-article-save-group')?.querySelector('[data-save-label]');if(text)text.textContent=saved?'已收藏':'收藏文章';
  toast(saved?'文章已收藏':'已取消收藏');
 }
 });
 document.addEventListener('input',e=>{
  const field=e.target;
  if(field.form?.id!=='profile-form'||field.maxLength<0)return;
  const counter=field.form.querySelector('[data-profile-count="'+field.name+'"]');
  if(counter)counter.textContent=field.value.length+' / '+field.maxLength;
 });
 document.addEventListener('submit',e=>{
 if(e.target.id==='profile-form'){e.preventDefault();const f=e.target;session.update({...session.profile,dsuId:session.profile.dsuId||session.profile.email?.trim().toLowerCase()||session.profile.nickname.trim().toLowerCase(),nickname:f.nickname.value.trim(),city:f.city.value.trim(),email:f.email.value,bio:f.bio.value.trim(),interests:f.interests.value.split(/[、,，]/).map(x=>x.trim()).filter(Boolean)});document.querySelector('.portal-form-status').textContent='已保存，你的资料已更新。'}
 if(e.target.id==='redeem-form'){e.preventDefault();if(!session.profile){session.login();return}if(e.target.code.value.trim().toUpperCase()!=='READ2026'){toast('兑换码不正确，请检查后重试');return}session.member({label:'年度兑换',price:0});accountTab='membership';location.hash='#/me?tab=membership';toast('年度会员体验已兑换')}
 });
 window.addEventListener('dsu-change',()=>{if(route==='me')render()});
 window.addEventListener('dsu-article-unlocked',event=>{
  const locked=event.detail.closest('.portal-reader');
  if(route!=='article'||!locked?.isConnected)return;
  const index=locked.dataset.continuousIndex;
  if(index!==undefined&&String(routeId)!==index){
   location.hash=location.hash.replace(/article\/\d+/,'article/'+index);
   return;
  }
  const y=scrollY;
  render();
  window.scrollTo({top:y,behavior:'instant'});
  main.querySelector('.portal-reader-content h1')?.focus({preventScroll:true});
 });
 window.addEventListener('hashchange',()=>{filter='全部';render()});window.addEventListener('club-session-change',()=>{if(route==='me'||route==='membership')clubPageMotion.update(()=>render())});
 function updateReadingProgress(){
  if(readingProgress.hidden||document.body.classList.contains('issue-full-page'))return;
  const content=main.querySelector('.portal-reader-content');
  if(!content)return;
  const rect=content.getBoundingClientRect();
  const extent=Math.max(1,rect.height-innerHeight+100);
  readingProgress.style.transform='scaleX('+Math.max(0,Math.min(1,(100-rect.top)/extent))+')';
 }
 window.addEventListener('scroll',updateReadingProgress,{passive:true});
 window.addEventListener('resize',updateReadingProgress);
 render();
})();
