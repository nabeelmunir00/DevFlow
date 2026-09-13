import { io } from "socket.io-client";

const TOKEN =
  "eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18zSjJTSnNKbFBSWVBRSHdhN3BWUFViZ2s5Z0QiLCJvaWF0IjoxNzg5MjkxODI4LCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJleHAiOjE3ODkyOTE4ODgsImZ2YSI6WzQ0ODEsLTFdLCJpYXQiOjE3ODkyOTE4MjgsImlzcyI6Imh0dHBzOi8vbmF0aXZlLW1hcmxpbi0xOTYxLmNsZXJrLmFjY291bnRzLmRldiIsIm5iZiI6MTc4OTI5MTgxOCwic2lkIjoic2Vzc18zSjdyVUZaNzRXSzFMbUFMb3ZZSzVvcVVlSmwiLCJzdHMiOiJhY3RpdmUiLCJzdWIiOiJ1c2VyXzNKMlo1bEJmQWt6ZVBnUHE2U2tyd3VRMTFXTiIsInYiOjJ9.tINVimP3D0y7OXJBMdXovuNV4fgsU7VbqqBiAv3mlioIL9cPSvBhu4b0yda3kOFKYLP5doH8cQV6g02fr6QCD8a-RyVjBYutoDU8BUIrR_DKX6jQSLYj2t9yqh451xVOUZ2AyyhlnRXH_LuXiRPNN-ygCOi3lq6ckg-CvzzsadOQUngKLrx3-ndDGLtcNhYIaiDW-bwU1xMhduNZ5c7DHWYlrHsC7q2BWC3G7VTetn_CWa1TSU78eySPMkfUDvdhAaOLAnWjoUIqPEDgA_yk2ZKvo1s9W2WJTReUX1K5iKhLG0E_LvTw-z-C4m6Vc07WpS86CZTE2iU8acPjL0OeqQ";

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

socket.on("connect_error", (error) => {
  console.error("❌ connect error:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("disconnected:", reason);
});
