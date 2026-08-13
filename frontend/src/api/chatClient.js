const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export class ChatError extends Error {
  constructor(status, code) {
    super(code)
    this.status = status
    this.code = code
  }
}

export async function sendChatMessage(message, history) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}/api/chat/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    })
  } catch {
    throw new ChatError(0, 'network_error')
  }

    if (!response.ok) {
    let code = 'request_failed'
    try {
      const body = await response.json()
      if (body?.error) code = body.error
    } catch {
      // ignore
    }
    throw new ChatError(response.status, code)
  }

  const data = await response.json()
  return data.reply
}
