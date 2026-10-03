import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { FaBars, FaXmark } from 'react-icons/fa6'
import ThemeToggle from './ThemeToggle'

// How far the page can scroll before an open mobile menu closes itself.
const MENU_SCROLL_CLOSE_PX = 10

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
  const [menuOpen, setMenuOpen] = useState(false)
  const menuOpenedAt = useRef(0)
  const { scrollY, scrollYProgress } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 80)

    if (menuOpen && Math.abs(y - menuOpenedAt.current) > MENU_SCROLL_CLOSE_PX) {
      setMenuOpen(false)
    }
  })

  function toggleMenu() {
    menuOpenedAt.current = window.scrollY
    setMenuOpen((open) => !open)
  }

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

  // In the mobile menu, close the menu first and scroll once it has settled.
  // Doing both at once lets mobile browsers cancel the smooth scroll.
  function handleMenuLink(event, href) {
    if (!menuOpen) return

    event.preventDefault()
    setMenuOpen(false)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.querySelector(href)?.scrollIntoView()
        history.pushState(null, '', href)
      })
    })
  }

  // Close the mobile menu with Escape.
  useEffect(() => {
    if (!menuOpen) return undefined

    function handleKey(event) {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [menuOpen])

  return (
    <header className={`nav${scrolled || menuOpen ? ' nav--solid' : ''}${menuOpen ? ' nav--open' : ''}`}>
      <nav className="nav__inner" aria-label="Main">
        <a
          className="nav__brand"
          href="#top"
          onClick={(event) => handleMenuLink(event, '#top')}
        >
          EK
        </a>

        <ul className="nav__links" id="nav-links">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                className={activeSection === link.href.slice(1) ? 'nav__link--active' : ''}
                href={link.href}
                aria-current={activeSection === link.href.slice(1) ? 'page' : undefined}
                onClick={(event) => handleMenuLink(event, link.href)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <ThemeToggle />

        <button
          type="button"
          className="nav__menu"
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-controls="nav-links"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <FaXmark /> : <FaBars />}
        </button>
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
