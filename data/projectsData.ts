interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'OH-MindMirror',
    description: `通过类似于 OH 卡的方式进行 AI 引导式自我探索。基于 TypeScript 构建，
    结合 AI 与心理学意象对话，帮助用户在视觉化的卡片中展开深度自我反思。`,
    href: 'https://github.com/Jim-purch/OH-MindMirror',
  },
  {
    title: 'Know Yourself Tools',
    description: `一个可以通过人工咨询 + AI，结合常用工具，帮助你了解你自己的 Web 项目。
    面向咨询场景的一体化工具平台。`,
    href: 'https://github.com/Jim-purch/know-yourself-tools',
  },
  {
    title: 'WPS MCP Server',
    description: `面向 MCP（Model Context Protocol）生态的 WPS 文档服务接入，
    让 AI 助手能够读写 WPS 文档，是 AI 协作场景下的本地化能力扩展。`,
    href: 'https://github.com/Jim-purch/jim-wps-mcp-server',
  },
  {
    title: 'WebSearch WPS Webhook',
    description: `结合 Web 搜索能力与 WPS 自动化的 Webhook 服务，已部署到 Vercel。
    用于把搜索结果实时回流到 WPS 表格中。`,
    href: 'https://github.com/Jim-purch/websearch-wps-webhook',
  },
  {
    title: 'Mac Voice to Text',
    description: `桌面端应用 —— 可以将内录（系统正在播放的声音）和外录（麦克风输入）
    实时转为文字，支持 macOS 平台，MIT 开源。`,
    href: 'https://github.com/Jim-purch/mac-voice-to-text',
  },
  {
    title: 'Parts Catalog PDF to XLSX',
    description: `自动把矢量 PDF 格式的产品手册（含图片）转换为 XLSX 表格，
    用于零部件目录的批量数字化，节省大量人工录入时间。`,
    href: 'https://github.com/Jim-purch/parts-catalog-pdf-to-xlsx',
  },
]

export default projectsData
