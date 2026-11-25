/* Membership interactions share the reading demo's local account and benefits state. */
(()=>{
 const session=clubSession,root='#/membership/'+encodeURIComponent('南风窗');
 const dialog=document.createElement('dialog');dialog.className='signed-member-dialog';dialog.setAttribute('aria-label','会员方案');document.body.append(dialog);
 function notice(title,body){dialog.innerHTML=`<form method="dialog"><button class="signed-dialog-close" aria-label="关闭弹窗">×</button></form><h2>${title}</h2>${body}`;dialog.showModal();}
 function refresh(){document.querySelectorAll('.signed-membership-content').forEach(el=>{el.outerHTML=renderSignedMembership(el.dataset.membershipPage==='true',el.dataset.membershipPublication);});}
 function activate(plan){const start=new Date(),end=new Date(start);end.setDate(end.getDate()+plan.durationDays);session.member({label:plan.periodLabel,period:plan.periodCode,price:plan.priceFen/100});session.write('membership',{...session.membership,started:start.toISOString().slice(0,10),expires:end.toISOString().slice(0,10)});dialog.close();refresh();}
 document.addEventListener('click',event=>{
  const button=event.target.closest('.signed-membership-content button,[data-signed-confirm]');if(!button)return;
  if(button.hasAttribute('data-signed-confirm')){activate(window.signedMembershipPrices[Number(button.dataset.signedConfirm)]);return;}
  if(button.hasAttribute('data-plan')){if(!session.profile){session.login();return;}const i=Number(button.dataset.plan),p=window.signedMembershipPrices[i];notice('确认体验'+p.periodLabel+'会员',`<p>你选择了${p.periodLabel}方案 · ${p.priceFen/100} DSU / ${p.durationDays} 天。</p><p>确认后即可开启所选会员权益。</p><button class="button dark" data-signed-confirm="${i}">确认体验开通</button>`);}
  if(button.hasAttribute('data-trial')){if(!session.profile){session.login();return;}if(session.membership){notice('我的会员',`<p>${session.membership.label}会员 · 有效期至 ${session.membership.expires}</p>`);return;}activate({periodLabel:'7 天体验',priceFen:0,durationDays:7,periodCode:'TRIAL'});}
 },true);
 document.addEventListener('submit',event=>{if(!event.target.matches('.signed-membership-content #redeem-form'))return;event.preventDefault();event.stopImmediatePropagation();if(!session.profile){session.login();return;}if(event.target.code.value.trim().toUpperCase()!=='READ2026'){notice('兑换码未匹配','<p>请检查兑换码后重试。</p>');return;}activate({periodLabel:'年度兑换',periodCode:'YEAR',priceFen:0,durationDays:365});},true);
 // The publication's original “become a member” button now opens the shared membership page.
 document.addEventListener('click',event=>{const button=event.target.closest('.oc-publication [data-rd-action="member"]');if(!button)return;event.preventDefault();event.stopImmediatePropagation();location.hash=root;},true);
 window.addEventListener('club-session-change',refresh);
})();
