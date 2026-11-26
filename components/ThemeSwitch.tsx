'use client'

import { Fragment, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Radio,
  RadioGroup,
  Transition,
} from '@headlessui/react'

const Sun = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
)

const Moon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const Monitor = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
)

const Blank = () => <svg className="h-4 w-4" />

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  return (
    <div className="flex items-center">
      <Menu as="div" className="relative inline-block text-left">
        <div className="flex items-center justify-center">
          <MenuButton
            aria-label="Theme switcher"
            className="border-warm-gray bg-cream-light text-charcoal hover:border-terracotta hover:text-terracotta inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border transition-colors"
          >
            {mounted ? resolvedTheme === 'dark' ? <Moon /> : <Sun /> : <Blank />}
          </MenuButton>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="border-warm-gray bg-cream-light text-charcoal absolute right-0 z-50 mt-2 w-36 origin-top-right rounded-lg border p-1 shadow-xl focus:outline-hidden">
            <RadioGroup value={theme} onChange={setTheme}>
              <div className="space-y-0.5 p-0.5">
                <Radio value="light">
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        className={`${focus ? 'bg-terracotta/15 text-terracotta' : ''} group flex w-full cursor-pointer items-center rounded-md px-2.5 py-1.5 font-mono text-xs transition-colors`}
                      >
                        <div className="mr-2">
                          <Sun />
                        </div>
                        暖纸 Light
                      </button>
                    )}
                  </MenuItem>
                </Radio>
                <Radio value="dark">
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        className={`${
                          focus ? 'bg-terracotta/15 text-terracotta' : ''
                        } group flex w-full cursor-pointer items-center rounded-md px-2.5 py-1.5 font-mono text-xs transition-colors`}
                      >
                        <div className="mr-2">
                          <Moon />
                        </div>
                        暗夜 Dark
                      </button>
                    )}
                  </MenuItem>
                </Radio>
                <Radio value="system">
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        className={`${
                          focus ? 'bg-terracotta/15 text-terracotta' : ''
                        } group flex w-full cursor-pointer items-center rounded-md px-2.5 py-1.5 font-mono text-xs transition-colors`}
                      >
                        <div className="mr-2">
                          <Monitor />
                        </div>
                        跟随系统
                      </button>
                    )}
                  </MenuItem>
                </Radio>
              </div>
            </RadioGroup>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  )
}

export default ThemeSwitch
