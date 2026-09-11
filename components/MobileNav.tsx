'use client'

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { Fragment, useState, useEffect, useRef } from 'react'
import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false)
  const [mounted, setMounted] = useState(false)
  const navRef = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        enableBodyScroll(navRef.current)
      } else {
        // Prevent scrolling
        disableBodyScroll(navRef.current)
      }
      return !status
    })
  }

  useEffect(() => {
    return clearAllBodyScrollLocks
  })

  return (
    <>
      <button
        aria-label="Toggle Menu"
        onClick={onToggleNav}
        className="text-charcoal hover:text-terracotta transition-colors sm:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-7 w-7"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {mounted && (
        <Transition appear show={navShow} as={Fragment} unmount={false}>
          <Dialog as="div" onClose={onToggleNav} unmount={false}>
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              unmount={false}
            >
              <div className="bg-charcoal/30 fixed inset-0 z-60 backdrop-blur-sm" />
            </TransitionChild>

            <TransitionChild
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full opacity-0"
              enterTo="translate-x-0 opacity-100"
              leave="transition ease-in duration-200 transform"
              leaveFrom="translate-x-0 opacity-100"
              leaveTo="translate-x-full opacity-0"
              unmount={false}
            >
              <DialogPanel className="border-warm-gray bg-cream/98 fixed top-0 right-0 z-70 h-full w-4/5 max-w-sm border-l p-6 shadow-2xl backdrop-blur-md duration-300">
                <div className="border-warm-gray flex items-center justify-between border-b pb-4">
                  <div className="text-charcoal font-serif text-lg font-medium">导航 / Menu</div>
                  <button
                    className="text-charcoal hover:text-terracotta p-2 transition-colors"
                    aria-label="Close Menu"
                    onClick={onToggleNav}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                <nav
                  ref={navRef}
                  className="mt-6 flex flex-col items-start space-y-4 overflow-y-auto"
                >
                  {headerNavLinks.map((link) => (
                    <Link
                      key={link.title}
                      href={link.href}
                      className="text-charcoal hover:text-terracotta font-serif text-lg tracking-wider transition-colors"
                      onClick={onToggleNav}
                    >
                      {link.title}
                    </Link>
                  ))}
                </nav>
              </DialogPanel>
            </TransitionChild>
          </Dialog>
        </Transition>
      )}
    </>
  )
}

export default MobileNav
