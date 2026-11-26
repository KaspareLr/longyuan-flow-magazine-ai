/* Shared checkout for the Demo. */
(()=>{
 const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 const methods={
  wechat:{label:'微信支付',app:'微信'},
  alipay:{label:'支付宝支付',app:'支付宝'}
 };
 const assets=new URL('assets/figma-identity/',document.currentScript.src);
 const format=amount=>amount.toLocaleString('zh-CN',{maximumFractionDigits:2})+' DSU';
 let activeDialog;
 function open({title,product,price,issue,success='支付成功',minimum,membership,dsu,onPaid,onDone}){
  if(activeDialog?.open)return;
  const dialog=document.createElement('dialog');
  activeDialog=dialog;
  const qr=Boolean(membership||minimum);
  const compact=qr||Boolean(dsu);
  dialog.className=compact?'qikan-checkout qikan-membership-checkout':'qikan-checkout';
  dialog.setAttribute('aria-labelledby','qikan-checkout-title');
  let amount=price??minimum;
  let paid=false, processing=false, expires=0, timer;
  const paymentCode=method=>`<img src="${new URL('https://kasparelr.github.io/agentui-shared-images/objects/17/17e9295410354db62acca0d17bb01af04b3184d4d7c04e1167d4a3a49152df18.png',assets)}" alt="${method.label}二维码">`;
  dialog.innerHTML=`
   <div class="mh-dialog-head"><h2 id="qikan-checkout-title">${escape(membership?product:title)}</h2>
    <form method="dialog"><button aria-label="关闭支付"><img src="${new URL(compact?'../auth/close.svg':'checkout-close.svg',assets)}" alt=""></button></form>
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
    ${minimum?`<fieldset class="mh-recharge-options">
      <legend>选择额度</legend>
      <div class="mh-recharge-presets">
        ${[minimum,minimum*2,minimum*5].map((value,index)=>`<label><input type="radio" name="rechargeTier" value="${value}" ${index===0?'checked':''}><span>${format(value)}</span></label>`).join('')}
        <label><input type="radio" name="rechargeTier" value="custom"><span>其他</span></label>
      </div>
    </fieldset>
    <label class="mh-payment-amount" hidden>充值金额
      <span><input type="number" name="amount" required disabled min="${minimum}" max="1000000" step="1" value="${minimum}" inputmode="numeric"> DSU</span>
    </label>`:''}
    ${dsu?`<div class="mh-dsu-payment">
      <div><strong>DSU 支付</strong><span>可用 <b data-publication-balance></b></span></div>
      <p class="mh-dsu-shortfall" data-publication-shortfall hidden></p>
      <div class="mh-dsu-recovery" data-publication-recovery hidden>
       <button type="button" class="dsu-button dsu-primary" data-publication-recharge>充值 DSU</button>
       <a class="dsu-button" href="${escape(dsu.membershipURL)}">开通会员</a>
      </div>
    </div>`:qr?`<fieldset class="mh-payment-tabs" aria-label="选择支付方式">
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
      <span class="mh-payment-code">${paymentCode(method)}</span>
     </label>`).join('')}
    </fieldset>`}
    <p role="alert" data-payment-error hidden></p>
    ${qr?'':`<div class="dsu-dialog-actions mh-payment-actions"><button class="qikan-checkout-button is-primary" type="submit">${dsu?'确认购买':'确定'}</button></div>`}
   </form>
   <section data-payment-step="success" hidden>
    ${compact?`<img class="mh-success-art" src="${new URL('https://kasparelr.github.io/agentui-shared-images/objects/27/2719458acc3afe6901c276fab1b6489143424c43bcab2d29e21c3629c128b829.jpg',assets)}" width="160" height="160" alt="">`:
    '<div class="mh-payment-success" aria-hidden="true">✓</div>'}
    <h3 tabindex="-1">${escape(success)}</h3>
    <p data-payment-receipt>${compact?'<span data-paid-provider></span><strong data-paid-amount></strong>':''}</p>
    ${compact?'':'<div class="dsu-dialog-actions mh-payment-actions"><button type="button" class="qikan-checkout-button is-primary" data-payment-action="done">完成</button></div>'}
   </section>`;
  const form=dialog.querySelector('[data-payment-step=choose]');
  const total=dialog.querySelector('[data-order-total]');
  const error=dialog.querySelector('[data-payment-error]');
  const payButton=form.querySelector('[type=submit],.mh-payment-actions button');
  const amountField=form.elements.amount;
  const orderAmount=()=>minimum?(amountField.disabled?Number(form.elements.rechargeTier.value):amountField.valueAsNumber):price;
  const validAmount=()=>!amountField||amountField.disabled||amountField.validity.valid;
  function updateCountdown(){
   const seconds=Math.max(0,Math.ceil((expires-Date.now())/1000));
   const valid=validAmount();
   dialog.querySelector('[data-qr-status]').textContent=!valid?`请输入至少 ${minimum} DSU 的整数金额，`:seconds?`${seconds} 秒后二维码失效，`:'二维码已失效，';
   payButton.classList.toggle('is-expired',!seconds||!valid);
   payButton.disabled=processing||!seconds||!valid;
  }
  if(qr){
   const refresh=()=>{
    expires=Date.now()+25000;
    payButton.innerHTML=paymentCode(methods[form.elements.provider.value]);
    updateCountdown();
   };
   form.elements.provider.forEach(input=>input.addEventListener('change',refresh));
   dialog.querySelector('[data-qr-refresh]').addEventListener('click',refresh);
   if(minimum){
    const updateAmount=()=>{
     total.textContent=validAmount()?format(orderAmount()):'—';
     refresh();
    };
    form.elements.rechargeTier.forEach(input=>input.addEventListener('change',()=>{
     const custom=form.elements.rechargeTier.value==='custom';
     amountField.disabled=!custom;
     amountField.closest('label').hidden=!custom;
     updateAmount();
     if(custom)amountField.focus();
    }));
    amountField.addEventListener('input',updateAmount);
   }
   refresh();
   timer=setInterval(updateCountdown,250);
  }
  function updateBalance(){
   const available=dsu.available(),shortfall=Math.max(0,price-available);
   dialog.querySelector('[data-publication-balance]').textContent=format(available);
   const note=dialog.querySelector('[data-publication-shortfall]');
   note.hidden=shortfall===0;
   note.textContent=shortfall?`可用 DSU 不足，还差 ${format(shortfall)}。`:'';
   dialog.querySelector('[data-publication-recovery]').hidden=shortfall===0;
   payButton.hidden=shortfall>0;
  }
  let rechargeRequested=false;
  if(dsu){
   updateBalance();
   dialog.querySelector('[data-publication-recharge]').addEventListener('click',()=>{
    rechargeRequested=true;
    dialog.close();
   });
   dialog.querySelector('[data-publication-recovery] a').addEventListener('click',()=>dialog.close());
  }
  function show(step){
   for(const section of dialog.querySelectorAll('[data-payment-step]')){
    section.hidden=section.dataset.paymentStep!==step;
    if(!section.hidden)(section.querySelector('h3')||section.querySelector(':checked'))?.focus();
   }
  }
  form.addEventListener('submit',async event=>{
   event.preventDefault();
   if(paid||processing||(qr&&(Date.now()>=expires||!validAmount())))return;
   amount=orderAmount();
   const provider=dsu?{label:'DSU 支付'}:methods[form.elements.provider.value];
   error.hidden=true;
   const controls=[...dialog.querySelectorAll('button')];
   processing=true;
   controls.forEach(control=>{control.disabled=true;});
   try{
    await onPaid?.(amount);
    paid=true;
    if(compact){
     dialog.append(dialog.querySelector('.mh-order-summary'));
     dialog.classList.add('has-payment-success');
     dialog.querySelector('[data-paid-provider]').textContent=provider.label;
     dialog.querySelector('[data-paid-amount]').textContent=format(amount);
     dialog.querySelector('.mh-dialog-head button').setAttribute('aria-label','关闭支付结果');
    }else dialog.querySelector('[data-payment-receipt]').textContent=provider.label+' · '+format(amount);
   }catch(err){
    error.textContent=err.message||'订单提交失败，请重试。';
    error.hidden=false;
   }finally{
    processing=false;
    controls.forEach(control=>{control.disabled=false;});
   }
   if(paid){clearInterval(timer);show('success');}
   else if(qr)updateCountdown();
   else if(dsu)updateBalance();
  });
  dialog.querySelector('[data-payment-action=done]')?.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('cancel',event=>{if(processing)event.preventDefault();});
  dialog.addEventListener('close',()=>{
   clearInterval(timer);
   dialog.remove();
   activeDialog=null;
   if(paid)onDone?.();
   if(rechargeRequested)dsu.recharge();
  },{once:true});
  document.body.append(dialog);
  dialog.showModal();
 }
 function mount(trigger,options){
  trigger.addEventListener('click',()=>open(options));
 }
 window.magazineCheckout={mount,open};
})();
