const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function getApiStatus() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/status`)
    if (!res.ok) throw new Error("Backend offline")
    return await res.json()
  } catch (err) {
    return { status: "offline", error: true }
  }
}

export async function getVaultFiles() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/vault`)
    if (!res.ok) return []
    return await res.json()
  } catch (err) {
    return []
  }
}

export async function saveConfig(target: string, data: any) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/config/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target, data })
    })
    return await res.json()
  } catch (err) {
    return { error: true, message: "Error saving config" }
  }
}

export async function sendChatMessage(sessionId: string, message: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, message })
    })
    return await res.json()
  } catch (err) {
    return { error: true, message: "Chat server unreachable" }
  }
}
