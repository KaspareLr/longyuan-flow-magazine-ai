/* Shared local-only account state across the independent demo. */
(()=>{
 const base=new URL('.',document.currentScript.src);window.clubRootURL=base.href;
 const personalPreview=location.pathname.endsWith('/portal.html')&&new URLSearchParams(location.search).get('personalPreview')==='filled';
 const fixture=new Map();
 if(personalPreview){
  const articleRoute='#/article/0?context=magazine&resource='+encodeURIComponent('第一财经')+'&full=1';
  const day=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai'}).format(new Date());
  fixture.set('profile',{nickname:'林间读者',dsuId:'personal-preview',avatar:'assets/account-avatars/avatar-04.png',
   email:'reader@example.com',city:'上海',bio:'喜欢从一篇报道开始，读懂日常生活中的变化。',interests:['商业观察','文学','城市生活'],role:'reader',publicationRights:[{name:'第一财经',expires:'2027-09-30'},{name:'南风窗',expires:'2027-06-30'}]});
  fixture.set('membership',{label:'年度读友',started:'2026-11-01',expires:'2027-11-01',price:198});
  fixture.set('qikan-reading-history',[
   {title:'你睡得好吗？', route:articleRoute, day},
   {title:'大事件',route:articleRoute.replace('/article/0','/article/1'),day:'2026-11-18'},
   {title:'趋势',route:articleRoute.replace('/article/0','/article/2'),day:'2026-11-16'}
  ]);
  fixture.set('savedBooks',(window.clubPortalData?.books||[]).slice(0,2).map(book=>book.id));
  fixture.set('savedArticles',[{title:'你睡得好吗？',source:'第一财经 · 2026 年 09 期',route:articleRoute},
   {title:'大事件',source:'第一财经 · 2026 年 09 期',route:articleRoute.replace('/article/0','/article/1')}]);
  fixture.set('book-learning-notes',[{bookId:'rb-ob-01',text:'记录人物之间的关系和选择。',date:new Date().toISOString()}]);
  for(const event of (window.clubPortalData?.events||[]).slice(0,2))fixture.set('event-'+event.id,true);
 }
 const read=(key,fallback)=>{
  if(personalPreview)return fixture.get(key)??fallback;
  try{return JSON.parse(localStorage.getItem('club-demo:'+key))??fallback}catch{return fallback}
 };
 const write=(key,value)=>{
  if(personalPreview){fixture.set(key,value);return;}
  try{localStorage.setItem('club-demo:'+key,JSON.stringify(value))}catch{}
 };
 const contentKey=()=>{const p=read('profile',null);return 'reading-content:'+ (p?.dsuId||p?.email||p?.nickname||'guest');};
 const contentRows=kind=>read(contentKey(),[]).filter(row=>row.kind===kind);
 function recordContent(kind,id,details){
  const storage=contentKey();
  const rows=read(storage,[]).filter(row=>row.kind!==kind||row.id!==id);
  if(details)rows.unshift({...details,kind,id,time:Date.now()});
  write(storage,rows);
  window.dispatchEvent(new Event('reading-content-change'));
 }
 const state=window.clubSession={personalPreview,contentRows,recordContent,get profile(){return qikanAccountAvatar(read('profile',null),read,write)},get membership(){return read('membership',null)},read,write,
  update(profile){profile={...profile,dsuId:profile.dsuId||(profile.email?.trim().toLowerCase()||profile.nickname.trim().toLowerCase()),avatar:profile.avatar};profile=qikanAccountAvatar(profile,read,write);write('profile',profile);if(!personalPreview)try{localStorage.setItem('club-demo:nickname',profile.nickname)}catch{};refresh();window.dispatchEvent(new Event('club-session-change'))},
  logout(){write('profile',null);if(!personalPreview)try{localStorage.removeItem('club-demo:nickname')}catch{};refresh();window.dispatchEvent(new Event('club-session-change'))},
  member(plan){write('membership',{...plan,expires:'2027-10-15',started:'2026-10-15'});window.dispatchEvent(new Event('club-session-change'))},
  login(){dialog.showModal();dialog.querySelector('input').focus()}
 };
 const dialog=document.createElement('dialog');dialog.className='club-account-dialog';dialog.setAttribute('aria-label','登录读书会');dialog.innerHTML=`<form method="dialog"><button class="club-dialog-close" aria-label="关闭登录">×</button></form><span class="club-overline">YOUR READING SPACE</span><h2>欢迎回来。</h2><p>用一个昵称，开启你的阅读空间。</p><form id="club-demo-login"><label>阅读昵称<input name="nickname" maxlength="20" value="林间读者" autocomplete="nickname" required></label><label>登录身份<select name="role"><option value="reader">读者</option><option value="leader">领读人 · 体验创建读书会</option></select></label><label>邮箱（选填）<input name="email" type="email" autocomplete="email" placeholder="reader@example.com"></label><button class="button dark" type="submit">登录并开始阅读</button></form>`;document.body.append(dialog);
 dialog.querySelector('#club-demo-login').addEventListener('submit',e=>{e.preventDefault();const f=e.target;state.update({nickname:f.nickname.value.trim(),email:f.email.value,bio:'读书，读人，也读世界。',city:'上海',interests:['文学','生活'],role:f.role.value});dialog.close();if(f.role.value==='leader'){const configured=read('club-configuration',null);clubPageMotion.navigate(new URL(configured?'index.html':'index.html?setup=1',base))}});
 const themes={共读:'reading',领读人:'people',活动:'events',会员:'membership'};
 function refresh(){
  const profile=state.profile;
  document.querySelectorAll('.nav-shell nav a,.nav-shell nav button,.club-demo-topbar .nav a').forEach(el=>{
   const page=themes[el.textContent.trim()];if(!page)return;
   if(el.tagName==='BUTTON'){const a=document.createElement('a');a.href=new URL('portal.html#/'+page,base);a.textContent=el.textContent;el.replaceWith(a)}else el.href=new URL('portal.html#/'+page,base);
  });
  document.querySelectorAll('.login,.nav-login').forEach(el=>{el.replaceChildren();if(profile){const img=document.createElement('img');img.className='club-account-avatar';img.src=new URL(profile.avatar,base);img.alt='';img.width=28;img.height=28;const name=document.createElement('span');name.className='club-account-name';name.textContent=profile.nickname;el.append(img,name)}else el.textContent='登录';el.classList.toggle('is-signed-in',!!profile);el.setAttribute('aria-label',profile?'我的阅读空间':'登录');if(el.tagName==='A')el.href=new URL('portal.html#/me',base)});
 }
 document.addEventListener('click',e=>{
  const login=e.target.closest('.login,.nav-login,[data-club-login]');if(login){e.preventDefault();e.stopImmediatePropagation();if(state.profile&&!login.hasAttribute('data-club-login'))clubPageMotion.navigate(new URL('portal.html#/me',base));else state.login();return}
  const member=e.target.closest('[data-open="member"],.member');if(member){e.preventDefault();e.stopImmediatePropagation();clubPageMotion.navigate(new URL('portal.html#/membership',base));return}
 },true);
 refresh();window.addEventListener('storage',refresh);window.addEventListener('hashchange',refresh);
})();
