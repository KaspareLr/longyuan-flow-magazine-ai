(() => {
 const base = new URL('.', document.currentScript.src);
 const brand=`<img class="qikan-auth-brand" src="${new URL('assets/longyuan-home/longyuan-logo-v2.png',base)}" alt="龙源期刊网" width="98" height="32">`;
 const storageKey = 'qikan-auth-accounts:v1';
 const copy = {
  login: {title:'登录期刊网', description:'继续你的阅读。', submit:'登录'},
  register: {title:'注册期刊网账号', description:'开始使用你的阅读空间。', submit:'注册并继续'},
  reset: {title:'重设密码', description:'设置新的登录密码。', submit:'保存新密码'}
 };
 const passwordField = (name, label, autocomplete) => `<label>${label}
   <span class="qikan-auth-password"><input name="${name}" type="password" autocomplete="${autocomplete}" maxlength="128">
   <button type="button" data-auth-password aria-label="显示${label}" aria-pressed="false">显示</button></span></label>`;
 const dialog = document.createElement('dialog');
 dialog.className = 'club-account-dialog qikan-auth-dialog';
 dialog.setAttribute('aria-labelledby','qikan-auth-title');
 dialog.innerHTML = '<button type="button" class="qikan-auth-close" aria-label="关闭账号弹窗">×</button><div data-auth-content></div>';
 document.body.append(dialog);
 const content = dialog.querySelector('[data-auth-content]');
 const close = dialog.querySelector('.qikan-auth-close');
 let session, mode, email;

 function findProfile(identity){
  try{
   const accounts=JSON.parse(localStorage.getItem(storageKey)||'[]');
   return accounts.find(item=>item.email===identity)?.profile;
  }catch{return undefined;}
 }
 function rememberProfile(profile){
  try{
   const accounts=JSON.parse(localStorage.getItem(storageKey)||'[]');
   const identity=profile.dsuId;
   localStorage.setItem(storageKey,JSON.stringify([...accounts.filter(item=>item.email!==identity),{email:identity,profile}]));
  }catch{}
 }
 function render(){
  const text=copy[mode];
  const registering=mode==='register',resetting=mode==='reset';
  content.innerHTML=`${brand}<h2 id="qikan-auth-title">${text.title}</h2><p class="qikan-auth-description">${text.description}</p>
   ${resetting?'':`<div class="qikan-auth-tabs" role="group" aria-label="账号操作">
    <button type="button" data-auth-mode="login" aria-pressed="${mode==='login'}">登录</button>
    <button type="button" data-auth-mode="register" aria-pressed="${registering}">注册</button></div>`}
   <form class="qikan-auth-form" novalidate>
    ${registering?'<label>昵称<input name="nickname" autocomplete="nickname" maxlength="20" placeholder="请输入昵称"></label>':''}
    <label>邮箱<input name="email" type="email" autocomplete="username" maxlength="254" placeholder="请输入邮箱"></label>
    <div class="qikan-auth-password-group">
     ${passwordField('password',resetting?'新密码':'密码',mode==='login'?'current-password':'new-password')}
     ${mode==='login'?'<button class="qikan-auth-text-action" type="button" data-auth-mode="reset">忘记密码？</button>':''}
    </div>
    ${mode!=='login'?passwordField('confirm','确认密码','new-password'):''}
    <button class="qikan-auth-submit" type="submit">${text.submit}</button>
   </form>
   ${resetting?'<button class="qikan-auth-text-action qikan-auth-return" type="button" data-auth-mode="login">返回登录</button>':''}`;
  const form=content.querySelector('form');
  form.elements.email.value=email;
  form.addEventListener('submit',submit);
  form.elements.email.focus();
 }
 function submit(event){
  event.preventDefault();
  const form=event.currentTarget;
  email=form.elements.email.value.trim().toLowerCase();
  if(mode==='reset'){
   mode='login';render();return;
  }
  const identity=email||'林间读者';
  const previous=findProfile(identity);
  const nickname=form.elements.nickname?.value.trim()||previous?.nickname||email.split('@')[0].slice(0,20)||'林间读者';
  session.update({...previous,nickname,email,dsuId:identity,role:'reader'});
  dialog.close();
 }
 content.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if(button?.hasAttribute('data-auth-password')){
   const input=button.previousElementSibling,show=input.type==='password';
   input.type=show?'text':'password';button.textContent=show?'隐藏':'显示';
   button.setAttribute('aria-pressed',String(show));
   button.setAttribute('aria-label',(show?'隐藏':'显示')+input.closest('label').firstChild.textContent.trim());
  }
  if(button?.dataset.authMode){
   email=content.querySelector('[name=email]')?.value||email;
   mode=button.dataset.authMode;render();
  }
 });
 close.addEventListener('click',()=>dialog.close());
 window.addEventListener('club-session-change',()=>{
  const profile=window.clubSession?.profile;
  if(profile?.dsuId)rememberProfile(profile);
 });
 window.qikanAuth={
  open(accountSession){
   if(dialog.open)return;
   session=accountSession;mode='login';email='';
   dialog.showModal();render();
  }
 };
})();
