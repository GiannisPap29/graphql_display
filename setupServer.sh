#!/bin/bash

# Zone01 Profile - Start Both Servers
# This script starts the HTTP server and CORS proxy together

echo "🚀 Zone01 Profile - Starting Servers"
echo "====================================="
echo ""

# Check if cors-anywhere is installed
if ! npm list -g cors-anywhere &> /dev/null; then
    echo "❌ cors-anywhere is not installed!"
    echo ""
    echo "Install it with:"
    echo "  npm install -g cors-anywhere"
    echo ""
    exit 1
fi

echo "✅ cors-anywhere is installed"
echo ""
echo "📝 Make sure USE_CORS_PROXY is set to 'true' in js/config.js"
echo ""
echo "Starting servers..."
echo ""
echo "🌐 Main Server: http://localhost:8000"
echo "🔧 CORS Proxy: http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Create a temporary script to run cors-anywhere
cat > /tmp/cors-proxy-start.js << 'EOF'
const corsAnywhere = require('cors-anywhere');

const host = '0.0.0.0';
const port = 8080;

corsAnywhere.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: [],
    removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, function() {
    console.log('CORS Anywhere proxy running on ' + host + ':' + port);
});
EOF

# Start both servers in background
python3 -m http.server 8000 &
HTTP_PID=$!

node /tmp/cors-proxy-start.js &
CORS_PID=$!

# Function to cleanup on exit
cleanup() {
    echo ""
    echo ""
    echo "🛑 Stopping servers..."
    kill $HTTP_PID 2>/dev/null
    kill $CORS_PID 2>/dev/null
    rm -f /tmp/cors-proxy-start.js
    echo "✅ Servers stopped"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT TERM

# Wait for both processes
wait