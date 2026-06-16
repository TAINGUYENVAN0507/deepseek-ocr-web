#!/bin/bash

PROJECT_DIR="$HOME/Project/deepseek-ocr-web"
REMOTE_HOST="root@171.101.230.180"
REMOTE_PORT="28230"

LOCAL_BACKEND_PORT="8000"
REMOTE_BACKEND_PORT="8000"
FRONTEND_PORT="5173"

echo "Starting remote backend..."
ssh -p $REMOTE_PORT $REMOTE_HOST "
cd /workspace/deepseek-ocr-web/backend &&
source ../.venv/bin/activate &&
fuser -k $REMOTE_BACKEND_PORT/tcp 2>/dev/null || true &&
uvicorn app.main:app --host 0.0.0.0 --port $REMOTE_BACKEND_PORT
" &
BACKEND_SSH_PID=$!

sleep 8

echo "Starting SSH tunnel..."
ssh -p $REMOTE_PORT $REMOTE_HOST -L $LOCAL_BACKEND_PORT:localhost:$REMOTE_BACKEND_PORT -N &
TUNNEL_PID=$!

sleep 2

echo "Starting frontend..."
cd "$PROJECT_DIR/frontend" || exit 1

if [ ! -d "node_modules" ]; then
    npm install
fi

npm run dev -- --host 0.0.0.0 --port $FRONTEND_PORT &
FRONTEND_PID=$!

echo ""
echo "Project is running"
echo "Frontend: http://localhost:$FRONTEND_PORT"
echo "Backend Swagger: http://localhost:$LOCAL_BACKEND_PORT/docs"
echo ""
echo "Press Ctrl+C to stop"

trap "kill $BACKEND_SSH_PID $TUNNEL_PID $FRONTEND_PID 2>/dev/null; ssh -p $REMOTE_PORT $REMOTE_HOST 'fuser -k $REMOTE_BACKEND_PORT/tcp 2>/dev/null || true'; exit" INT

wait
