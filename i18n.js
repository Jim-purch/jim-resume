// i18n.js — 模块化国际化，支持URL参数/Storage/浏览器语言检测
(function() {
  const dict = {
    'zh-CN': {
      // 导航
      nav_home: '首页', nav_about: '关于', nav_skills: '技能', nav_report: '报告', nav_projects: '项目', nav_contact: '联系', nav_converter: 'PDF转换',
      lang_toggle: 'English',
      // 英雄区
      hero_title: 'AI协作专家\n数字化产品经理',
      hero_subtitle: '精通CMS系统架构与AI工具协作，专注需求分析与实现、业务流程数字化\n14个专业项目经验，致力于用技术创新驱动业务价值',
      hero_cta: '了解更多',
      github_label: 'GitHub', email_label: '邮箱联系',
      // 关于我
      about_title: '关于我',
      about_intro_highlight: '🤖 专注于通过AI工具创造实际商业价值的数字化产品经理',
      about_intro_metrics: '14个专业项目经验 | 3年+企业数字化实战 | 企业级CMS系统上线 | 效率提升300%+成功案例 | 67%人力成本优化',
      exp_ai_tools: 'AI工具精通', exp_analysis: '需求分析', exp_digital: '数字化转型', exp_product: '产品设计',
      // 技能
      skills_title: '核心技能',
      skills_cards: [
        { title: 'AI工具精通', text: '深度掌握Claude Code、ChatGPT等主流AI工具，擅长复杂提示工程和本地大模型部署与优化。' },
        { title: '需求分析与产品', text: '将模糊业务需求精确转化为AI可执行的技术方案，擅长产品设计和项目管理。' },
        { title: 'AI协作框架', text: '设计多角色AI协作体系，擅长提示工程和技术选型指导，建立高效的人机协作工作流。' },
        { title: '数字化转型', text: '通过AI工具将传统业务流程数字化，具备丰富的流程优化和业务自动化经验。' },
        { title: '数据处理方案', text: '50万+记录处理经验，擅长设计大规模数据整合方案和数据产品架构。' },
        { title: '跨领域业务', text: '外贸、制造、内容管理等多领域的AI化改造经验，擅长跨领域整合和创新实践。' },
      ],
      // 项目
      projects_title: '项目展示',
      // 报告区（沿用既有data-i18n键）
      report_title: '简历更新报告', download_pdf: '下载报告 PDF', view_markdown: '查看完整报告（Markdown）', generated_at_label: '生成时间',
      metric_total: '总项目数', metric_recent: '最近更新', metric_significant: '显著更新', metric_ai: 'AI协作项目', metric_complexity: '平均复杂度',
      exec_summary: '执行摘要', value_prop: '价值主张', analysis_title: '专业分析维度（摘要）', sfia_note: '基于交付范围、独立性与影响力综合评估。',
      okr_o1: '强化 AI 协作商业落地：新增 2 个企业案例', okr_o2: '提升交付效率与质量：自动化覆盖 ≥60%', okr_o3: '扩大开源影响力：Star +100 / Demo 3 个',
      vc_title: '价值-复杂度优先', vc_item1: 'CMS 权限与流程模板库：高价值 / 中复杂', vc_item2: '订单→文档自动化：高价值 / 中高复杂', vc_item3: 'WPS 邮件智能助手：中高价值 / 中复杂',
      view_full_dims: '查看完整维度'
    },
    'en': {
      // Nav
      nav_home: 'Home', nav_about: 'About', nav_skills: 'Skills', nav_report: 'Report', nav_projects: 'Projects', nav_contact: 'Contact', nav_converter: 'PDF Tools',
      lang_toggle: '中文',
      // Hero
      hero_title: 'AI Collaboration Expert\nDigital Product Manager',
      hero_subtitle: 'Proficient in CMS architecture and AI collaboration; focused on requirements, delivery, and process digitization\n14 professional projects; committed to driving business value through tech innovation',
      hero_cta: 'Learn More',
      github_label: 'GitHub', email_label: 'Email',
      // About
      about_title: 'About Me',
      about_intro_highlight: '🤖 Digital product manager focused on delivering business value with AI tools',
      about_intro_metrics: '14 projects | 3+ years enterprise digitization | CMS production rollout | 300%+ efficiency | 67% cost savings',
      exp_ai_tools: 'AI Tools', exp_analysis: 'Analysis', exp_digital: 'Digital Transformation', exp_product: 'Product Design',
      // Skills
      skills_title: 'Core Skills',
      skills_cards: [
        { title: 'AI Tools Mastery', text: 'Deep experience with Claude Code, ChatGPT; skilled in complex prompting and local model optimization.' },
        { title: 'Requirements & Product', text: 'Turn ambiguous business needs into executable AI solutions; strong in product design and PM.' },
        { title: 'AI Collaboration Framework', text: 'Design multi-agent collaboration; prompting and tech guidance; build efficient human-AI workflows.' },
        { title: 'Digital Transformation', text: 'Digitize traditional processes with AI; experienced in process optimization and automation.' },
        { title: 'Data Processing', text: '500k+ records handling; design large-scale data integration and product architectures.' },
        { title: 'Cross-domain Business', text: 'Experience in trade, manufacturing, content management; strong integration and innovation across domains.' },
      ],
      // Projects
      projects_title: 'Projects',
      // Report
      report_title: 'Resume Update Report', download_pdf: 'Download Report PDF', view_markdown: 'View Full Report (Markdown)', generated_at_label: 'Generated At',
      metric_total: 'Total Repos', metric_recent: 'Recent Updates', metric_significant: 'Significant Changes', metric_ai: 'AI Projects', metric_complexity: 'Avg. Complexity',
      exec_summary: 'Executive Summary', value_prop: 'Value Proposition', analysis_title: 'Professional Dimensions (Summary)', sfia_note: 'Assessed by scope, autonomy and impact.',
      okr_o1: 'Strengthen AI collaboration: +2 enterprise cases', okr_o2: 'Improve delivery efficiency & quality: automation coverage ≥60%', okr_o3: 'Expand OSS impact: +100 Stars / 3 Demos',
      vc_title: 'Value-Complexity Priority', vc_item1: 'CMS roles & workflow templates: High value / Medium complexity', vc_item2: 'Order→Document automation: High value / Med-High complexity', vc_item3: 'WPS mail assistant: Med-High value / Medium complexity',
      view_full_dims: 'View Full Dimensions'
    }
  };

  const normalize = (lang) => {
    if (!lang) return 'zh-CN';
    const lower = lang.toLowerCase();
    if (lower.startsWith('zh')) return 'zh-CN';
    return 'en';
  };

  const detectLanguage = () => {
    const urlLang = new URLSearchParams(window.location.search).get('lang');
    if (urlLang) return normalize(urlLang);
    try {
      const saved = localStorage.getItem('site.lang');
      if (saved) return normalize(saved);
    } catch (e) {}
    const htmlLang = document.documentElement.getAttribute('lang');
    if (htmlLang) return normalize(htmlLang);
    return normalize(navigator.language || navigator.userLanguage);
  };

  const applyDataI18n = (bundle) => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (bundle[key]) el.innerHTML = bundle[key];
      const attrList = el.getAttribute('data-i18n-attr');
      if (attrList) {
        attrList.split(',').map(s => s.trim()).forEach(attr => {
          const attrKey = `${key}.${attr}`;
          if (bundle[attrKey]) el.setAttribute(attr, bundle[attrKey]);
        });
      }
    });
  };

  const applySelectorMap = (bundle) => {
    const map = {
      '.hero-title': 'hero_title',
      '.hero-subtitle': 'hero_subtitle',
      '.hero-cta span': 'hero_cta',
      '#about .section-title': 'about_title',
      '#skills .section-title': 'skills_title',
      '#projects .section-title': 'projects_title',
      '.social-link.github span': 'github_label',
      '.social-link.email span': 'email_label',
    };
    Object.entries(map).forEach(([sel, key]) => {
      const el = document.querySelector(sel);
      if (el && bundle[key]) el.textContent = bundle[key];
    });
    // 关于我：专家标签（按顺序）
    const expLabels = ['exp_ai_tools', 'exp_analysis', 'exp_digital', 'exp_product'];
    const expNodes = document.querySelectorAll('.expertise-item span');
    expNodes.forEach((el, i) => { const k = expLabels[i]; if (bundle[k]) el.textContent = bundle[k]; });

    // 技能卡片（标题+描述按顺序）
    const cards = document.querySelectorAll('.skills-grid .skill-card');
    const data = bundle.skills_cards;
    if (cards && data && data.length) {
      cards.forEach((card, i) => {
        const item = data[i];
        if (!item) return;
        const h4 = card.querySelector('h4');
        const p = card.querySelector('p');
        if (h4 && item.title) h4.textContent = item.title;
        if (p && item.text) p.textContent = item.text;
      });
    }
  };

  const updateSEO = (lang) => {
    const origin = window.location.origin || 'https://jim.aquor.space';
    const path = window.location.pathname || '/';
    const baseUrl = origin + path;
    const canonicalLink = document.getElementById('canonicalLink');
    if (canonicalLink) canonicalLink.setAttribute('href', lang === 'en' ? baseUrl + '?lang=en' : baseUrl);
    const zh = document.getElementById('hreflangZh');
    const en = document.getElementById('hreflangEn');
    if (zh) zh.setAttribute('href', baseUrl);
    if (en) en.setAttribute('href', baseUrl + '?lang=en');
    const ogUrl = document.getElementById('ogUrl');
    if (ogUrl) ogUrl.setAttribute('content', lang === 'en' ? (baseUrl + '?lang=en') : baseUrl);
  };

  const applyTranslations = (lang) => {
    const bundle = dict[lang] || dict['zh-CN'];
    document.documentElement.setAttribute('lang', lang);
    document.title = (lang === 'en') ? 'Jim - AI Collaboration Expert & Product Manager | Resume' : 'Jim - AI协作专家 & 产品经理 | 个人简历';
    applyDataI18n(bundle);
    applySelectorMap(bundle);
    try { localStorage.setItem('site.lang', lang); } catch (e) {}
    updateSEO(lang);
    document.dispatchEvent(new CustomEvent('i18n:languageChanged', { detail: { lang } }));
  };

  const setLanguage = (lang) => {
    const next = normalize(lang);
    applyTranslations(next);
    const url = new URL(window.location.href);
    if (next === 'zh-CN') url.searchParams.delete('lang'); else url.searchParams.set('lang', 'en');
    window.history.replaceState({}, '', url.toString());
  };

  // 初始化
  const initial = detectLanguage();
  applyTranslations(initial);
  const btn = document.getElementById('langToggle');
  if (btn) btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('lang') || 'zh-CN';
    const next = current === 'zh-CN' ? 'en' : 'zh-CN';
    setLanguage(next);
  });

  // 观察新增节点（动态内容）
  const mo = new MutationObserver((mutations) => {
    const lang = document.documentElement.getAttribute('lang') || 'zh-CN';
    const bundle = dict[lang] || dict['zh-CN'];
    mutations.forEach(m => {
      m.addedNodes && m.addedNodes.forEach(node => {
        if (node.nodeType === 1) { // Element
          const el = node;
          if (el.hasAttribute && el.hasAttribute('data-i18n')) {
            const key = el.getAttribute('data-i18n');
            if (bundle[key]) el.innerHTML = bundle[key];
          }
        }
      });
    });
  });
  mo.observe(document.body, { childList: true, subtree: true });

  // 暴露接口
  window.i18n = { setLanguage, getLanguage: () => document.documentElement.getAttribute('lang') };
})();