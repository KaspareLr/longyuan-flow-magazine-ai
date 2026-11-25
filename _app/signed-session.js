/* Shared local-only account state across the independent demo. */
(()=>{
 const base=new URL('.',document.currentScript.src);window.clubRootURL=base.href;
 const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem('club-demo:'+key))??fallback}catch{return fallback}};
 const write=(key,value)=>{try{localStorage.setItem('club-demo:'+key,JSON.stringify(value))}catch{}};
 const state=window.clubSession={get profile(){return qikanAccountAvatar(read('profile',null),read,write)},get membership(){return read('membership',null)},read,write,
  update(profile){profile={...profile,dsuId:profile.dsuId||(profile.email?.trim().toLowerCase()||profile.nickname.trim().toLowerCase()),avatar:profile.avatar};profile=qikanAccountAvatar(profile,read,write);write('profile',profile);try{localStorage.setItem('club-demo:nickname',profile.nickname)}catch{};refresh();window.dispatchEvent(new Event('club-session-change'))},
  logout(){write('profile',null);try{localStorage.removeItem('club-demo:nickname')}catch{};refresh();window.dispatchEvent(new Event('club-session-change'))},
  member(plan){write('membership',{...plan,expires:'2027-10-15',started:'2026-10-15'});window.dispatchEvent(new Event('club-session-change'))},
  login(){window.qikanAuth.open(state)}
 };

 function refresh(){}
})();
