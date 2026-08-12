import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { sendContactMessage } from '../api/contactClient'

const EMPTY_FORM = { name: '', email: '', message: '' }

function ContactForm() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle')
  const [fieldErrors, setFieldErrors] = useState({})

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (status === 'sending') return

    setStatus('sending')
    setFieldErrors({})

    try {
      const result = await sendContactMessage(form)

      if (result.ok) {
        setForm(EMPTY_FORM)
        setStatus('sent')
      } else {
        setFieldErrors(result.fieldErrors ?? {})
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const isSending = status === 'sending'
  const hasFieldErrors = Object.keys(fieldErrors).length > 0

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="contact-name">Name</label>
        <input
          id="contact-name"
          name="name"
          value={form.name}
          onChange={handleChange}
          maxLength={100}
          required
        />
        {fieldErrors.name && <p className="field__error">{fieldErrors.name[0]}</p>}
      </div>

      <div className="field">
        <label htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        {fieldErrors.email && <p className="field__error">{fieldErrors.email[0]}</p>}
      </div>

      <div className="field">
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={6}
          maxLength={2000}
          required
        />
        {fieldErrors.message && <p className="field__error">{fieldErrors.message[0]}</p>}
      </div>

      <div>
        <button className="btn" type="submit" disabled={isSending}>
          {isSending ? 'Sending…' : 'Send message'}
        </button>
      </div>

      <AnimatePresence>
        {status === 'sent' && (
          <motion.p
            className="form__status"
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            Thanks — your message is on its way. I'll get back to you soon.
          </motion.p>
        )}

        {status === 'error' && !hasFieldErrors && (
          <motion.p
            className="field__error"
            role="alert"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            Something went wrong. Please try again, or email me directly.
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  )
}

export default ContactForm