(() => {
  const view = document.querySelector('#view-kexin');
  const scenes = [
    ['投资研究', '一个判断，\n如何被数据支撑？', '结合财报、公告和公开数据，核对投资观点。', [
      ['新能源车销量上涨、利润率下降，是竞争力增强还是价格战加剧？', '对照销量结构、盈利指标和行业价格。', '财报、行业报告、市场数据'],
      ['存款利率下调后，哪些数据能验证资金流向理财和债基？', '比较资金流向、产品回报和风险等级。', '央行数据、基金季报、银行公告'],
      ['长期回测是否支持高股息策略？', '区分策略收益、估值变化和交易拥挤。', '学术论文、指数数据、市场研究'],
      ['算力投资增长，产业链哪些环节可能受益？', '核对资本开支、订单和供应瓶颈。', '公司公告、产业链报告、招投标数据']
    ]],
    ['政策解读', '一项政策，\n如何改变现实？', '对照政策原文、统计数据和实施案例。', [
      ['低空经济扶持政策把资源投向了哪里？', '按技术、设施和招商梳理支持方向。', '政策文件、官方数据、产业规划'],
      ['如何评价数据要素试点对治理和产业的影响？', '梳理政策演进，比较可量化的成效。', '政策文件、官方数据、学术论文'],
      ['哪些指标能看出购房预期发生了变化？', '结合成交、信贷和调查结果交叉验证。', '政策文件、官方数据、市场调查'],
      ['地方专项债投向变化，对城市更新和产业园区建设有什么影响？', '核对项目清单、资金落地和投入产出数据。', '政府工作报告、财政数据、产业规划']
    ]],
    ['法律分析', '用法规和案例厘清争议', '核对适用规则，比较裁判所依据的事实。', [
      ['签了竞业协议却没有收到补偿，法院通常怎么认定？', '梳理协议效力、补偿义务和违约责任。', '法律法规、劳动争议、裁判案例'],
      ['剪辑影视片段制作营利短视频，哪些情况可能侵权？', '检查素材用途、使用比例和授权情况。', '著作权法、裁判案例、平台规则'],
      ['只有微信聊天和转账记录，能否证明朋友借款？', '核对证据链能否说明款项的性质。', '民事法律、证据规则、裁判案例'],
      ['商家声称拥有最终解释权，这类条款有法律效力吗？', '对照格式条款规则和消费纠纷案例。', '消费者权益、合同条款、法院判决']
    ]],
    ['医学理解', '读懂医学证据适用的范围', '把健康说法放到指南和研究证据中核对。', [
      ['体检指标连续偏高但没有症状，指南如何区分观察与复查？', '结合指标阈值、变化趋势和适用人群。', '医学指南、临床共识、风险评估'],
      ['新药研究宣称有效率提高，怎样判断证据是否可靠？', '核对样本量、对照组和研究终点。', '临床试验、医学期刊、证据分级'],
      ['哪些癌症早筛项目有证据支持，哪些可能造成过度检查？', '比较指南建议、筛查获益与可能的伤害。', '医学指南、系统综述、官方数据'],
      ['面对不同医院提出的治疗方案，如何比较其中的依据？', '梳理指南、证据强度和需要沟通的问题。', '医学指南、临床共识、研究证据']
    ]],
    ['学术研究', '把选题收敛成可研究的问题', '从文献、方法和引用规范入手。', [
      ['怎样用文献综述缩小一个过大的论文选题？', '检索综述，找出尚未解决的具体问题。', '核心期刊、综述文章、研究方法'],
      ['高引用论文的方法存在争议，怎样评价结论？', '检查样本、研究设计和后续验证。', '原始论文、后续研究、同行评论'],
      ['论文写作中，AI 可以辅助哪些环节？', '梳理高校和期刊关于 AI 使用的规范。', '高校规范、期刊政策、学术伦理'],
      ['为什么变量相关还不足以证明因果？', '比较混杂因素、研究设计和识别策略。', '文献综述、研究设计、方法论文']
    ]]
  ];

  const form = view.querySelector('form');
  const input = form.elements.q;
  const status = view.querySelector('[data-kexin-status]');
  const panel = view.querySelector('[data-kexin-panel]');
  const arrow = '<i class="iconfont icon-Arrow_Forward-2 kx-arrow" aria-hidden="true"></i>';
  const chips = (values) => values.map(value => `<span>${value}</span>`).join('');
  const sceneButtons = [...view.querySelectorAll('[data-kexin-scene]')];

  function renderScene(index) {
    sceneButtons.forEach((button, i) => {
      button.setAttribute('aria-selected', String(i === index));
      button.tabIndex = i === index ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', sceneButtons[index].id);
    const [, title, subtitle, questions] = scenes[index];
    const sources = [...new Set(questions.flatMap(question => question[2].split('、')))];
    panel.innerHTML = `
      <div class="kx-scene-intro">
        <div><h3>${title}</h3><p>${subtitle}</p></div>
        <div class="kx-scene-sources">
          <p class="kx-source-label">这个场景会核对的来源（${sources.length} 类）</p>
          <div class="kx-chips">${chips(sources)}</div>
        </div>
      </div>
      <div class="kx-questions">${questions.map(([question, desc, sources], i) => `
        <article class="kx-question">
          <h4>${question}</h4><p>${desc}</p>
          <div class="kx-chips">${chips(sources.split('、'))}</div>
          <div class="kx-question-foot">
            <button class="kx-question-action" type="button" data-kexin-question="${i}" aria-label="用可信分析：${question}">${arrow}</button>
          </div>
        </article>`).join('')}</div>`;
    view.querySelectorAll('[data-kexin-question]').forEach((button, i) => {
      button.addEventListener('click', () => {
        input.value = questions[i][0];
        syncInput();
        form.requestSubmit();
      });
    });
  }

  sceneButtons.forEach((button, index) => {
    button.id = `kexin-scene-${index}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', panel.id);
    button.innerHTML = `<span class="kx-scene-card-copy"><strong>${scenes[index][0]}</strong><small>${scenes[index][2]}</small></span>`;
    button.addEventListener('click', () => renderScene(index));
    button.addEventListener('keydown', event => {
      const last = sceneButtons.length - 1;
      const next = {ArrowLeft: index === 0 ? last : index - 1, ArrowRight: index === last ? 0 : index + 1, Home: 0, End: last}[event.key];
      if (next === undefined) return;
      event.preventDefault();
      renderScene(next);
      sceneButtons[next].focus();
    });
  });
  const chatForm = document.querySelector('#view-search .ai-composer');
  const chatActions = form.querySelector('.kx-composer-actions').cloneNode(true);
  chatActions.querySelector('.kx-mode-options').id = 'kexin-chat-mode-options';
  chatActions.querySelector('[data-kexin-mode-trigger]').setAttribute('aria-controls','kexin-chat-mode-options');
  chatActions.querySelector('.kx-send').classList.add('ai-send');
  chatForm.append(chatActions);
  const chatStatus = document.createElement('p');
  chatStatus.className = 'kx-status';
  chatStatus.setAttribute('role','status');
  chatForm.append(chatStatus);

  const composers = [form,chatForm];
  for (const composer of composers) {
    const trigger = composer.querySelector('[data-kexin-mode-trigger]');
    const options = composer.querySelector('.kx-mode-options');
    function setModeMenu(open) {
      options.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
      if (open) options.querySelector(':checked').focus();
    }
    trigger.addEventListener('click', () => setModeMenu(options.hidden));
    options.addEventListener('change', () => {
      setModeMenu(false);
      trigger.focus();
    });
    document.addEventListener('click', event => {
      if (!options.hidden && !trigger.parentElement.contains(event.target)) setModeMenu(false);
    });
    composer.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !options.hidden) {
        setModeMenu(false);
        trigger.focus();
      }
    });
    composer.addEventListener('change', event => {
      if (!['mode','knowledge','webSearch'].includes(event.target.name)) return;
      for (const other of composers) {
        other.elements.mode.value = composer.elements.mode.value;
        other.elements.knowledge.checked = composer.elements.knowledge.checked;
        other.elements.webSearch.checked = composer.elements.webSearch.checked;
        other.querySelector('[data-kexin-mode-trigger]').textContent =
          other.querySelector('.kx-mode-options :checked').labels[0].querySelector('strong').textContent;
      }
      status.textContent = chatStatus.textContent = '';
    });
  }

  function canSend(composer, question) {
    const allowed = !question || composer.elements.webSearch.checked || composer.elements.knowledge.checked;
    (composer === form ? status : chatStatus).textContent = allowed ? '' : '请开启联网搜索或参考知识库，也可以前往可信官网上传附件。';
    return allowed;
  }
  window.kexinComposer = {canSend};
  function syncInput() { status.textContent = ''; }
  input.addEventListener('input', syncInput);
  input.addEventListener('keydown', event => {
    if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return;
    event.preventDefault();
    form.requestSubmit();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const question = input.value.trim();
    if (canSend(form, question)) window.longyuanConversation.startResearch(question);
  });
  renderScene(0);
  syncInput();
})();
