import { useState } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'
import ThemeToggle from './ThemeToggle'

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#chat', label: 'Chat' },
  { href: '#contact', label: 'Contact' },
]

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 80)
  })

  return (
    <header className={`nav${scrolled ? ' nav--solid' : ''}`}>
      <nav className="nav__inner" aria-label="Main">
        <a className="nav__brand" href="#top">EK</a>

        <ul className="nav__links">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>

        <ThemeToggle />
      </nav>
    </header>
  )
}

export default Nav
