window.publicationCommunityRoute=(publication,page='',id='')=>'#/magazine/'+encodeURIComponent(publication)+'?claimed=1'+(page?'&page='+page:'')+(id?'&id='+encodeURIComponent(id):'');
window.octoberCommunityRoute=(page,id)=>publicationCommunityRoute('南风窗',page,id);
window.financeCommunityData=function(){
 const cover='assets/magazine-home/dycy202609-z.jpg';
 const article=(index)=>'portal.html#/article/'+index+'?context=magazine&resource='+encodeURIComponent('第一财经')+'&full=1';
 const profiles=[
  {id:'zhao-jia',name:'赵嘉',role:'《第一财经》本期作者',columnTitle:'编者的话',slogan:'从睡眠困扰出发，一起读懂睡眠经济。',bio:'本期《你睡得好吗？》的作者。',article:article(0),articleTitle:'你睡得好吗？'},
  {id:'deng-yiyun',name:'邓依云',role:'《第一财经》本期作者',columnTitle:'有研究',slogan:'从新导演的处境看电影市场如何变化。',bio:'本期《市场退潮，新导演如何“上岸”》的共同作者。',article:article(11),articleTitle:'市场退潮，新导演如何“上岸”'}
 ].map(p=>({...p,avatar:cover,hero:cover,heroOriginal:cover,portrait:cover,readings:1,followers:0,views:0}));
 const activities=[
  {id:'sleep-economy',title:'共读《睡眠经济学》',summary:'从封面报道出发，聊聊睡眠困扰如何催生新的消费需求。'},
  {id:'film-market',title:'共读电影市场与新导演',summary:'围绕本期电影报道，讨论市场变化给新导演带来的挑战。'}
 ].map(a=>({...a,cover,demo:true,statusLabel:'即将开始',location:'待公布',date:'待公布'}));
 return {profiles,activities};
};
window.renderPublicationMembershipPage=function(publication='南风窗'){
 return `<div class="rd-periodical pe-figma-detail oc-publication">
  <main class="oc-main"><section class="oc-membership" id="oc-membership">${renderSignedMembership(true,publication==='南风窗'?'':publication)}</section></main>
  ${renderOctoberDock('membership','',publication)}
  ${renderResourceChat()}
 </div>`;
};
window.renderOctoberCommunity=function(page,id,publication='南风窗'){
 if(page==='membership')return window.renderPublicationMembershipPage(publication);
 const finance=publication==='第一财经',data=finance?financeCommunityData():null;
 const d=octoberClubData,e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const route=(page,id)=>publicationCommunityRoute(publication,page,id);
 const icon=n=>`<i class="iconfont icon-${n}" aria-hidden="true"></i>`;
 const profiles=data?.profiles||d.lecturers.profiles,activities=data?.activities||d.activities.list;
 const date=s=>s?new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(s)):'待公布';
 const button=(text,url,dark=false)=>`<a class="oc-button ${dark?'oc-dark':''}" href="${e(url)}">${text}${icon('Arrow_Forward-2')}</a>`;
 const heading=(eyebrow,title,summary='')=>`<header class="oc-header"><span class="oc-eyebrow">${eyebrow}</span><h1>${e(title)}</h1>${summary?`<p>${e(summary)}</p>`:''}</header>`;
 const person=p=>`<a class="oc-person-card" href="${route('lecturer',p.id)}"><img src="${p.avatar}" alt="${e(p.name)}"><div><h2>${e(p.name)}</h2><span>${e(p.role)}</span><p>${e(p.slogan||p.bio)}</p></div>${icon('Arrow_Forward-2')}</a>`;
 const activity=a=>`<a class="oc-activity-card" href="${route('activity',a.id)}"><img src="${a.cover}" alt="${e(a.title)}"><div><span class="oc-status">${e(a.statusLabel)}</span><h2>${e(a.title)}</h2><p>${e(a.summary)}</p><small>${date(a.startTime)} · ${e(a.location)}</small></div>${icon('Arrow_Forward-2')}</a>`;
 let body='';
 if(page==='lecturers')body=clubPeoplePage.render(route,data?.profiles);
 if(page==='activities')body=renderSignedActivities(publication);
 if(page==='lecturer'){
  const p=profiles.find(p=>p.id===id);if(!p)return '<p>未找到这位领读人。</p>';
  const associated=activities.filter(a=>[...(a.leaders||[]),...(a.guests||[])].some(x=>x.id===p.id));
  const entries=(finance?[]:window.octoberGuidedPlans||[]).filter(x=>x.personId===p.id&&window.isSignedReading?.(x));
  const notes=(p.readingNotes||[]).filter(x=>!x.text.includes('\t'));
  body=`<section class="oc-profile-first"><div class="oc-profile-primary"><div class="oc-profile-identity"><div class="oc-profile-title"><span class="oc-profile-greeting">你好！</span><h1>我是${e(p.name)}<span>领读人</span></h1></div><p>${e(p.role)}</p><div class="oc-profile-actions"><a class="oc-button oc-dark" href="${finance?p.article:'https://readclub.qikan.cn/shiyue#/lecturers/'+encodeURIComponent(p.id)}" ${finance?'':'target="_blank" rel="noopener"'}><img class="oc-profile-action-icon" src="assets/figma-profile/add.svg" alt="" width="24" height="24">${finance?'阅读本期文章':'关注领读人'}</a><button class="oc-profile-share" type="button" data-oc-profile-share aria-label="分享领读人" title="分享领读人"><img class="oc-profile-action-icon" src="assets/figma-profile/share.svg" alt="" width="24" height="24"></button></div><div class="oc-profile-stats"><span>${finance?p.readings:entries.length}领读</span><span>${p.followers??0}关注</span><span>${notes.length}观点</span></div></div><figure class="oc-profile-portrait"><img src="${p.avatar}" alt="${e(p.name)}"></figure></div><div class="oc-profile-introduction"><section><span class="oc-eyebrow">READING MESSAGE · 领读寄语</span><h2>${e(p.slogan||'一起，把阅读读深。')}</h2></section><section><span class="oc-eyebrow">ABOUT · 领读人介绍</span><p>${e(p.bio)}</p></section><section><span class="oc-eyebrow">专属栏目</span><h2>${e(p.columnTitle||'领读空间')}</h2></section></div></section><section class="oc-section oc-profile-opinions"><header class="oc-heading"><span>READING NOTES</span><h2>阅读观点</h2></header><div class="oc-opinion-carousel" data-oc-opinions data-current="0" aria-roledescription="轮播" aria-label="阅读观点"><div class="oc-opinion-slides" aria-live="off">${notes.map((x,i)=>`<article class="oc-opinion-slide ${i===0?'is-active':''}" aria-hidden="${i!==0}" aria-roledescription="幻灯片" aria-label="${i+1} / ${notes.length}"><p>${e(x.text)}</p><small>${e(x.source)}</small></article>`).join('')}</div>${notes.length>1?`<div class="oc-opinion-controls"><div class="oc-opinion-dots" aria-label="选择阅读观点">${notes.map((x,i)=>`<button type="button" data-oc-opinion-index="${i}" aria-label="第 ${i+1} 条观点" aria-pressed="${i===0}"><span></span></button>`).join('')}</div><button type="button" class="oc-opinion-pause" data-oc-opinion-pause aria-label="暂停自动轮播" title="暂停自动轮播"><i class="iconfont icon-Pause" aria-hidden="true"></i></button></div>`:''}</div></section><section class="oc-section oc-reading-section"><header class="oc-heading"><span>READING LIST</span><h2>领读内容</h2></header>${finance?button(e(p.articleTitle),p.article):renderOctoberReadingCards(p.id)}</section><section class="oc-section"><header class="oc-heading"><span>ACTIVITIES</span><h2>相关活动</h2></header><div class="oc-activity-list oc-related-activities">${associated.map(activity).join('')||'<p>暂无关联活动。</p>'}</div></section><section class="oc-section"><header class="oc-heading"><span>MORE PEOPLE</span><h2>认识更多领读人</h2></header><div class="oc-more-guides">${profiles.filter(x=>x!==p).map(x=>`<a class="oc-guide oc-more-guide" href="${route('lecturer',x.id)}"><img src="${x.avatar}" alt="${e(x.name)}"><span><strong>${e(x.name)}<b>领读人</b></strong><small>${e(x.role)}</small></span></a>`).join('')}</div></section>`;
 }
 if(page==='reading')body=renderOctoberGuidedDetail(id);
 if(page==='activity'){
  const a=activities.find(a=>a.id===id);if(!a)return '<p>未找到这场活动。</p>';
  if(finance){body=heading('ACTIVITY · 共读活动',a.title)+`<section class="oc-event-hero"><img src="${a.cover}" alt="第一财经本期封面"><aside><span class="oc-status">演示活动</span><p>${e(a.summary)}</p><p>活动时间与报名方式待公布。</p></aside></section>`;}else body=heading('ACTIVITY · 共读活动',a.title)+`<section class="oc-event-hero"><img src="${a.cover}" alt="${e(a.title)}"><aside><span class="oc-status">${e(a.statusLabel)}</span><dl><dt>活动时间</dt><dd>${date(a.startTime)}</dd><dt>活动地点</dt><dd>${e(a.location)}</dd><dt>报名截止</dt><dd>${date(a.registrationDeadline)}</dd><dt>活动名额</dt><dd>${a.capacity}人 · 已报名${a.registered}人</dd><dt>参与方式</dt><dd>${a.memberOnly?'会员活动':'公开活动'}</dd></dl><a class="oc-button oc-dark" href="https://readclub.qikan.cn/shiyue#/activities/${encodeURIComponent(a.id)}" target="_blank" rel="noopener">${a.registrationOpen?'查看报名信息':'查看活动状态'}${icon('Arrow_Forward-2')}</a></aside></section><section class="oc-section"><header class="oc-heading"><span>ABOUT THE EVENT</span><h2>关于活动</h2></header><p class="oc-event-summary">${e(a.summary)}</p>${(a.sections||[]).map(s=>`<article class="oc-event-section"><h3>${e(s.heading||'活动安排与参与须知')}</h3><p>${e(s.body)}</p></article>`).join('')}</section><section class="oc-section"><header class="oc-heading"><span>WITH THE LECTURERS</span><h2>领读人与嘉宾</h2></header><div class="oc-people-grid">${[...(a.leaders||[]),...(a.guests||[])].map(x=>profiles.find(p=>p.id===x.id)).filter(Boolean).map(person).join('')}</div></section>`;
 }
 return `<div class="rd-periodical pe-figma-detail oc-publication ${finance?'finance-community':''} ${page==='lecturer'?'oc-lecturer-profile':page==='reading'?'oc-guided-page':page==='lecturers'?'signed-people-home':''}"><main class="oc-main">${body}${page==='reading'?'':'<footer class="oc-source"></footer>'}</main>${renderOctoberDock(page,id,publication)}${renderResourceChat()}</div>`;
};
document.addEventListener('click',event=>{const b=event.target.closest('[data-oc-activity-filter]');if(!b)return;const root=b.closest('.oc-publication');root.querySelectorAll('[data-oc-activity-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));let count=0;root.querySelectorAll('[data-oc-activity-status]').forEach(x=>{x.hidden=b.dataset.ocActivityFilter!=='ALL'&&x.dataset.ocActivityStatus!==b.dataset.ocActivityFilter;if(!x.hidden)count++});root.querySelector('.oc-activities-empty').hidden=count>0;});

document.addEventListener('click',async event=>{const button=event.target.closest('[data-oc-profile-share]');if(!button)return;const title=button.closest('.oc-profile-first').querySelector('h1').firstChild.textContent.replace(/^我是/,'')+' · 领读人';try{if(navigator.share){await navigator.share({title,url:location.href})}else{await navigator.clipboard.writeText(location.href);button.title='链接已复制';button.setAttribute('aria-label','链接已复制');setTimeout(()=>{button.title='分享领读人';button.setAttribute('aria-label','分享领读人')},2000)}}catch(error){if(error.name!=='AbortError'){window.prompt('复制领读人链接',location.href)}}});
