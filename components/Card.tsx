import Image from './Image'
import Link from './Link'

const Card = ({ title, description, imgSrc, href }) => (
  <div className="md max-w-[544px] p-4 md:w-1/2">
    <div className="group border-warm-gray bg-cream-light hover:border-charcoal-light/30 flex h-full flex-col overflow-hidden rounded-lg border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {imgSrc &&
        (href ? (
          <Link href={href} aria-label={`Link to ${title}`} className="overflow-hidden">
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
      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-charcoal group-hover:text-terracotta mb-3 font-serif text-xl font-medium transition-colors">
          {href ? (
            <Link href={href} aria-label={`Link to ${title}`}>
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
        <p className="text-charcoal-light mb-4 flex-1 text-sm leading-relaxed">{description}</p>
        {href && (
          <Link
            href={href}
            className="text-terracotta hover:text-terracotta-dark inline-flex items-center text-sm font-medium transition-colors"
            aria-label={`Link to ${title}`}
          >
            阅读文档 / Explore &rarr;
          </Link>
        )}
      </div>
    </div>
  </div>
)

export default Card
