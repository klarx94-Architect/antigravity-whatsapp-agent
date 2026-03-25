#!/bin/bash
# ⚡ Antigravity WhatsApp Agent — Script de inicio
# Ejecutar: bash start.sh

set -e

echo ""
echo "==========================================================="
echo "   ⚡ Antigravity WhatsApp Agent — Setup"
echo "==========================================================="
echo ""
echo "  Preparando tu entorno de agente IA con Gemini..."
echo ""

# ── Verificar Python ──────────────────────────────────────────
echo "  [1/4] Verificando Python..."
if ! command -v python3 &> /dev/null; then
    echo ""
    echo "  ERROR: Python 3 no encontrado."
    echo "  Descargalo en: https://python.org/downloads"
    echo ""
    exit 1
fi

PYTHON_MAJOR=$(python3 -c 'import sys; print(sys.version_info.major)')
PYTHON_MINOR=$(python3 -c 'import sys; print(sys.version_info.minor)')
if [ "$PYTHON_MAJOR" -lt 3 ] || ([ "$PYTHON_MAJOR" -eq 3 ] && [ "$PYTHON_MINOR" -lt 11 ]); then
    echo ""
    echo "  ERROR: Necesitas Python 3.11 o superior."
    echo "  Version actual: $(python3 --version)"
    echo ""
    exit 1
fi
echo "  OK — $(python3 --version)"

# ── Verificar/crear entorno virtual ──────────────────────────
echo "  [2/4] Configurando entorno virtual..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "  OK — venv creado"
else
    echo "  OK — venv existente"
fi
source venv/bin/activate

# ── Instalar dependencias ──────────────────────────────────────
echo "  [3/4] Instalando dependencias..."
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt -q
    echo "  OK — google-generativeai y dependencias instaladas"
fi

# ── Crear carpetas base ──────────────────────────────────────
echo "  [4/4] Preparando carpetas..."
mkdir -p knowledge agent/providers config tests
echo "  OK — Estructura lista"

echo ""
echo "==========================================================="
echo ""
echo "  Todo listo. Pasos siguientes:"
echo ""
echo "  1. Copia .env.example a .env:"
echo "     cp .env.example .env"
echo ""
echo "  2. Obtén tu GEMINI_API_KEY GRATIS en:"
echo "     https://aistudio.google.com/app/apikey"
echo ""
echo "  3. Agrega tu clave en .env:"
echo "     GEMINI_API_KEY=tu_clave_aqui"
echo ""
echo "  4. Configura tu proveedor de WhatsApp en .env"
echo "     (Recomendado: Whapi.cloud — tiene sandbox gratis)"
echo ""
echo "  5. Prueba el agente en terminal:"
echo "     python tests/test_local.py"
echo ""
echo "==========================================================="
echo ""
