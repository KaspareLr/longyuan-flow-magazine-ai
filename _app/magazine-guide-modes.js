/* This independent branch keeps the existing reading-guide UI and adds two demo modes. */
(()=>{
 const mounted=new WeakMap();
 const e=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const icon=n=>`<i class="iconfont club-local-icon icon-${n}" aria-hidden="true"></i>`;
 function articles(){
  const full=new Map((window.clubEditorialArticleData||[]).map(article=>[article.id,article]));
  return (window.periodicalReference?.groups||[]).flatMap(group=>group.articles.map(article=>{
   const id=article.url.match(/dycy\d+/)?.[0],body=full.get(id);
   const length=body?.blocks.reduce((total,block)=>total+(block.text?.length||0),0)||0;
   return {...article,id,group:group.title,full:!!body,minutes:body?Math.max(1,Math.ceil(length/350)):0};
  })).map((article,index)=>({...article,index}));
 }
 const presets=[
  {question:'想看睡眠经济，先读哪几篇？',matches:[[19,100],[1,94],[32,49]]},
  {question:'本期有哪些值得读的 AI 和科技文章？',matches:[[15,100],[25,89],[10,73],[4,57]]},
  {question:'电影市场变化和新导演，有哪些报道？',matches:[[12,100],[23,85],[33,63]]},
  {question:'想了解品牌经营和成本变化，读什么？',matches:[[16,100],[13,94],[14,70],[18,52]]}
 ];
 const segmenter=new Intl.Segmenter('zh',{granularity:'word'});
 const questionTopic=/^(本期|哪些|什么|想看|想读|想了解|有|的|和|文章|报道|先读|值得|我|几篇|读)$/;
 function rank(rows,query,preset){
  if(preset)return preset.matches.flatMap(([number,score])=>{
   const article=rows.find(a=>a.id==='dycy202609'+String(number).padStart(2,'0'));
   return article?[{article,score}]:[];
  });
  const terms=[...new Set([...segmenter.segment(query.toLowerCase())]
   .filter(word=>word.isWordLike&&!questionTopic.test(word.segment)).map(word=>word.segment))];
  const scored=rows.map(article=>{
   const title=article.title.toLowerCase(),excerpt=(article.excerpt||'').toLowerCase();
   return {article,score:terms.reduce((score,term)=>score+(title.includes(term)?3:excerpt.includes(term)?1:0),0)};
  }).filter(entry=>entry.score>0).sort((a,b)=>b.score-a.score);
  const best=scored[0]?.score;
  return scored.map(entry=>({...entry,score:Math.round(entry.score*100/best)}));
 }
 function showResults(reply,matches,minimum){
  const filtered=matches.filter(entry=>entry.score>=minimum);
  reply.querySelector('.issue-salience-value').value=minimum+'%';
  reply.querySelector('.issue-results-count').textContent='符合门槛 '+filtered.length+' / '+matches.length+' 篇';
  reply.querySelector('.issue-filter-results').innerHTML=filtered.length?filtered.map(({article,score})=>
   `<a class="issue-result" href="${link(article)}"><span><strong>${e(article.title)}</strong><small>${e(article.group)} · ${article.full?'全文 · 约 '+article.minutes+' 分钟':'摘要预览'}</small></span><span class="issue-salience-score" aria-label="相对显著度 ${score}%">${score}%</span>${icon('Arrow_Forward-2')}</a>`
  ).join(''):`<p class="issue-empty">${matches.length?'没有文章达到这个门槛，试试调低最低显著度。':'本期没有找到明显相关的文章，试试更具体的关键词。'}</p>`;
 }
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
  const state={mode:'jev',minimum:60,rows,original:[...original.childNodes],placeholder:chat.querySelector('textarea').placeholder,controller:new AbortController()};mounted.set(chat,state);chat.dataset.issueGuide='true';
  const tabs=document.createElement('div');tabs.className='issue-guide-tabs';tabs.setAttribute('role','group');tabs.setAttribute('aria-label','阅读向导功能');tabs.innerHTML='<button type="button" data-issue-mode="jev" aria-pressed="true" aria-label="JEV 快速筛选">JEV</button><button type="button" data-issue-mode="llm" aria-pressed="false" aria-label="LLM 主题归纳">LLM</button>';const heading=document.createElement('header');heading.className='issue-guide-heading';heading.innerHTML='<img class="issue-guide-avatar" src="assets/issue-guide-figma-avatar.png" width="44" height="44" alt=""><div class="issue-guide-identity"><h2>阅读向导</h2><p>找好文章，也帮你读得更舒服</p></div>';heading.append(tabs);chat.prepend(heading);
  const input=chat.querySelector('textarea');
  const setComposer=()=>{input.placeholder=state.mode==='llm'?'输入你想了解的本期主题':'问问本期值得读什么';input.setAttribute('aria-label',input.placeholder);};
  setComposer();
  const messages=chat.querySelector('.pe-chat-messages');messages.innerHTML=`<section data-issue-panel="jev"><div class="pe-guide-welcome"><h3>这一期，先读什么？</h3><p>选一个问题，看本期哪些文章最相关。</p></div><div class="issue-preset-questions" role="group" aria-label="本期预设问题">${presets.map((preset,index)=>`<button type="button" data-issue-question="${index}"><span>${e(preset.question)}</span>${icon('Arrow_Forward-2')}</button>`).join('')}</div><div class="issue-guide-conversation" data-issue-log="jev" aria-live="polite"></div></section><section data-issue-panel="llm" hidden><div class="issue-engine">LLM · 主题阅读线索</div><div class="pe-guide-welcome"><h3>把这一期，连起来读</h3><p>从已收录内容中找到值得追问的主题。</p></div>${themes.map((t,n)=>`<article class="issue-theme"><span>TOPIC ${String(n+1).padStart(2,'0')}</span><h4>${e(t.title)}</h4><p>${e(t.text)}</p><div class="issue-theme-sources">${t.ids.map(id=>rows.find(a=>a.id===id)).filter(Boolean).map(a=>`<a href="${link(a)}">${icon('Book')}<span>${e(a.title)}</span></a>`).join('')}</div></article>`).join('')}<p class="issue-guide-note">主题为本地预设阅读建议，未调用实时LLM。</p><div class="issue-guide-conversation" data-issue-log="llm" aria-live="polite"></div></section>`;
  chat.addEventListener('click',event=>{const b=event.target.closest('button');if(!b)return;
   if(b.dataset.issueMode){state.mode=b.dataset.issueMode;setComposer();tabs.querySelectorAll('button').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));chat.querySelectorAll('[data-issue-panel]').forEach(n=>n.hidden=n.dataset.issuePanel!==state.mode);}
   if(b.hasAttribute('data-issue-question')){
    const preset=presets[Number(b.dataset.issueQuestion)];
    addReply(chat,state,'jev',preset.question,preset);
   }
  },{signal:state.controller.signal});
 }
 function addReply(chat,state,mode,q,preset){
  const log=chat.querySelector(`[data-issue-log="${mode}"]`);
  const user=document.createElement('p');user.className='pe-user-message';user.textContent=q;
  const reply=document.createElement('div');reply.className='issue-guide-reply';
  if(mode==='llm'){
   const t=/电影|市场|导演|创作/.test(q)?themes[1]:/数字|科技|人物|事件/.test(q)?themes[2]:themes[0];
   reply.innerHTML=`<strong>${e(t.title)}</strong><p>${e(t.text)}</p><small>演示建议，未调用实时模型。</small>`;
  }else{
   const matches=rank(state.rows,q,preset);
   reply.classList.add('issue-jev-reply');
   reply.innerHTML=`<strong>本期推荐</strong>
    <label class="issue-salience-control"><span>最低显著度 <output class="issue-salience-value"></output></span>
    <input type="range" min="0" max="100" step="1" value="${state.minimum}" aria-label="最低相对显著度"></label>
    <p class="issue-guide-note">演示评分 · 本轮最相关的文章为 100%</p>
    <div class="issue-results-count" role="status"></div><div class="issue-filter-results"></div>`;
   const slider=reply.querySelector('input');
   const update=()=>{
    const minimum=Number(slider.value);
    slider.setAttribute('aria-valuetext',minimum+'%');
    showResults(reply,matches,minimum);
   };
   slider.addEventListener('input',()=>{update();state.minimum=Number(slider.value);});
   update();
  }
  log.append(user,reply);
  const messages=chat.querySelector('.pe-chat-messages');
  if(mode==='jev'){
   messages.scrollTop+=user.getBoundingClientRect().top-messages.getBoundingClientRect().top-12;
  }else messages.scrollTop=messages.scrollHeight;
 }
 // Capture only this experiment's form, before the original demo reply handler.
 window.addEventListener('submit',async event=>{const form=event.target.closest('.pe-chat-form'),chat=form?.closest('[data-issue-guide]');if(!chat)return;event.preventDefault();event.stopImmediatePropagation();const input=form.querySelector('textarea'),q=input.value.trim();if(!q)return;const state=mounted.get(chat),mode=state.mode;
  if(mode==='llm'&&!await qikanDSU.confirmAI(q))return;
  if(mounted.get(chat)!==state)return;
  addReply(chat,state,mode,q);input.value='';
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
