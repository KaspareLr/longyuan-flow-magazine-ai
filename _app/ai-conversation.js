/* One persisted conversation model for the full workspace and reading guide. */
(()=>{
 const key='longyuan-ai-conversations-v1',esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const icon=n=>`<i class="iconfont icon-${n}" aria-hidden="true"></i>`;
 let state;try{state=JSON.parse(localStorage.getItem(key))}catch{};if(!state?.items)state={items:[],active:null};
 let timer=null,busy=false,editing=null, quote=null;
 const current=()=>state.items.find(x=>x.id===state.active);
 const guideReturnKey='longyuan-ai-guide-return';
 function guideReturn(){return location.hash.startsWith('#/search')&&new URLSearchParams(location.hash.split('?')[1]||'').get('from')==='guide'?sessionStorage.getItem(guideReturnKey):null;}
 function save(){localStorage.setItem(key,JSON.stringify(state));}
 function fresh(context=null){stop();const c={id:(crypto.randomUUID?.() ?? Array.from(crypto.getRandomValues(new Uint32Array(4)), value=>value.toString(16).padStart(8,'0')).join('')),title:'新对话',messages:[],draft:'',context,updated:Date.now()};state.items.unshift(c);state.active=c.id;save();return c;}
 function context(){return {title:document.querySelector('#portal-main h1,.pe-identity h1,.oc-header h1,.books-home-copy h1')?.textContent.trim()||document.querySelector('.view.active h1')?.textContent.trim()||'当前阅读',url:location.href};}
 const tools=(m,i)=>m.role==='user'?`<button data-ai-edit="${i}" title="编辑提问" aria-label="编辑提问">${icon('EditPen')}</button>`:`<button data-ai-copy="${i}" title="复制回答" aria-label="复制回答">${icon('Copy')}</button><button data-ai-retry="${i}" title="重新生成" aria-label="重新生成">${icon('Refresh2')}</button>`;
 function messageHTML(c){
  const history=c.messages.map((m,i)=>`<article class="ai-message ai-${m.role}"><div class="ai-message-body">${esc(m.text).replace(/\n/g,'<br>')}${busy&&i===c.messages.length-1?'<span class="ai-cursor"></span>':''}</div><div class="ai-message-actions">${tools(m,i)}</div></article>`).join('');
  if(quote?.conversation!==c.id)return history;
  const {available}=qikanDSU.summary();
  const sufficient=available>=qikanDSU.aiPrice;
  return history+`${quote.retry===null?`<article class="ai-message ai-user"><div class="ai-message-body">${esc(quote.question)}</div></article>`:''}
   <div class="ai-cost-prompt">
    <div class="ai-cost-copy">
     <span class="ai-cost-title">本次问答将消耗 ${qikanDSU.aiPrice} DSU</span>
     <span class="ai-cost-balance">${sufficient?`当前可用 ${available} DSU`:'当前可用额度不足，请充值'}</span>
     ${quote.error?`<span role="alert">${esc(quote.error)}</span>`:''}
    </div>
    <div class="ai-cost-actions">
     <button type="button" data-ai-cost-cancel ${quote.charging?'disabled':''}>取消</button>
     ${sufficient?`<button type="button" data-ai-cost-confirm ${quote.charging?'disabled':''}>确认</button>`:`<a href="${esc(qikanDSU.membershipURL)}">购买</a>`}
    </div>
   </div>`;
 }
 const welcomeChoices=[['帮我挑一篇','说说此刻的心情或兴趣，我按你的状态选'],['给自己十分钟','选一篇轻松、可读全文的短文'],['问一个主题','先告诉我想聊什么，答案带原文出处']];
 const welcomeHTML=(full=false)=>`<div class="pe-guide-welcome guide-unified-welcome ${full?'ai-welcome':''}"><${full?'h1':'h3'}>此刻，想读点什么？</${full?'h1':'h3'}><p>说说你的想法，或从这里开始。</p><div class="ai-guide-choices">${welcomeChoices.map(([title,desc])=>`<button type="button" class="pe-guide-prompt" ${full?'data-ai-prompt':'data-pe-prompt'}="${title}"><span><strong>${title}</strong><small>${desc}</small></span>${icon('Arrow_Forward-2')}</button>`).join('')}</div></div>`;
 const view=document.querySelector('#view-search');
 if(view&&!state.historyPreviewInitialized){const examples=[['如何保持深度阅读？','可以先从十分钟不被打断的阅读开始。选择一篇感兴趣的文章，带着一个问题读完，再用自己的话概括主要观点。'],['城市更新如何影响日常生活？','不妨从熟悉的街道观察：步行是否更方便，是否有可以停留的空间，原有的小店与邻里关系是否被保留下来。这些细节让城市更新与日常生活联系起来。']];for(const [q,a] of examples){if(state.items.filter(x=>x.messages.length).length>=2)break;if(state.items.some(x=>x.title===q))continue;state.items.push({id:(crypto.randomUUID?.() ?? Array.from(crypto.getRandomValues(new Uint32Array(4)), value=>value.toString(16).padStart(8,'0')).join('')),title:q,messages:[{role:'user',text:q},{role:'assistant',text:a}],draft:'',context:null,updated:Date.now()});}state.historyPreviewInitialized=true;state.active=null;save();}

 if(view)view.innerHTML=`<div class="ai-workspace"><aside class="ai-history"><header><strong>龙源 AI</strong><button data-ai-sidebar aria-label="收起历史记录" title="收起历史记录">${icon('Slider')}</button></header><button class="ai-new" data-ai-new>新对话</button><span class="ai-history-label">对话记录</span><div class="ai-history-list"></div><footer>让每个问题，通向更深的阅读。</footer></aside><main class="ai-main"><header class="ai-main-header"><button data-ai-sidebar aria-label="展开历史记录" title="展开历史记录">${icon('Slider')}</button><button data-ai-restore hidden title="恢复阅读向导" aria-label="恢复阅读向导">${icon('ZoomIN-2')}</button></header><div class="ai-scroll"><div class="ai-thread" role="log" aria-label="对话记录"></div></div><div class="ai-composer-area"><a class="ai-context" hidden></a><form class="ai-composer guide-unified-composer"><textarea rows="1" aria-label="发送消息" placeholder="说说你想读什么，或问一个问题…" maxlength="4000"></textarea><div class="ai-composer-tools"><label class="guide-unified-attach" tabindex="0" role="button" title="添加内容" aria-label="添加内容">${icon('Link')}<input type="file" hidden></label><button type="submit" class="ai-send" aria-label="发送消息">${icon('Arrow_Top')}</button></div></form><p class="ai-composer-hint">结合原文阅读，让理解更进一步。</p></div></main></div>`;
 function render(){
  const c=current();if(view){const list=view.querySelector('.ai-history-list');list.innerHTML=state.items.filter(x=>x.messages.length).map(x=>`<div class="ai-history-item ${x.id===state.active?'selected':''}"><button data-ai-select="${x.id}" title="${esc(x.title)}">${esc(x.title)}</button><button data-ai-delete="${x.id}" title="删除对话" aria-label="删除对话">${icon('Delete2')}</button></div>`).join('')||'<p class="ai-history-empty">暂无对话记录</p>';
   const thread=view.querySelector('.ai-thread');thread.innerHTML=c&&(c.messages.length||quote?.conversation===c.id)?messageHTML(c):welcomeHTML(true);
   const input=view.querySelector('textarea');if(document.activeElement!==input)input.value=c?.draft||'';
   const ctx=view.querySelector('.ai-context');ctx.hidden=!c?.context;if(c?.context){ctx.textContent='正在讨论 · '+c.context.title;ctx.href=c.context.url;}
   view.querySelector('[data-ai-restore]').hidden=!guideReturn();
   const send=view.querySelector('.ai-send');send.innerHTML=icon(busy?'Stop':'Arrow_Forward-2');send.setAttribute('aria-label',busy?'停止生成':'发送消息');
  }
  document.querySelectorAll('.pe-chat:not([data-issue-guide])').forEach(chat=>{const box=chat.querySelector('.pe-chat-messages');if(c&&(c.messages.length||quote?.conversation===c.id)){box.innerHTML=messageHTML(c);box.dataset.aiSynced='true';}else if(box.dataset.aiSynced){box.innerHTML=welcomeHTML();delete box.dataset.aiSynced;}const submit=chat.querySelector('[type=submit]');if(submit){submit.innerHTML=icon(busy?'Stop':'Arrow_Forward-2');submit.setAttribute('aria-label',busy?'停止生成':'发送提问');}const input=chat.querySelector('textarea');if(input&&document.activeElement!==input)input.value=c?.draft||'';});
 }
 function answer(q,c){const t=c.context?.title;return `${t?'围绕《'+t+'》，':'关于“'+q+'”，'}我们可以先抓住问题的核心，再回到具体内容中寻找线索。\n\n先建立整体认识\n明确你最想了解的是背景、观点还是实际应用。带着一个具体问题阅读，比一次性接收所有信息更容易形成理解。\n\n再比较不同视角\n留意作者讨论的对象、使用的案例和结论成立的条件。把相近的观点放在一起，看看它们如何补充彼此。\n\n最后形成自己的判断\n用自己的话概括主要观点，并记录仍然好奇的地方。${t?'你也可以回到当前阅读内容，选一段我们继续讨论。':'你更想从哪个角度继续聊？'}`;}
 let generation=0;
 function stop(){generation++;clearTimeout(timer);timer=null;busy=false;const c=current();if(c?.pending){const response=c.messages.at(-1);if(response?.role==='assistant'&&response.cost&&!response.status)response.status='stopped';delete c.pending;}save();}
 function pump(c,m,full){
  busy=true;c.pending=full;let pos=m.text.length;
  
  const token=++generation;
  function tick(){
   if(token!==generation)return;
   pos=Math.min(full.length,pos+5);m.text=full.slice(0,pos);
   if(pos===full.length){m.status='complete';stop();}
   else timer=setTimeout(tick,25);
   save();render();
   const sc=view?.querySelector('.ai-scroll');
   if(sc&&sc.scrollHeight-sc.scrollTop-sc.clientHeight<220)sc.scrollTop=sc.scrollHeight;
   document.querySelectorAll('.pe-chat-messages').forEach(x=>x.scrollTop=x.scrollHeight);
  }
  render();timer=setTimeout(tick,25);
 }
 function generate(c,q){stop();const m={role:'assistant',text:'',cost:qikanDSU.aiPrice};c.messages.push(m);pump(c,m,answer(q,c));}
 function showQuote(question,fromGuide=false,retry=null){
  question=question.trim();
  if(!question||busy||quote?.charging||!qikanDSU.signedIn())return;
  const c=current()||fresh();
  quote={conversation:c.id,question,retry,editing,context:fromGuide?context():null};
  render();
  requestAnimationFrame(()=>document.querySelectorAll('.ai-cost-prompt').forEach(node=>{
   if(!node.getClientRects().length)return;
   const scroller=node.closest('.pe-chat-messages,.ai-scroll');
   if(scroller)scroller.scrollTop=scroller.scrollHeight;
  }));
 }
 async function confirmQuote(){
  const c=current(),request=quote;
  if(!c||request?.conversation!==c.id||request.charging||busy)return;
  request.charging=true;
  render();
  try{
   await qikanDSU.chargeAI(request.question);
  }catch(error){
   request.charging=false;
   request.error=qikanDSU.summary().available>=qikanDSU.aiPrice?error.message:'';
   render();
   return;
  }
  quote=null;
  if(request.context)c.context=request.context;
  if(request.retry!==null)c.messages.splice(request.retry);
  else{
   if(request.editing!==null)c.messages.splice(request.editing);
   c.messages.push({role:'user',text:request.question});
   if(c.messages.length===1)c.title=request.question.slice(0,28);
   editing=null;
   c.draft='';
  }
  c.updated=Date.now();
  document.querySelectorAll('.ai-composer textarea,.pe-chat:not([data-issue-guide]) textarea').forEach(input=>{input.value=c.draft;});
  generate(c,request.question);
 }
 document.addEventListener('submit',event=>{const form=event.target.closest('.ai-composer,.pe-chat-form');if(!form||form.closest('[data-issue-guide]'))return;event.preventDefault();event.stopImmediatePropagation();if(busy){stop();render();return;}const input=form.querySelector('textarea');showQuote(input.value,form.matches('.pe-chat-form'));},true);
 document.addEventListener('input',event=>{if(!event.target.closest('[data-issue-guide]')&&event.target.matches('.ai-composer textarea,.pe-chat-form textarea')){const c=current()||fresh(event.target.closest('.pe-chat-form')?context():null);c.draft=event.target.value;save();event.target.style.height='auto';event.target.style.height=Math.min(event.target.scrollHeight,200)+'px';}});
 document.addEventListener('keydown',event=>{if(!event.target.closest('[data-issue-guide]')&&event.target.matches('.ai-composer textarea,.pe-chat-form textarea')&&event.key==='Enter'&&!event.shiftKey&&!event.isComposing){event.preventDefault();if(!busy){showQuote(event.target.value,!!event.target.closest('.pe-chat-form'));}}});
 document.addEventListener('click',async event=>{
  const b=event.target.closest('button');if(!b)return;
  if(b.hasAttribute('data-ai-cost-cancel')){quote=null;render();return;}
  if(b.hasAttribute('data-ai-cost-confirm')){await confirmQuote();return;}
  if(quote?.charging&&b.matches('[data-ai-new],[data-ai-select],[data-ai-delete],[data-ai-edit]'))return;
  if(b.matches('[data-ai-new],[data-ai-select],[data-ai-delete],[data-ai-edit]'))quote=null;
  if(b.hasAttribute('data-ai-new')){fresh();editing=null;render();view?.querySelector('textarea').focus();}
  if(b.dataset.aiSelect){stop();state.active=b.dataset.aiSelect;editing=null;save();render();}
  if(b.dataset.aiDelete){stop();state.items=state.items.filter(x=>x.id!==b.dataset.aiDelete);if(state.active===b.dataset.aiDelete)state.active=state.items[0]?.id||null;save();render();}
  if(b.hasAttribute('data-ai-sidebar'))view?.querySelector('.ai-workspace').classList.toggle('ai-sidebar-collapsed');
  if(b.hasAttribute('data-ai-restore')){const returnUrl=guideReturn();if(returnUrl){sessionStorage.setItem('club-demo-reading-guide-collapsed','false');sessionStorage.setItem('longyuan-reading-guide-collapsed','false');sessionStorage.removeItem(guideReturnKey);location.href=returnUrl;}}
  if(b.dataset.aiPrompt)showQuote(b.dataset.aiPrompt);
  if(b.hasAttribute('data-ai-copy')){await navigator.clipboard.writeText(current().messages[Number(b.dataset.aiCopy)].text);b.innerHTML='已复制';}
  if(b.hasAttribute('data-ai-edit')){stop();editing=Number(b.dataset.aiEdit);const input=view?.classList.contains('active')?view.querySelector('textarea'):b.closest('.pe-chat').querySelector('textarea');input.value=current().messages[editing].text;input.focus();}
  if(b.hasAttribute('data-ai-retry')){const c=current(),i=Number(b.dataset.aiRetry),question=c.messages[i-1]?.text;if(question)showQuote(question,false,i);}
  const prompt=event.target.closest('[data-pe-prompt]');if(prompt){event.stopImmediatePropagation();showQuote(prompt.dataset.pePrompt,true);}
 },true);
 if(view&&matchMedia('(max-width:800px)').matches)view.querySelector('.ai-workspace').classList.add('ai-sidebar-collapsed');
 const mounted=new WeakSet();
 function mount(){
  document.querySelectorAll('.pe-chat').forEach(chat=>{
   if(mounted.has(chat))return;
   mounted.add(chat);
   chat.querySelector('.pe-guide-welcome')?.classList.add('guide-unified-welcome');
   chat.querySelector('.pe-chat-form')?.classList.add('guide-unified-composer');
   const heading=chat.querySelector('.pe-guide-heading'),collapse=heading.querySelector('.pe-chat-toggle');
   if(collapse?.querySelector('i'))collapse.querySelector('i').className='iconfont icon-a-4';
   render();
  });
 }
 new MutationObserver(mount).observe(document.body,{subtree:true,childList:true});mount();
 function open(q){const id=new URLSearchParams(location.hash.split('?')[1]||'').get('conversation');if(id&&state.items.some(x=>x.id===id))state.active=id;render();if(q&&current()?.messages.at(-2)?.text!==q)showQuote(q);}
 const mobile=matchMedia('(max-width:800px)');mobile.addEventListener('change',event=>{if(event.matches)view?.querySelector('.ai-workspace').classList.add('ai-sidebar-collapsed');});
 window.longyuanConversation={open,refresh:render};window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#/search'))open(new URLSearchParams(location.hash.split('?')[1]||'').get('q'));});
 window.addEventListener('storage',event=>{if(event.key===key){try{state=JSON.parse(event.newValue);render();}catch{}}});open(new URLSearchParams(location.hash.split('?')[1]||'').get('q'));const pending=current();if(pending?.pending&&pending.messages.at(-1)?.role==='assistant')pump(pending,pending.messages.at(-1),pending.pending);
})();
