const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.resolve(__dirname,'..'),ctx={window:{addEventListener(){}}};vm.createContext(ctx);
for(const file of ['editorial-articles-data.js','issue-trial-data.js','magazine-original-data.js','issue-preview.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx);
const full=ctx.window.clubEditorialArticleData,trial=ctx.window.clubIssueTrialData;
const images=full.flatMap(a=>a.blocks.filter(b=>b.type==='figure').map(b=>b.src));
const tiles=ctx.window.magazineOriginalData.pages.flatMap(p=>p.tiles.map(t=>t.src));
for(const src of [...images,...tiles]){assert(!/^https?:/.test(src),src);assert(fs.existsSync(path.join(root,src)),src);}
const a={context:'magazine',rid:'第一财经',resource:'第一财经',list:trial.map(x=>({title:x.title,url:x.source,excerpt:x.paragraphs.join('\n')}))};
const markup=ctx.window.clubIssuePreview.render(a,()=>'<aside class="portal-toc"></aside>');
assert.equal((markup.match(/class="issue-preview-article"/g)||[]).length,33);
assert.equal((markup.match(/>阅读全文 /g)||[]).length,33);
assert(!/试读结束|剩余\d+字|公开试读内容/.test(markup));
assert(markup.includes('issue-toc-slot'));assert(markup.includes('<figure>'));
for(const article of full){const body=ctx.window.clubIssuePreview.fullBody({title:article.title,url:article.source.url});assert(body);assert(body.includes(article.blocks.find(b=>b.type==='paragraph').text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')));}
const report={date:'2026-11-17',total:trial.length,complete:full.length,pending:trial.length-full.length,localArticleImages:images.length,localOriginalTiles:tiles.length,originalPages:ctx.window.magazineOriginalData.pages.length,articles:trial.map(x=>({id:x.id,title:x.title,status:full.some(a=>a.id===x.id)?'complete':'trial-only',source:x.source}))};
fs.writeFileSync(path.join(root,'sources/yimagazine-202609/download-status.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({...report,articles:undefined}));
