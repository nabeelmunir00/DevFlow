import { io } from "socket.io-client";

const TOKEN =
  "eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18zSjJTSnNKbFBSWVBRSHdhN3BWUFViZ2s5Z0QiLCJvaWF0IjoxNzg5MjkzMDE3LCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJleHAiOjE3ODkyOTMwNzcsImZ2YSI6WzQ1MDAsLTFdLCJpYXQiOjE3ODkyOTMwMTcsImlzcyI6Imh0dHBzOi8vbmF0aXZlLW1hcmxpbi0xOTYxLmNsZXJrLmFjY291bnRzLmRldiIsIm5iZiI6MTc4OTI5MzAwNywic2lkIjoic2Vzc18zSjdyVUZaNzRXSzFMbUFMb3ZZSzVvcVVlSmwiLCJzdHMiOiJhY3RpdmUiLCJzdWIiOiJ1c2VyXzNKMlo1bEJmQWt6ZVBnUHE2U2tyd3VRMTFXTiIsInYiOjJ9.KB2wULfScWrmzPyyuAMqReEFoM-v62YrbtYVsvGK4-s6MG4F90dSo_6DZRhgG-Jhad7UTbNqYH0TpymAJ5DhpPIJlYYdZ3_UdjDZrJE9bhXnBIwdb-8wfLBEOd4L7CmexslP-QBiJ6Jn0UlPDm09t6jiRAs0DVNXj14rRFuJIadrVh1TCMdeBgdNzDX4EfJu3G-u5upRmqqviqKhF-ohYGjut7wXOpuhuLxsp2aWCXmAwdw73RSuFrqpvAi1aSbIDNg-m818orhPVh4IpEyoG-bMvlaHTQ2QLNXH3vejxNns_Tf9o-cAe3wqz6Fxw_eIiTCfbIrkgeqqdC-2r2aO-g";

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

socket.on("attachment:uploaded", (payload) => {
  console.log("📎 attachment uploaded:", payload);
});

socket.on("attachment:deleted", (payload) => {
  console.log("🗑️ attachment deleted:", payload);
});
socket.on("subtask:created", (payload) => {
  console.log("✅ subtask created:", payload);
});

socket.on("subtask:updated", (payload) => {
  console.log("📝 subtask updated:", payload);
});

socket.on("subtask:deleted", (payload) => {
  console.log("🗑️ subtask deleted:", payload);
});

socket.on("connect_error", (error) => {
  console.error("❌ connect error:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("disconnected:", reason);
});
