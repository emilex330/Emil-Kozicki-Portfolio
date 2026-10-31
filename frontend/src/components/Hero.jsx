import { FaGithub, FaLinkedin } from 'react-icons/fa6'
import profile from '../data/profile.json'

const [firstName, ...rest] = profile.name.split(' ')
const lastName = rest.join(' ')

function Hero() {
    return (
        <section className="hero" id="top">
            <div className="hero__glow hero__glow--top" aria-hidden="true" />
            <div className="hero__glow hero__glow--bottom" aria-hidden="true" />

            <div className="hero__inner container">
                <div className="hero__meta">
                    <p className="hero__tagline">
                        {profile.headline} · {profile.location}
                    </p>
                    {profile.openToWork && (
                        <a className="hero__status" href="#contact">
                            <span className="hero__status-dot" aria-hidden="true" />
                            Open to new roles
                        </a>
                    )}
                </div>

                <h1 className="hero__name">
                    {firstName} <span className="hero__name-accent">{lastName}</span>
                </h1>

                <p className="hero__lead">
                    <strong>Backend-focused engineer</strong> who builds the integrations and
                    data pipelines that keep systems talking, with{' '}
                    <strong>full-stack experience</strong> shipping features from data model to UI.
                </p>

                <div className="hero__cta">
                    <div className="hero__actions">
                        <a
                            className="btn"
                            href="/Emil_Kozicki_Resume.pdf"
                            download
                        >
                            Download Resume
                        </a>
                        <a className="btn btn--ghost" href="#contact">
                            Get in touch
                        </a>
                    </div>

                    <div className="hero__social">
                        <a
                            className="icon-link"
                            href={profile.contact.github}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Emil on GitHub"
                            title="GitHub"
                        >
                            <FaGithub />
                        </a>
                        <a
                            className="icon-link"
                            href={profile.contact.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Emil on LinkedIn"
                            title="LinkedIn"
                        >
                            <FaLinkedin />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
