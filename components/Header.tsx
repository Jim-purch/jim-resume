import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'

const Header = () => {
  let headerClass =
    'flex items-center w-full bg-cream/85 backdrop-blur-md justify-between py-5 border-b border-warm-gray transition-colors'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle} className="group">
        <div className="flex items-center justify-between">
          <div className="mr-3 transition-transform duration-300 group-hover:scale-105">
            <Logo />
          </div>
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="text-charcoal group-hover:text-terracotta font-serif text-xl font-medium tracking-wider transition-colors sm:block">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-3 leading-5 sm:space-x-5">
        <nav className="no-scrollbar hidden items-center gap-x-6 overflow-x-auto sm:flex">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-charcoal-light hover:text-terracotta text-sm font-medium tracking-wide transition-colors duration-200"
              >
                {link.title}
              </Link>
            ))}
        </nav>
        <div className="border-warm-gray flex items-center gap-2 border-l pl-3">
          <SearchButton />
          <ThemeSwitch />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

export default Header
