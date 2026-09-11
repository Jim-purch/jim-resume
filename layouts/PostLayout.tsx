import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import SectionContainer from '@/components/SectionContainer'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/main/data/${path}`

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, path, slug, date, title, tags } = content
  const basePath = path.split('/')[0]

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article className="py-6 sm:py-10">
        <div className="divide-warm-gray divide-y">
          {/* 文章头部信息 */}
          <header className="pt-6 pb-8 text-center sm:pb-10">
            <div className="space-y-3">
              <div className="text-stone flex items-center justify-center gap-2 font-mono text-xs tracking-widest uppercase">
                <span className="bg-terracotta inline-block h-1.5 w-1.5 rounded-full" />
                <time dateTime={date}>
                  {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                </time>
              </div>
              <h1 className="text-charcoal mx-auto max-w-4xl font-serif text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl lg:leading-tight">
                {title}
              </h1>
              {tags && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {tags.map((tag) => (
                    <Tag key={tag} text={tag} />
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* 文章内容与侧边元信息 */}
          <div className="divide-warm-gray grid-rows-[auto_1fr] divide-y pb-12 xl:grid xl:grid-cols-4 xl:gap-x-8 xl:divide-y-0">
            {/* 左侧作者与元信息栏 */}
            <dl className="xl:border-warm-gray pt-6 pb-8 xl:border-b xl:pt-10">
              <dt className="sr-only">作者</dt>
              <dd>
                <ul className="flex flex-wrap justify-center gap-4 sm:space-x-12 xl:block xl:space-y-6 xl:space-x-0">
                  {authorDetails.map((author) => (
                    <li className="flex items-center space-x-3" key={author.name}>
                      {author.avatar && (
                        <Image
                          src={author.avatar}
                          width={40}
                          height={40}
                          alt="avatar"
                          className="border-warm-gray h-10 w-10 rounded-full border object-cover"
                        />
                      )}
                      <dl className="text-sm leading-5 font-medium whitespace-nowrap">
                        <dt className="sr-only">Name</dt>
                        <dd className="text-charcoal font-serif text-base">{author.name}</dd>
                        <dt className="sr-only">Role</dt>
                        <dd className="text-stone font-mono text-xs">AI协作 & 全栈创造者</dd>
                      </dl>
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>

            {/* 正文区域 */}
            <div className="divide-warm-gray divide-y xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose text-charcoal-light max-w-none pt-8 pb-10">{children}</div>

              {/* 文章底部工具栏 */}
              <div className="text-stone flex items-center justify-between py-6 font-mono text-xs">
                <Link href={editUrl(filePath)} className="hover:text-terracotta transition-colors">
                  在 GitHub 查看源码 &rarr;
                </Link>
                <span>感谢阅读与实践</span>
              </div>

              {siteMetadata.comments && (
                <div className="text-charcoal-light py-6 text-center" id="comment">
                  <Comments slug={slug} />
                </div>
              )}
            </div>

            {/* 侧边/底部前向与后向文章导航 */}
            <footer>
              <div className="divide-warm-gray text-sm leading-5 font-medium xl:col-start-1 xl:row-start-2 xl:divide-y">
                {(next || prev) && (
                  <div className="flex justify-between py-6 xl:block xl:space-y-6 xl:py-8">
                    {prev && prev.path && (
                      <div>
                        <h2 className="text-stone font-mono text-[11px] tracking-wider uppercase">
                          &larr; 上一篇 / Previous
                        </h2>
                        <div className="text-charcoal hover:text-terracotta mt-1 font-serif text-sm transition-colors">
                          <Link href={`/${prev.path}`}>{prev.title}</Link>
                        </div>
                      </div>
                    )}
                    {next && next.path && (
                      <div className="mt-4 xl:mt-6">
                        <h2 className="text-stone font-mono text-[11px] tracking-wider uppercase">
                          下一篇 / Next &rarr;
                        </h2>
                        <div className="text-charcoal hover:text-terracotta mt-1 font-serif text-sm transition-colors">
                          <Link href={`/${next.path}`}>{next.title}</Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="pt-4 xl:pt-8">
                <Link
                  href={`/${basePath}`}
                  className="text-terracotta hover:text-terracotta-dark inline-flex items-center font-mono text-xs font-medium transition-colors"
                  aria-label="返回文章列表"
                >
                  &larr; 返回文章列表 / Back to Blog
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
