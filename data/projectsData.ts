interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'WPS MCP Server（已开源 · npm）',
    description:
      '基于 Model Context Protocol 构建的 WPS 365 开放平台服务端，让 Claude / Cursor 等智能体直接调度表格与文档自动化协同。',
    imgSrc: '/resume/images/proj-mcp.svg',
    href: '/blog/wps-mcp-server-guide',
  },
  {
    title: 'OH-MindMirror 心理投射工具（开源）',
    description:
      '结合经典 OH 卡潜意识投射原理与 Gemini 2.0 多模态能力，通过两步阶梯式引导实现无偏见的自我深度对话，纯前端高隐私运行。',
    imgSrc: '/resume/images/proj-mindmirror.svg',
    href: '/blog/oh-mindmirror-intro',
  },
  {
    title: '2000万+ 配件数据分布式架构实践',
    description:
      '工业级全车件数据系统。采用 PostgreSQL 分区、Redis 多级缓存与 Elasticsearch 倒排检索，实现亚秒级模糊响应与跨国数据同步。',
    imgSrc: '/resume/images/proj-database.svg',
    href: '/blog/parts-database-architecture',
  },
  {
    title: '企业云表格 SaaS 与全文检索系统',
    description:
      '基于 Next.js 16 与 Supabase 构建的高性能云表格中台，支持千万级物料模糊搜索、百万行 Excel 流式解析与多租户行级安全隔离。',
    imgSrc: '/resume/images/proj-saas.svg',
    href: '/blog/cloud-sheet-saas-guide',
  },
  {
    title: 'Mac Voice to Text（macOS 免驱动内录）',
    description:
      '基于 Apple ScreenCaptureKit 实现的系统内录与双通道混音工具，免装虚拟声卡即可实时流式调用 Whisper 进行高精度文字转换。',
    imgSrc: '/resume/images/proj-telechat.svg',
    href: '/blog/mac-voice-to-text-guide',
  },
  {
    title: '纯前端批量水印工具（隐私优先 · Docker）',
    description:
      '完全在本地浏览器 Canvas 离屏多线程处理的批量水印工具，零数据上传，附带仅 15MB 极轻量 Docker 镜像方便企业私有化部署。',
    imgSrc: '/resume/images/proj-watermark.svg',
    href: '/blog/batch-watermark-privacy-guide',
  },
  {
    title: 'TeleChat 语音思考双通道机器人',
    description:
      '整合 DeepSeek 深度推理与 MiniMax 逼真情感语音合成，打造具备多轮上下文记忆与语音实时收发能力的 7x24 小时随身智能助手。',
    imgSrc: '/resume/images/proj-telechat.svg',
    href: '/blog/telechat-voice-bot',
  },
]

export default projectsData
