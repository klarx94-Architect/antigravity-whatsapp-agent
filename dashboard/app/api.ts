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

/**
 * Genera una propuesta de agente basada en la entrevista del "Arquitecto".
 * En el frontend, esto permite automatizar la creación del System Prompt.
 */
export async function generateAgentProposal(interviewData: any) {
  // Simulador de Lógica IA para el Creador Autónomo
  // En producción, esto se envía al endpoint /generate-agent del backend local
  console.log("🛠️ Architect Engine: Generating Intelligence Protocol...", interviewData)
  
  // Retraso artificial para simular "pensamiento"
  await new Promise(resolve => setTimeout(resolve, 2000))

  return {
    name: interviewData.name || "Agente Sin Nombre",
    systemPrompt: `Eres un Agente Elite de ${interviewData.company || 'la organización'}. 
Tu misión principal es: ${interviewData.goals || 'asistir al usuario'}.
Contexto de marca: ${interviewData.web || 'No especificado'}.
Tono: ${interviewData.tone || 'Profesional y Directo'}.

[PROTOCOLOS DE RESPUESTA]
- Responde siempre basándote en el contexto de la empresa.
- Si no sabes algo, redirige a la web oficial.
- Mantén la brevedad y eficiencia en cada mensaje por WhatsApp.`,
    yaml: `agent:
  name: "${interviewData.name}"
  company: "${interviewData.company}"
  mission: "${interviewData.goals}"
  brain:
    model: "gemini-1.5-pro"
    personality: "${interviewData.tone}"`
  }
}
