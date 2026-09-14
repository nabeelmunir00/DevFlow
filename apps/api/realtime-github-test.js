import { io } from 'socket.io-client';

const token =
  'eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18zSjJTSnNKbFBSWVBRSHdhN3BWUFViZ2s5Z0QiLCJvaWF0IjoxNzg5Mzg4ODMwLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJleHAiOjE3ODkzODg4OTAsImZ2YSI6WzYwOTcsLTFdLCJpYXQiOjE3ODkzODg4MzAsImlzcyI6Imh0dHBzOi8vbmF0aXZlLW1hcmxpbi0xOTYxLmNsZXJrLmFjY291bnRzLmRldiIsIm5iZiI6MTc4OTM4ODgyMCwic2lkIjoic2Vzc18zSjdyVUZaNzRXSzFMbUFMb3ZZSzVvcVVlSmwiLCJzdHMiOiJhY3RpdmUiLCJzdWIiOiJ1c2VyXzNKMlo1bEJmQWt6ZVBnUHE2U2tyd3VRMTFXTiIsInYiOjJ9.Cm9iwtbmPIqupzCu8OFakRm4EiIpLLUkbANXE3UVi3ugPkJ1PdyrY349vXP2z84N0u5l-kycu-rd70BAARzgsz4Ld7MAeZKUqm7-x4sCmo6t-fhz64JAvaMPahe4LCXSNuOv5uk06XX5Y7RRr6tOuXBldCQo6lYVDA2kg-z1w54Hu5Ay2F-iF-kWiwvGAmsd2O86GszBFSKiHgaTWlSAE8Q8FEChbISV8HVv-neMrlFtIZNV9TaE-UKCYv1raQWI0ie5BCYeKw9qfMGdUNW04F7zXPM3jaqjwb8oc3Q1EyMHRmXQ2m8DMnIwrSQbl6yz4s1qhXe7VNjUemM0AMEq0A';

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
