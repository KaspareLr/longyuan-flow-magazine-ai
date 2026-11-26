/* Shared checkout. The two codes contain only provider-specific test references. */
(()=>{
 const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 const methods={
  wechat:{label:'微信支付',app:'微信',color:'#167a48',path:'M6 6h7v1h-7zM16 6h3v1h-3zM20 6h3v1h-3zM24 6h7v1h-7zM6 7h1v1h-1zM12 7h1v1h-1zM16 7h1v1h-1zM18 7h1v1h-1zM24 7h1v1h-1zM30 7h1v1h-1zM6 8h1v1h-1zM8 8h3v1h-3zM12 8h1v1h-1zM15 8h4v1h-4zM21 8h2v1h-2zM24 8h1v1h-1zM26 8h3v1h-3zM30 8h1v1h-1zM6 9h1v1h-1zM8 9h3v1h-3zM12 9h1v1h-1zM15 9h1v1h-1zM17 9h3v1h-3zM22 9h1v1h-1zM24 9h1v1h-1zM26 9h3v1h-3zM30 9h1v1h-1zM6 10h1v1h-1zM8 10h3v1h-3zM12 10h1v1h-1zM15 10h2v1h-2zM20 10h2v1h-2zM24 10h1v1h-1zM26 10h3v1h-3zM30 10h1v1h-1zM6 11h1v1h-1zM12 11h1v1h-1zM14 11h1v1h-1zM16 11h2v1h-2zM21 11h1v1h-1zM24 11h1v1h-1zM30 11h1v1h-1zM6 12h7v1h-7zM14 12h1v1h-1zM16 12h1v1h-1zM18 12h1v1h-1zM20 12h1v1h-1zM22 12h1v1h-1zM24 12h7v1h-7zM16 13h4v1h-4zM21 13h2v1h-2zM6 14h1v1h-1zM9 14h1v1h-1zM11 14h2v1h-2zM14 14h2v1h-2zM18 14h1v1h-1zM20 14h2v1h-2zM23 14h1v1h-1zM25 14h1v1h-1zM7 15h1v1h-1zM9 15h1v1h-1zM13 15h1v1h-1zM16 15h1v1h-1zM19 15h1v1h-1zM21 15h1v1h-1zM24 15h2v1h-2zM28 15h1v1h-1zM6 16h3v1h-3zM12 16h1v1h-1zM14 16h3v1h-3zM18 16h4v1h-4zM24 16h1v1h-1zM27 16h1v1h-1zM30 16h1v1h-1zM7 17h4v1h-4zM13 17h2v1h-2zM17 17h1v1h-1zM19 17h1v1h-1zM21 17h1v1h-1zM23 17h1v1h-1zM25 17h3v1h-3zM29 17h2v1h-2zM8 18h1v1h-1zM12 18h1v1h-1zM14 18h2v1h-2zM17 18h1v1h-1zM20 18h1v1h-1zM22 18h5v1h-5zM28 18h3v1h-3zM8 19h1v1h-1zM10 19h1v1h-1zM15 19h3v1h-3zM19 19h2v1h-2zM22 19h2v1h-2zM26 19h2v1h-2zM29 19h1v1h-1zM6 20h1v1h-1zM9 20h2v1h-2zM12 20h2v1h-2zM15 20h3v1h-3zM19 20h5v1h-5zM25 20h1v1h-1zM27 20h1v1h-1zM30 20h1v1h-1zM7 21h1v1h-1zM9 21h2v1h-2zM16 21h2v1h-2zM21 21h1v1h-1zM23 21h1v1h-1zM26 21h1v1h-1zM28 21h3v1h-3zM6 22h4v1h-4zM12 22h3v1h-3zM18 22h2v1h-2zM21 22h6v1h-6zM28 22h1v1h-1zM14 23h1v1h-1zM18 23h5v1h-5zM26 23h3v1h-3zM6 24h7v1h-7zM15 24h4v1h-4zM20 24h3v1h-3zM24 24h1v1h-1zM26 24h4v1h-4zM6 25h1v1h-1zM12 25h1v1h-1zM14 25h2v1h-2zM18 25h1v1h-1zM20 25h1v1h-1zM22 25h1v1h-1zM26 25h4v1h-4zM6 26h1v1h-1zM8 26h3v1h-3zM12 26h1v1h-1zM15 26h2v1h-2zM21 26h7v1h-7zM6 27h1v1h-1zM8 27h3v1h-3zM12 27h1v1h-1zM14 27h4v1h-4zM20 27h2v1h-2zM24 27h2v1h-2zM28 27h2v1h-2zM6 28h1v1h-1zM8 28h3v1h-3zM12 28h1v1h-1zM16 28h1v1h-1zM21 28h2v1h-2zM27 28h1v1h-1zM30 28h1v1h-1zM6 29h1v1h-1zM12 29h1v1h-1zM15 29h1v1h-1zM20 29h1v1h-1zM22 29h2v1h-2zM26 29h2v1h-2zM30 29h1v1h-1zM6 30h7v1h-7zM14 30h3v1h-3zM18 30h1v1h-1zM21 30h1v1h-1zM23 30h1v1h-1zM28 30h1v1h-1zM30 30h1v1h-1z'},
  alipay:{label:'支付宝支付',app:'支付宝',color:'#0869bd',path:'M6 6h7v1h-7zM15 6h1v1h-1zM18 6h1v1h-1zM21 6h2v1h-2zM24 6h7v1h-7zM6 7h1v1h-1zM12 7h1v1h-1zM16 7h3v1h-3zM21 7h1v1h-1zM24 7h1v1h-1zM30 7h1v1h-1zM6 8h1v1h-1zM8 8h3v1h-3zM12 8h1v1h-1zM14 8h1v1h-1zM21 8h2v1h-2zM24 8h1v1h-1zM26 8h3v1h-3zM30 8h1v1h-1zM6 9h1v1h-1zM8 9h3v1h-3zM12 9h1v1h-1zM14 9h2v1h-2zM17 9h1v1h-1zM22 9h1v1h-1zM24 9h1v1h-1zM26 9h3v1h-3zM30 9h1v1h-1zM6 10h1v1h-1zM8 10h3v1h-3zM12 10h1v1h-1zM14 10h2v1h-2zM19 10h1v1h-1zM22 10h1v1h-1zM24 10h1v1h-1zM26 10h3v1h-3zM30 10h1v1h-1zM6 11h1v1h-1zM12 11h1v1h-1zM14 11h9v1h-9zM24 11h1v1h-1zM30 11h1v1h-1zM6 12h7v1h-7zM14 12h1v1h-1zM16 12h1v1h-1zM18 12h1v1h-1zM20 12h1v1h-1zM22 12h1v1h-1zM24 12h7v1h-7zM14 13h1v1h-1zM16 13h1v1h-1zM18 13h2v1h-2zM6 14h1v1h-1zM8 14h5v1h-5zM15 14h1v1h-1zM20 14h2v1h-2zM24 14h5v1h-5zM8 15h4v1h-4zM13 15h2v1h-2zM16 15h3v1h-3zM22 15h2v1h-2zM28 15h3v1h-3zM9 16h1v1h-1zM12 16h2v1h-2zM15 16h2v1h-2zM18 16h1v1h-1zM24 16h3v1h-3zM30 16h1v1h-1zM7 17h3v1h-3zM11 17h1v1h-1zM14 17h1v1h-1zM16 17h1v1h-1zM18 17h1v1h-1zM20 17h2v1h-2zM23 17h2v1h-2zM27 17h1v1h-1zM29 17h1v1h-1zM6 18h1v1h-1zM11 18h3v1h-3zM21 18h5v1h-5zM27 18h1v1h-1zM29 18h2v1h-2zM6 19h1v1h-1zM9 19h1v1h-1zM15 19h1v1h-1zM18 19h3v1h-3zM22 19h1v1h-1zM24 19h1v1h-1zM26 19h3v1h-3zM30 19h1v1h-1zM6 20h1v1h-1zM12 20h1v1h-1zM14 20h1v1h-1zM19 20h2v1h-2zM25 20h1v1h-1zM28 20h3v1h-3zM6 21h1v1h-1zM8 21h2v1h-2zM13 21h4v1h-4zM18 21h2v1h-2zM21 21h2v1h-2zM24 21h3v1h-3zM28 21h1v1h-1zM6 22h1v1h-1zM8 22h5v1h-5zM14 22h1v1h-1zM18 22h1v1h-1zM20 22h1v1h-1zM22 22h7v1h-7zM14 23h3v1h-3zM22 23h1v1h-1zM26 23h3v1h-3zM30 23h1v1h-1zM6 24h7v1h-7zM17 24h2v1h-2zM22 24h1v1h-1zM24 24h1v1h-1zM26 24h1v1h-1zM29 24h1v1h-1zM6 25h1v1h-1zM12 25h1v1h-1zM14 25h2v1h-2zM17 25h1v1h-1zM20 25h3v1h-3zM26 25h2v1h-2zM30 25h1v1h-1zM6 26h1v1h-1zM8 26h3v1h-3zM12 26h1v1h-1zM14 26h1v1h-1zM17 26h1v1h-1zM22 26h5v1h-5zM28 26h2v1h-2zM6 27h1v1h-1zM8 27h3v1h-3zM12 27h1v1h-1zM14 27h3v1h-3zM18 27h4v1h-4zM23 27h1v1h-1zM28 27h1v1h-1zM30 27h1v1h-1zM6 28h1v1h-1zM8 28h3v1h-3zM12 28h1v1h-1zM14 28h3v1h-3zM19 28h2v1h-2zM22 28h1v1h-1zM25 28h2v1h-2zM30 28h1v1h-1zM6 29h1v1h-1zM12 29h1v1h-1zM15 29h1v1h-1zM18 29h2v1h-2zM22 29h4v1h-4zM27 29h1v1h-1zM6 30h7v1h-7zM14 30h3v1h-3zM18 30h1v1h-1zM20 30h1v1h-1zM22 30h2v1h-2zM26 30h2v1h-2zM30 30h1v1h-1z'}
 };
 const assets=new URL('assets/figma-identity/',document.currentScript.src);
 const format=amount=>amount.toLocaleString('zh-CN',{maximumFractionDigits:2})+' DSU';
 let activeDialog;
 function open({title,product,price,issue,success='支付成功',minimum,membership,onPaid,onDone}){
  if(activeDialog?.open)return;
  const dialog=document.createElement('dialog');
  activeDialog=dialog;
  dialog.className=membership?'qikan-checkout qikan-membership-checkout':'qikan-checkout';
  dialog.setAttribute('aria-labelledby','qikan-checkout-title');
  let amount=price??minimum;
  let paid=false, processing=false, expires=0, timer;
  const paymentCode=method=>`<svg viewBox="2 2 33 33" role="img" aria-label="${method.label}二维码" shape-rendering="crispEdges"><path fill="#000" d="${method.path}"/></svg>`;
  dialog.innerHTML=`
   <div class="mh-dialog-head"><h2 id="qikan-checkout-title">${escape(membership?product:title)}</h2>
    <form method="dialog"><button aria-label="关闭支付"><img src="${new URL(membership?'../auth/close.svg':'checkout-close.svg',assets)}" alt=""></button></form>
   </div>
   <dl class="mh-order-summary">
    ${membership?`<div><dt>会员额度</dt><dd>${format(membership.quota)}</dd></div>
    <div><dt>有效期</dt><dd>${escape(issue)}</dd></div>
    <div><dt>续费方式</dt><dd>${escape(membership.renewal)}</dd></div>`:
    `<div><dt>订单</dt><dd>${escape(product)}</dd></div>
    ${issue?`<div><dt>有效范围</dt><dd>${escape(issue)}</dd></div>`:''}`}
    <div><dt>应付金额</dt><dd><strong data-order-total>${format(amount)}</strong></dd></div>
   </dl>
   <form data-payment-step="choose">
    ${minimum?`<label class="mh-payment-amount">充值金额
      <span><input type="number" name="amount" required min="${minimum}" max="1000000" step="1" value="${minimum}" inputmode="numeric"> DSU</span>
     </label>`:''}
    ${membership?`<fieldset class="mh-payment-tabs" aria-label="选择支付方式">
      ${Object.entries(methods).map(([key,method])=>`<label>
        <input type="radio" name="provider" value="${key}" aria-label="${method.label}" ${key==='alipay'?'checked':''}>
        <span>${method.app}</span>
      </label>`).join('')}
    </fieldset>
    <button type="submit" class="mh-membership-code" data-membership-code aria-label="扫码支付"></button>
    <p class="mh-qr-status"><span data-qr-status></span><button type="button" data-qr-refresh>刷新</button></p>`:
    `<fieldset class="mh-payment-methods" aria-label="选择支付方式">
     ${Object.entries(methods).map(([key,method])=>`<label>
      <span class="mh-payment-radio"><input type="radio" name="provider" value="${key}" aria-label="${method.label}" ${key==='wechat'?'checked':''}>
       <img src="${new URL('checkout-selected.svg',assets)}" alt=""></span>
      <span class="mh-payment-provider"><strong>${method.label}</strong><small>请使用${method.app}扫一扫</small></span>
      <span class="mh-payment-code"><svg viewBox="0 0 37 37" role="img" aria-label="${method.label}二维码" shape-rendering="crispEdges" style="color:${method.color}"><path fill="currentColor" d="${method.path}"/></svg></span>
     </label>`).join('')}
    </fieldset>`}
    <p role="alert" data-payment-error hidden></p>
    ${membership?'':'<div class="dsu-dialog-actions mh-payment-actions"><button class="qikan-checkout-button is-primary">确定</button></div>'}
   </form>
   <section data-payment-step="success" hidden>
    <div class="mh-payment-success" aria-hidden="true">✓</div>
    <h3 tabindex="-1">${escape(success)}</h3><p data-payment-receipt></p>
    <div class="dsu-dialog-actions mh-payment-actions"><button type="button" class="qikan-checkout-button is-primary" data-payment-action="done">完成</button></div>
   </section>`;
  const form=dialog.querySelector('[data-payment-step=choose]');
  const total=dialog.querySelector('[data-order-total]');
  const error=dialog.querySelector('[data-payment-error]');
  const payButton=form.querySelector('[type=submit],.mh-payment-actions button');
  function updateCountdown(){
   const seconds=Math.max(0,Math.ceil((expires-Date.now())/1000));
   dialog.querySelector('[data-qr-status]').textContent=seconds?`${seconds} 秒后二维码失效，`:'二维码已失效，';
   payButton.classList.toggle('is-expired',!seconds);
   payButton.disabled=processing||!seconds;
  }
  if(membership){
   const refresh=()=>{
    expires=Date.now()+25000;
    payButton.innerHTML=paymentCode(methods[form.elements.provider.value]);
    updateCountdown();
   };
   form.elements.provider.forEach(input=>input.addEventListener('change',refresh));
   dialog.querySelector('[data-qr-refresh]').addEventListener('click',refresh);
   refresh();
   timer=setInterval(updateCountdown,250);
  }
  function show(step){
   for(const section of dialog.querySelectorAll('[data-payment-step]')){
    section.hidden=section.dataset.paymentStep!==step;
    if(!section.hidden)(section.querySelector('h3')||section.querySelector(':checked'))?.focus();
   }
  }
  form.elements.amount?.addEventListener('input',event=>{
   const field=event.currentTarget;
   total.textContent=field.validity.valid?format(field.valueAsNumber):'—';
  });
  form.addEventListener('submit',async event=>{
   event.preventDefault();
   if(paid||processing||(membership&&Date.now()>=expires))return;
   amount=form.elements.amount?.valueAsNumber??price;
   const provider=methods[form.elements.provider.value];
   error.hidden=true;
   const controls=[...dialog.querySelectorAll('button')];
   processing=true;
   controls.forEach(control=>{control.disabled=true;});
   try{
    await onPaid?.(amount);
    paid=true;
    dialog.querySelector('[data-payment-receipt]').textContent=provider.label+' · '+format(amount);
   }catch(err){
    error.textContent=err.message||'订单提交失败，请重试。';
    error.hidden=false;
   }finally{
    processing=false;
    controls.forEach(control=>{control.disabled=false;});
   }
   if(paid){clearInterval(timer);show('success');}
   else if(membership)updateCountdown();
  });
  dialog.querySelector('[data-payment-action=done]').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('cancel',event=>{if(processing)event.preventDefault();});
  dialog.addEventListener('close',()=>{
   clearInterval(timer);
   dialog.remove();
   activeDialog=null;
   if(paid)onDone?.();
  },{once:true});
  document.body.append(dialog);
  dialog.showModal();
 }
 function mount(trigger,options){
  trigger.addEventListener('click',()=>open(options));
 }
 window.magazineCheckout={mount,open};
})();
