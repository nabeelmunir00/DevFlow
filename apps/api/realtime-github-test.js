import { io } from 'socket.io-client';

/* ==========================================================================
   CONFIGURATION
   ========================================================================== */

/*
 * Fresh Clerk session token yahan paste karo.
 *
 * IMPORTANT:
 * - Clerk Secret Key nahi lagani.
 * - Fresh user session token lagana hai.
 * - Token expire ho sakta hai, isliye connection error aaye
 *   to fresh token generate karna.
 */
const token =
  'eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18zSjJTSnNKbFBSWVBRSHdhN3BWUFViZ2s5Z0QiLCJvaWF0IjoxNzg5NDY2MzI3LCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJleHAiOjE3ODk0NjYzODcsImZ2YSI6WzczODksLTFdLCJpYXQiOjE3ODk0NjYzMjcsImlzcyI6Imh0dHBzOi8vbmF0aXZlLW1hcmxpbi0xOTYxLmNsZXJrLmFjY291bnRzLmRldiIsIm5iZiI6MTc4OTQ2NjMxNywic2lkIjoic2Vzc18zSjdyVUZaNzRXSzFMbUFMb3ZZSzVvcVVlSmwiLCJzdHMiOiJhY3RpdmUiLCJzdWIiOiJ1c2VyXzNKMlo1bEJmQWt6ZVBnUHE2U2tyd3VRMTFXTiIsInYiOjJ9.cWZrFaKrlFN7UMebQBuUeBN3luxG27A_DffsrIe44C1roZY62AXk8wWYge6KE7xQAh2eyPzolc6BI73d00IKmadQDgQQs83WiLVnbJJUp56JevJdon9TXgFeRXtJfcPol59FFDVwozWhk8Z_ZtEPZJdMPap1QpK3w-KJJ0KjNlDroYLmiBxCeq2Ol0xkrzWfRiCqjyZGmufXl59VjZ9YiQ-MOIonGW3W3XvavnJsT-VihFK1zYV0M5rAxFK62UICdy5-CTfrve6hEwRKUxdVzraYMDJ40JRTBdzdzeWzt9yuiYonN8y3hAD_bvWkiCtJ-Vjb8Cwkt0NVb_O3Cx5Cbg';

const organizationId = 'af0e8191-836d-44e1-8719-8358d16d2571';

const projectId = '29805c6c-8070-429e-b534-91d4e4908aa0';

/* ==========================================================================
   TOKEN CHECK
   ========================================================================== */

if (!token) {
  console.error('❌ CLERK_TOKEN missing');
  console.error(
    'Fresh Clerk session token realtime-github-test.js mein add karo.',
  );

  process.exit(1);
}

/* ==========================================================================
   SOCKET CONNECTION
   ========================================================================== */

const socket = io('http://localhost:3001', {
  transports: ['websocket'],

  auth: {
    token,
  },
});

/* ==========================================================================
   CONNECTION
   ========================================================================== */

socket.on('connect', () => {
  console.log('\n========================================');
  console.log('✅ SOCKET CONNECTED');
  console.log('========================================');

  console.log('Socket ID:', socket.id);

  console.log('Organization ID:', organizationId);

  console.log('Project ID:', projectId);

  console.log('========================================\n');

  /*
   * Join organization room
   */
  socket.emit('join:organization', organizationId);

  /*
   * Join project room
   */
  socket.emit('join:project', {
    organizationId,
    projectId,
  });
});

/* ==========================================================================
   ROOM JOIN EVENTS
   ========================================================================== */

socket.on('joined:organization', (data) => {
  console.log('\n========================================');
  console.log('🏢 JOINED ORGANIZATION ROOM');
  console.log('========================================');

  console.dir(data, {
    depth: null,
    colors: true,
  });

  console.log('========================================\n');
});

socket.on('joined:project', (data) => {
  console.log('\n========================================');
  console.log('📁 JOINED PROJECT ROOM');
  console.log('========================================');

  console.dir(data, {
    depth: null,
    colors: true,
  });

  console.log('========================================\n');
});

/* ==========================================================================
   GITHUB PUSH
   ========================================================================== */

socket.on('github:push', (data) => {
  console.log('\n========================================');
  console.log('🚀 GITHUB PUSH EVENT');
  console.log('========================================');

  console.log('Repository:', data.repository?.fullName);

  console.log('Repository ID:', data.repository?.id);

  console.log('GitHub Repository ID:', data.repository?.githubRepositoryId);

  console.log('Branch:', data.branch);

  console.log('Sender:', data.sender);

  console.log('Commit Count:', data.commitCount);

  console.log('Activity ID:', data.activityId);

  console.log('\nFull payload:');

  console.dir(data, {
    depth: null,
    colors: true,
  });

  console.log('========================================\n');
});

/* ==========================================================================
   GITHUB PULL REQUEST
   ========================================================================== */

socket.on('github:pull_request', (data) => {
  console.log('\n========================================');
  console.log('🔀 GITHUB PULL REQUEST EVENT');
  console.log('========================================');

  console.log('Action:', data.action);

  console.log('DevFlow PR ID:', data.pullRequest?.id);

  console.log('GitHub PR ID:', data.pullRequest?.githubId);

  console.log('PR Number:', data.pullRequest?.number);

  console.log('Title:', data.pullRequest?.title);

  console.log('State:', data.pullRequest?.state);

  console.log('Draft:', data.pullRequest?.draft);

  console.log('Merged:', data.pullRequest?.merged);

  console.log('Author:', data.pullRequest?.author);

  console.log('Head Branch:', data.pullRequest?.headBranch);

  console.log('Base Branch:', data.pullRequest?.baseBranch);

  console.log('Repository:', data.repository?.fullName);

  console.log('DevFlow Repository ID:', data.repository?.id);

  console.log('GitHub Repository ID:', data.repository?.githubRepositoryId);

  console.log('Activity ID:', data.activityId);

  console.log('Created At:', data.createdAt);

  console.log('\nFull payload:');

  console.dir(data, {
    depth: null,
    colors: true,
  });

  console.log('========================================\n');
});

/* ==========================================================================
   GITHUB ISSUE
   ========================================================================== */

socket.on('github:issue', (data) => {
  console.log('\n========================================');
  console.log('🐛 GITHUB ISSUE EVENT');
  console.log('========================================');

  console.log('Action:', data.action);

  console.log('DevFlow Issue ID:', data.issue?.id);

  console.log('GitHub Issue ID:', data.issue?.githubId);

  console.log('Issue Number:', data.issue?.number);

  console.log('Title:', data.issue?.title);

  console.log('State:', data.issue?.state);

  console.log('State Reason:', data.issue?.stateReason);

  console.log('Author:', data.issue?.author);

  console.log('Assignee:', data.issue?.assignee);

  console.log('Repository:', data.repository?.fullName);

  console.log('DevFlow Repository ID:', data.repository?.id);

  console.log('GitHub Repository ID:', data.repository?.githubRepositoryId);

  console.log('Activity ID:', data.activityId);

  console.log('Created At:', data.createdAt);

  console.log('\nLabels:');

  console.dir(data.issue?.labels ?? [], {
    depth: null,
    colors: true,
  });

  console.log('\nFull payload:');

  console.dir(data, {
    depth: null,
    colors: true,
  });

  console.log('========================================\n');
});

/* ==========================================================================
   GITHUB ISSUE COMMENT
   ========================================================================== */

socket.on('github:issue_comment', (data) => {
  console.log('\n========================================');
  console.log('💬 GITHUB ISSUE COMMENT EVENT');
  console.log('========================================');

  console.log('Action:', data.action);

  console.log('Issue Number:', data.issue?.number);

  console.log('Issue Title:', data.issue?.title);

  console.log('Is Pull Request:', data.issue?.isPullRequest);

  console.log('Comment GitHub ID:', data.comment?.githubId);

  console.log('Comment Author:', data.comment?.author);

  console.log('Repository:', data.repository?.fullName);

  console.log('Activity ID:', data.activityId);

  console.log('\nComment Body:');

  console.log(data.comment?.body ?? '(empty)');

  console.log('\nFull payload:');

  console.dir(data, {
    depth: null,
    colors: true,
  });

  console.log('========================================\n');
});

/* ==========================================================================
   GITHUB INSTALLATION SUSPENDED
   ========================================================================== */

socket.on('github:installation_suspended', (data) => {
  console.log('\n========================================');
  console.log('⏸️ GITHUB INSTALLATION SUSPENDED');
  console.log('========================================');

  console.dir(data, {
    depth: null,
    colors: true,
  });

  console.log('========================================\n');
});

/* ==========================================================================
   GITHUB INSTALLATION UNSUSPENDED
   ========================================================================== */

socket.on('github:installation_unsuspended', (data) => {
  console.log('\n========================================');
  console.log('▶️ GITHUB INSTALLATION UNSUSPENDED');
  console.log('========================================');

  console.dir(data, {
    depth: null,
    colors: true,
  });

  console.log('========================================\n');
});

/* ==========================================================================
   GITHUB INSTALLATION DISCONNECTED
   ========================================================================== */

socket.on('github:installation_disconnected', (data) => {
  console.log('\n========================================');
  console.log('🔌 GITHUB INSTALLATION DISCONNECTED');
  console.log('========================================');

  console.dir(data, {
    depth: null,
    colors: true,
  });

  console.log('========================================\n');
});

/* ==========================================================================
   GITHUB INSTALLATION UPDATED
   ========================================================================== */

socket.on('github:installation_updated', (data) => {
  console.log('\n========================================');
  console.log('🔄 GITHUB INSTALLATION UPDATED');
  console.log('========================================');

  console.dir(data, {
    depth: null,
    colors: true,
  });

  console.log('========================================\n');
});

/* ==========================================================================
   PRESENCE
   ========================================================================== */

socket.on('presence:online', (data) => {
  console.log('\n🟢 PRESENCE ONLINE');

  console.dir(data, {
    depth: null,
    colors: true,
  });
});

socket.on('presence:offline', (data) => {
  console.log('\n⚫ PRESENCE OFFLINE');

  console.dir(data, {
    depth: null,
    colors: true,
  });
});

/* ==========================================================================
   CONNECTION ERRORS
   ========================================================================== */

socket.on('connect_error', (error) => {
  console.error('\n========================================');
  console.error('❌ SOCKET CONNECTION ERROR');
  console.error('========================================');

  console.error('Message:', error.message);

  console.error('========================================\n');
});

/* ==========================================================================
   DISCONNECT
   ========================================================================== */

socket.on('disconnect', (reason) => {
  console.log('\n========================================');
  console.log('🔴 SOCKET DISCONNECTED');
  console.log('========================================');

  console.log('Reason:', reason);

  console.log('========================================\n');
});

/* ==========================================================================
   GENERIC SOCKET ERROR
   ========================================================================== */

socket.on('error', (error) => {
  console.error('\n❌ Socket error:');

  console.dir(error, {
    depth: null,
    colors: true,
  });
});
