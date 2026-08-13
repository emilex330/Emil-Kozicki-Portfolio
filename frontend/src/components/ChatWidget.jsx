import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { sendChatMessage } from '../api/chatClient'
import { track } from '@vercel/analytics'

const MAX_CHARS = 600
const TYPE_SPEED_MS = 12
const CHARS_PER_TICK = 2

const PREFERS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function errorMessage(error) {
  if (error.code === 'quota_exceeded') {
    return "The assistant has reached today's free-tier limit on the AI model. Please try again tomorrow or email Emil directly, he answers faster anyway."
  }
  if (error.status === 429) {
    return "That's a lot of questions. Give me a minute and try again."
  }
  if (error.code === 'network_error') {
    return "I can't reach the server right now. Please try again shortly."
  }
  return 'Something went wrong. Please try again.'
}

function ChatWidget() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState(null)
  const [pending, setPending] = useState(null)
  const [shown, setShown] = useState(0)
  const endRef = useRef(null)
  const [isSlow, setIsSlow] = useState(false)

  // Reveal the pending reply one chunk at a time, then commit it.
  useEffect(() => {
    if (pending === null) return undefined

    if (shown >= pending.length) {
      setMessages((current) => [...current, { role: 'assistant', content: pending }])
      setPending(null)
      setShown(0)
      return undefined
    }

    const timer = setTimeout(() => setShown((n) => n + CHARS_PER_TICK), TYPE_SPEED_MS)
    return () => clearTimeout(timer)
  }, [pending, shown])

    // Keep the newest message in view (but never on first load).
  useEffect(() => {
    if (messages.length === 0 && !isSending && pending === null) return
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages, pending, shown, isSending])

  // After a few seconds of waiting, explain the delay.
  useEffect(() => {
    if (!isSending) {
      setIsSlow(false)
      return undefined
    }
    const timer = setTimeout(() => setIsSlow(true), 7000)
    return () => clearTimeout(timer)
  }, [isSending])



  async function handleSubmit(event) {
    event.preventDefault()

    const question = input.trim()
    if (!question || isSending || pending !== null) return

    track('chat_message')

    const history = messages
    setMessages([...messages, { role: 'user', content: question }])
    setInput('')
    setError(null)
    setIsSending(true)

    try {
      const reply = await sendChatMessage(question, history)
      if (PREFERS_REDUCED) {
        setMessages((current) => [...current, { role: 'assistant', content: reply }])
      } else {
        setPending(reply)
        setShown(0)
        }
    } catch (err) {
      setMessages(history)
      setInput(question)
      setError(errorMessage(err))
    } finally {
      setIsSending(false)
    }
  }

  const isBusy = isSending || pending !== null

  return (
    <div className="chat__window">
      <div className="chat__messages">
        {messages.length === 0 && !isBusy && (
          <p className="chat__empty">
            Try “What did Emil build at Bridge?” or “What is he good at?”
          </p>
        )}

        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              className={`bubble bubble--${message.role === 'user' ? 'user' : 'bot'}`}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {message.content}
            </motion.div>
          ))}
        </AnimatePresence>

        {isSending && (
          <motion.div
            className="bubble bubble--bot"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="typing" aria-label="Thinking">
              <span />
              <span />
              <span />
            </span>
          </motion.div>
        )}
        {isSending && isSlow && (
          <p className="chat__hint">
            Still working. Gemini's free tier is occasionally slow to respond.
          </p>
        )}

        {pending !== null && (
          <div className="bubble bubble--bot">{pending.slice(0, shown)}</div>
        )}

        <div ref={endRef} />
      </div>

      {error && <p className="chat__error" role="alert">{error}</p>}

      <form className="chat__form" onSubmit={handleSubmit}>
        <input
          className="chat__input"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about my experience…"
          maxLength={MAX_CHARS}
          disabled={isBusy}
          aria-label="Ask a question"
        />
        <button className="btn" type="submit" disabled={isBusy || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  )
}

export default ChatWidget