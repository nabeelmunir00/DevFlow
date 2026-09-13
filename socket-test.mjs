import { io } from "socket.io-client";

const TOKEN =
  "eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18zSjJTSnNKbFBSWVBRSHdhN3BWUFViZ2s5Z0QiLCJvaWF0IjoxNzg5MjkwMTUyLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJleHAiOjE3ODkyOTAyMTIsImZ2YSI6WzU1NDMsLTFdLCJpYXQiOjE3ODkyOTAxNTIsImlzcyI6Imh0dHBzOi8vbmF0aXZlLW1hcmxpbi0xOTYxLmNsZXJrLmFjY291bnRzLmRldiIsIm5iZiI6MTc4OTI5MDE0Miwic2lkIjoic2Vzc18zSjVpcFhBVm5pNFEwRFBpb2taUVpITWJGbHYiLCJzdHMiOiJhY3RpdmUiLCJzdWIiOiJ1c2VyXzNKNWlwWEpMb05acVVqdnNkN0ZSdVpSZEFMUyIsInYiOjJ9.sJC5jZWNiThKOqz1BQqM7hggFPPGw33F76H7fkiTjYpcbI-ADvDt2GAiV2OES_wilQoULOtMDqBbz4jHrGI-l2EXi3JDdqWueKUlRvtFQKXHvVrrrzM0H0rxdvswOA_wVYXGib0jaLeBA5y0uzKdoE122945kEkGz7Nq6KMzjH16rW5J1tSSVR250N8yWMR_kYOu8-nD9uAxVJdJcTnpPUF3CxirbXFTpZMfQZcPDbZMCKuYrgw_3Iwe66-DKWRl3ODSacS4d4YGjwyZPQvDkfNhUxr77aIzFEMJnkwAKkHGyWRk1cii8PeM6AdP5DZLVFBk2TZwQpd_xmfD35mqzA";

const ORGANIZATION_ID = "af0e8191-836d-44e1-8719-8358d16d2571";

const PROJECT_ID = "29805c6c-8070-429e-b534-91d4e4908aa0";

const socket = io("http://localhost:3001", {
  auth: {
    token: TOKEN,
  },
});

socket.on("connect", () => {
  console.log("✅ connected:", socket.id);

  socket.emit("join:organization", ORGANIZATION_ID, (response) => {
    console.log("organization response:", response);
  });

  socket.emit(
    "join:project",
    {
      organizationId: ORGANIZATION_ID,
      projectId: PROJECT_ID,
    },
    (response) => {
      console.log("project response:", response);
    },
  );
});

socket.on("joined:organization", (data) => {
  console.log("joined organization:", data);
});

socket.on("joined:project", (data) => {
  console.log("joined project:", data);
});

socket.on("task:created", (payload) => {
  console.log("🚀 task created realtime event:");
  console.log(payload);
});

socket.on("task:updated", (payload) => {
  console.log("📝 task updated:", payload);
});

socket.on("task:moved", (payload) => {
  console.log("🔄 task moved:", payload);
});

socket.on("task:archived", (payload) => {
  console.log("🗄️ task archived:", payload);
});

socket.on("task:reordered", (payload) => {
  console.log("↕️ tasks reordered:", payload);
});

socket.on("comment:created", (payload) => {
  console.log("💬 comment created:", payload);
});

socket.on("comment:updated", (payload) => {
  console.log("✏️ comment updated:", payload);
});

socket.on("comment:deleted", (payload) => {
  console.log("🗑️ comment deleted:", payload);
});

socket.on("notification:new", (notification) => {
  console.log("🔔 new notification:", notification);
});

socket.on("connect_error", (error) => {
  console.error("❌ connect error:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("disconnected:", reason);
});
