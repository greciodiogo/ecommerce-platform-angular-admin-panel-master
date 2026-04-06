// Script para testar conexão Socket.IO
// Executar: node test-socket-connection.js

const io = require('socket.io-client');

const API_URL = 'https://api.encontrarshopping.com';
const USER_ID = 187;

console.log('🧪 Testing Socket.IO connection...');
console.log('📍 API URL:', API_URL);
console.log('👤 User ID:', USER_ID);
console.log('---');

const socket = io(API_URL, {
  path: '/socket.io/',
  query: { userId: USER_ID.toString() },
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 10,
  timeout: 20000,
  autoConnect: true,
  forceNew: true,
});

socket.on('connect', () => {
  console.log('✅ Connected successfully!');
  console.log('📡 Transport:', socket.io.engine.transport.name);
  console.log('🆔 Socket ID:', socket.id);
  console.log('---');
  console.log('✨ Connection is working! You can close this now.');
  
  // Aguardar upgrade
  socket.io.engine.on('upgrade', (transport) => {
    console.log('⬆️ Upgraded to:', transport.name);
  });
  
  // Fechar após 5 segundos
  setTimeout(() => {
    console.log('---');
    console.log('🏁 Test completed. Disconnecting...');
    socket.disconnect();
    process.exit(0);
  }, 5000);
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error.message);
  console.error('---');
  console.error('💡 Troubleshooting:');
  console.error('1. Check if backend is running:', API_URL);
  console.error('2. Test endpoint: curl', API_URL + '/socket.io/?EIO=4&transport=polling');
  console.error('3. Check Railway logs for errors');
  console.error('4. Verify CORS settings in backend');
});

socket.on('disconnect', (reason) => {
  console.log('🔌 Disconnected:', reason);
});

socket.on('error', (error) => {
  console.error('⚠️ Socket error:', error);
});

socket.on('notification', (data) => {
  console.log('🔔 Notification received:', data);
});

// Timeout de segurança
setTimeout(() => {
  if (!socket.connected) {
    console.error('---');
    console.error('⏱️ Connection timeout after 30 seconds');
    console.error('❌ Could not connect to Socket.IO server');
    socket.disconnect();
    process.exit(1);
  }
}, 30000);
