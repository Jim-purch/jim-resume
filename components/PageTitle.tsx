import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function PageTitle({ children }: Props) {
  return (
    <h1 className="text-charcoal font-serif text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl lg:leading-tight">
      {children}
    </h1>
  )
}
