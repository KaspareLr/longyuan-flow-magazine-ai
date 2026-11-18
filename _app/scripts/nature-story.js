/* A visual reading journey through the nature collection. */
(()=>{
 const id='topic-mudsnwbq',e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const arrow='<span class="nature-arrow" aria-hidden="true"><span><img src="assets/nature-story/article-arrow.svg" alt=""></span></span>';
 const notes=[
 '跟随刘先平走进天山，在寻找雪豹的旅途中，发现自然不经意间展开的丰盛。',
 '从戈壁上的一次突然停车开始，跟随行走与观察，靠近那些自由的生命。',
 '一封来自森林深处的消息，把猞猁、驯鹿与鄂温克人的生活连在了一起。',
 '六月的河谷、清晨的马群。一只鵟的出现，让熟悉的营地有了新的故事。',
 '一头聪明得超乎预想的牧羊犬，让人与动物之间的较量充满了意外。',
 '暮春清晨的一声呼唤，把生命的脆弱与牵挂，带到读者面前。',
 '走进巴图鲁的故事，在逐渐展开的细节里，寻找那个尚未说出的秘密。',
 '在大漠荒原的哨所，一位独自执勤的人，与狼群做了一年的邻居。'
 ];
 let observer,frame=0,hero;
 function motion(){frame=0;if(!hero?.isConnected||!document.querySelector('#view-topic.active'))return;const r=hero.getBoundingClientRect(),top=hero.closest('.nature-story').getBoundingClientRect().top,p=Math.max(0,Math.min(1,-top/r.height));hero.style.setProperty('--nature-progress',String(p));}
 function schedule(){if(!frame)frame=requestAnimationFrame(motion);}
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
 function card(i){const a=window.natureTopicData.articles[i];return `<a class="nature-article" href="portal.html#/article/${i}?context=magazine&resource=${encodeURIComponent('十月少年文学')}&topic=${id}"><span class="nature-article-number">${String(i+1).padStart(2,'0')}</span><div><span class="nature-kicker">十月少年文学 · ${e(a.issueLabel)}</span><h3>${e(a.title)}</h3><p>${notes[i]}</p><footer><span>${e(a.author)}</span>${arrow}</footer></div></a>`;}
 function render(){observer?.disconnect();hero=null;const active=location.hash.split('?')[0]==='#/topic/'+id;document.body.classList.toggle('has-nature-story',active);if(!active)return;const target=document.querySelector('#view-topic');target.querySelector('.topics-detail-new')?.remove();target.querySelector('.content').hidden=true;
 target.insertAdjacentHTML('beforeend',`<div class="topics-detail-new nature-story">
 <section class="nature-hero" aria-labelledby="nature-title"><img class="nature-hero-image" src="assets/claimed-october/topic.png" alt="猞猁伫立在岩石上，远处是河谷、山脉与草原" fetchpriority="high"><div class="nature-hero-shade"></div><div class="nature-hero-copy"><span>自然 · ANIMAL STORIES</span><h1 id="nature-title"><span>迷人的</span><span>大自然之歌</span></h1><p>在文字里，听见旷野的回声。</p></div><div class="nature-hero-bottom"><span>8 篇作品</span></div></section>
 <div class="nature-story-content"><section class="nature-overview nature-wrap nature-reveal" data-nature-start><span class="nature-kicker">A SONG OF THE WILD / 专题概述</span><div><h2>它们不取悦人，<br>只忠实于荒野。</h2><p>从天山的山野到大兴安岭的林间，从河谷上空的鵟到赛汗塔拉的牧羊犬，自然始终以自己的节奏生长。动物文学让我们暂时放下人的尺度，靠近另一种生活。</p><p>沿着刘先平与黑鹤等作家的文字，走进八个故事。在观察、相遇与牵挂之间，听见生命各自的声音。</p></div></section>
 <section class="nature-image-pair nature-wrap" aria-label="林间与河谷"><figure class="nature-pair-wide nature-reveal"><div class="nature-image-clip"><img src="assets/nature-story/woodland.png" alt="水彩笔触下，戴胜站在长着蘑菇和苔藓的林间溪流旁" loading="lazy"></div><figcaption><span>01 / INTO THE WOODS</span><span>从一处细小的风景开始</span></figcaption></figure><figure class="nature-pair-tall nature-reveal"><div class="nature-image-clip"><img src="assets/nature-story/river-bird.png" alt="鵟停在树枝上，俯瞰蜿蜒的河流与草原" loading="lazy"></div><figcaption>风经过河谷，也经过一只鸟的羽翼。</figcaption></figure></section>
 <section class="nature-reading nature-wrap"><header class="nature-chapter-intro nature-reveal"><span class="nature-kicker">CHAPTER 01 / 走近与观察</span><h2>把脚步放轻，<br>故事就在身边。</h2><div><p>很多故事，始于一次停留。也许是在赶路时忽然看见的身影，也许是一封从森林深处传来的消息。循着这些线索，风景不再只是背景，动物也有了各自的处境。</p><p>先跟随作家走进山野。试着看得更仔细一点，让不熟悉的生命，慢慢走近。</p></div></header><div class="nature-articles-first nature-reveal">${[0,1,2].map(card).join('')}</div></section>
 <section class="nature-panorama nature-reveal"><img src="assets/nature-story/grassland.png" alt="辽阔草原上，牧羊犬守望着羊群，河流蜿蜒伸向远山" loading="lazy"><div class="nature-panorama-shade"></div><div><span class="nature-kicker">BETWEEN EARTH AND SKY</span><p>旷野自有它的秩序。<br>我们只是，<br>有幸与它们相遇。</p><small>让目光走远，也让理解更近。</small></div></section>
 <section class="nature-reading nature-wrap"><header class="nature-chapter-intro nature-reveal"><span class="nature-kicker">CHAPTER 02 / 相遇与共处</span><h2>同一片土地，<br>不同的生命。</h2><div><p>走出林间，河流把视线带向更开阔的草原。这里有牧人的营地，有守护羊群的狗，也有不受人指挥的野生动物。生活彼此交叠，却并不总能轻易理解。</p><p>动物文学里的相遇，有机敏与勇敢，也有冲突、失去和牵挂。读下去，或许我们会重新思考：当人走进旷野，怎样与其他生命保持合适的距离？</p></div></header><div class="nature-articles-last nature-reveal">${[3,4,5,6,7].map(card).join('')}</div></section>
 <section class="nature-ending nature-wrap nature-reveal"><span class="nature-kicker">THE SONG GOES ON / 余音</span><h2>合上书页，<br>自然还在继续。</h2><p>一只鸟掠过窗前，一条河流经过远方。故事让我们记住名字，也提醒我们，每一种生命都有属于自己的世界。</p><p>下一次走进自然，愿我们多一点耐心，多一点好奇。<br>听一听，那些还没有被听见的声音。</p><a class="nature-ending-link" href="#/topics">回到专题，继续发现</a></section>
 <section class="nature-related nature-wrap"><header><span class="nature-kicker">KEEP EXPLORING / 继续探索</span><h2>让好奇，再走远一点。</h2></header><div>${[['small-nature','身边的微小自然','科学 · NATURE NEXT DOOR','从窗边与街角，发现共同生活的邻居。'],['slow-time','给生活一点慢时间','生活 · THE PLEASURE OF SLOW','放慢脚步，让日常重新变得清晰。']].map(([id,t,k,p])=>`<a href="#/topic/${id}"><div class="nature-image-clip"><img src="assets/topics-generated/${id}.png" alt="${t}" loading="lazy"></div><span class="nature-kicker">${k}</span><h3>${t} ${arrow}</h3><p>${p}</p></a>`).join('')}</div></section></div></div>`);
 hero=target.querySelector('.nature-hero');
 observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.08});target.querySelectorAll('.nature-reveal').forEach(x=>observer.observe(x));schedule();document.title='迷人的大自然之歌 · 龙源期刊网';
 }
 window.addEventListener('hashchange',render);render();
})();
