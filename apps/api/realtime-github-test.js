import { io } from 'socket.io-client';

const token =
  'eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18zSjJTSnNKbFBSWVBRSHdhN3BWUFViZ2s5Z0QiLCJvaWF0IjoxNzg5Mzg5NjY0LCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJleHAiOjE3ODkzODk3MjQsImZ2YSI6WzYxMTEsLTFdLCJpYXQiOjE3ODkzODk2NjQsImlzcyI6Imh0dHBzOi8vbmF0aXZlLW1hcmxpbi0xOTYxLmNsZXJrLmFjY291bnRzLmRldiIsIm5iZiI6MTc4OTM4OTY1NCwic2lkIjoic2Vzc18zSjdyVUZaNzRXSzFMbUFMb3ZZSzVvcVVlSmwiLCJzdHMiOiJhY3RpdmUiLCJzdWIiOiJ1c2VyXzNKMlo1bEJmQWt6ZVBnUHE2U2tyd3VRMTFXTiIsInYiOjJ9.cdPUsywQ4sCVtL3tKKsxn4eJeLaOYN9Mb4hugyP_zgaN-sbiIffjIWil6sPo2_Kwe1IU-qtnsQOcrWIDAEACdhVruqooVqzDnPu4ixlzrh7lqu5tA_Zf8XRLe2Utyl4ZOvxAYjDTEs8O0l5qBjUiMQp5HETtpAH8IT_BqBEHH9QVWZllL_ua8Rl5Ix4nCDvAt1j86yOMaph1ei_mYuHp6gXHqdtgBmfW18ve9PfpGtwS9rw4olYCTL72rjnYcQAmEQZxv-SvpjLFo0LrREOvBlcf1jM9bRctOu2fJbgOE2mOsZ1RkdK9_a9KwuYysmqvlgpAzkb9WoVMeTAfbzs1Kw';

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

socket.on('connect_error', (error) => {
  console.error('❌ Socket error:', error.message);
});
