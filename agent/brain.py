import os
import google.generativeai as genai
import yaml
import json
from typing import List, Dict

class AgentBrain:
    def __init__(self, api_key: str, model_name: str = "gemini-1.5-pro"):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(model_name)
        self.config_path = "config/prompts.yaml"
        self.business_path = "config/business.yaml"

    def get_system_prompt(self) -> str:
        if not os.path.exists(self.config_path):
            return "Eres un asistente de WhatsApp profesional."
        
        with open(self.config_path, 'r', encoding='utf-8') as f:
            config = yaml.safe_load(f)
            return config.get('system_prompt', "Eres un asistente de WhatsApp profesional.")

    def generate_response(self, message: str, history: List[Dict] = []) -> str:
        system_prompt = self.get_system_prompt()
        
        if os.path.exists(self.business_path):
            with open(self.business_path, 'r', encoding='utf-8') as f:
                business_data = f.read()
                system_prompt += f"\n\nDATOS DEL NEGOCIO:\n{business_data}"

        chat = self.model.start_chat(history=[
            {"role": "user", "parts": [system_prompt]},
            {"role": "model", "parts": ["Entendido. Estoy listo para asistir a los clientes siguiendo tus instrucciones."]}
        ] + history)

        response = chat.send_message(message)
        return response.text

    def generate_agent_logic(self, interview_data: Dict) -> Dict:
        """Genera un System Prompt y un manifiesto YAML profesional usando Gemini."""
        prompt = f"""
        Actúa como un Ingeniero de Prompts Senior. Analiza estos datos de entrevista para crear un Agente de WhatsApp:
        - Nombre: {interview_data.get('name')}
        - Empresa: {interview_data.get('company')}
        - Web/Contexto: {interview_data.get('web')}
        - Objetivos: {interview_data.get('goals')}
        - Tono: {interview_data.get('tone')}
        - Conexión: {interview_data.get('connection')}

        Devuelve un JSON con exactamente estas dos llaves:
        1. "systemPrompt": Un prompt de sistema detallado, profesional y enfocado en la misión.
        2. "yaml": El contenido de un archivo YAML de configuración que siga esta estructura:
           agent:
             name: "{interview_data.get('name')}"
             company: "{interview_data.get('company')}"
             connection: "{interview_data.get('connection')}"
             brain:
               model: "gemini-1.5-pro"
               personality: "{interview_data.get('tone')}"
        """
        
        response = self.model.generate_content(prompt)
        # Limpieza básica de la respuesta si Gemini devuelve markdown
        text = response.text.replace('```json', '').replace('```', '').strip()
        
        try:
            return json.loads(text)
        except:
            # Fallback si falla el parseo
            return {
                "systemPrompt": f"Eres un asistente para {interview_data.get('name')}. Tono: {interview_data.get('tone')}.",
                "yaml": f"agent:\n  name: {interview_data.get('name')}\n  connection: {interview_data.get('connection')}"
            }

if __name__ == "__main__":
    # Test simple
    from dotenv import load_dotenv
    load_dotenv()
    key = os.getenv("GEMINI_API_KEY")
    if key:
        brain = AgentBrain(key)
        print(brain.generate_response("Hola, ¿quién eres?"))
    else:
        print("GEMINI_API_KEY no configurada.")
