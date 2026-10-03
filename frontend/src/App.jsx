import profile from './data/profile.json'
import ChatWidget from './components/ChatWidget'
import ContactForm from './components/ContactForm'
import Hero from './components/Hero'
import Section from './components/Section'
import SkillsGrid from './components/SkillsGrid'
import './App.css'
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa6'
import Nav from './components/Nav'
import { Analytics } from '@vercel/analytics/react'

function App() {
  return (
    <>
      <Nav />
      <Hero />

      <main>
        <Section id="about" label="About" title="Hey, I'm Emil.">
          <p className="section__lead">{profile.summary}</p>
        </Section>

        <Section id="experience" label="Experience" title="Where I've worked">
          <div className="card-grid">
            {profile.experience.map((job) => (
              <article className="card" key={job.company}>
                <h3>{job.role}</h3>
                <p className="card__meta">
                  {job.company} · {job.location} · {job.dates}
                </p>
                {job.tech && <span className="card__tech">{job.tech}</span>}
                <ul className="card__list">
                  {job.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>

        <Section id="projects" label="Projects" title="Things I've built">
          <div className="card-grid">
            {profile.projects.map((project) => (
              <article className="card" key={project.name}>
                <div className="card__head">
                  <h3>{project.name}</h3>
                  {project.repo && (
                    <a
                      className="card__link"
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${project.name} source code on GitHub`}
                    >
                      <FaGithub />
                      <span>Code</span>
                    </a>
                  )}
                </div>
                <span className="card__tech">{project.tech}</span>
                <p className="card__meta">{project.description}</p>
                <ul className="card__list">
                  {project.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>



        <Section id="skills" label="Skills" title="What I work with">
          <SkillsGrid />
        </Section>

        <Section id="education" label="Education" title="Where I studied">
          <div className="card-grid">
            {profile.education.map((school) => (
              <article className="card" key={school.degree}>
                <div className="edu__head">
                  <h3>
                    {school.degree}
                    {school.honors && <span className="edu__honors"> · {school.honors}</span>}
                  </h3>
                  <span className="edu__dates">{school.dates}</span>
                </div>
                <p className="edu__school">{school.school}</p>
                {school.note && <p className="edu__note">{school.note}</p>}
              </article>
            ))}
          </div>
        </Section>

        <Section id="chat" label="Ask me anything" title="Chat with my AI assistant">
          <p className="section__lead">
            It knows my background, experience, and projects. Ask it anything.
          </p>
          <ChatWidget />
        </Section>

        <Section id="contact" label="Contact" title="Get in touch">
          <p className="section__lead">
            Have a question or an opportunity? Send me a message.
          </p>
          <ContactForm />
        </Section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer__links">
            <a
              className="icon-link"
              href={`mailto:${profile.contact.email}`}
              aria-label="Email Emil"
              title="Email"
            >
              <FaEnvelope />
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
          </div>
          <p>© {new Date().getFullYear()} {profile.name}</p>
        </div>
        <Analytics />
      </footer>

    </>
  )
}

export default App