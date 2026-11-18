/* One-line composer and a reversible, scroll-driven viewport-to-banner transition. */
(()=>{
 const view=document.querySelector('#view-home'),hero=view?.querySelector('.hero-break');if(!hero)return;
 const stage=document.createElement('div'),pin=document.createElement('div');stage.className='home-hero-scroll';pin.className='home-hero-pin';hero.before(stage);stage.append(pin);pin.append(hero);
 const title=hero.querySelector('.home-title'),search=hero.querySelector('.hero-search'),form=search.querySelector('form'),input=form.querySelector('textarea');title.append(search);input.rows=1;input.wrap='off';
 const send=form.querySelector('.round-send');send.innerHTML='<span class="home-send-icon" aria-hidden="true"><img src="assets/home-composer/send-arrow.svg" alt=""></span>';
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),shelf=hero.querySelector('.hero-shelf');let frame=0,locked=null;
 function update(){frame=0;if(!view.classList.contains('active'))return;
  const w=document.documentElement.clientWidth,h=innerHeight,inset=Math.max(Math.min(104,Math.max(24,w*.066667)),(w-1360)/2),finalHeight=w<=760?Math.min(560,h-160):Math.min(600,(w-2*inset)*9/16,h-140),range=Math.max(360,h*.8);
  const progress=reduced.matches?0:Math.max(0,Math.min(1,-stage.getBoundingClientRect().top/range));
  stage.style.setProperty('--home-shrink',String(progress));stage.style.setProperty('--home-inset-x',inset+'px');stage.style.setProperty('--home-inset-y',(h-finalHeight)/2+'px');stage.style.setProperty('--home-height-change',(h-finalHeight)+'px');stage.style.setProperty('--home-scroll-range',range+'px');
  if(search.parentElement===title){const formBottom=form.getBoundingClientRect().bottom-hero.getBoundingClientRect().top,shelfTop=formBottom+((w<=760?112:144)*(1-progress)+(w<=760?52:64)*progress),coverEnd=Math.max(h*.6,finalHeight*.72);stage.style.setProperty('--home-shelf-top',shelfTop+'px');window.longyuanShelf?.setScrollGeometry((h*.92*(1-progress)+coverEnd*progress)/(h*.92),1+progress*.4);}
  const disabled=progress>.001;if(disabled!==locked){locked=disabled;hero.classList.toggle('home-shelf-locked',disabled);shelf.inert=disabled;window.longyuanShelf?.setInteractive(!disabled);}
  window.longyuanHomeJourney?.update({w,h,range,scroll:Math.max(0,-stage.getBoundingClientRect().top)});
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(update);}
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);window.addEventListener('hashchange',schedule);reduced.addEventListener('change',schedule);
 input.addEventListener('input',()=>{if(search.parentElement===title&&/[\r\n]/.test(input.value))input.value=input.value.replace(/[\r\n]+/g,' ');});
 input.addEventListener('keydown',event=>{if(event.key==='Enter'&&event.shiftKey&&!event.isComposing&&search.parentElement===title){event.preventDefault();form.requestSubmit();}});
 window.longyuanHomeHeroRefresh=schedule;new ResizeObserver(schedule).observe(title);update();
})();
