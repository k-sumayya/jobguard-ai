#!/bin/bash
# JobGuard AI – Full Stack Launcher

echo "=========================================="
echo "🛡️  Starting JobGuard AI – Fake Job Detector"
echo "=========================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$SCRIPT_DIR/jobguard-ai"
if [ ! -d "$BASE_DIR" ]; then
  BASE_DIR="$SCRIPT_DIR"
fi

# Function to kill child processes on exit
cleanup() {
  echo ""
  echo "Shutting down JobGuard AI servers..."
  kill $(jobs -p) 2>/dev/null
  exit
}
trap cleanup SIGINT SIGTERM

echo "1. Starting Flask Backend on http://127.0.0.1:5001..."
cd "$BASE_DIR/backend"
PYTHONPATH="$BASE_DIR/backend" "$BASE_DIR/backend/venv/bin/python" app.py &
BACKEND_PID=$!

sleep 1

echo "2. Starting React Vite Frontend on http://localhost:5173..."
cd "$BASE_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🚀 JobGuard AI is now running!"
echo "   ➜ Frontend: http://localhost:5173"
echo "   ➜ Backend API: http://127.0.0.1:5001/api/health"
echo "=========================================="
echo "Press Ctrl+C to stop both servers."

wait
