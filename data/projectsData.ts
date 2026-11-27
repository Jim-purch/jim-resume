interface Project {
  title: string
  description: string
  href?: string
  repo?: string
  demo?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'WPS MCP Server（已开源 · npm）',
    description:
      '基于 Model Context Protocol 与 WPS AirScript Webhook 构建的云表格查询服务端，让 Claude / Cursor 等智能体直接检索智能表格与多维表格数据。',
    imgSrc: '/resume/images/proj-mcp.svg',
    href: '/blog/wps-mcp-server-guide',
    repo: 'https://github.com/Jim-purch/jim-wps-mcp-server',
  },
  {
    title: '企业云表格 SaaS 与跨表检索系统',
    description:
      '基于 Next.js 16 与 Supabase 构建的云表格令牌管理与跨表多条件搜索中台，支持权限分享、多租户 RLS 隔离、免登录沙盒演示与一键生成 MCP 配置。',
    imgSrc: '/resume/images/proj-saas.svg',
    href: '/blog/cloud-sheet-saas-guide',
    repo: 'https://github.com/Jim-purch/websearch-wps-webhook',
    demo: 'https://websearch-wps-webhook.vercel.app/demo',
  },
  {
    title: '2000万+ 配件数据分布式架构实践',
    description:
      '工业级全车件数据系统（企业私有核心库，配套矢量目录提取工具已开源）。采用 PostgreSQL 分区、Redis 多级缓存与 Elasticsearch 倒排检索。',
    imgSrc: '/resume/images/proj-database.svg',
    href: '/blog/parts-database-architecture',
    repo: 'https://github.com/Jim-purch/parts-catalog-pdf-to-xlsx',
  },
  {
    title: 'Sheets2Kdocs — Google 表格定时同步金山文档',
    description:
      '基于 FastAPI 构建的自托管定时同步连接器，支持可视化管理后台、字段映射及 Upsert / Replace 双模式同步至 WPS 智能表格。',
    imgSrc: '/resume/images/proj-automation.svg',
    repo: 'https://github.com/Jim-purch/sheets2kdocs',
  },
  {
    title: 'OH-MindMirror 心理投射工具（开源）',
    description:
      '结合经典 OH 卡潜意识投射原理与 Gemini 多模态视觉理解（亦兼容 OpenAI 接口），支持 3D 翻牌、结构化引导对话与 PNG 心语卡片导出，纯前端高隐私运行。',
    imgSrc: '/resume/images/proj-mindmirror.svg',
    href: '/blog/oh-mindmirror-intro',
    repo: 'https://github.com/Jim-purch/OH-MindMirror',
    demo: 'https://oh-mindmirror.vercel.app',
  },
  {
    title: '知己工具箱 Know Yourself Tools（开源）',
    description:
      '面向自我探索与心理觉察的纯前端综合工具箱，集成 AI 生活教练（GROW 模型）、MBTI 性格测试、OH 卡探索、八字排盘与紫微斗数，数据纯本地存储。',
    imgSrc: '/resume/images/proj-mindmirror.svg',
    repo: 'https://github.com/Jim-purch/know-yourself-tools',
    demo: 'https://know-yourself-tools.vercel.app',
  },
  {
    title: '台球大师 ball-webgame（Web 物理桌球）',
    description:
      '基于 Next.js 16 与 Matter.js 物理引擎构建的网页桌球游戏，支持美式 8 球、9 球与英式斯诺克，含力度/加塞控制、本地双人、AI 对战与 Supabase 在线联机。',
    imgSrc: '/resume/images/proj-starkark.svg',
    repo: 'https://github.com/Jim-purch/ball-webgame',
    demo: 'https://ball-webgame.vercel.app',
  },
  {
    title: '纯前端批量水印工具（隐私优先 · Docker）',
    description:
      '基于 Vite + React + HTML5 Canvas 的浏览器本地批量水印与图片处理工具箱（含 PDF 转换、文件提取与 ICO 转换），零数据上传，附带 Docker + Nginx 私有化方案。',
    imgSrc: '/resume/images/proj-watermark.svg',
    href: '/blog/batch-watermark-privacy-guide',
    repo: 'https://github.com/Jim-purch/put-watermark-web',
    demo: 'https://put-watermark-web.vercel.app',
  },
  {
    title: 'Mac Voice to Text（macOS 免驱动内录）',
    description:
      '基于 Tauri v2 + Rust + Swift (ScreenCaptureKit & SFSpeechRecognizer) 实现的系统内录实时转文字桌面端，免装虚拟声卡且端侧离线运行。',
    imgSrc: '/resume/images/proj-telechat.svg',
    href: '/blog/mac-voice-to-text-guide',
    repo: 'https://github.com/Jim-purch/mac-voice-to-text',
  },
  {
    title: 'TeleChat 文本+语音双输出机器人',
    description:
      '基于 Node.js 整合 DeepSeek / Kimi 多模型推理与 MiniMax 高拟真语音合成，打造具备多轮上下文记忆与文字+语音双输出能力的 7x24 小时随身助手。',
    imgSrc: '/resume/images/proj-telechat.svg',
    href: '/blog/telechat-voice-bot',
    repo: 'https://github.com/Jim-purch/telechat',
  },
]

export default projectsData
