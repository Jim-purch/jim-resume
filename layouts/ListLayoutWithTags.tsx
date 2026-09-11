'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const basePath = pathname
    .replace(/^\//, '')
    .replace(/\/page\/\d+\/?$/, '')
    .replace(/\/$/, '')
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="pt-8 pb-8">
      <nav className="text-stone flex items-center justify-between font-mono text-xs">
        {!prevPage && (
          <button
            className="border-warm-gray cursor-not-allowed rounded border px-3 py-1.5 opacity-40"
            disabled
          >
            &larr; Previous / 上一页
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
            className="border-warm-gray bg-cream-light text-charcoal hover:border-terracotta hover:text-terracotta rounded border px-3 py-1.5 transition-colors"
          >
            &larr; Previous / 上一页
          </Link>
        )}
        <span className="font-mono">
          {currentPage} / {totalPages}
        </span>
        {!nextPage && (
          <button
            className="border-warm-gray cursor-not-allowed rounded border px-3 py-1.5 opacity-40"
            disabled
          >
            Next / 下一页 &rarr;
          </button>
        )}
        {nextPage && (
          <Link
            href={`/${basePath}/page/${currentPage + 1}`}
            rel="next"
            className="border-warm-gray bg-cream-light text-charcoal hover:border-terracotta hover:text-terracotta rounded border px-3 py-1.5 transition-colors"
          >
            Next / 下一页 &rarr;
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <div className="py-6 sm:py-10">
      {/* 顶部标题区 */}
      <div className="border-warm-gray border-b pb-8">
        <div className="text-terracotta flex items-center gap-2 font-mono text-xs font-medium tracking-widest uppercase">
          <span className="bg-terracotta inline-block h-1.5 w-1.5 rounded-full" />
          Engineering Notes & Open Source
        </div>
        <h1 className="text-charcoal mt-2 font-serif text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
          {title}
        </h1>
        <p className="text-charcoal-light mt-2 text-sm sm:text-base">
          记录在 AI 生态构建、MCP 扩展、分布式高并发与垂直 SaaS 产品开发中的深度实战经验。
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* 左侧标签筛选栏 */}
        <aside className="w-full shrink-0 lg:w-64">
          <div className="border-warm-gray bg-cream-light rounded-lg border p-5 shadow-xs">
            <div className="border-warm-gray/60 border-b pb-3">
              <span className="text-charcoal font-serif text-xs font-semibold tracking-wider uppercase">
                标签分类 / Tags
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-1.5">
              <Link
                href="/blog"
                className={`flex items-center justify-between rounded px-2.5 py-1.5 text-xs transition-colors ${
                  pathname === '/blog' || pathname.startsWith('/blog/page')
                    ? 'bg-terracotta/15 text-terracotta font-medium'
                    : 'text-charcoal-light hover:bg-cream-dark/60 hover:text-charcoal'
                }`}
              >
                <span>全部文章 / All</span>
                <span className="text-stone font-mono text-[10px]">({posts.length})</span>
              </Link>
              {sortedTags.map((t) => {
                const isSelected = decodeURI(pathname.split('/tags/')[1] || '') === slug(t)
                return (
                  <Link
                    key={t}
                    href={`/tags/${slug(t)}`}
                    className={`flex items-center justify-between rounded px-2.5 py-1.5 text-xs transition-colors ${
                      isSelected
                        ? 'bg-terracotta/15 text-terracotta font-medium'
                        : 'text-charcoal-light hover:bg-cream-dark/60 hover:text-charcoal'
                    }`}
                  >
                    <span>#{t}</span>
                    <span className="text-stone font-mono text-[10px]">({tagCounts[t]})</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </aside>

        {/* 右侧文章列表 */}
        <div className="flex-1 space-y-5">
          <ul className="space-y-4">
            {displayPosts.map((post) => {
              const { path, date, title: postTitle, summary, tags } = post
              return (
                <li key={path}>
                  <article className="group border-warm-gray bg-cream-light hover:border-charcoal-light/30 relative rounded-lg border p-6 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="text-stone flex items-center justify-between font-mono text-xs">
                      <time dateTime={date} suppressHydrationWarning>
                        {formatDate(date, siteMetadata.locale)}
                      </time>
                      <span className="text-terracotta text-[10px] tracking-widest uppercase">
                        Article
                      </span>
                    </div>

                    <h2 className="text-charcoal group-hover:text-terracotta mt-2.5 font-serif text-xl font-medium tracking-normal transition-colors sm:text-2xl">
                      <Link href={`/${path}`} className="block">
                        {postTitle}
                      </Link>
                    </h2>

                    <p className="text-charcoal-light mt-2.5 text-sm leading-relaxed sm:text-base">
                      {summary}
                    </p>

                    <div className="border-warm-gray mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-dashed pt-4">
                      <div className="flex flex-wrap gap-1.5">
                        {tags?.map((tag) => (
                          <Tag key={tag} text={tag} />
                        ))}
                      </div>
                      <Link
                        href={`/${path}`}
                        className="text-terracotta hover:text-terracotta-dark inline-flex items-center text-xs font-medium transition-colors"
                      >
                        阅读全文 &rarr;
                      </Link>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>

          {pagination && pagination.totalPages > 1 && (
            <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
          )}
        </div>
      </div>
    </div>
  )
}
