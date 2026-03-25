import os
import sys
from dotenv import load_dotenv

# Añadir el directorio raíz al path para importar el agente
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agent.brain import AgentBrain

def run_test():
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        print("❌ ERROR: GEMINI_API_KEY no encontrada en el archivo .env")
        return

    print("🤖 Simulación de Chat Local (Antigravity Protocol)")
    print("------------------------------------------------")
    
    brain = AgentBrain(api_key)
    
    history = []
    
    while True:
        user_input = input("\n👤 Tu: ")
        if user_input.lower() in ["salir", "exit", "quit"]:
            break
            
        try:
            print("⏳ Pensando...")
            response = brain.generate_response(user_input, history)
            print(f"\n🤖 Agente: {response}")
            
            # Actualizar historial
            history.append({"role": "user", "parts": [user_input]})
            history.append({"role": "model", "parts": [response]})
            
        except Exception as e:
            print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    run_test()
