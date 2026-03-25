from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
import os
import yaml
from pathlib import Path
from agent.brain import AgentBrain
from agent.memory import AgentMemory
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Antigravity Agent API")

# Configuración CORS para el Dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En prod restringir al dominio del dashboard
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from agent.providers.evolution import EvolutionProvider

# Inicializar componentes
brain = AgentBrain(api_key=os.getenv("GEMINI_API_KEY", ""))
memory = AgentMemory()
evolution = EvolutionProvider()

@app.get("/api/status")
async def get_status():
    return {
        "status": "online",
        "engine": "Gemini 1.5 Pro",
        "api_connected": bool(os.getenv("GEMINI_API_KEY")),
        "version": "3.7.0-evolution"
    }

# --- EVOLUTION API ENDPOINTS ---

@app.get("/api/evolution/instances")
async def list_instances():
    return await evolution.get_instances()

@app.post("/api/evolution/create")
async def create_instance(name: str = Body(..., embed=True)):
    return await evolution.create_instance(name)

@app.get("/api/evolution/qr/{name}")
async def get_qr(name: str):
    return await evolution.get_qr(name)

@app.post("/api/webhook/evolution")
async def webhook_evolution(data: dict = Body(...)):
    """Handler para mensajes entrantes de Evolution API"""
    try:
        # Extraer datos del mensaje (Evolution API v2 structure)
        if data.get("event") == "messages.upsert":
            msg = data.get("data", {}).get("message", {})
            remote_resid = data.get("data", {}).get("key", {}).get("remoteJid", "")
            from_me = data.get("data", {}).get("key", {}).get("fromMe", False)
            
            if from_me: return {"status": "ignored_self"}

            text = msg.get("conversation") or msg.get("extendedTextMessage", {}).get("text", "")
            instance = data.get("instance", "default")

            if text and remote_resid:
                # Procesar con el cerebro
                history = memory.get_history(remote_resid)
                response = brain.generate_response(text, history)
                
                # Enviar respuesta
                await evolution.send_message(instance, remote_resid, response)
                
                # Actualizar memoria
                memory.add_message(remote_resid, "user", text)
                memory.add_message(remote_resid, "model", response)
                
                return {"status": "responded", "to": remote_resid}
        
        return {"status": "event_ignored"}
    except Exception as e:
        print(f"Error en webhook: {e}")
        return {"error": str(e)}

# --- CORE ENDPOINTS ---

@app.post("/api/chat")
async def chat(session_id: str = Body(...), message: str = Body(...)):
    try:
        if not os.getenv("GEMINI_API_KEY"):
            raise HTTPException(status_code=500, detail="GEMINI_API_KEY no configurada")
        
        history = memory.get_history(session_id)
        response = brain.generate_response(message, history)
        
        # Guardar en memoria
        memory.add_message(session_id, "user", message)
        memory.add_message(session_id, "model", response)
        
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/config/save")
async def save_config(target: str = Body(...), data: dict = Body(...)):
    """Guarda archivos en la carpeta agents/"""
    try:
        agents_dir = Path("agents")
        agents_dir.mkdir(exist_ok=True)
        
        file_path = agents_dir / f"{target}.yaml"
        with open(file_path, 'w', encoding='utf-8') as f:
            yaml.dump(data, f, allow_unicode=True)
            
        return {"message": f"Agente {target} guardado correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/vault")
async def list_files():
    agents_dir = Path("agents")
    if not agents_dir.exists():
        return []
    
    files = []
    for f in agents_dir.glob("*.yaml"):
        stats = f.stat()
        # Fecha real de modificación
        from datetime import datetime
        mod_time = datetime.fromtimestamp(stats.st_mtime).strftime("%b %d, %Y")
        
        files.append({
            "name": f.name,
            "size": f"{stats.st_size / 1024:.1f}kb",
            "date": mod_time
        })
    return files

@app.post("/api/generate-agent")
async def generate_agent(interview_data: dict = Body(...)):
    """Punto de entrada para la generación de inteligencia del agente."""
    try:
        if not os.getenv("GEMINI_API_KEY"):
            raise HTTPException(status_code=500, detail="GEMINI_API_KEY no configurada en el servidor")
        
        result = brain.generate_agent_logic(interview_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
