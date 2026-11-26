import Image from './Image'
import Link from './Link'

const Card = ({ title, description, imgSrc, href, repo }) => (
  <div className="md max-w-[544px] p-4 md:w-1/2">
    <div className="group aura-spotlight-card aura-corner-ticks border-warm-gray bg-cream-light hover:border-terracotta/50 flex h-full flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {imgSrc &&
        (href || repo ? (
          <Link href={href || repo} aria-label={`Link to ${title}`} className="overflow-hidden">
            <Image
              alt={title}
              src={imgSrc}
              className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              width={544}
              height={306}
            />
          </Link>
        ) : (
          <div className="overflow-hidden">
            <Image
              alt={title}
              src={imgSrc}
              className="h-48 w-full object-cover"
              width={544}
              height={306}
            />
          </div>
        ))}
      <div className="relative z-10 flex flex-1 flex-col p-6">
        <h2 className="text-charcoal group-hover:text-terracotta mb-3 font-serif text-xl font-medium transition-colors">
          {href || repo ? (
            <Link href={href || repo} aria-label={`Link to ${title}`}>
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
        <p className="text-charcoal-light mb-5 flex-1 text-sm leading-relaxed">{description}</p>
        <div className="border-warm-gray/60 flex flex-wrap items-center gap-3 border-t border-dashed pt-4">
          {repo && (
            <Link
              href={repo}
              className="border-warm-gray bg-cream text-charcoal hover:border-terracotta hover:text-terracotta inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs font-medium transition-colors"
              aria-label={`GitHub repository for ${title}`}
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>GitHub 源码</span>
            </Link>
          )}
          {href && (
            <Link
              href={href}
              className="text-terracotta hover:text-terracotta-dark inline-flex items-center font-mono text-xs font-medium transition-colors"
              aria-label={`Link to ${title}`}
            >
              阅读文档 / Guide &rarr;
            </Link>
          )}
        </div>
      </div>
    </div>
  </div>
)

export default Card
