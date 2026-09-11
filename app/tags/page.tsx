import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { slug } from 'github-slugger'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Tags / 标签索引',
  description: '文章主题与技术标签分类',
})

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-terracotta flex items-center justify-center gap-2 font-mono text-xs font-medium tracking-widest uppercase">
          <span className="bg-terracotta inline-block h-1.5 w-1.5 rounded-full" />
          Taxonomy & Index
        </div>
        <h1 className="text-charcoal mt-2 font-serif text-3xl font-medium tracking-tight sm:text-4xl">
          标签分类索引
        </h1>
        <p className="text-charcoal-light mt-2 text-sm">按技术主题快速筛选文章与工程指南</p>
      </div>

      <div className="border-warm-gray bg-cream-light mx-auto mt-10 max-w-3xl rounded-lg border p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {tagKeys.length === 0 && <p className="text-charcoal-light text-sm">暂无标签分类</p>}
          {sortedTags.map((t) => {
            return (
              <div key={t} className="flex items-center gap-1.5">
                <Tag text={t} />
                <Link
                  href={`/tags/${slug(t)}`}
                  className="text-stone hover:text-charcoal font-mono text-xs transition-colors"
                  aria-label={`查看包含 ${t} 标签的文章`}
                >
                  ({tagCounts[t]})
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
