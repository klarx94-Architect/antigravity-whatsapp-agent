# ⚡ Antigravity WhatsApp Agent — Mother Repository
### Engine + Dashboard Unified Architecture

Bienvenido al repositorio maestro del ecosistema **Antigravity WhatsApp Agent**. Este repositorio contiene tanto el motor de IA como el panel de gestión visual.

---

## 📂 Estructura del Proyecto
- **[`agent/`](agent/)**: Núcleo del Agente (FastAPI + Gemini 1.5 Pro).
- **[`dashboard/`](dashboard/)**: Panel de control visual "Robo-Factory" (Next.js + Tailwind).
- **[`config/`](config/)**: Configuraciones de negocio y prompts.
- **[`knowledge/`](knowledge/)**: Base de conocimientos del agente.

---

## 🚀 Despliegue Híbrido

### 1. Motor (Backend)
Despliega el motor en **Railway** usando el `Dockerfile` incluido para tener operación 24/7.

### 2. Dashboard (Frontend)
Despliega la carpeta `dashboard/` en **Vercel** para obtener tu URL de gestión en tiempo real.

---

## 🛠️ Inicio Rápido
1. `bash start.sh` para preparar el entorno.
2. Configura tu `.env` con la `GEMINI_API_KEY`.
3. Entra en `dashboard/` y ejecuta `npm install && npm run dev` para ver el panel localmente.

---
*Antigravity — Nuclear Standard*
