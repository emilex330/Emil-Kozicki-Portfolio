import { useEffect, useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
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
  const [activeSection, setActiveSection] = useState(null)
  const { scrollY, scrollYProgress } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 80)
  })

  useEffect(() => {
    const sections = ['#top', ...LINKS.map((link) => link.href)]
      .map((selector) => document.querySelector(selector))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visibleSections.length > 0) {
          const section = visibleSections[0].target
          setActiveSection(section.id === 'top' ? null : section.id)
        }
      },
      {
        rootMargin: '-120px 0px -55% 0px',
        threshold: 0,
      },
    )

    sections.forEach((section) => observer.observe(section))

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <header className={`nav${scrolled ? ' nav--solid' : ''}`}>
      <nav className="nav__inner" aria-label="Main">
        <a
          className="nav__brand"
          href="#top"
        >
          EK
        </a>

        <ul className="nav__links">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                className={activeSection === link.href.slice(1) ? 'nav__link--active' : ''}
                href={link.href}
                aria-current={activeSection === link.href.slice(1) ? 'page' : undefined}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <ThemeToggle />
      </nav>
      <motion.div
        className="nav__progress"
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />
    </header>
  )
}

export default Nav
