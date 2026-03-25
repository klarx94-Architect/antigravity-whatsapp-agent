# ⚡ GEMINI.md — Cerebro del Agente Constructor
## Antigravity WhatsApp Agent Builder

Este archivo contiene las instrucciones para construir un agente de WhatsApp
usando **Google Gemini** como motor de IA. Es el equivalente al CLAUDE.md
del proyecto original, adaptado 100% al estándar Antigravity.

---

## Flujo de Construcción (5 Fases)

Cuando el usuario quiera construir su agente, ejecutar estas fases EN ORDEN:

### FASE 1 — Verificación del entorno
```bash
bash start.sh
```
- Verifica Python 3.11+
- Crea entorno virtual e instala dependencias (google-generativeai, fastapi, etc.)
- Crea carpeta `knowledge/` para documentos del negocio

### FASE 2 — Entrevista del negocio (10 preguntas, una por una)
1. ¿Cómo se llama tu negocio?
2. ¿A qué se dedica? (restaurante, clínica, tienda, SaaS...)
3. ¿Cuál es el horario de atención?
4. ¿Cuál es la dirección o zona de cobertura?
5. ¿Qué servicios o productos ofrece?
6. ¿Tienes preguntas frecuentes que el agente deba saber responder?
7. ¿Cómo quieres que hable el agente? (formal, amigable, profesional...)
8. ¿Hay algo que el agente NUNCA debe decir o hacer?
9. ¿Qué proveedor de WhatsApp usarás? (Whapi / Meta / Twilio)
10. ¿Tienes las credenciales del proveedor elegido a mano?

### FASE 3 — Generación de archivos de configuración
Generar con las respuestas de la Fase 2:

**config/business.yaml**
```yaml
name: "[Nombre del negocio]"
type: "[Tipo: restaurante | clinica | tienda | otro]"
hours: "[Horario]"
location: "[Dirección o zona]"
services:
  - "[Servicio 1]"
  - "[Servicio 2]"
contact:
  phone: "[Teléfono]"
  email: "[Email]"
```

**config/prompts.yaml**
```yaml
system_prompt: |
  Eres el asistente virtual de [Nombre del negocio].
  
  SOBRE TI:
  - Nombre: [Nombre del negocio]
  - Tipo de negocio: [Tipo]
  - Horario: [Horario]
  - Ubicación: [Ubicación]
  
  SERVICIOS:
  [Lista de servicios]
  
  PERSONALIDAD:
  [Tono definido por el cliente]
  
  REGLAS ABSOLUTAS:
  - Nunca inventes información que no tengas
  - Si no sabes algo, di: "Para darte información más precisa, te recomiendo contactarnos directamente"
  - Responde siempre en el idioma en que te escriben
  - Sé conciso — las respuestas de WhatsApp deben ser cortas y claras
  [Restricciones del cliente]
```

### FASE 4 — Testing local
```bash
python tests/test_local.py
```
- El agente responde en la terminal usando Gemini real
- Ajustar `config/prompts.yaml` según el feedback
- No avanzar sin que el cliente apruebe las respuestas

### FASE 5 — Deploy a producción
Opciones según el estándar Antigravity:

**Opción A: Railway (más simple)**
```bash
# Necesitas Dockerfile (incluido en el repo)
docker compose up --build
# Subir a Railway.app
```

**Opción B: Vercel + Supabase (estándar Antigravity)**
- Backend en Vercel Functions (adaptar main.py a formato serverless)
- Base de datos: Supabase PostgreSQL
- Variable de entorno: `DATABASE_URL=postgresql+asyncpg://...`

---

## Variables de entorno requeridas

```bash
GEMINI_API_KEY=         # https://aistudio.google.com/app/apikey (gratis)
GEMINI_MODEL=gemini-1.5-pro
WHATSAPP_PROVIDER=whapi  # o meta / twilio
WHAPI_TOKEN=            # Si usas Whapi.cloud
PORT=8000
```

---

## Agregar conocimiento adicional

Coloca documentos en la carpeta `knowledge/`:
- Menús en PDF o TXT
- FAQ del negocio
- Catálogos de productos
- Políticas de la empresa

El sistema leerá estos archivos e incorporará su contenido al prompt del agente.

---

## Estructura del proyecto
```
antigravity-whatsapp-agent/
├── agent/
│   ├── brain.py          # Motor Gemini — NO MODIFICAR sin entender el contrato
│   ├── main.py           # FastAPI webhook server
│   ├── memory.py         # Historial SQLite/PostgreSQL
│   └── providers/
│       ├── base.py       # Interfaz abstracta
│       └── whapi.py      # Adaptador Whapi (u otros)
├── config/
│   ├── business.yaml     # Datos del negocio
│   └── prompts.yaml      # System prompt del agente
├── knowledge/            # Documentos del negocio
├── tests/
│   └── test_local.py     # Simulador de chat
├── .env                  # Claves (NUNCA subir a GitHub)
└── GEMINI.md             # Este archivo
```
