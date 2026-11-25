/* Shared demonstration checkout for a single issue or an annual subscription. */
(()=>{
 const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 function mount(trigger,subscription,{title,product,price,issue,success,onPaid}){
  const amount=price.toFixed(2)+' DSU';
  subscription.classList.add('qikan-checkout');
  subscription.setAttribute('aria-labelledby','mh-subscribe-title');
  subscription.innerHTML=`  <div class="mh-dialog-head">
    <h2 id="mh-subscribe-title">${escape(title)}</h2>
    <form method="dialog"><button type="submit" aria-label="关闭结算"><i class="iconfont icon-Close" aria-hidden="true"></i></button></form>
  </div>
  <dl class="dsu-purchase-breakdown mh-order-summary">
    <div><dt>${escape(product)}</dt><dd><strong>${amount}</strong></dd></div>
    <div><dt>期次</dt><dd>${escape(issue)}</dd></div>
  </dl>
  <p class="mh-payment-notice">支付演示 · 不会产生实际扣款</p>
  <section data-payment-step="choose">
    <fieldset class="mh-payment-methods">
      <legend>选择支付方式</legend>
      <label><input type="radio" name="mh-payment" value="scan" checked><span>微信扫码</span></label>
      <label><input type="radio" name="mh-payment" value="alipay"><span>支付宝</span></label>
      <label><input type="radio" name="mh-payment" value="dsu"><span>DSU 余额</span></label>
    </fieldset>
    <div class="dsu-dialog-actions mh-payment-actions"><button type="button" class="qikan-checkout-button is-primary" data-payment-action="next">继续支付</button></div>
  </section>
  <section data-payment-step="confirm" hidden>
    <h3 tabindex="-1" data-payment-heading></h3>
    <div class="mh-payment-code" data-payment-code hidden><svg viewBox="0 0 45 45" role="img" aria-label="演示二维码，扫码仅显示说明" shape-rendering="crispEdges"><path fill="currentColor" d="M4 4h1v1h-1zM5 4h1v1h-1zM6 4h1v1h-1zM7 4h1v1h-1zM8 4h1v1h-1zM9 4h1v1h-1zM10 4h1v1h-1zM12 4h1v1h-1zM14 4h1v1h-1zM18 4h1v1h-1zM21 4h1v1h-1zM22 4h1v1h-1zM23 4h1v1h-1zM24 4h1v1h-1zM25 4h1v1h-1zM28 4h1v1h-1zM29 4h1v1h-1zM32 4h1v1h-1zM34 4h1v1h-1zM35 4h1v1h-1zM36 4h1v1h-1zM37 4h1v1h-1zM38 4h1v1h-1zM39 4h1v1h-1zM40 4h1v1h-1zM4 5h1v1h-1zM10 5h1v1h-1zM12 5h1v1h-1zM14 5h1v1h-1zM15 5h1v1h-1zM17 5h1v1h-1zM19 5h1v1h-1zM25 5h1v1h-1zM26 5h1v1h-1zM27 5h1v1h-1zM28 5h1v1h-1zM31 5h1v1h-1zM34 5h1v1h-1zM40 5h1v1h-1zM4 6h1v1h-1zM6 6h1v1h-1zM7 6h1v1h-1zM8 6h1v1h-1zM10 6h1v1h-1zM12 6h1v1h-1zM13 6h1v1h-1zM16 6h1v1h-1zM18 6h1v1h-1zM19 6h1v1h-1zM20 6h1v1h-1zM21 6h1v1h-1zM22 6h1v1h-1zM28 6h1v1h-1zM31 6h1v1h-1zM34 6h1v1h-1zM36 6h1v1h-1zM37 6h1v1h-1zM38 6h1v1h-1zM40 6h1v1h-1zM4 7h1v1h-1zM6 7h1v1h-1zM7 7h1v1h-1zM8 7h1v1h-1zM10 7h1v1h-1zM14 7h1v1h-1zM16 7h1v1h-1zM18 7h1v1h-1zM20 7h1v1h-1zM21 7h1v1h-1zM22 7h1v1h-1zM24 7h1v1h-1zM25 7h1v1h-1zM26 7h1v1h-1zM27 7h1v1h-1zM28 7h1v1h-1zM30 7h1v1h-1zM32 7h1v1h-1zM34 7h1v1h-1zM36 7h1v1h-1zM37 7h1v1h-1zM38 7h1v1h-1zM40 7h1v1h-1zM4 8h1v1h-1zM6 8h1v1h-1zM7 8h1v1h-1zM8 8h1v1h-1zM10 8h1v1h-1zM12 8h1v1h-1zM13 8h1v1h-1zM18 8h1v1h-1zM20 8h1v1h-1zM21 8h1v1h-1zM23 8h1v1h-1zM25 8h1v1h-1zM29 8h1v1h-1zM32 8h1v1h-1zM34 8h1v1h-1zM36 8h1v1h-1zM37 8h1v1h-1zM38 8h1v1h-1zM40 8h1v1h-1zM4 9h1v1h-1zM10 9h1v1h-1zM13 9h1v1h-1zM14 9h1v1h-1zM15 9h1v1h-1zM16 9h1v1h-1zM19 9h1v1h-1zM20 9h1v1h-1zM21 9h1v1h-1zM22 9h1v1h-1zM23 9h1v1h-1zM28 9h1v1h-1zM31 9h1v1h-1zM34 9h1v1h-1zM40 9h1v1h-1zM4 10h1v1h-1zM5 10h1v1h-1zM6 10h1v1h-1zM7 10h1v1h-1zM8 10h1v1h-1zM9 10h1v1h-1zM10 10h1v1h-1zM12 10h1v1h-1zM14 10h1v1h-1zM16 10h1v1h-1zM18 10h1v1h-1zM20 10h1v1h-1zM22 10h1v1h-1zM24 10h1v1h-1zM26 10h1v1h-1zM28 10h1v1h-1zM30 10h1v1h-1zM32 10h1v1h-1zM34 10h1v1h-1zM35 10h1v1h-1zM36 10h1v1h-1zM37 10h1v1h-1zM38 10h1v1h-1zM39 10h1v1h-1zM40 10h1v1h-1zM18 11h1v1h-1zM20 11h1v1h-1zM21 11h1v1h-1zM22 11h1v1h-1zM23 11h1v1h-1zM25 11h1v1h-1zM26 11h1v1h-1zM30 11h1v1h-1zM4 12h1v1h-1zM7 12h1v1h-1zM8 12h1v1h-1zM9 12h1v1h-1zM10 12h1v1h-1zM11 12h1v1h-1zM12 12h1v1h-1zM13 12h1v1h-1zM16 12h1v1h-1zM18 12h1v1h-1zM19 12h1v1h-1zM22 12h1v1h-1zM23 12h1v1h-1zM26 12h1v1h-1zM28 12h1v1h-1zM29 12h1v1h-1zM31 12h1v1h-1zM32 12h1v1h-1zM33 12h1v1h-1zM36 12h1v1h-1zM38 12h1v1h-1zM39 12h1v1h-1zM40 12h1v1h-1zM4 13h1v1h-1zM6 13h1v1h-1zM7 13h1v1h-1zM9 13h1v1h-1zM11 13h1v1h-1zM12 13h1v1h-1zM13 13h1v1h-1zM17 13h1v1h-1zM20 13h1v1h-1zM21 13h1v1h-1zM22 13h1v1h-1zM23 13h1v1h-1zM27 13h1v1h-1zM30 13h1v1h-1zM31 13h1v1h-1zM35 13h1v1h-1zM37 13h1v1h-1zM38 13h1v1h-1zM39 13h1v1h-1zM40 13h1v1h-1zM4 14h1v1h-1zM5 14h1v1h-1zM8 14h1v1h-1zM9 14h1v1h-1zM10 14h1v1h-1zM13 14h1v1h-1zM15 14h1v1h-1zM17 14h1v1h-1zM19 14h1v1h-1zM20 14h1v1h-1zM22 14h1v1h-1zM23 14h1v1h-1zM24 14h1v1h-1zM25 14h1v1h-1zM26 14h1v1h-1zM36 14h1v1h-1zM39 14h1v1h-1zM5 15h1v1h-1zM6 15h1v1h-1zM7 15h1v1h-1zM11 15h1v1h-1zM12 15h1v1h-1zM14 15h1v1h-1zM17 15h1v1h-1zM18 15h1v1h-1zM20 15h1v1h-1zM22 15h1v1h-1zM25 15h1v1h-1zM26 15h1v1h-1zM27 15h1v1h-1zM28 15h1v1h-1zM29 15h1v1h-1zM35 15h1v1h-1zM37 15h1v1h-1zM39 15h1v1h-1zM5 16h1v1h-1zM7 16h1v1h-1zM8 16h1v1h-1zM9 16h1v1h-1zM10 16h1v1h-1zM12 16h1v1h-1zM13 16h1v1h-1zM15 16h1v1h-1zM17 16h1v1h-1zM19 16h1v1h-1zM20 16h1v1h-1zM21 16h1v1h-1zM22 16h1v1h-1zM24 16h1v1h-1zM26 16h1v1h-1zM27 16h1v1h-1zM30 16h1v1h-1zM36 16h1v1h-1zM37 16h1v1h-1zM4 17h1v1h-1zM11 17h1v1h-1zM15 17h1v1h-1zM16 17h1v1h-1zM18 17h1v1h-1zM22 17h1v1h-1zM24 17h1v1h-1zM26 17h1v1h-1zM28 17h1v1h-1zM30 17h1v1h-1zM35 17h1v1h-1zM38 17h1v1h-1zM40 17h1v1h-1zM5 18h1v1h-1zM6 18h1v1h-1zM8 18h1v1h-1zM10 18h1v1h-1zM12 18h1v1h-1zM14 18h1v1h-1zM16 18h1v1h-1zM17 18h1v1h-1zM18 18h1v1h-1zM20 18h1v1h-1zM21 18h1v1h-1zM22 18h1v1h-1zM24 18h1v1h-1zM27 18h1v1h-1zM28 18h1v1h-1zM29 18h1v1h-1zM30 18h1v1h-1zM33 18h1v1h-1zM34 18h1v1h-1zM35 18h1v1h-1zM38 18h1v1h-1zM9 19h1v1h-1zM11 19h1v1h-1zM13 19h1v1h-1zM17 19h1v1h-1zM18 19h1v1h-1zM20 19h1v1h-1zM22 19h1v1h-1zM25 19h1v1h-1zM29 19h1v1h-1zM35 19h1v1h-1zM37 19h1v1h-1zM39 19h1v1h-1zM4 20h1v1h-1zM8 20h1v1h-1zM10 20h1v1h-1zM11 20h1v1h-1zM13 20h1v1h-1zM17 20h1v1h-1zM18 20h1v1h-1zM19 20h1v1h-1zM21 20h1v1h-1zM22 20h1v1h-1zM23 20h1v1h-1zM26 20h1v1h-1zM29 20h1v1h-1zM33 20h1v1h-1zM35 20h1v1h-1zM37 20h1v1h-1zM38 20h1v1h-1zM39 20h1v1h-1zM4 21h1v1h-1zM5 21h1v1h-1zM6 21h1v1h-1zM7 21h1v1h-1zM8 21h1v1h-1zM9 21h1v1h-1zM14 21h1v1h-1zM22 21h1v1h-1zM25 21h1v1h-1zM26 21h1v1h-1zM27 21h1v1h-1zM28 21h1v1h-1zM29 21h1v1h-1zM32 21h1v1h-1zM34 21h1v1h-1zM36 21h1v1h-1zM37 21h1v1h-1zM38 21h1v1h-1zM4 22h1v1h-1zM5 22h1v1h-1zM6 22h1v1h-1zM8 22h1v1h-1zM10 22h1v1h-1zM12 22h1v1h-1zM13 22h1v1h-1zM15 22h1v1h-1zM16 22h1v1h-1zM17 22h1v1h-1zM20 22h1v1h-1zM21 22h1v1h-1zM26 22h1v1h-1zM32 22h1v1h-1zM34 22h1v1h-1zM38 22h1v1h-1zM39 22h1v1h-1zM4 23h1v1h-1zM6 23h1v1h-1zM8 23h1v1h-1zM11 23h1v1h-1zM13 23h1v1h-1zM14 23h1v1h-1zM15 23h1v1h-1zM18 23h1v1h-1zM19 23h1v1h-1zM20 23h1v1h-1zM21 23h1v1h-1zM22 23h1v1h-1zM24 23h1v1h-1zM25 23h1v1h-1zM27 23h1v1h-1zM32 23h1v1h-1zM33 23h1v1h-1zM34 23h1v1h-1zM38 23h1v1h-1zM39 23h1v1h-1zM40 23h1v1h-1zM5 24h1v1h-1zM7 24h1v1h-1zM8 24h1v1h-1zM9 24h1v1h-1zM10 24h1v1h-1zM11 24h1v1h-1zM12 24h1v1h-1zM14 24h1v1h-1zM17 24h1v1h-1zM18 24h1v1h-1zM20 24h1v1h-1zM21 24h1v1h-1zM27 24h1v1h-1zM30 24h1v1h-1zM38 24h1v1h-1zM5 25h1v1h-1zM6 25h1v1h-1zM8 25h1v1h-1zM9 25h1v1h-1zM12 25h1v1h-1zM13 25h1v1h-1zM14 25h1v1h-1zM17 25h1v1h-1zM19 25h1v1h-1zM20 25h1v1h-1zM21 25h1v1h-1zM22 25h1v1h-1zM23 25h1v1h-1zM24 25h1v1h-1zM26 25h1v1h-1zM27 25h1v1h-1zM28 25h1v1h-1zM30 25h1v1h-1zM31 25h1v1h-1zM32 25h1v1h-1zM34 25h1v1h-1zM37 25h1v1h-1zM38 25h1v1h-1zM39 25h1v1h-1zM9 26h1v1h-1zM10 26h1v1h-1zM11 26h1v1h-1zM12 26h1v1h-1zM14 26h1v1h-1zM15 26h1v1h-1zM18 26h1v1h-1zM20 26h1v1h-1zM23 26h1v1h-1zM24 26h1v1h-1zM26 26h1v1h-1zM28 26h1v1h-1zM32 26h1v1h-1zM33 26h1v1h-1zM37 26h1v1h-1zM38 26h1v1h-1zM39 26h1v1h-1zM5 27h1v1h-1zM8 27h1v1h-1zM12 27h1v1h-1zM14 27h1v1h-1zM15 27h1v1h-1zM19 27h1v1h-1zM22 27h1v1h-1zM23 27h1v1h-1zM24 27h1v1h-1zM25 27h1v1h-1zM26 27h1v1h-1zM29 27h1v1h-1zM31 27h1v1h-1zM33 27h1v1h-1zM34 27h1v1h-1zM35 27h1v1h-1zM39 27h1v1h-1zM40 27h1v1h-1zM7 28h1v1h-1zM10 28h1v1h-1zM11 28h1v1h-1zM12 28h1v1h-1zM15 28h1v1h-1zM16 28h1v1h-1zM19 28h1v1h-1zM21 28h1v1h-1zM23 28h1v1h-1zM25 28h1v1h-1zM26 28h1v1h-1zM27 28h1v1h-1zM28 28h1v1h-1zM30 28h1v1h-1zM31 28h1v1h-1zM33 28h1v1h-1zM35 28h1v1h-1zM40 28h1v1h-1zM4 29h1v1h-1zM11 29h1v1h-1zM13 29h1v1h-1zM14 29h1v1h-1zM16 29h1v1h-1zM22 29h1v1h-1zM24 29h1v1h-1zM26 29h1v1h-1zM28 29h1v1h-1zM29 29h1v1h-1zM31 29h1v1h-1zM34 29h1v1h-1zM35 29h1v1h-1zM4 30h1v1h-1zM5 30h1v1h-1zM6 30h1v1h-1zM7 30h1v1h-1zM9 30h1v1h-1zM10 30h1v1h-1zM12 30h1v1h-1zM13 30h1v1h-1zM14 30h1v1h-1zM15 30h1v1h-1zM16 30h1v1h-1zM19 30h1v1h-1zM21 30h1v1h-1zM26 30h1v1h-1zM27 30h1v1h-1zM29 30h1v1h-1zM30 30h1v1h-1zM35 30h1v1h-1zM37 30h1v1h-1zM38 30h1v1h-1zM39 30h1v1h-1zM4 31h1v1h-1zM9 31h1v1h-1zM13 31h1v1h-1zM15 31h1v1h-1zM17 31h1v1h-1zM18 31h1v1h-1zM20 31h1v1h-1zM21 31h1v1h-1zM25 31h1v1h-1zM29 31h1v1h-1zM30 31h1v1h-1zM31 31h1v1h-1zM34 31h1v1h-1zM4 32h1v1h-1zM8 32h1v1h-1zM9 32h1v1h-1zM10 32h1v1h-1zM11 32h1v1h-1zM12 32h1v1h-1zM13 32h1v1h-1zM14 32h1v1h-1zM16 32h1v1h-1zM17 32h1v1h-1zM19 32h1v1h-1zM22 32h1v1h-1zM24 32h1v1h-1zM25 32h1v1h-1zM27 32h1v1h-1zM28 32h1v1h-1zM29 32h1v1h-1zM30 32h1v1h-1zM32 32h1v1h-1zM33 32h1v1h-1zM34 32h1v1h-1zM35 32h1v1h-1zM36 32h1v1h-1zM37 32h1v1h-1zM38 32h1v1h-1zM12 33h1v1h-1zM14 33h1v1h-1zM18 33h1v1h-1zM19 33h1v1h-1zM21 33h1v1h-1zM23 33h1v1h-1zM24 33h1v1h-1zM26 33h1v1h-1zM29 33h1v1h-1zM30 33h1v1h-1zM32 33h1v1h-1zM36 33h1v1h-1zM39 33h1v1h-1zM4 34h1v1h-1zM5 34h1v1h-1zM6 34h1v1h-1zM7 34h1v1h-1zM8 34h1v1h-1zM9 34h1v1h-1zM10 34h1v1h-1zM12 34h1v1h-1zM13 34h1v1h-1zM15 34h1v1h-1zM16 34h1v1h-1zM17 34h1v1h-1zM20 34h1v1h-1zM21 34h1v1h-1zM22 34h1v1h-1zM24 34h1v1h-1zM25 34h1v1h-1zM28 34h1v1h-1zM29 34h1v1h-1zM32 34h1v1h-1zM34 34h1v1h-1zM36 34h1v1h-1zM37 34h1v1h-1zM4 35h1v1h-1zM10 35h1v1h-1zM12 35h1v1h-1zM14 35h1v1h-1zM18 35h1v1h-1zM20 35h1v1h-1zM24 35h1v1h-1zM25 35h1v1h-1zM28 35h1v1h-1zM30 35h1v1h-1zM31 35h1v1h-1zM32 35h1v1h-1zM36 35h1v1h-1zM38 35h1v1h-1zM39 35h1v1h-1zM40 35h1v1h-1zM4 36h1v1h-1zM6 36h1v1h-1zM7 36h1v1h-1zM8 36h1v1h-1zM10 36h1v1h-1zM12 36h1v1h-1zM13 36h1v1h-1zM15 36h1v1h-1zM16 36h1v1h-1zM17 36h1v1h-1zM18 36h1v1h-1zM19 36h1v1h-1zM20 36h1v1h-1zM22 36h1v1h-1zM23 36h1v1h-1zM26 36h1v1h-1zM27 36h1v1h-1zM28 36h1v1h-1zM29 36h1v1h-1zM32 36h1v1h-1zM33 36h1v1h-1zM34 36h1v1h-1zM35 36h1v1h-1zM36 36h1v1h-1zM38 36h1v1h-1zM40 36h1v1h-1zM4 37h1v1h-1zM6 37h1v1h-1zM7 37h1v1h-1zM8 37h1v1h-1zM10 37h1v1h-1zM12 37h1v1h-1zM13 37h1v1h-1zM14 37h1v1h-1zM21 37h1v1h-1zM23 37h1v1h-1zM26 37h1v1h-1zM27 37h1v1h-1zM29 37h1v1h-1zM40 37h1v1h-1zM4 38h1v1h-1zM6 38h1v1h-1zM7 38h1v1h-1zM8 38h1v1h-1zM10 38h1v1h-1zM16 38h1v1h-1zM18 38h1v1h-1zM22 38h1v1h-1zM23 38h1v1h-1zM25 38h1v1h-1zM28 38h1v1h-1zM29 38h1v1h-1zM30 38h1v1h-1zM31 38h1v1h-1zM32 38h1v1h-1zM33 38h1v1h-1zM34 38h1v1h-1zM35 38h1v1h-1zM38 38h1v1h-1zM40 38h1v1h-1zM4 39h1v1h-1zM10 39h1v1h-1zM13 39h1v1h-1zM14 39h1v1h-1zM15 39h1v1h-1zM16 39h1v1h-1zM19 39h1v1h-1zM23 39h1v1h-1zM24 39h1v1h-1zM25 39h1v1h-1zM26 39h1v1h-1zM28 39h1v1h-1zM29 39h1v1h-1zM30 39h1v1h-1zM37 39h1v1h-1zM39 39h1v1h-1zM40 39h1v1h-1zM4 40h1v1h-1zM5 40h1v1h-1zM6 40h1v1h-1zM7 40h1v1h-1zM8 40h1v1h-1zM9 40h1v1h-1zM10 40h1v1h-1zM12 40h1v1h-1zM15 40h1v1h-1zM16 40h1v1h-1zM22 40h1v1h-1zM24 40h1v1h-1zM25 40h1v1h-1zM26 40h1v1h-1zM29 40h1v1h-1zM30 40h1v1h-1zM33 40h1v1h-1zM35 40h1v1h-1zM36 40h1v1h-1zM37 40h1v1h-1zM40 40h1v1h-1z"/></svg></div>
    <p data-payment-instructions></p>
    <div class="dsu-dialog-actions mh-payment-actions">
      <button type="button" class="qikan-checkout-button" data-payment-action="back">更换方式</button>
      <button type="button" class="qikan-checkout-button is-primary" data-payment-action="confirm"></button>
    </div>
  </section>
  <section data-payment-step="success" hidden>
    <div class="mh-payment-success" aria-hidden="true">✓</div>
    <h3 tabindex="-1">${escape(success)}</h3>
    <p data-payment-receipt></p>
    <div class="dsu-dialog-actions mh-payment-actions"><button type="button" class="qikan-checkout-button is-primary" data-payment-action="done">完成</button></div>
  </section>
  `;
 const paymentSteps=[...subscription.querySelectorAll('[data-payment-step]')];
 const paymentMethods={
  scan:{label:'微信扫码',heading:'微信扫码支付',instructions:'扫码可查看演示说明。点击下方按钮模拟扫码支付完成。',confirm:'模拟扫码完成'},
  alipay:{label:'支付宝',heading:'支付宝支付确认',instructions:`请核对订单金额 ${amount}，再确认模拟支付。此步骤在当前页面完成。`,confirm:'模拟支付宝支付'},
  dsu:{label:'DSU 余额',heading:'DSU 余额支付',instructions:`可用演示余额 0 DSU，本单需 ${price} DSU。可模拟充值后继续支付。`,confirm:`模拟充值 ${price} DSU`}
 };
 let payment='scan',demoBalance=0;
 function showPaymentStep(step){
  paymentSteps.forEach(section=>{section.hidden=section.dataset.paymentStep!==step;});
  const active=paymentSteps.find(section=>!section.hidden);
  (active.querySelector('h3')||active.querySelector(':checked'))?.focus();
 }
 function showPaymentConfirmation(){
  const method=paymentMethods[payment];
  subscription.querySelector('[data-payment-heading]').textContent=method.heading;
  subscription.querySelector('[data-payment-code]').hidden=payment!=='scan';
  subscription.querySelector('[data-payment-instructions]').textContent=payment==='dsu'&&demoBalance?
   `可用演示余额 ${price} DSU，本单将模拟扣除 ${price} DSU。`:method.instructions;
  subscription.querySelector('[data-payment-action=confirm]').textContent=payment==='dsu'&&demoBalance?
   `确认模拟支付 ${price} DSU`:method.confirm;
  showPaymentStep('confirm');
 }
 trigger.addEventListener('click',()=>{
  demoBalance=0;
  subscription.querySelector('[value=scan]').checked=true;
  paymentSteps.forEach(section=>{section.hidden=section.dataset.paymentStep!=='choose';});
  subscription.showModal();
  subscription.querySelector(':checked').focus();
 });
 subscription.addEventListener('click',event=>{
  const action=event.target.closest('[data-payment-action]')?.dataset.paymentAction;
  switch(action){
   case 'next':
    payment=subscription.querySelector('[name=mh-payment]:checked').value;
    showPaymentConfirmation();
    break;
   case 'back':
    showPaymentStep('choose');
    break;
   case 'confirm':
    if(payment==='dsu'&&!demoBalance){
     demoBalance=price;
     showPaymentConfirmation();
     break;
    }
    if(payment==='dsu')demoBalance=0;
    subscription.querySelector('[data-payment-receipt]').textContent=payment==='dsu'?
     `DSU 余额 · ${price} DSU · 演示完成`:paymentMethods[payment].label+` · ${amount} · 演示完成`;
    onPaid?.();
    showPaymentStep('success');
    break;
   case 'done':
    subscription.close();
    break;
  }
 });
 }
 window.magazineCheckout={mount};
})();
