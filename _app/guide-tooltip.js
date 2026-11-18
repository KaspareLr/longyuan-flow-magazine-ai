/* A viewport-level tooltip avoids clipping and conflicting legacy inset rules. */
(()=>{
 const tip=document.createElement('div');tip.id='longyuan-guide-tooltip';tip.className='guide-floating-tooltip';tip.role='tooltip';tip.hidden=true;document.body.append(tip);let active=null;
 const selector='.pe-icon-button,.pe-chat-reopen,.pe-chat button[title],.pe-chat .pe-chat-attach,.pe-chat [data-guide-tooltip]';
 function hide(){if(active){const ids=(active.getAttribute('aria-describedby')||'').split(/\s+/).filter(x=>x&&x!==tip.id);if(ids.length)active.setAttribute('aria-describedby',ids.join(' '));else active.removeAttribute('aria-describedby');}active=null;tip.hidden=true;}
 function show(el){const label=el.getAttribute('title')||el.dataset.guideTooltip||el.querySelector('.pe-tooltip')?.textContent||el.getAttribute('aria-label');if(!label?.trim())return;hide();active=el;el.dataset.guideTooltip=label.trim();el.removeAttribute('title');tip.textContent=label.trim();tip.hidden=false;el.setAttribute('aria-describedby',[(el.getAttribute('aria-describedby')||''),tip.id].filter(Boolean).join(' '));const r=el.getBoundingClientRect(),t=tip.getBoundingClientRect(),pad=8;let left=r.left+r.width/2-t.width/2;left=Math.max(pad,Math.min(left,innerWidth-t.width-pad));let top=r.bottom+8;if(top+t.height>innerHeight-pad)top=r.top-t.height-8;tip.style.left=left+'px';tip.style.top=Math.max(pad,top)+'px';}
 document.addEventListener('pointerover',event=>{const el=event.target.closest(selector);if(el&&el!==active)show(el);});
 document.addEventListener('pointerout',event=>{if(active&&active.contains(event.target)&&!active.contains(event.relatedTarget))hide();});
 document.addEventListener('focusin',event=>{const el=event.target.closest(selector);if(el)show(el);});
 document.addEventListener('focusout',event=>{if(active?.contains(event.target))hide();});
 document.addEventListener('keydown',event=>{if(event.key==='Escape')hide();});
 document.addEventListener('click',hide);window.addEventListener('scroll',hide,true);window.addEventListener('resize',hide);window.addEventListener('hashchange',hide);
})();
