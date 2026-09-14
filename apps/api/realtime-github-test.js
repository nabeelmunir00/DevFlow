import { io } from 'socket.io-client';

const token =
  'eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18zSjJTSnNKbFBSWVBRSHdhN3BWUFViZ2s5Z0QiLCJvaWF0IjoxNzg5NDAxNTI5LCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJleHAiOjE3ODk0MDE1ODksImZ2YSI6WzYzMDksLTFdLCJpYXQiOjE3ODk0MDE1MjksImlzcyI6Imh0dHBzOi8vbmF0aXZlLW1hcmxpbi0xOTYxLmNsZXJrLmFjY291bnRzLmRldiIsIm5iZiI6MTc4OTQwMTUxOSwic2lkIjoic2Vzc18zSjdyVUZaNzRXSzFMbUFMb3ZZSzVvcVVlSmwiLCJzdHMiOiJhY3RpdmUiLCJzdWIiOiJ1c2VyXzNKMlo1bEJmQWt6ZVBnUHE2U2tyd3VRMTFXTiIsInYiOjJ9.OaeIEvEIXWOAw89hxBIZyiPyGBjHS4wIevgF9BvXQsB13EM6ND0M0C1W-ZXCoJ68Ek_uxdEKS3Pxbl5Dk4fR1h4vrx0-b8ysSs9oWIskU1hWKEu4Q2WfpXlyVND8ZEU7S2S8j9-VHrNqYvR926KYibbbarVHyimgjdUR1ka32KzrF3zmClVNw1pr7EE5wJdpChDPeYWxXvH8zdA_BD3luf_82kJK5fw4Mj7OzuS76tUXYrflMBVybzLMwev-JMKRGlAuWXfttnUSMCwbpfLnVEusOV-9N9N4fCACsntvLQ_t-SuQMaVpHUzP2mtppgqI8QMadfda7QpAre0os9ju6Q';

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

socket.on('connect', () => {
  console.log('✅ Connected:', socket.id);

  socket.emit('join:project', {
    organizationId,
    projectId,
  });
});

socket.on('joined:project', (data) => {
  console.log('✅ Joined project room:', data);
});

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

socket.on('connect_error', (error) => {
  console.error('❌ Socket error:', error.message);
});
