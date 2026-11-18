/* Publication ownership is explicit; unrelated books and magazines stay out of profiles. */
window.isSignedReading=plan=>plan.publication==='南风窗'||plan.publicationTitle==='南风窗'||(plan.contentType==='journal'&&plan.bookTitle==='南风窗');
(()=>{
 const local=octoberGuidedPlans.find(p=>p.id==='magazine-南风窗');if(local){local.publication='南风窗';local.returnUrl=octoberCommunityRoute();}
 window.renderSignedIssueSidebar=(m,issue,trial)=>{
  if(!local)return null;const template=document.createElement('template');template.innerHTML=renderOctoberGuidedDetail(local.id);const header=template.content.querySelector('.oc-guided-sidebar');if(!header)return null;
  header.querySelector('.oc-guided-title h1').textContent=m.title;header.querySelector('.oc-guided-title p').textContent=issue.label;
  const cover=header.querySelector('.oc-guided-cover');if(cover){cover.src=issue.src||m.src;cover.alt=m.title+' '+issue.label+'封面';}
  header.querySelector('.oc-guided-join')?.remove();
  const actions=document.createElement('div');actions.className='signed-issue-actions';
  const facsimile=document.createElement('a');facsimile.className='signed-issue-facsimile';facsimile.href=trial;facsimile.target='_blank';facsimile.rel='noopener';facsimile.textContent='原貌版试读';
  const start=document.createElement('a');start.className='signed-issue-start';start.href='portal.html#/article/0?context=magazine&resource='+encodeURIComponent(m.title);start.textContent='开始阅读';actions.append(facsimile,start);header.querySelector('.oc-guided-title').after(actions);
  const aside=document.createElement('aside');aside.className='pe-identity signed-issue-sidebar';
  const category=document.createElement('div');category.className='signed-issue-category';category.textContent=m.category||'期刊';
  const footer=document.createElement('div');footer.className='signed-issue-guide-slot';const guide=header.querySelector('.oc-guided-guide');if(guide){const avatar=guide.querySelector('img'),name=guide.querySelector('strong'),badge=guide.querySelector('span'),copy=document.createElement('span');copy.className='signed-issue-guide-name';badge.className='signed-issue-guide-badge';copy.append(name,badge);guide.replaceChildren(avatar,copy);footer.append(guide);}
  aside.append(category,header);return aside;
 };
 window.appendSignedIssueBottom=(template,m,issue)=>{
  const layout=template.content.querySelector('.pe-layout');if(!layout||!local)return;
  template.content.querySelectorAll('.pe-bottom-section').forEach(el=>el.remove());
  const bottom=document.createElement('div');bottom.className='signed-issue-bottom pe-bottom-section oc-guided-figma';bottom.dataset.issueKey='issue:'+m.title+':'+issue.label;
  const lesson=document.createElement('template');lesson.innerHTML=renderOctoberGuidedDetail(local.id);const notes=lesson.content.querySelector('.oc-guided-notes-section');
  notes.querySelector('.oc-reading-note-form').className='oc-reading-note-form signed-issue-note-form';const input=notes.querySelector('textarea');input.id='signed-issue-note';notes.querySelector('label').htmlFor=input.id;
  const comment=notes.querySelector('[data-reading-comment]');comment.removeAttribute('data-reading-comment');comment.setAttribute('data-signed-issue-comment','');
  const saved=octoberReadingState(bottom.dataset.issueKey).notes||[];saved.slice().reverse().forEach(n=>{const article=document.createElement('article'),p=document.createElement('p'),footer=document.createElement('footer'),author=document.createElement('strong');p.textContent=n.text;author.textContent=n.author||'我';footer.append(author);article.append(p,footer);notes.querySelector('.oc-reading-notes').prepend(article);});bottom.append(notes);
  const ordinary=document.createElement('template'),reference=flowShelfData.find(item=>item.title==='第一财经');ordinary.innerHTML=renderOrdinaryPeriodical(reference,{label:'2026年09期',src:periodicalReference.cover});
  const related=ordinary.content.querySelector('#pe-related');layout.after(bottom);if(related)bottom.after(related);

 };
 document.addEventListener('click',event=>{const button=event.target.closest('[data-signed-issue-comment]');if(!button)return;const input=button.closest('.signed-issue-bottom').querySelector('textarea');input.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});input.focus({preventScroll:true});});
 document.addEventListener('submit',event=>{const form=event.target.closest('.signed-issue-note-form');if(!form)return;event.preventDefault();const text=form.elements.note.value.trim();if(!text)return;const root=form.closest('.signed-issue-bottom'),state=octoberReadingState(root.dataset.issueKey),note={text,author:'我',date:new Date().toLocaleDateString('sv-SE')};state.notes=[note,...(state.notes||[])];if(!ocSaveReading(root.dataset.issueKey,state)){form.querySelector('[role=status]').textContent='保存失败，请重试。';return;}const article=document.createElement('article'),p=document.createElement('p'),footer=document.createElement('footer');p.textContent=text;footer.textContent='我 · '+note.date;article.append(p,footer);root.querySelector('.oc-reading-notes').prepend(article);form.reset();form.querySelector('[role=status]').textContent='已发布';});
})();
