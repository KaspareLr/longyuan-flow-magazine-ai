(() => {
 const base = new URL('.', document.currentScript.src);
 const brand=`<img class="qikan-auth-brand" src="${new URL('assets/longyuan-home/longyuan-logo-v2.png',base)}" alt="龙源期刊网" width="98" height="32">`;
 const wechatQr = `<img class="qikan-auth-qr" src="${new URL('https://kasparelr.github.io/agentui-shared-images/objects/17/17e9295410354db62acca0d17bb01af04b3184d4d7c04e1167d4a3a49152df18.png',base)}" alt="微信登录二维码">`;
 const storageKey = 'qikan-auth-accounts:v1';
 const copy = {
  login: {title:'登录', description:'继续你的阅读', submit:'立即登录'},
  register: {title:'注册', description:'开始使用你的阅读空间', submit:'立即注册'},
  reset: {title:'重设密码', description:'设置新的登录密码', submit:'保存新密码'},
  wechat: {title:'微信登录', description:'使用微信扫一扫登录', submit:'继续登录'},
  qq: {title:'QQ 登录', description:'使用 QQ 登录龙源期刊网', submit:'继续登录'}
 };
 const authAsset = name => new URL('assets/auth/'+name,base);
 const passwordField = (name, label, autocomplete, placeholder = label) => `<label><span class="qikan-auth-field-label">${label}</span>
   <span class="qikan-auth-password"><input name="${name}" type="password" autocomplete="${autocomplete}" maxlength="128" placeholder="${placeholder}">
   <button type="button" data-auth-password aria-label="显示${label}" aria-pressed="false"><img src="${authAsset('password-visibility.svg')}" alt=""></button></span></label>`;
 const dialog = document.createElement('dialog');
 dialog.className = 'club-account-dialog qikan-auth-dialog qikan-auth-styled';
 dialog.setAttribute('aria-labelledby','qikan-auth-title');
 dialog.innerHTML = `<button type="button" class="qikan-auth-close" aria-label="关闭账号弹窗"><img src="${authAsset('close.svg')}" alt=""></button><div data-auth-content></div>`;
 document.body.append(dialog);
 const content = dialog.querySelector('[data-auth-content]');
 const close = dialog.querySelector('.qikan-auth-close');
 let session, mode, email, phone;
 const scannedFromPhone = new URLSearchParams(location.search).has('wechat-login');
 const returnToLogin = '<button class="qikan-auth-text-action qikan-auth-return" type="button" data-auth-mode="login">返回登录</button>';


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
  const registering=mode==='register';
  const loggingIn=mode==='login';
  const resetting=mode==='reset';
  const social=mode==='wechat'||mode==='qq';
  const text=copy[mode];
  dialog.classList.toggle('qikan-auth-register',registering);
  dialog.classList.toggle('qikan-auth-login',loggingIn);
  dialog.classList.toggle('qikan-auth-reset',resetting);
  const description=mode==='wechat'&&scannedFromPhone?'使用微信登录龙源期刊网':text.description;
  const heading=`${brand}<h2 id="qikan-auth-title" tabindex="-1">${text.title}</h2><p class="qikan-auth-description">${description}</p>`;
  if(social){
   const scan=mode==='wechat'&&!scannedFromPhone;
   content.innerHTML=`${heading}<div class="qikan-auth-provider-flow">
    ${scan?wechatQr:`<span class="qikan-auth-provider-mark"><img src="${authAsset(mode+'.svg')}" alt=""></span>`}
    <button class="qikan-auth-submit" type="button" data-auth-provider="continue">${text.submit}</button>
    ${returnToLogin}
   </div>`;
   content.querySelector('#qikan-auth-title').focus({preventScroll:true});
   return;
  }
  content.innerHTML=`${heading}
   ${resetting?'':`<div class="qikan-auth-tabs" role="group" aria-label="账号操作">
    <button type="button" data-auth-mode="login" aria-pressed="${mode==='login'}">登录</button>
    <button type="button" data-auth-mode="register" aria-pressed="${registering}">注册</button></div>`}
   <form class="qikan-auth-form" novalidate>
    ${registering?`<label><span class="qikan-auth-field-label">手机号</span><input name="phone" type="tel" autocomplete="tel" placeholder="请输入手机号"></label>
     <div class="qikan-auth-code-row">
      <label><span class="qikan-auth-field-label">图形验证码</span><input name="captcha" autocomplete="off" placeholder="图形验证码"></label>
      <button type="button" class="qikan-auth-captcha" data-auth-captcha aria-label="刷新图形验证码，当前为 0323">0323</button>
     </div>
     <div class="qikan-auth-code-row">
      <label><span class="qikan-auth-field-label">验证码</span><input name="sms" inputmode="numeric" autocomplete="one-time-code" placeholder="请输入验证码"></label>
      <button type="button" class="qikan-auth-send" data-auth-sms>发送验证码</button>
     </div>
     <label><span class="qikan-auth-field-label">用户名</span><input name="nickname" autocomplete="nickname" maxlength="20" placeholder="请输入用户名"></label>`:
     `<label><span class="qikan-auth-field-label">${resetting?'邮箱':'手机号或邮箱'}</span><input name="email" type="${resetting?'email':'text'}" autocomplete="username" maxlength="254" placeholder="${resetting?'请输入邮箱':'请输入手机号'}"></label>`}
    <div class="qikan-auth-password-group">
     ${passwordField('password',resetting?'新密码':'密码',mode==='login'?'current-password':'new-password')}
     ${mode==='login'?'<button class="qikan-auth-text-action" type="button" data-auth-mode="reset">忘记密码？</button>':''}
    </div>
    ${mode!=='login'?passwordField('confirm',registering?'重复密码':'确认密码','new-password',registering?'重复密码':'确认新密码'):''}
    ${registering?`<p class="qikan-auth-terms">点击“注册”即表示您同意并愿意遵守 <a href="https://www.qikan.com.cn/userrelative/serviceterms.html" target="_blank" rel="noopener">龙源期刊网注册协议</a> 和 <span>隐私政策</span>。</p>`:''}
    <button class="qikan-auth-submit" type="submit">${text.submit}</button>
   </form>
   ${mode==='login'?`<div class="qikan-auth-other"><p>其他方式登录</p><div class="qikan-auth-providers">
    <button type="button" data-auth-mode="wechat" aria-label="微信登录"><img src="${authAsset('wechat.svg')}" alt=""></button>
    <button type="button" data-auth-mode="qq" aria-label="QQ 登录"><img src="${authAsset('qq.svg')}" alt=""></button>
   </div></div>`:''}
   ${resetting?returnToLogin:''}`;
  const form=content.querySelector('form');
  const accountInput=form.elements.phone||form.elements.email;
  accountInput.value=registering?phone:email;
  form.addEventListener('submit',submit);
  content.querySelector('#qikan-auth-title').focus({preventScroll:true});
 }
 function submit(event){
  event.preventDefault();
  const form=event.currentTarget;
  const account=form.elements.email?.value.trim().toLowerCase()||form.elements.phone?.value.trim()||'';
  if(form.elements.email)email=account;
  if(mode==='reset'){
   mode='login';render();return;
  }
  finishSignIn(account, form.elements.nickname?.value.trim());
 }
 function finishSignIn(account='', username=''){
  const identity=account||'林间读者';
  const previous=findProfile(identity);
  const nickname=username||previous?.nickname||account.split('@')[0].slice(0,20)||'林间读者';
  const contact=mode==='register'||/^\+?[\d -]+$/.test(account)?{phone:account}:{email:account};
  session.update({...previous,...contact,nickname,dsuId:identity,role:'reader'});
  dialog.close();
 }
 content.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if(button?.hasAttribute('data-auth-password')){
   const input=button.previousElementSibling,show=input.type==='password';
   input.type=show?'text':'password';
   button.setAttribute('aria-pressed',String(show));
   button.setAttribute('aria-label',(show?'隐藏':'显示')+input.closest('label').querySelector('.qikan-auth-field-label').textContent);
  }
  if(button?.hasAttribute('data-auth-captcha')){
   const code=1000+(Number(button.textContent)-1000+1+Math.floor(Math.random()*8999))%9000;
   button.textContent=code;
   button.setAttribute('aria-label',`刷新图形验证码，当前为 ${code}`);
  }
  if(button?.hasAttribute('data-auth-sms'))button.textContent='重新发送';
  if(button?.dataset.authProvider)finishSignIn();
  if(button?.dataset.authMode){
   phone=content.querySelector('[name=phone]')?.value??phone;
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
  open(accountSession, initialMode='login'){
   if(dialog.open)return;
   session=accountSession;mode=initialMode;email='';phone='';
   dialog.showModal();render();
  }
 };
 if(scannedFromPhone){
  window.addEventListener('DOMContentLoaded',()=>{
   if(!window.clubSession||window.clubSession.profile)return;
   window.qikanAuth.open(window.clubSession,'wechat');
  },{once:true});
 }
})();
