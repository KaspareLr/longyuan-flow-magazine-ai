(() => {
 const accountButton=document.querySelector('[data-home-login]');
 const session=window.clubSession;
 const refreshAccount=()=>{
  const profile=session.profile;
  accountButton.textContent=profile?'':'登录';
  accountButton.classList.toggle('is-signed-in',!!profile);
  accountButton.setAttribute('aria-label',profile?'我的阅读空间':'登录');
  if(!profile)return;
  const avatar=document.createElement('img');
  avatar.src=profile.avatar;
  avatar.alt='';
  avatar.width=28;
  avatar.height=28;
  avatar.className='club-account-avatar';
  const name=document.createElement('span');
  name.className='club-account-name';
  name.textContent=profile.nickname;
  accountButton.append(avatar,name);
 };
 accountButton.addEventListener('click',()=>{
  if(session.profile)clubPageMotion.navigate('portal.html#/me');
  else session.login();
 });
 window.addEventListener('club-session-change',refreshAccount);
 window.addEventListener('storage',event=>{if(event.key==='club-demo:profile'||event.key===null)refreshAccount();});
 refreshAccount();
 const picker=document.getElementById('home-content-files'),list=document.getElementById('home-attachments');let files=[];
 document.getElementById('home-add-content').addEventListener('click',()=>picker.click());
 function render(){list.replaceChildren();files.forEach((file,index)=>{const chip=document.createElement('div');chip.className='home-file-chip';const name=document.createElement('span');name.textContent=file.name;name.title=file.name;const remove=document.createElement('button');remove.type='button';remove.setAttribute('aria-label','移除 '+file.name);remove.innerHTML='<i class="iconfont icon-Close" aria-hidden="true"></i>';remove.addEventListener('click',()=>{files.splice(index,1);render()});chip.append(name,remove);list.append(chip)});if(files.length){const note=document.createElement('p');note.className='home-attachment-note';note.textContent='文件已选择。';list.append(note)}}
 picker.addEventListener('change',()=>{for(const file of picker.files){if(!files.some(x=>x.name===file.name&&x.size===file.size&&x.lastModified===file.lastModified))files.push(file)}picker.value='';render()});
})();
