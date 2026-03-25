#!/bin/bash

# --- Antigravity Unified Starter ---
# Lanza el Dashboard (Next.js) y el Agente (FastAPI) simultáneamente.

echo "🚀 Iniciando Ecosistema Antigravity WhatsApp Agent..."

# 1. Verificar Entorno Python
echo "📦 Verificando dependencias del Agente..."
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

source venv/Scripts/activate || source venv/bin/activate
pip install -r agent/requirements.txt --quiet

# 2. Verificar Entorno Dashboard
echo "🎨 Verificando dependencias del Dashboard..."
if [ ! -d "dashboard/node_modules" ]; then
    echo "Installing node modules..."
    cd dashboard && npm install --quiet && cd ..
fi

# 3. Lanzar Servicios
echo "📡 Lanzando servicios en segundo plano..."

# Backend (Puerto 8000)
python agent/main.py &
BACKEND_PID=$!

# Frontend (Puerto 3000)
cd dashboard && npm run dev &
FRONTEND_PID=$!

echo "------------------------------------------------"
echo "✅ TODO LISTO"
echo "🔗 Dashboard: http://localhost:3000"
echo "🔗 API Engine: http://localhost:8000/api/status"
echo "------------------------------------------------"
echo "Presiona Ctrl+C para detener ambos servicios."

# Manejo de cierre
cleanup() {
    echo "🛑 Deteniendo servicios..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

trap cleanup SIGINT

wait
