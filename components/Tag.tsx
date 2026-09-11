import Link from 'next/link'
import { slug } from 'github-slugger'

interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="border-terracotta/20 bg-terracotta/10 text-terracotta hover:border-terracotta/40 hover:bg-terracotta/20 hover:text-terracotta-dark inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs font-medium tracking-wide transition-all duration-200"
    >
      #{text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
