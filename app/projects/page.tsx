import projectsData from '@/data/projectsData'
import Card from '@/components/Card'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Projects / 项目作品' })

export default function Projects() {
  return (
    <div className="py-6 sm:py-10">
      <div className="border-warm-gray border-b pb-8">
        <div className="text-terracotta flex items-center gap-2 font-mono text-xs font-medium tracking-widest uppercase">
          <span className="bg-terracotta inline-block h-1.5 w-1.5 rounded-full" />
          FIG.03 // Featured Work &amp; Architecture
        </div>
        <h1 className="text-charcoal mt-2 font-serif text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
          <span data-rough="underline">精选项目</span>与工程实践
        </h1>
        <p className="text-charcoal-light mt-2 text-sm sm:text-base">
          涵盖 <span data-rough="highlight">AI Agent 协议实现 (MCP)</span>
          、千万级分布式数据库架构、垂直领域 SaaS 与端侧语音效率工具。
        </p>
      </div>
      <div className="py-10 sm:py-12">
        <div className="-m-4 flex flex-wrap">
          {projectsData.map((d) => (
            <Card
              key={d.title}
              title={d.title}
              description={d.description}
              imgSrc={d.imgSrc}
              href={d.href}
              repo={d.repo}
              demo={d.demo}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
