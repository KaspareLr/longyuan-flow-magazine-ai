/* This independent branch keeps the existing reading-guide UI and adds two demo modes. */
(()=>{
 const mounted=new WeakMap();
 const e=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const icon=n=>`<i class="iconfont club-local-icon icon-${n}" aria-hidden="true"></i>`;
 function articles(){const full=new Map((window.clubEditorialArticleData||[]).map(a=>[a.id,a]));return (window.periodicalReference?.groups||[]).flatMap(g=>g.articles.map(a=>{const id=a.url.match(/dycy\d+/)?.[0],body=full.get(id),length=body?.blocks.reduce((n,b)=>n+(b.text?.length||0),0)||0;const topic=/睡|眠|暑假|咖啡|生活|高寿/.test(a.title)?'生活方式':/数字|趋势|AI|科技|能源|电/.test(a.title)?'科技趋势':/人物|电影|导演|天才|刘同/.test(a.title)?'文化人物':'商业观察';return {...a,id,group:g.title,topic,full:!!body,minutes:body?Math.max(1,Math.ceil(length/350)):1};})).map((a,index)=>({...a,index}));}
 function link(a){return '#issue-preview-'+a.index;}
 const themes=[
  {title:'日常需求，如何成为商业机会？',text:'从《你睡得好吗？》讨论的睡眠困扰与睡眠经济出发，观察个人需求如何形成一个市场。可以沿着这条线索，继续阅读本期趋势报道。',ids:['dycy20260901','dycy20260903']},
  {title:'市场退潮时，谁能找到新路径？',text:'《市场退潮，新导演如何“上岸”》提供了电影市场的观察视角。沿着观众需求、创作与市场变化之间的关系，思考旧经验之外的机会。',ids:['dycy20260912']},
  {title:'把数字、人物与事件放在一起读',text:'以《数字世界》《人物》《大事件》为一组，分别从数据、个体和事件寻找变化。这里是建议的阅读路径，不把推测当作原文结论。',ids:['dycy20260904','dycy20260905','dycy20260902']}
 ];
 function mount(chat){
  if(mounted.has(chat)||!chat.querySelector('.pe-chat-messages'))return;
  const rows=articles();if(!rows.length)return;
  const original=chat.querySelector('.pe-chat-messages');
  const state={mode:'jev',interest:'全部',time:0,rows,original:[...original.childNodes],placeholder:chat.querySelector('textarea').placeholder,controller:new AbortController()};mounted.set(chat,state);chat.dataset.issueGuide='true';
  const tabs=document.createElement('div');tabs.className='issue-guide-tabs';tabs.setAttribute('role','group');tabs.setAttribute('aria-label','阅读向导功能');tabs.innerHTML='<button type="button" data-issue-mode="jev" aria-pressed="true" aria-label="JEV 快速筛选">JEV</button><button type="button" data-issue-mode="llm" aria-pressed="false" aria-label="LLM 主题归纳">LLM</button>';const heading=document.createElement('header');heading.className='issue-guide-heading';heading.innerHTML='<img class="issue-guide-avatar" src="assets/issue-guide-figma-avatar.png" width="44" height="44" alt=""><div class="issue-guide-identity"><h2>阅读向导</h2><p>找好文章，也帮你读得更舒服</p></div>';heading.append(tabs);chat.prepend(heading);
  const input=chat.querySelector('textarea');
  const setComposer=()=>{input.placeholder=state.mode==='llm'?'输入你想了解的本期主题':'输入本期文章关键词';input.setAttribute('aria-label',input.placeholder);};
  setComposer();
  const messages=chat.querySelector('.pe-chat-messages');messages.innerHTML=`<section data-issue-panel="jev"><div class="issue-engine">JEV · 阅读偏好匹配</div><div class="pe-guide-welcome"><h3>先读与你有关的</h3><p>按兴趣、时间和主题，挑几篇开始。</p></div><fieldset><legend>阅读兴趣</legend><div class="issue-guide-chips">${['全部','商业观察','生活方式','科技趋势','文化人物'].map(v=>`<button type="button" data-issue-interest="${v}" aria-pressed="${v==='全部'}">${v}</button>`).join('')}</div></fieldset><fieldset><legend>阅读时间</legend><div class="issue-guide-chips">${[[0,'不限'],[3,'3分钟'],[8,'8分钟'],[15,'15分钟']].map(([v,t])=>`<button type="button" data-issue-time="${v}" aria-pressed="${v===0}">${t}</button>`).join('')}</div></fieldset><div class="issue-filter-results" aria-live="polite"></div></section><section data-issue-panel="llm" hidden><div class="issue-engine">LLM · 主题阅读线索</div><div class="pe-guide-welcome"><h3>把这一期，连起来读</h3><p>从已收录内容中找到值得追问的主题。</p></div>${themes.map((t,n)=>`<article class="issue-theme"><span>TOPIC ${String(n+1).padStart(2,'0')}</span><h4>${e(t.title)}</h4><p>${e(t.text)}</p><div class="issue-theme-sources">${t.ids.map(id=>rows.find(a=>a.id===id)).filter(Boolean).map(a=>`<a href="${link(a)}">${icon('Book')}<span>${e(a.title)}</span></a>`).join('')}</div></article>`).join('')}<p class="issue-guide-note">主题为本地预设阅读建议，未调用实时LLM。</p></section><div class="issue-guide-conversation" aria-live="polite"></div>`;
  function renderMatches(){const list=rows.filter(a=>(state.interest==='全部'||a.topic===state.interest)&&(!state.time||a.minutes<=state.time));chat.querySelector('.issue-filter-results').innerHTML=`<div class="issue-results-count">${list.length} 篇匹配 · 为你挑选</div>`+(list.length?list.slice(0,3).map(a=>`<a class="issue-result" href="${link(a)}"><span><strong>${e(a.title)}</strong><small>${a.topic} · ${a.full?'全文':'摘要预览'} · 约${a.minutes}分钟</small></span>${icon('Arrow_Forward-2')}</a>`).join(''):'<p class="issue-empty">没有同时符合这些条件的文章，试试放宽兴趣或时间。</p>');}
  chat.addEventListener('click',event=>{const b=event.target.closest('button');if(!b)return;
   if(b.dataset.issueMode){state.mode=b.dataset.issueMode;setComposer();tabs.querySelectorAll('button').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));chat.querySelectorAll('[data-issue-panel]').forEach(n=>n.hidden=n.dataset.issuePanel!==state.mode);}
   if(b.dataset.issueInterest){state.interest=b.dataset.issueInterest;chat.querySelectorAll('[data-issue-interest]').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));renderMatches();}
   if(b.hasAttribute('data-issue-time')){state.time=Number(b.dataset.issueTime);chat.querySelectorAll('[data-issue-time]').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));renderMatches();}
  },{signal:state.controller.signal});renderMatches();
 }
 // Capture only this experiment's form, before the original demo reply handler.
 window.addEventListener('submit',async event=>{const form=event.target.closest('.pe-chat-form'),chat=form?.closest('[data-issue-guide]');if(!chat)return;event.preventDefault();event.stopImmediatePropagation();const input=form.querySelector('textarea'),q=input.value.trim();if(!q)return;const state=mounted.get(chat),mode=state.mode;
  if(mode==='llm'&&!await qikanDSU.confirmAI(q))return;
  if(mounted.get(chat)!==state)return;
  const log=chat.querySelector('.issue-guide-conversation');const user=document.createElement('p');user.className='pe-user-message';user.textContent=q;log.append(user);const reply=document.createElement('div');reply.className='issue-guide-reply';
  if(mode==='llm'){const t=/电影|市场|导演|创作/.test(q)?themes[1]:/数字|科技|人物|事件/.test(q)?themes[2]:themes[0];reply.innerHTML=`<strong>${e(t.title)}</strong><p>${e(t.text)}</p><small>演示建议，未调用实时模型。</small>`;}
  else{const matches=state.rows.filter(a=>(a.title+a.excerpt).includes(q)||q.includes(a.topic)).slice(0,3);reply.innerHTML=matches.length?'可以从这几篇开始：'+matches.map(a=>`<a href="${link(a)}">${e(a.title)}</a>`).join(''):'可以用上方的兴趣、阅读时间与主题筛选，或输入更具体的词，例如“睡眠”“电影”“人物”。';}
  log.append(reply);input.value='';const messages=chat.querySelector('.pe-chat-messages');messages.scrollTop=messages.scrollHeight;
 },true);
 window.addEventListener('keydown',event=>{
  const input=event.target;
  if(!input.matches('[data-issue-guide] textarea')||event.key!=='Enter'||event.shiftKey||event.isComposing)return;
  event.preventDefault();
  input.form.requestSubmit();
 },true);
 function sync(){
  const chat=document.querySelector('.reader-guide-widget .pe-chat');
  if(!chat)return;
  if(document.body.classList.contains('issue-preview-page')){
   mount(chat);
   return;
  }
  const state=mounted.get(chat);
  if(!state)return;
  state.controller.abort();
  chat.querySelector('.issue-guide-heading').remove();
  chat.querySelector('.pe-chat-messages').replaceChildren(...state.original);
  const input=chat.querySelector('textarea');
  input.placeholder=state.placeholder;
  input.setAttribute('aria-label','向阅读向导提问');
  input.value='';
  delete chat.dataset.issueGuide;
  mounted.delete(chat);
  window.longyuanConversation?.refresh();
 }
 new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
 sync();
})();
