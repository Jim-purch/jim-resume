import { ReactNode } from 'react'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

interface LayoutProps {
  content: CoreContent<Blog>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export default function PostLayout({ content, next, prev, children }: LayoutProps) {
  const { path, slug, date, title } = content

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article className="py-6 sm:py-10">
        <div>
          <header>
            <div className="border-warm-gray space-y-2 border-b pb-8 text-center sm:pb-10">
              <dl>
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-stone font-mono text-xs tracking-widest uppercase">
                    <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div className="divide-warm-gray divide-y pb-8">
            <div className="divide-warm-gray divide-y">
              <div className="prose text-charcoal-light max-w-none pt-8 pb-10">{children}</div>
            </div>
            {siteMetadata.comments && (
              <div className="text-charcoal-light py-6 text-center" id="comment">
                <Comments slug={slug} />
              </div>
            )}
            <footer>
              <div className="flex flex-col gap-4 font-mono text-xs sm:flex-row sm:justify-between sm:text-sm">
                {prev && prev.path && (
                  <div className="pt-4">
                    <Link
                      href={`/${prev.path}`}
                      className="text-terracotta hover:text-terracotta-dark transition-colors"
                      aria-label={`上一篇: ${prev.title}`}
                    >
                      &larr; {prev.title}
                    </Link>
                  </div>
                )}
                {next && next.path && (
                  <div className="pt-4">
                    <Link
                      href={`/${next.path}`}
                      className="text-terracotta hover:text-terracotta-dark transition-colors"
                      aria-label={`下一篇: ${next.title}`}
                    >
                      {next.title} &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
