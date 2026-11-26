interface Project {
  title: string
  description: string
  href?: string
  repo?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'WPS MCP Server（已开源 · npm）',
    description:
      '基于 Model Context Protocol 构建的 WPS 365 开放平台服务端，让 Claude / Cursor 等智能体直接调度表格与文档自动化协同。',
    imgSrc: '/resume/images/proj-mcp.svg',
    href: '/blog/wps-mcp-server-guide',
    repo: 'https://github.com/Jim-purch/jim-wps-mcp-server',
  },
  {
    title: '企业云表格 SaaS 与跨表检索系统',
    description:
      '基于 Next.js 16 与 Supabase 构建的云表格令牌管理与跨表多条件搜索中台，支持权限分享、多租户 RLS 隔离与一键生成 MCP 配置。',
    imgSrc: '/resume/images/proj-saas.svg',
    href: '/blog/cloud-sheet-saas-guide',
    repo: 'https://github.com/Jim-purch/websearch-wps-webhook',
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
      '结合经典 OH 卡潜意识投射原理与 Gemini 2.0 多模态能力，通过两步阶梯式引导实现无偏见的自我深度对话，纯前端高隐私运行。',
    imgSrc: '/resume/images/proj-mindmirror.svg',
    href: '/blog/oh-mindmirror-intro',
    repo: 'https://github.com/Jim-purch/OH-MindMirror',
  },
  {
    title: 'Mac Voice to Text（macOS 免驱动内录）',
    description:
      '基于 Apple ScreenCaptureKit 实现的系统内录与双通道混音工具，免装虚拟声卡即可实时流式调用 Whisper 进行高精度文字转换。',
    imgSrc: '/resume/images/proj-telechat.svg',
    href: '/blog/mac-voice-to-text-guide',
    repo: 'https://github.com/Jim-purch/mac-voice-to-text',
  },
  {
    title: '纯前端批量水印工具（隐私优先 · Docker）',
    description:
      '完全在本地浏览器 Canvas 离屏多线程处理的批量水印工具，零数据上传，附带仅 15MB 极轻量 Docker 镜像方便企业私有化部署。',
    imgSrc: '/resume/images/proj-watermark.svg',
    href: '/blog/batch-watermark-privacy-guide',
    repo: 'https://github.com/Jim-purch/put-watermark-web',
  },
  {
    title: 'TeleChat 语音思考双通道机器人',
    description:
      '整合 DeepSeek 深度推理与 MiniMax 逼真情感语音合成，打造具备多轮上下文记忆与语音实时收发能力的 7x24 小时随身智能助手。',
    imgSrc: '/resume/images/proj-telechat.svg',
    href: '/blog/telechat-voice-bot',
    repo: 'https://github.com/Jim-purch/telechat',
  },
]

export default projectsData
