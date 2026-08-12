const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function sendContactMessage(form) {
  const response = await fetch(`${API_BASE_URL}/api/contact/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  })

  if (response.status === 400) {
    return { ok: false, fieldErrors: await response.json() }
  }
  if (!response.ok) {
    return { ok: false, fieldErrors: null }
  }
  return { ok: true, fieldErrors: null }
}