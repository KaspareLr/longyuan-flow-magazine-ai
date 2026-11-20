/* Shared local-only account state across the independent demo. */
(()=>{
 const base=new URL('.',document.currentScript.src);window.clubRootURL=base.href;
 const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem('club-demo:'+key))??fallback}catch{return fallback}};
 const write=(key,value)=>{try{localStorage.setItem('club-demo:'+key,JSON.stringify(value))}catch{}};
 const state=window.clubSession={get profile(){return qikanAccountAvatar(read('profile',null),read,write)},get membership(){return read('membership',null)},read,write,
  update(profile){profile={...profile,dsuId:profile.dsuId||(profile.email?.trim().toLowerCase()||profile.nickname.trim().toLowerCase()),avatar:profile.avatar};profile=qikanAccountAvatar(profile,read,write);write('profile',profile);try{localStorage.setItem('club-demo:nickname',profile.nickname)}catch{};refresh();window.dispatchEvent(new Event('club-session-change'))},
  logout(){write('profile',null);try{localStorage.removeItem('club-demo:nickname')}catch{};refresh();window.dispatchEvent(new Event('club-session-change'))},
  member(plan){write('membership',{...plan,expires:'2027-10-15',started:'2026-10-15'});window.dispatchEvent(new Event('club-session-change'))},
  login(){dialog.showModal();dialog.querySelector('input').focus()}
 };
 const dialog=document.createElement('dialog');dialog.className='club-account-dialog';dialog.setAttribute('aria-label','登录读书会');dialog.innerHTML=`<form method="dialog"><button class="club-dialog-close" aria-label="关闭登录">×</button></form><span class="club-overline">YOUR READING SPACE</span><h2>欢迎回来。</h2><p>用一个昵称，开启你的阅读空间。</p><form id="club-demo-login"><label>阅读昵称<input name="nickname" maxlength="20" value="林间读者" autocomplete="nickname" required></label><label>登录身份<select name="role"><option value="reader">读者</option></select></label><label>邮箱（选填）<input name="email" type="email" autocomplete="email" placeholder="reader@example.com"></label><button class="button dark" type="submit">登录并开始阅读</button></form>`;document.body.append(dialog);
 dialog.querySelector('#club-demo-login').addEventListener('submit',e=>{e.preventDefault();const f=e.target;state.update({nickname:f.nickname.value.trim(),email:f.email.value,bio:'读书，读人，也读世界。',city:'上海',interests:['文学','生活'],role:f.role.value});dialog.close();if(false){const configured=read('club-configuration',null);clubPageMotion.navigate(new URL(configured?'index.html':'index.html?setup=1',base))}});

 function refresh(){}
})();
