/* Local DSU demo. All balance changes are persisted together with their receipts. */
(() => {
  const root = new URL('.', document.currentScript.src);
  const accountURL = new URL('portal.html#/me?tab=dsu', root).href;
  const minimum = 100, monthlyPrice = 99, monthlyQuota = 300, articlePrice = 1, aiPrice = 3;
  // Demo prices and quotas can be changed together without changing payment flows.
  const plans = {
    month:{name:'月度会员',price:99,quota:300,months:1},
    'month-auto':{name:'连续包月',price:89,quota:300,months:1,auto:true},
    year:{name:'年度会员',price:999,quota:3600,months:12},
    'year-auto':{name:'连续包年',price:899,quota:3600,months:12,auto:true},
    pro:{name:'年度 Pro',price:3599,quota:5000,months:12},
    'pro-auto':{name:'年度 Pro · 连续包年',price:3299,quota:5000,months:12,auto:true}
  };
  const planFor = subscription => plans[subscription?.code] || plans['month-auto'];
  const membershipURL=new URL('portal.html#/membership',root).href;
  function addMonths(time,count){
    const end=new Date(time);
    const day=end.getUTCDate();
    end.setUTCDate(1);end.setUTCMonth(end.getUTCMonth()+count);
    const last=new Date(end);last.setUTCMonth(last.getUTCMonth()+1,0);
    end.setUTCDate(Math.min(day,last.getUTCDate()));
    return end.getTime();
  }
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const profile = () => window.clubSession?.profile;
  const identity = p => p?.dsuId || (p && (p.email?.trim().toLowerCase() || p.nickname.trim().toLowerCase()));
  const key = id => 'qikan-dsu:' + id;
  function resetPurchasesOnReload(){
    if(window.clubSession?.personalPreview)return;
    let navigation=performance;
    try{navigation=window.top.performance;}catch{}
    if(navigation.getEntriesByType('navigation')[0]?.type!=='reload')return;
    const resetKey='qikan-purchase-reset';
    const stamp=String(navigation.timeOrigin);
    const owner=identity(profile());
    if(!owner)return;
    try{
      if(sessionStorage.getItem(resetKey)===stamp)return;
      const ledger=JSON.parse(localStorage.getItem(key(owner))||'null');
      if(ledger){
        const {walletEnabled,walletLimit}=ledger;
        localStorage.setItem(key(owner),JSON.stringify({balance:0,subscription:null,records:[],walletEnabled,walletLimit}));
      }
      const contentKey='club-demo:reading-content:'+owner;
      const content=JSON.parse(localStorage.getItem(contentKey)||'null');
      if(Array.isArray(content)){
        localStorage.setItem(contentKey,JSON.stringify(content.filter(row=>row.kind!=='issue'&&row.kind!=='subscription')));
      }
      sessionStorage.setItem(resetKey,stamp);
    }catch{}
  }
  resetPurchasesOnReload();
  const month = time => new Intl.DateTimeFormat('sv-SE', {year:'numeric', month:'2-digit', timeZone:'Asia/Shanghai'}).format(time);
  function nextMonth(time, day) {
    const end = new Date(time);
    end.setUTCDate(1);
    end.setUTCMonth(end.getUTCMonth() + 1);
    const last = new Date(end);
    last.setUTCMonth(last.getUTCMonth() + 1, 0);
    end.setUTCDate(Math.min(day, last.getUTCDate()));
    return end.getTime();
  }
  function demoLedger(){
    const state={balance:0,subscription:null,records:[]};
    loadSample(state);
    populateUsageDemo(state);
    return state;
  }
  function load(id) {
    const session=window.clubSession;
    let state;
    if(session?.personalPreview){
      state=session.read('dsu-preview',null);
      if(!state){state=demoLedger();session.write('dsu-preview',state);}
    }else state=JSON.parse(localStorage.getItem(key(id)) || 'null') ?? {balance:0, subscription:null, records:[]};
    const plan = state.subscription;
    const now = Date.now();
    if (plan?.autoRenew && plan.expires <= now) {
      do {
        plan.start = plan.expires;
        plan.expires = addMonths(plan.start,planFor(plan).months);
      } while (plan.expires <= now);
      plan.used = 0;
      delete plan.usageCarry;
    }
    return state;
  }
  const active = state => state.subscription?.expires > Date.now();
  const remaining = state => active(state) ? Math.max(0,planFor(state.subscription).quota-state.subscription.used) : 0;
  const walletSpent = state => {
    const current = month(Date.now());
    return state.records.reduce((total, record) =>
      total + (record.wallet && month(record.time) === current ? record.wallet : 0), 0);
  };
  const walletAvailable = state => state.walletEnabled === false ? 0 :
    Math.min(state.balance, state.walletLimit == null ? state.balance : Math.max(0,state.walletLimit-walletSpent(state)));
  const articleId = a => a.url?.match(/\/(?:article|articleinfo)\/([^/?#]+)\.html/i)?.[1]?.toLowerCase()
    || a.contentKey || a.url || [a.rid || a.resource, a.title].join('/');
  const unlocked = (state, id) => state.records.some(record => record.type === 'article' && record.article === id);
  const date = time => new Intl.DateTimeFormat('zh-CN', {dateStyle:'medium', timeStyle:'short', timeZone:'Asia/Shanghai'}).format(time);

  async function change(update) {
    const id = identity(profile());
    if (!id) throw Error('请先登录。');
    const commit = () => {
      if (identity(profile()) !== id) throw Error('账号已切换，请重试。');
      const state = load(id);
      update(state);
      if(window.clubSession?.personalPreview)window.clubSession.write('dsu-preview',state);
      else localStorage.setItem(key(id), JSON.stringify(state));
    };
    if (navigator.locks) await navigator.locks.request(key(id), commit);
    else commit();
    window.dispatchEvent(new Event('dsu-change'));
  }

  function applyCharge(state, type, description, amount, article, publication) {
    if (article && unlocked(state, article)) return;
    const quota = Math.min(remaining(state), amount);
    const wallet = amount - quota;
    if (wallet && state.walletEnabled === false) throw Error('充值余额扣费已关闭，可在 DSU 账户开启。');
    if (wallet > state.balance) throw Error('可用 DSU 不足，请充值或开通会员。');
    if (wallet > walletAvailable(state)) throw Error('已达到充值余额的每月消费上限，可在 DSU 账户调整。');
    if (quota) state.subscription.used += quota;
    state.balance -= wallet;
    state.records.unshift({type, description, amount, quota, wallet, article, publication, time:Date.now()});
  }

  function charge(type, description, amount, article) {
    return change(state => applyCharge(state,type,description,amount,article));
  }

  function loadSample(state) {
    if (state.subscription || state.balance || state.records.length) throw Error('演示数据只能载入空白账户。');
    const now = Date.now(), day = 86400000, hour = 3600000;
    const start = now - 8*day;
    const subscriptionDay = new Date(start).getUTCDate();
    state.subscription = {start, day:subscriptionDay, expires:nextMonth(start,subscriptionDay), used:0, autoRenew:true};
    state.balance = 154;
    state.walletLimit = 80;
    const record = (type, description, amount, time) =>
      ({type, description, amount, quota:amount, wallet:0, time});
    const topics = ['比较城市更新中的社区参与方式','梳理睡眠经济的主要消费趋势','提炼电影市场变化的阅读线索',
      '从期刊文章梳理深度阅读的方法','比较科技报道的不同视角','帮我整理本期商业观察的阅读顺序'];
    const articles = [
      ['dycy20260901','你睡得好吗？'],['dycy20260902','大事件'],['dycy20260903','趋势'],['dycy20260904','数字世界']
    ];
    state.records = [
      ...articles.map(([article,title], index) =>
        ({...record('article',title,articlePrice, now-(index+1)*hour),article})),
      ...Array.from({length:30},(_, index) => {
        const topic = topics[index % topics.length];
        const followUp = ['','，补充相关背景','，列出阅读线索','，归纳主要观点','，给出延伸问题'][Math.floor(index/topics.length)];
        return record('ai',topic+followUp,aiPrice,now-(index+1)*5*hour);
      })
    ].sort((a,b)=>b.time-a.time);
    state.subscription.used = state.records.reduce((total,row)=>total+row.quota,0);
    state.sample = true;
    addSampleHistory(state);
  }

  function addSampleHistory(state) {
    if (!state.sample || state.sampleHistory) return;
    const oldest = Math.min(state.subscription.start,...state.records.map(record=>record.time));
    const hour = 3600000;
    const topics = ['整理公共交通与城市更新的相关报道','查找关于消费习惯变化的文章','归纳本期人物报道的共同主题',
      '比较不同文章对电影市场变化的解释','梳理数字阅读对注意力的影响','找出关于科技与日常生活的阅读线索',
      '按阅读时长整理本期商业报道','总结期刊对社区商业的观察'];
    const history = Array.from({length:16},(_, index)=>({
      type:'ai', description:topics[index%topics.length]+(index>=topics.length?'，并给出进一步阅读的建议':''),
      amount:aiPrice, quota:aiPrice, wallet:0, time:oldest-(index+3)*9*hour
    }));
    for (const [article,title,hours] of [['dycy20260905','人物',30],['dycy20260912','市场退潮，新导演如何“上岸”',58]]) {
      if (!unlocked(state,article)) history.push({type:'article', description:title, article, amount:articlePrice, quota:articlePrice, wallet:0, time:oldest-hours*hour});
    }
    state.records = [...state.records,...history].sort((a,b)=>b.time-a.time);
    state.sampleHistory = true;
  }

  function populateUsageDemo(state) {
    if (!active(state) || state.usageDemoSeeded) return;
    const plan = state.subscription;
    const current = state.records.filter(record=>record.time>=plan.start);
    const aiUsed = current.reduce((sum, record)=>sum+(record.type==='ai'?record.quota:0),0);
    const titles = (window.natureTopicData?.articles || []).map(article=>({title:article.title,id:articleId(article)}));
    const additions = [];
    let budget = remaining(state);
    for (const article of titles) {
      if (budget<articlePrice) break;
      if (unlocked(state,article.id)) continue;
      additions.push({type:'article',description:article.title,article:article.id,amount:articlePrice});
      budget-=articlePrice;
    }
    const topics = ['梳理本期商业观察的阅读线索','比较期刊里的城市议题','总结睡眠经济报道的观点','找出自然专题里的动物故事','归纳电影市场变化的线索','整理适合短时间阅读的篇目'];
    const count = Math.min(Math.floor(budget/aiPrice),Math.max(0,Math.ceil((90-aiUsed)/aiPrice)));
    for (let index=0;index<count;index++) {
      const question = topics[index%topics.length];
      const angle = ['','，补充背景','，比较观点','，列出阅读顺序','，给出延伸问题'][Math.floor(index/topics.length)];
      additions.push({type:'ai',description:question+angle,amount:aiPrice});
    }
    const span = Math.min(Date.now()-plan.start,6*86400000);
    additions.forEach((record,index)=>{
      plan.used+=record.amount;
      state.records.push({...record,quota:record.amount,wallet:0,example:true,time:Math.max(plan.start,Date.now()-Math.floor(span*(index+1)/(additions.length+1)))});
    });
    state.records.sort((a,b)=>b.time-a.time);
    state.usageDemoSeeded = true;
    delete state.showSampleLedger;
  }

  const dialog = document.createElement('dialog');
  dialog.className = 'dsu-dialog';
  dialog.setAttribute('aria-labelledby', 'dsu-dialog-title');
  document.body.append(dialog);

  function confirm({title, message, label, submit, limit = undefined, accountLink = false, article = null}) {
    if (dialog.open) return Promise.resolve(false);
    dialog.classList.toggle('dsu-dialog-article',Boolean(article));
    const hasField=limit!==undefined;
    dialog.innerHTML = article ? articleConfirmation(article, label) : `<form class="dsu-settings-form" novalidate>
      <header><h2 id="dsu-dialog-title">${esc(title)}</h2><p class="dsu-dialog-message">${esc(message)}</p></header>
      ${hasField?`<div class="dsu-dialog-field">
        <label for="dsu-settings-value">消费上限</label>
        <div class="dsu-number-field">
          <input id="dsu-settings-value" type="number" inputmode="numeric" name="limit" min="0" max="1000000" step="1"
          value="${limit??''}" placeholder="不限" aria-describedby="dsu-dialog-field-hint dsu-dialog-status" autofocus>
          <span aria-hidden="true">DSU</span>
        </div>
        <p id="dsu-dialog-field-hint">留空表示不限</p>
      </div>`:''}
      <p id="dsu-dialog-status" role="status" class="dsu-error"></p>
      <footer class="dsu-dialog-actions">
        ${accountLink?`<a href="${esc(accountURL)}">前往 DSU 账户</a>`:''}
        <button type="button" class="dsu-button" data-cancel ${hasField?'':'autofocus'}>取消</button>
        <button type="submit" class="dsu-button dsu-primary">${esc(label)}</button>
      </footer></form>`;
    return new Promise(resolve => {
      let completed = false;
      const form = dialog.querySelector('form');
      const button = form.querySelector('[type=submit]');
      const field = form.querySelector('input');
      const status = form.querySelector('[role=status]');
      field?.addEventListener('input',()=>{
        field.removeAttribute('aria-invalid');
        status.textContent='';
      });
      dialog.querySelector('[data-cancel]').onclick = () => dialog.close();
      dialog.querySelector('a')?.addEventListener('click', () => dialog.close());
      dialog.oncancel = event => { if (button?.disabled) event.preventDefault(); };
      dialog.addEventListener('close', () => resolve(completed), {once:true});
      form.onsubmit = async event => {
        event.preventDefault();
        if (!button) return;
        button.disabled = true;
        dialog.querySelector('[data-cancel]').disabled = true;
        try {
          await submit(form);
          completed = true;
          dialog.close();
        } catch (error) {
          status.textContent = error.message;
          if(field&&!field.validity.valid){
            field.setAttribute('aria-invalid','true');
            field.focus();
          }
          if (article) form.querySelector('.dsu-purchase-account')?.removeAttribute('hidden');
          button.disabled = false;
          dialog.querySelector('[data-cancel]').disabled = false;
        }
      };
      dialog.showModal();
    });
  }

  function signedIn() {
    if (profile()) return true;
    window.clubSession.login();
    return false;
  }

  function articleConfirmation(article, label) {
    const state = load(identity(profile()));
    const quota = Math.min(articlePrice, remaining(state));
    const available = remaining(state) + walletAvailable(state);
    const sufficient = available >= articlePrice;
    const source = quota === articlePrice ? '会员额度' : '充值余额';
    return `<form class="dsu-purchase">
      <button type="button" class="dsu-purchase-close" data-cancel aria-label="关闭解锁弹窗" autofocus>×</button>
      <span class="dsu-purchase-icon" aria-hidden="true"><i class="iconfont icon-Lock"></i></span>
      <h2 id="dsu-dialog-title">解锁全文</h2>
      <p class="dsu-purchase-title">${esc(article)}</p>
      <dl class="dsu-purchase-breakdown">
        <div><dt>本次支付</dt><dd><strong>${articlePrice}</strong> DSU</dd></div>
        <div><dt>可用额度</dt><dd>${available} DSU</dd></div>
      </dl>
      <p class="dsu-purchase-note">${sufficient?'从'+source+'扣除。解锁后可随时回来阅读。':'可用额度不足。充值或开通会员后即可解锁。'}</p>
      <p role="status" class="dsu-error"></p>
      ${sufficient?`<button type="submit" class="dsu-button dsu-primary dsu-purchase-primary">${esc(label)}</button>
        <a class="dsu-purchase-account" href="${esc(accountURL)}" hidden>前往 DSU 账户</a>`:
        `<a class="dsu-button dsu-primary dsu-purchase-primary" href="${esc(accountURL)}">前往 DSU 账户</a>`}
    </form>`;
  }

  function showInsufficient(){
    if(dialog.open)return;
    dialog.classList.remove('dsu-dialog-article');
    dialog.innerHTML=`<div class="dsu-settings-form"><header><h2 id="dsu-dialog-title">可用 DSU 不足</h2></header><div class="dsu-actions"><button type="button" class="dsu-button" data-cancel>关闭</button><a class="dsu-button" href="${accountURL}">充值 DSU</a><a class="dsu-button dsu-primary" href="${membershipURL}">查看会员套餐</a></div></div>`;
    dialog.querySelector('[data-cancel]').onclick=()=>dialog.close();
    dialog.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>dialog.close()));
    dialog.showModal();
  }
  async function purchaseArticle(button){
    if(!signedIn()||button.disabled)return false;
    button.disabled=true;
    try{
      await change(state=>{
        const article=button.dataset.dsuArticle;
        if(unlocked(state,article))return;
        applyCharge(state,'article',button.dataset.title,articlePrice,article);
        state.records[0].route=location.hash;
      });
      return true;
    }
    catch{showInsufficient();return false;}
    finally{button.disabled=false;}
  }
  async function spendAI(question,operation){
    await change(state=>{
      applyCharge(state,'ai',question,1);
      const row=state.records[0];
      row.operation=operation;
      const previous=state.records.find((r,i)=>i>0&&r.operation===operation);
      if(previous){
        for(const key of ['amount','quota','wallet'])row[key]+=previous[key];
        state.records.splice(state.records.indexOf(previous),1);
      }
    });
  }
  function summary(){
    const owner=identity(profile());
    const state=owner?load(owner):{balance:0,records:[]};
    const quota=active(state)?planFor(state.subscription).quota:0;
    const left=remaining(state);
    const used=state.records.filter(row=>month(row.time)===month(Date.now()));
    return {left,quota,wallet:walletAvailable(state),available:left+walletAvailable(state),
      ai:used.reduce((total,row)=>total+(row.type==='ai'?row.amount:0),0),
      articles:used.reduce((total,row)=>total+(purchaseTypes.has(row.type)?row.amount:0),0)};
  }
  function membership(code, period=null){
    const plan=Object.hasOwn(plans,code)?plans[code]:null;
    const owner=identity(profile());
    const state=owner?load(owner):null;
    const pricing='#/membership';
    const buyQuota='<button type="button" class="dsu-button" data-dsu-recharge>购买额度</button>';
    const annual=period==='year'||(period!=='month'&&plan?.months===12);
    const base=annual?'year':'month';
    const uses=[
      ['解锁文章','按篇解锁，继续阅读全文'],
      ['购买期刊','选购单期或全年订阅'],
      ['阅读向导与可信问答','按实际使用量消耗 DSU']
    ];
    const billing=`<nav class="dsu-billing-switch" aria-label="普通会员计费周期"><a href="${pricing}?period=month" ${annual?'':'aria-current="true"'}>月</a><a href="${pricing}?period=year" ${annual?'aria-current="true"':''}>年</a></nav>`;
    const included=new URL('assets/membership/included.svg',root).href;
    const card=(key,title,description)=>{
      const item=plans[key];
      const pro=key==='pro';
      const cycle=item.months===1?'月':'年';
      const selected=key+'-auto';
      const selectedPlan=plans[selected];
      return `<article class="dsu-price-card ${pro?'dsu-price-pro':''}">
        <div class="dsu-plan-head"><div><h2>${title}</h2><p class="dsu-plan-description">${description}</p></div>${pro?'':billing}</div>
        <div class="dsu-plan-purchase">
          <div class="dsu-plan-price-row">
            <div><div class="dsu-price-amount"><strong data-dsu-plan-price>${selectedPlan.price}</strong><span>DSU/${cycle}</span></div>
            <p class="dsu-price-quota">每${cycle}获得 <strong>${item.quota} DSU</strong></p></div>
            <button type="button" class="dsu-switch dsu-plan-renewal" role="switch" aria-label="${title}连续包${cycle}" aria-checked="true" data-dsu-plan-switch="${key}">
              连续包${cycle}<span class="dsu-switch-track" aria-hidden="true"></span>
            </button>
          </div>
          <button type="button" class="dsu-button dsu-primary dsu-plan-buy" data-dsu-checkout="${selected}">购买</button>
        </div>
        <ul class="dsu-plan-features">${uses.map(([name,detail])=>`<li><img src="${included}" alt="" width="20" height="20"><div><strong>${name}</strong><small>${detail}</small></div></li>`).join('')}</ul>
      </article>`;
    };
    return `<section class="dsu-pricing dsu-pricing-comparison">
      <header><h1>龙源期刊网会员</h1><p>用 DSU 阅读文章、选购期刊和使用 AI 问答。</p></header>
      <div class="dsu-membership-grid">${card(base,'普通会员','适合日常阅读和提问')}${card('pro','Pro会员','更高的年度额度，适合频繁阅读和问答')}</div>
      <footer class="dsu-pricing-foot">
        <div>${state?`<span class="dsu-pricing-balance-label">当前余额</span>
          <strong data-dsu-pricing-balance>${(remaining(state)+walletAvailable(state)).toLocaleString('zh-CN')} DSU 可用</strong>`:'<strong>单独购买额度</strong>'}
          <p>单笔 ${minimum} DSU 起充</p>
        </div>${buyQuota}
      </footer>
    </section>`;
  }
  const purchaseTypes=new Set(['article','issue','subscription','purchase']);
  function usageType(record){
    if(purchaseTypes.has(record.type))return 'purchase';
    if(record.type==='ai')return 'ai';
  }
  function quotaUsage(state){
    const member=active(state),plan=state.subscription;
    const quota=member?planFor(plan).quota:0;
    const used=member?plan.used:0;
    let remaining=used;
    const totals={purchase:0,ai:0};
    function count(kind,amount){
      if(!kind||!remaining)return;
      const recorded=Math.min(remaining,Math.max(0,Number(amount)||0));
      totals[kind]+=recorded;
      remaining-=recorded;
    }
    if(member){
      for(const record of state.records){
        if(record.time>=plan.start)count(usageType(record),record.quota);
      }
      count('purchase',plan.usageCarry?.purchase??plan.usageCarry?.article);
      count('ai',plan.usageCarry?.ai);
      // Older accounts carried the used total but did not persist its split.
      if(remaining){
        const previous=state.records.filter(record=>record.time<plan.start).sort((a,b)=>b.time-a.time);
        for(const record of previous)count(usageType(record),record.quota);
      }
    }
    return {used,quota,percent:quota?used/quota*100:0,...totals,missing:remaining};
  }
  function quotaProgress(usage){
    const scale=Math.max(usage.used,usage.quota,1);
    return {total:usage.used/scale*100,
      segments:[['purchase',usage.purchase/scale*100],['ai',usage.ai/scale*100]]};
  }
  function quotaSegments(progress){
    return progress.segments.map(([kind,percent])=>`<span data-usage="${kind}" style="width:${percent}%"></span>`).join('');
  }
  function panel(filter = 'all', view) {
    const state = load(identity(profile()));
    if (active(state) && !state.usageDemoSeeded) {
      queueMicrotask(()=>change(populateUsageDemo).catch(()=>{}));
    }
    const records = state.records.filter(record => filter === 'all' || usageType(record) === (filter==='article'?'purchase':filter));
    const groups = new Map();
    const dayFormat = new Intl.DateTimeFormat('zh-CN',{dateStyle:'long',timeZone:'Asia/Shanghai'});
    const timeFormat = new Intl.DateTimeFormat('zh-CN',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Shanghai'});
    for (const record of records) {
      const day = dayFormat.format(record.time);
      if (!groups.has(day)) groups.set(day,[]);
      groups.get(day).push(record);
    }
    const ledger = `<section class="dsu-section dsu-ledger" id="dsu-ledger"><header class="dsu-row"><h3>消费流水</h3>
        ${state.sample&&!state.sampleHistory?'<button type="button" class="dsu-button" data-dsu-history>补充样例流水</button>':''}
        <nav class="dsu-filters" aria-label="消费类型">${[['all','全部'],['article','购买记录'],['ai','AI对话']].map(([id,label]) =>
          `<a class="dsu-button dsu-filter" href="#/me?tab=dsu&amp;view=usage&amp;filter=${id}" ${filter===id?'aria-current="page"':''}>${label}</a>`).join('')}</nav></header>
        ${records.length ? [...groups].map(([day,rows])=>`<section class="dsu-record-day"><h4>${day}</h4>
          <ul class="dsu-records">${rows.map(record=>{
          const source = (record.example?'样例 · ':'')+[record.quota && '会员额度 '+record.quota,record.wallet && '充值余额 '+record.wallet].filter(Boolean).join(' + ')+' DSU';
          return `<li title="${esc(source)}"><time datetime="${new Date(record.time).toISOString()}">${timeFormat.format(record.time)}</time>
          <div class="dsu-record-copy"><span class="dsu-record-type">${({article:'解锁文章',issue:'购买单期',subscription:'订阅期刊',purchase:'购买',ai:'AI 对话'})[record.type]||'DSU'}</span><strong>${esc(record.description)}</strong></div>
          <b>−${record.amount} DSU</b><small class="dsu-record-source">${esc(source)}</small></li>`;
          }).join('')}</ul></section>`).join(''):'<p>暂无此类消费记录。</p>'}</section>`;
    const member=active(state),plan=state.subscription,totals=quotaUsage(state);
    const {used,quota,percent,missing}=totals;
    const progress=quotaProgress(totals);
    const walletEnabled=state.walletEnabled!==false;
    const spent=walletSpent(state),limit=state.walletLimit;
    const planManagement=member&&view==='plan';
    const walletManagement=view==='wallet';
    const expiry=member?'本期额度有效至 '+date(plan.expires):'开通会员后可使用套餐额度。';
    return `<div class="dsu-panel dsu-subscriptions dsu-account-overview">
      <header class="dsu-account-title"><h2>DSU 订阅与用量</h2><p>会员额度与充值余额</p></header>
      <section class="dsu-summary dsu-account-card" aria-label="当前套餐">
        <div><p class="dsu-card-label">当前套餐</p>
          <strong>${member?`<a href="#/me?tab=dsu${planManagement?'':'&amp;view=plan'}" aria-label="管理${esc(planFor(plan).name)}">${esc(planFor(plan).name)}</a>`:'尚未订阅'}</strong>
          <p class="dsu-card-detail">${expiry}</p>
        </div>
        <a class="dsu-button" href="#/membership">购买会员</a>
        ${planManagement?`<div class="dsu-account-card-settings dsu-actions">
          ${plan.autoRenew?'<button type="button" class="dsu-button" data-dsu-cancel>取消订阅</button>':
            '<button type="button" class="dsu-button" data-dsu-renew>续费</button>'}
        </div>`:''}
      </section>
      <section class="dsu-section dsu-usage"><h3>会员额度用量</h3>
        <div class="dsu-usage-progress">
        <div class="dsu-row"><p>已用 <b>${used} / ${quota} DSU</b></p><span class="dsu-tag">${percent.toFixed(1)}%</span></div>
        <div class="dsu-progress" style="--usage-total:${progress.total}%" aria-hidden="true">${quotaSegments(progress)}</div>
        <div class="dsu-legend"><span title="${totals.purchase} DSU">购买消耗</span><span title="${totals.ai} DSU">AI 对话</span></div>
        ${missing?'<p class="dsu-usage-history-note">部分历史流水缺失。</p>':''}</div>
      </section>
      <section class="dsu-section dsu-wallet"><h3>充值额度</h3><div class="dsu-wallet-card dsu-account-card">
        <div><p class="dsu-card-label">当前余额</p>
          <strong><a href="#/me?tab=dsu${walletManagement?'':'&amp;view=wallet'}" aria-label="管理充值余额">${walletAvailable(state)} DSU 可用</a></strong>
          <p class="dsu-card-detail">单笔 ${minimum} DSU 起充</p>
        </div>
        <button type="button" class="dsu-button" data-dsu-recharge>购买额度</button>
        ${walletManagement?`<div class="dsu-account-card-settings">
         <div class="dsu-row"><p>使用充值余额</p><button type="button" class="dsu-switch" role="switch" aria-label="使用充值余额" aria-checked="${walletEnabled}" data-dsu-wallet><span class="dsu-switch-track" aria-hidden="true"></span></button></div>
         <div class="dsu-row"><p>账户余额 ${state.balance} DSU · 本月消费 ${spent} / ${limit==null?'不限':limit+' DSU'}</p>
           <button type="button" class="dsu-button" data-dsu-limit>设置消费上限</button></div>
        </div>`:''}
      </div></section>
      ${!plan&&!state.balance&&!state.records.length?'<div><button type="button" class="dsu-button" data-dsu-sample>载入演示数据</button></div>':''}
      ${ledger}</div>`;
  }

  function openMembershipPayment(selected,renewal){
    const owner=identity(profile());
    const code=renewal?(load(owner).subscription?.code||'month-auto'):selected;
    const plan=plans[code];
    if(!plan)return;
    window.magazineCheckout.open({
      title:renewal?'会员续费':'支付会员订单',
      product:plan.name,
      issue:plan.months===1?'1个月':'1年',
      membership:{quota:plan.quota,renewal:plan.auto?'到期自动续费，可在 DSU 账户取消':'到期后按需续订'},
      price:plan.price,
      success:renewal?'续费成功':'会员开通成功',
      onPaid:()=>change(state=>{
        if(identity(profile())!==owner)throw Error('账号已切换，请重新提交订单。');
        const start=Date.now();
        if(renewal){
          if(!active(state)||planFor(state.subscription)!==plan)throw Error('会员状态已更新，请重新提交订单。');
          state.subscription.expires=addMonths(state.subscription.expires,plan.months);
          return;
        }
        const {used,purchase,ai}=quotaUsage(state);
        state.subscription={code,start,expires:addMonths(start,plan.months),used,autoRenew:Boolean(plan.auto),
          usageCarry:{purchase,ai}};
      }),
      onDone:()=>{location.hash='#/me?tab=dsu';}
    });
  }

  document.addEventListener('click', async event => {
    const planSwitch=event.target.closest('[data-dsu-plan-switch]');
    if(planSwitch){
      const auto=planSwitch.getAttribute('aria-checked')!=='true';
      const selected=planSwitch.dataset.dsuPlanSwitch+(auto?'-auto':'');
      const card=planSwitch.closest('.dsu-price-card');
      const purchase=card.querySelector('.dsu-plan-buy');
      card.querySelector('[data-dsu-plan-price]').textContent=plans[selected].price;
      planSwitch.setAttribute('aria-checked',String(auto));
      purchase.dataset.dsuCheckout=selected;
      return;
    }
    const checkout=event.target.closest('[data-dsu-checkout],[data-dsu-renew]');
    if(checkout){
      const selected=checkout.dataset.dsuCheckout;
      const renewal=checkout.hasAttribute('data-dsu-renew');
      if(signedIn())openMembershipPayment(selected,renewal);
      else document.querySelector('.qikan-auth-dialog:modal')?.addEventListener('close',()=>{
        if(profile())openMembershipPayment(selected,renewal);
      },{once:true});
      return;
    }
    const button = event.target.closest('[data-dsu-article],[data-dsu-recharge],[data-dsu-wallet],[data-dsu-limit],[data-dsu-cancel],[data-dsu-sample],[data-dsu-history]');
    if (!button) return;
    if (button.hasAttribute('data-dsu-article')) {
      if (await purchaseArticle(button)) window.dispatchEvent(new CustomEvent('dsu-article-unlocked', {detail:button}));
      return;
    }
    if (!signedIn()) return;
    if (button.hasAttribute('data-dsu-history')) {
      await confirm({title:'补充样例流水', message:'加入更早的演示记录，当前周期的余额和用量不受影响。', label:'补充样例流水',
        submit:() => change(addSampleHistory)});
      return;
    }
    if (button.hasAttribute('data-dsu-sample')) {
      await confirm({title:'载入演示数据', message:'将为当前空白账户载入会员、余额和消费记录样例。', label:'确认载入演示数据',
        submit:() => change(loadSample)});
      return;
    }
    if (button.hasAttribute('data-dsu-wallet')) {
      await change(state => { state.walletEnabled = state.walletEnabled === false; });
      document.querySelector('[data-dsu-wallet]')?.focus();
      return;
    }
    if (button.hasAttribute('data-dsu-limit')) {
      await confirm({title:'设置每月消费上限', message:'上限只适用于当月从充值余额扣除的费用。', label:'保存上限',
        limit:load(identity(profile())).walletLimit ?? null,
        submit:form => change(state => {
          const field = form.elements.limit, value = field.valueAsNumber;
          if (!field.validity.valid || (field.value && !Number.isSafeInteger(value))) throw Error('请输入 0 至 1000000 的整数。');
          state.walletLimit = field.value ? value : null;
        })});
      return;
    }
    if (button.hasAttribute('data-dsu-cancel')) {
      await confirm({title:'取消订阅',label:'确认取消订阅',
        message:'本期剩余额度可用至到期，到期后停止续订。',
        submit:()=>change(state=>{
          if(!active(state))throw Error('当前会员已到期。');
          state.subscription.autoRenew=false;
        })});
      return;
    }
    openRecharge();
  });

  function openRecharge(onDone){
    const owner=identity(profile());
    window.magazineCheckout.open({
      title:'充值 DSU',product:'DSU 余额',minimum,success:'充值成功',onDone,
      onPaid:amount=>change(state=>{
        if(identity(profile())!==owner)throw Error('账号已切换，请重新提交订单。');
        state.balance+=amount;
      })
    });
  }

  function mountPublicationPurchase(trigger,{kind,id,...options}){
    const owned=()=>profile()&&window.clubSession.contentRows(kind).some(row=>row.id===id);
    const originalLabel=trigger.textContent;
    function reflectOwnership(){
      trigger.disabled=Boolean(owned());
      trigger.textContent=trigger.disabled?(kind==='subscription'?'已订购':'已购买'):originalLabel;
    }
    reflectOwnership();
    function open(){
      const owner=identity(profile());
      if(!owner||!trigger.isConnected)return;
      const publication=kind+':'+id;
      const hasPurchase=state=>state.records.some(record=>record.publication===publication);
      if(owned()){reflectOwnership();return;}
      window.magazineCheckout.open({
        ...options,
        dsu:{available:()=>summary().available,membershipURL,recharge:()=>openRecharge(open)},
        onPaid:async amount=>{
          await change(state=>{
            if(identity(profile())!==owner)throw Error('账号已切换，请重新提交订单。');
            if(!hasPurchase(state))applyCharge(state,kind,options.title,amount,undefined,publication);
          });
          options.onPaid?.();
          reflectOwnership();
        }
      });
    }
    trigger.addEventListener('click',()=>{
      if(signedIn())open();
      else document.querySelector('.qikan-auth-dialog:modal')?.addEventListener('close',open,{once:true});
    });
  }

  window.qikanDSU = {
    page(a) { return window.qikanArticleRoutes?.[articleId(a)]; },
    panel, membership, summary, mountPublicationPurchase,
    readingUnlocks(){const owner=identity(profile());return owner?load(owner).records.filter(row=>row.type==='article'&&row.article):[];}, spendAI, signedIn, accountURL, membershipURL, articleId, articlePrice, aiPrice,
    canRead(a) {
      const owner=identity(profile()),article=articleId(a);
      if(!owner)return false;
      return unlocked(load(owner),article);
    },
    gate(a, preview) {
      return `<div class="dsu-gate">
        <div class="portal-prose dsu-reading-excerpt">${preview}</div>
        <section class="dsu-reading-unlock" aria-label="全文解锁">
          <div class="dsu-reading-divider" aria-hidden="true"><i class="iconfont icon-Lock"></i></div>
          <h2>解锁全文</h2>
          <p>解锁后可以随时回来阅读。</p>
          <button type="button" class="dsu-button dsu-reading-button" data-dsu-article="${esc(articleId(a))}" data-title="${esc(a.title)}">用 ${articlePrice} DSU 解锁全文</button>
        </section>
      </div>`;
    }
  };
  const quickMenu=document.createElement('div');
  quickMenu.setAttribute('role','navigation');
  quickMenu.className='dsu-avatar-menu';
  quickMenu.id='dsu-avatar-menu';
  quickMenu.setAttribute('popover','manual');
  quickMenu.setAttribute('aria-label','账户快捷菜单');
  const observedAccounts=new WeakSet();
  let activeAccount,closeTimer,ignoreFocus=false,menuKey='';
  function closeMenu(){
    clearTimeout(closeTimer);
    if(!activeAccount)return;
    quickMenu.hidePopover();
    activeAccount.setAttribute('aria-expanded','false');
    activeAccount=null;
  }
  function placeMenu(){
    const bounds=activeAccount.getBoundingClientRect();
    quickMenu.style.left=Math.max(8,Math.min(bounds.left,innerWidth-quickMenu.offsetWidth-8))+'px';
    quickMenu.style.top=Math.min(bounds.bottom+8,Math.max(8,innerHeight-quickMenu.offsetHeight-8))+'px';
  }
  function openMenu(account){
    clearTimeout(closeTimer);
    if(account===activeAccount||!profile())return;
    closeMenu();
    activeAccount=account;
    account.after(quickMenu);
    quickMenu.showPopover();
    placeMenu();
    account.setAttribute('aria-expanded','true');
  }
  function maybeClose(){
    clearTimeout(closeTimer);
    closeTimer=setTimeout(()=>{
      if(activeAccount?.matches(':hover')||quickMenu.matches(':hover')||quickMenu.contains(document.activeElement))return;
      closeMenu();
    },160);
  }
  quickMenu.addEventListener('pointerenter',()=>clearTimeout(closeTimer));
  quickMenu.addEventListener('pointerleave',maybeClose);
  quickMenu.addEventListener('focusout',maybeClose);
  quickMenu.addEventListener('click',event=>{
    if(event.target.closest('[data-avatar-signout]')){
      closeMenu();
      window.clubSession.logout();
      return;
    }
    if(event.target.closest('a'))closeMenu();
  });
  document.addEventListener('pointerdown',event=>{
    if(activeAccount&&!activeAccount.contains(event.target)&&!quickMenu.contains(event.target))closeMenu();
  });
  document.addEventListener('keydown',event=>{
    if(event.key!=='Escape'||!activeAccount)return;
    const account=activeAccount;
    const restore=quickMenu.contains(document.activeElement);
    closeMenu();
    if(restore){
      ignoreFocus=true;
      account.focus({preventScroll:true});
      ignoreFocus=false;
    }
  });
  window.addEventListener('resize',()=>{if(activeAccount)placeMenu();});
  window.addEventListener('scroll',()=>{if(activeAccount)placeMenu();},{passive:true});
  window.addEventListener('hashchange',closeMenu);
  function refreshAvatarUsage(){
    const owner=profile();
    if(!owner){
      closeMenu();menuKey='';
      document.querySelectorAll('header [aria-controls="dsu-avatar-menu"]').forEach(account=>{
        account.removeAttribute('aria-description');
        account.removeAttribute('aria-controls');
        account.removeAttribute('aria-expanded');
      });
      return;
    }
    if(activeAccount&&!activeAccount.isConnected)closeMenu();
    const state=load(identity(owner));
    const totals=quotaUsage(state);
    const {used,quota,percent,purchase,ai,missing}=totals;
    const progress=quotaProgress(totals);
    const quotaLeft=remaining(state),available=quotaLeft+walletAvailable(state);
    const plan=active(state)?state.subscription:null;
    const planName=plan?planFor(plan).name:'尚未订阅';
    const expiry=plan?new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',dateStyle:'short'}).format(plan.expires).replaceAll('-','.'):'';
    const nextKey=JSON.stringify([owner.avatar,owner.nickname,planName,expiry,used,quota,purchase,ai,missing]);
    if(nextKey!==menuKey){
      menuKey=nextKey;
      const avatarURL=new URL(owner.avatar,root);
      const links=[['overview','我的阅读'],['profile','基本信息'],['dsu','会员与 DSU']];
      const arrow=new URL('assets/figma-identity/account-menu-arrow.svg',root);
      const flash=new URL('assets/figma-identity/account-plan-flash.svg',root);
      quickMenu.innerHTML=`<div class="dsu-menu-profile">
       <img src="${esc(avatarURL)}" class="dsu-menu-avatar" width="40" height="40" alt="">
       <div><strong>${esc(owner.nickname)}</strong><p><span>${esc(planName)}</span>${expiry?`<span>有效期至：${expiry}</span>`:''}</p></div>
      </div>
      <div class="dsu-menu-usage">
       <div class="dsu-menu-usage-line"><p>已用 <b>${used} / ${quota} DSU</b></p><span>${percent.toFixed(1)}%</span></div>
       <div class="dsu-menu-progress" style="--usage-total:${progress.total}%" aria-hidden="true">${quotaSegments(progress)}</div>
       <div class="dsu-menu-legend"><span>购买消耗</span><span>AI 对话</span></div>${missing?'<p class="dsu-usage-history-note">部分历史流水缺失。</p>':''}
      </div>
      <div class="dsu-menu-links">${links.map(([tab,label])=>`<a href="${esc(new URL('portal.html#/me?tab='+tab,root))}">${label}<img src="${esc(arrow)}" alt=""></a>`).join('')}</div>
      <div class="dsu-menu-links dsu-menu-plan-link"><a href="${esc(membershipURL)}">会员套餐<img src="${esc(flash)}" alt=""></a></div>
      <div class="dsu-menu-links"><button type="button" data-avatar-signout>退出登录</button></div>`;
    }
    for(const avatar of document.querySelectorAll('header .club-account-avatar')){
      const account=avatar.closest('.login,.nav-login');
      if(!account)continue;
      let meter=avatar.closest('.dsu-avatar-meter');
      if(!meter){
        meter=document.createElement('span');
        meter.className='dsu-avatar-meter';
        meter.innerHTML=`<svg viewBox="0 0 40 40" aria-hidden="true">
          <circle class="dsu-avatar-track" cx="20" cy="20" r="18"/>
          <circle class="dsu-avatar-total" cx="20" cy="20" r="18" pathLength="100"/>
          ${progress.segments.map(([kind])=>`<circle class="dsu-avatar-arc" data-usage="${kind}" cx="20" cy="20" r="18" pathLength="100"/>`).join('')}
        </svg>`;
        avatar.before(meter);meter.prepend(avatar);
      }
      meter.querySelector('.dsu-avatar-total').setAttribute('stroke-dasharray',`${progress.total} 100`);
      let offset=0;
      for(const [kind,length] of progress.segments){
        const arc=meter.querySelector(`circle[data-usage="${kind}"]`);
        arc.setAttribute('stroke-dasharray',`${length} 100`);
        arc.setAttribute('stroke-dashoffset',String(-offset));
        offset+=length;
      }
      account.setAttribute('aria-description',`已用 ${used} / ${quota} DSU（${percent.toFixed(1)}%），可用 ${available} DSU。按向下键打开账户快捷菜单。`);
      account.setAttribute('aria-controls',quickMenu.id);
      account.setAttribute('aria-expanded',String(activeAccount===account));
      if(observedAccounts.has(account))continue;
      observedAccounts.add(account);
      account.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')openMenu(account);});
      account.addEventListener('pointerleave',maybeClose);
      account.addEventListener('focus',()=>{if(!ignoreFocus&&account.matches(':focus-visible'))openMenu(account);});
      account.addEventListener('blur',maybeClose);
      account.addEventListener('keydown',event=>{
        if(event.key!=='ArrowDown'||!profile())return;
        event.preventDefault();
        openMenu(account);
        quickMenu.querySelector('a')?.focus();
      });
    }
  }
  window.addEventListener('dsu-change',()=>{
    refreshAvatarUsage();
    const balance=document.querySelector('[data-dsu-pricing-balance]');
    if(balance)balance.textContent=summary().available.toLocaleString('zh-CN')+' DSU 可用';
  });
  window.addEventListener('club-session-change',refreshAvatarUsage);
  window.addEventListener('storage',event=>{if(event.key?.startsWith('qikan-dsu:'))refreshAvatarUsage();});
  const header=document.querySelector('body > header');
  if(header)new MutationObserver(refreshAvatarUsage).observe(header,{childList:true,subtree:true});
  refreshAvatarUsage();
})();
