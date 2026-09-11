import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer className="border-warm-gray bg-cream-dark/40 text-charcoal mt-24 border-t py-12 transition-colors">
      <div className="mx-auto flex flex-col justify-between gap-8 md:flex-row md:items-start">
        {/* Brand Column */}
        <div className="max-w-sm space-y-3">
          <div className="text-charcoal font-serif text-lg font-medium tracking-wide">
            {siteMetadata.author}
          </div>
          <p className="text-charcoal-light text-sm leading-relaxed opacity-85">
            {siteMetadata.description ||
              'AI 协作践行者 & 全栈数字化产品创造者。探索人机共生的工程范式。'}
          </p>
          <div className="text-stone font-mono text-xs tracking-wider">
            HUMAN DIRECTION · AI POSSIBILITY
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3 text-sm">
          <div className="text-stone font-serif text-xs tracking-widest uppercase">
            站点导航 / Navigate
          </div>
          <ul className="text-charcoal-light space-y-2">
            <li>
              <Link href="/" className="hover:text-terracotta transition-colors">
                个人主页 / Home
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-terracotta transition-colors">
                技术手记 / Blog
              </Link>
            </li>
            <li>
              <Link href="/projects" className="hover:text-terracotta transition-colors">
                开源项目 / Projects
              </Link>
            </li>
            <li>
              <Link href="/tags" className="hover:text-terracotta transition-colors">
                标签分类 / Tags
              </Link>
            </li>
          </ul>
        </div>

        {/* Social / Connect */}
        <div className="space-y-3 text-sm">
          <div className="text-stone font-serif text-xs tracking-widest uppercase">
            连接 / Connect
          </div>
          <div className="flex flex-wrap gap-3">
            {siteMetadata.email && (
              <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={5} />
            )}
            {siteMetadata.github && (
              <SocialIcon kind="github" href={siteMetadata.github} size={5} />
            )}
            {siteMetadata.x && <SocialIcon kind="x" href={siteMetadata.x} size={5} />}
            {siteMetadata.linkedin && (
              <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={5} />
            )}
          </div>
          <div className="text-stone pt-2 text-xs">
            © {new Date().getFullYear()} {siteMetadata.author}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
