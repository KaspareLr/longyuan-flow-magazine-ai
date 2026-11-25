/* Shared three-column footer, following the public reading-club footer structure. */
(()=>{
 const base=new URL('.',document.currentScript.src),url=path=>new URL(path,base).href;
 const links=[["首页", "index.html#/frontpage"], ["搜索", "index.html#/find"], ["可信", "index.html#/kexin"], ["期刊", "index.html#/magazines"], ["学术", "index.html#/academic"], ["图书", "index.html#/books"]];
 const footer=document.createElement('footer');footer.className='club-site-footer';footer.setAttribute('aria-label','站点页脚');
 footer.innerHTML=`<div class="club-footer-columns"><div class="club-footer-brand"><a href="${url('index.html#/frontpage')}" aria-label="龙源期刊网首页"><img src="${url('assets/longyuan-home/longyuan-logo-v2.png')}" width="125" height="32" alt="龙源期刊网"></a><p>发现值得读的杂志、文章和图书，让阅读成为日常。</p></div><nav aria-label="页脚内容导航"><h2>内容</h2><ul>${links.map(([label,path])=>`<li><a href="${url(path)}">${label}</a></li>`).join('')}</ul></nav><div class="club-footer-about"><h2>说明</h2><p>让阅读，成为一种相遇。<br>在文字里发现新的视角，也连接每一个热爱阅读的人。</p><div class="club-footer-service"><a href="${url('portal.html#/me')}">我的阅读空间</a></div></div></div><div class="club-footer-bottom">龙源期刊网 · LONGYUAN QIKAN</div>`;
 if(document.querySelector('body > .club-site-footer'))return;
 const old=document.querySelector('body > .portal-footer,body > .site-footer');if(old)old.replaceWith(footer);else document.querySelector('body > main')?.insertAdjacentElement('afterend',footer);
})();
