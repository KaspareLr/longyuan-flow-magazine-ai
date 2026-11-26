(() => {
 const base = new URL('.', document.currentScript.src);
 const brand=`<img class="qikan-auth-brand" src="${new URL('assets/longyuan-home/longyuan-logo-v2.png',base)}" alt="龙源期刊网" width="98" height="32">`;
 const storageKey = 'qikan-auth-accounts:v1';
 const copy = {
  login: {title:'登录期刊网', description:'使用邮箱登录你的账号。', submit:'登录'},
  register: {title:'注册期刊网账号', description:'填写邮箱、昵称与密码，创建账号。', submit:'注册并继续'},
  reset: {title:'重设密码', description:'输入账号邮箱和注册时保存的恢复码。', submit:'保存新密码'}
 };
 const passwordField = (name, label, autocomplete) => `<label>${label}
   <span class="qikan-auth-password"><input name="${name}" type="password" autocomplete="${autocomplete}" required minlength="8" maxlength="128">
   <button type="button" data-auth-password aria-label="显示${label}" aria-pressed="false">显示</button></span></label>`;
 const dialog = document.createElement('dialog');
 dialog.className = 'club-account-dialog qikan-auth-dialog';
 dialog.setAttribute('aria-labelledby','qikan-auth-title');
 dialog.innerHTML = '<button type="button" class="qikan-auth-close" aria-label="关闭账号弹窗">×</button><div data-auth-content></div>';
 document.body.append(dialog);
 const content = dialog.querySelector('[data-auth-content]');
 const close = dialog.querySelector('.qikan-auth-close');
 let session, mode, email, pending = false;

 function readAccounts(){
  return JSON.parse(localStorage.getItem(storageKey)||'[]');
 }
 function saveAccount(account){
  const accounts=readAccounts().filter(item=>item.email!==account.email);
  localStorage.setItem(storageKey,JSON.stringify([...accounts,account]));
 }
 function randomHex(bytes){
  return Array.from(crypto.getRandomValues(new Uint8Array(bytes)),value=>value.toString(16).padStart(2,'0')).join('');
 }
 async function digest(secret,salt){
  const encoder=new TextEncoder();
  const key=await crypto.subtle.importKey('raw',encoder.encode(secret),'PBKDF2',false,['deriveBits']);
  const bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:encoder.encode(salt),iterations:210000},key,256);
  return Array.from(new Uint8Array(bits),value=>value.toString(16).padStart(2,'0')).join('');
 }
 async function credentials(password){
  const salt=randomHex(16),recovery=randomHex(12);
  return {recovery,security:{salt,passwordHash:await digest(password,salt),recoveryHash:await digest(recovery,salt)}};
 }
 function renderRecovery(code,profile){
  content.innerHTML=`${brand}<h2 id="qikan-auth-title">保存恢复码</h2>
   <p class="qikan-auth-description">忘记密码时可以用它重设密码。请妥善保存。</p>
   <p class="qikan-auth-recovery"><code>${code.match(/.{4}/g).join('-')}</code></p>
   <button type="button" class="qikan-auth-submit" data-auth-finish>${profile?'开始阅读':'返回登录'}</button>`;
  const finish=content.querySelector('[data-auth-finish]');
  finish.addEventListener('click',()=>{
   if(profile){session.update(profile);dialog.close();}
   else {mode='login';render();}
  });
  finish.focus();
 }
 function render(){
  const text=copy[mode];
  const registering=mode==='register',resetting=mode==='reset';
  content.innerHTML=`${brand}<h2 id="qikan-auth-title">${text.title}</h2><p class="qikan-auth-description">${text.description}</p>
   ${resetting?'':`<div class="qikan-auth-tabs" role="group" aria-label="账号操作">
    <button type="button" data-auth-mode="login" aria-pressed="${mode==='login'}">登录</button>
    <button type="button" data-auth-mode="register" aria-pressed="${registering}">注册</button></div>`}
   <form class="qikan-auth-form">
    ${registering?'<label>昵称<input name="nickname" autocomplete="nickname" required maxlength="20" placeholder="请输入昵称"></label>':''}
    <label>邮箱<input name="email" type="email" autocomplete="username" required maxlength="254" placeholder="请输入邮箱"></label>
    ${resetting?'<label>恢复码<input name="recovery" required maxlength="40" autocomplete="off" spellcheck="false" placeholder="请输入恢复码"></label>':''}
    <div class="qikan-auth-password-group">
     ${passwordField('password',resetting?'新密码':'密码',mode==='login'?'current-password':'new-password')}
     ${mode==='login'?'<button class="qikan-auth-text-action" type="button" data-auth-mode="reset">忘记密码？</button>':''}
    </div>
    ${mode!=='login'?passwordField('confirm','确认密码','new-password'):''}
    <p class="qikan-auth-error" role="alert"></p>
    <button class="qikan-auth-submit" type="submit">${text.submit}</button>
   </form>
   ${resetting?'<button class="qikan-auth-text-action qikan-auth-return" type="button" data-auth-mode="login">返回登录</button>':''}`;
  const form=content.querySelector('form');
  form.elements.email.value=email;
  form.addEventListener('submit',submit);
  form.elements.email.focus();
 }
 async function submit(event){
  event.preventDefault();
  if(pending)return;
  const form=event.currentTarget,error=form.querySelector('[role=alert]');
  email=form.elements.email.value.trim().toLowerCase();
  const password=form.elements.password.value;
  const nickname=form.elements.nickname?.value.trim();
  error.textContent='';
  if(mode==='register'&&!nickname){error.textContent='请输入昵称。';form.elements.nickname.focus();return;}
  if(form.elements.confirm&&form.elements.confirm.value!==password){
   error.textContent='两次输入的密码不一致。';form.elements.confirm.focus();return;
  }
  const submitButton=form.querySelector('[type=submit]');
  pending=true;submitButton.disabled=true;close.disabled=true;
  try{
   const account=readAccounts().find(item=>item.email===email);
   if(mode==='login'){
    if(!account||await digest(password,account.salt)!==account.passwordHash)throw Error('邮箱或密码不正确。');
    session.update(account.profile);dialog.close();return;
   }
   if(mode==='register'&&account)throw Error('该邮箱已注册，请登录。');
   if(mode==='reset'){
    const recovery=form.elements.recovery.value.replace(/[\s-]/g,'').toLowerCase();
    if(!account||await digest(recovery,account.salt)!==account.recoveryHash)throw Error('邮箱或恢复码不正确。');
   }
   const {recovery,security}=await credentials(password);
   if(mode==='register'&&readAccounts().some(item=>item.email===email))throw Error('该邮箱已注册，请登录。');
   const profile=account?.profile||{nickname,email,dsuId:email,role:'reader'};
   saveAccount({email,profile,...security});
   renderRecovery(recovery,mode==='register'?profile:null);
  }catch(err){
   error.textContent=err instanceof TypeError?'暂时无法验证账号，请稍后再试。':err.message;
  }finally{
   pending=false;submitButton.disabled=false;close.disabled=false;
  }
 }
 content.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if(button?.hasAttribute('data-auth-password')){
   const input=button.previousElementSibling,show=input.type==='password';
   input.type=show?'text':'password';button.textContent=show?'隐藏':'显示';
   button.setAttribute('aria-pressed',String(show));
   button.setAttribute('aria-label',(show?'隐藏':'显示')+input.closest('label').firstChild.textContent.trim());
  }
  if(button?.dataset.authMode&&!pending){
   email=content.querySelector('[name=email]')?.value||email;
   mode=button.dataset.authMode;render();
  }
 });
 close.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('cancel',event=>{if(pending)event.preventDefault();});
 window.addEventListener('club-session-change',()=>{
  const profile=window.clubSession?.profile;
  if(!profile?.dsuId)return;
  const account=readAccounts().find(item=>item.email===profile.dsuId);
  if(account)saveAccount({...account,profile});
 });
 window.qikanAuth={
  open(accountSession){
   if(dialog.open)return;
   session=accountSession;mode='login';email='';
   dialog.showModal();render();
  }
 };
})();
