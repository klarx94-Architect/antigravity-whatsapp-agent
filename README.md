# ⚡ Antigravity WhatsApp Agent

Construye tu propio agente de WhatsApp con inteligencia artificial en menos de 30 minutos.
Powered by **Google Gemini** — Antigravity Development Standard.

---

## ¿Qué es esto?

Un framework en Python que te permite desplegar un agente de WhatsApp IA completamente personalizado
para cualquier negocio. El agente responde mensajes de WhatsApp 24/7 usando Google Gemini como motor
de inteligencia artificial.

**Basado en:** [whatsapp-agentkit](https://github.com/Hainrixz/whatsapp-agentkit) por @soyenriquerocha  
**Adaptado por:** Antigravity — Migrado de Anthropic/Claude a Google Gemini

---

## Cómo funciona

```
WhatsApp (cliente)
    ↓
Proveedor (Whapi/Meta/Twilio) → agent/providers/ [patrón adaptador]
    ↓
FastAPI (agent/main.py) ↔ agent/memory.py (historial SQLite)
    ↓
Gemini API (agent/brain.py) ↔ config/prompts.yaml (personalidad)
    ↓
Respuesta enviada de vuelta por WhatsApp
```

---

## Inicio rápido

```bash
# 1. Clonar el repo
git clone https://github.com/klarx94-Architect/antigravity-whatsapp-agent.git
cd antigravity-whatsapp-agent

# 2. Setup automático
bash start.sh

# 3. Configurar .env
cp .env.example .env
# Edita .env con tu GEMINI_API_KEY y credenciales de WhatsApp

# 4. Definir la personalidad del agente
# Edita config/prompts.yaml

# 5. Probar en terminal
python tests/test_local.py

# 6. Arrancar servidor
uvicorn agent.main:app --reload --port 8000
```

---

## Obtener GEMINI_API_KEY (gratis)

1. Ve a https://aistudio.google.com/app/apikey
2. Crea una API key gratuita
3. Pégala en tu `.env` como `GEMINI_API_KEY=tu_clave`

---

## Proveedores de WhatsApp

| Proveedor | Nivel | Recomendado para |
|---|---|---|
| **Whapi.cloud** | Demo / Producción | Empezar — tiene sandbox gratis |
| **Meta Cloud API** | Producción oficial | Negocios verificados |
| **Twilio** | Producción | Escala empresarial |

---

## Casos de uso

| Tipo de negocio | Ejemplo de uso |
|---|---|
| Restaurante | Responde menú, horarios, toma reservas |
| Clínica / Salón | Agenda citas automáticamente |
| Tienda online | Toma pedidos por WhatsApp |
| SaaS / Software | Soporte técnico 24/7 |
| Inmobiliaria | Califica leads, envía info de propiedades |
| Cualquier negocio | FAQ automático 24/7 |

---

## Stack técnico

| Componente | Tecnología |
|---|---|
| IA | Google Gemini 1.5 Pro |
| Servidor | FastAPI + Uvicorn |
| Base de datos | SQLite (local) / Supabase PostgreSQL (producción) |
| WhatsApp | Whapi.cloud / Meta / Twilio |
| Deploy demo | Docker + Railway |
| Deploy producción | Vercel + Supabase |

---

## Deploy

### Demo (Railway)
```bash
docker compose up --build
# Subir a Railway.app — plan gratis disponible
```

### Producción (Antigravity Standard)
- **Frontend/API:** Vercel
- **Base de datos:** Supabase PostgreSQL
- **Dominio personalizado:** Configurado en Vercel

---

## Comandos útiles

```bash
# Chat en terminal (sin WhatsApp)
python tests/test_local.py

# Arrancar servidor local
uvicorn agent.main:app --reload --port 8000

# Docker
docker compose up --build

# Ver logs
docker compose logs -f agent
```

---

## Documentación del constructor

Ver **GEMINI.md** para el flujo completo de construcción del agente (5 fases).

---

## Licencia

MIT — Basado en whatsapp-agentkit (MIT) por @soyenriquerocha  
Adaptación Antigravity — Google Gemini Edition
