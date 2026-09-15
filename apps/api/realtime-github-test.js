import { io } from 'socket.io-client';

const token =
  'eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18zSjJTSnNKbFBSWVBRSHdhN3BWUFViZ2s5Z0QiLCJvaWF0IjoxNzg5NDUyNzM2LCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJleHAiOjE3ODk0NTI3OTYsImZ2YSI6WzcxNjIsLTFdLCJpYXQiOjE3ODk0NTI3MzYsImlzcyI6Imh0dHBzOi8vbmF0aXZlLW1hcmxpbi0xOTYxLmNsZXJrLmFjY291bnRzLmRldiIsIm5iZiI6MTc4OTQ1MjcyNiwic2lkIjoic2Vzc18zSjdyVUZaNzRXSzFMbUFMb3ZZSzVvcVVlSmwiLCJzdHMiOiJhY3RpdmUiLCJzdWIiOiJ1c2VyXzNKMlo1bEJmQWt6ZVBnUHE2U2tyd3VRMTFXTiIsInYiOjJ9.Z7pT008VB3dfETuS3yqmII3fPLaVXe6e1Mw4X9Rc5khYNHWxy6i9IM-k0Un4Fkk4wzlmws_2DBiJl5phoanr6z8WTUC3BUUIMci4btOuP3xjLUSV7rnZ2bLQ3_WIDF14YQVBGDZhuSTYFiD3JUEszQjqNGs3EgDBvJjKfjEukrYoE8ojiYKvYk2RkDVwlDlmptUeF-atNwZkc5o8tN74cTGnqAHGWcVVcSNuyo7QHlje4CoirkHugaoXm0psPok_3F_5wXTHY6JUyRv2gSUtINnBy5YyjEqZBGKxtN6z2EcuBLn5--eXIu4PM6aadp2EhdpoeCZgaKYzJVrXT9cPww';

const organizationId = 'af0e8191-836d-44e1-8719-8358d16d2571';
const projectId = '29805c6c-8070-429e-b534-91d4e4908aa0';

if (!token) {
  console.error('❌ CLERK_TOKEN missing');
  process.exit(1);
}

const socket = io('http://localhost:3001', {
  transports: ['websocket'],
  auth: {
    token,
  },
});

// =====================================================
// CONNECTION
// =====================================================

socket.on('connect', () => {
  console.log('✅ Connected:', socket.id);

  // Join organization room
  socket.emit('join:organization', organizationId);

  // Join project room
  socket.emit('join:project', {
    organizationId,
    projectId,
  });
});

// =====================================================
// ROOM JOIN EVENTS
// =====================================================

socket.on('joined:organization', (data) => {
  console.log('🏢 Joined organization room');
  console.dir(data, { depth: null });
});

socket.on('joined:project', (data) => {
  console.log('📁 Joined project room');
  console.dir(data, { depth: null });
});

// =====================================================
// GITHUB PROJECT EVENTS
// =====================================================

socket.on('github:push', (data) => {
  console.log('🚀 github:push received');
  console.dir(data, { depth: null });
});

socket.on('github:pull_request', (data) => {
  console.log('🔀 github:pull_request received');
  console.dir(data, { depth: null });
});

socket.on('github:issue', (data) => {
  console.log('🐛 github:issue received');
  console.dir(data, { depth: null });
});

socket.on('github:issue_comment', (data) => {
  console.log('💬 github:issue_comment received');
  console.dir(data, { depth: null });
});

// =====================================================
// GITHUB INSTALLATION EVENTS
// Organization-level events
// =====================================================

socket.on('github:installation_suspended', (data) => {
  console.log('⏸️ github:installation_suspended received');
  console.dir(data, { depth: null });
});

socket.on('github:installation_unsuspended', (data) => {
  console.log('▶️ github:installation_unsuspended received');
  console.dir(data, { depth: null });
});

socket.on('github:installation_disconnected', (data) => {
  console.log('🔌 github:installation_disconnected received');
  console.dir(data, { depth: null });
});

socket.on('github:installation_updated', (data) => {
  console.log('🔄 github:installation_updated received');
  console.dir(data, { depth: null });
});

// =====================================================
// PRESENCE
// =====================================================

socket.on('presence:online', (data) => {
  console.log('🟢 presence:online');
  console.dir(data, { depth: null });
});

socket.on('presence:offline', (data) => {
  console.log('⚫ presence:offline');
  console.dir(data, { depth: null });
});

// =====================================================
// CONNECTION ERRORS
// =====================================================

socket.on('connect_error', (error) => {
  console.error('❌ Socket connection error:', error.message);
});

socket.on('disconnect', (reason) => {
  console.log('🔴 Socket disconnected:', reason);
});
