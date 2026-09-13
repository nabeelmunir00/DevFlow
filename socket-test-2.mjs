import { io } from "socket.io-client";

const TOKEN =
  "eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18zSjJTSnNKbFBSWVBRSHdhN3BWUFViZ2s5Z0QiLCJvaWF0IjoxNzg5MzAyNDU2LCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJleHAiOjE3ODkzMDI1MTYsImZ2YSI6WzQ2NTgsLTFdLCJpYXQiOjE3ODkzMDI0NTYsImlzcyI6Imh0dHBzOi8vbmF0aXZlLW1hcmxpbi0xOTYxLmNsZXJrLmFjY291bnRzLmRldiIsIm5iZiI6MTc4OTMwMjQ0Niwic2lkIjoic2Vzc18zSjdyVUZaNzRXSzFMbUFMb3ZZSzVvcVVlSmwiLCJzdHMiOiJhY3RpdmUiLCJzdWIiOiJ1c2VyXzNKMlo1bEJmQWt6ZVBnUHE2U2tyd3VRMTFXTiIsInYiOjJ9.blOX9OdzbcAaKz3VQHD1royxy9EFdpMB2C3WOrCDtr6_xrzvA2ehiJDn5I8isnZZEckGu5qsN_CnRaLmoq66Awyns8--h7FF5stVb_GxZhLPMiW6PUAxHTHx483Uhy8f21R-N_mkEdQbbM_KzuFZUyK5jfk7x7DcEgviQiyAx4L2VSWLIuOZqNOQUT6UVw9PFmtqCEz6us8mUrXD61Y8MA9X8Hs94lLh8p34KR8zvtvs43tyt7TIZ3Er6XQ60tRj39cgRiln1Ul52_zHmbVUt7u_IAKBy6JXSel6QZBXRodjQyL6jvF3ppu3ij2h493CFsS4VSJRald_4dWsMBRK2g";

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

socket.on("label:created", (payload) => {
  console.log("🏷️ label created:", payload);
});

socket.on("label:updated", (payload) => {
  console.log("✏️ label updated:", payload);
});

socket.on("label:deleted", (payload) => {
  console.log("🗑️ label deleted:", payload);
});

socket.on("label:attached", (payload) => {
  console.log("🔗 label attached:", payload);
});

socket.on("label:detached", (payload) => {
  console.log("⛓️ label detached:", payload);
});

socket.on("presence:online", (payload) => {
  console.log("🟢 user online:", payload);
});

socket.on("presence:offline", (payload) => {
  console.log("⚫ user offline:", payload);
});

socket.on("typing:start", (payload) => {
  console.log("⌨️ typing started:", payload);
});

socket.on("typing:stop", (payload) => {
  console.log("🛑 typing stopped:", payload);
});

socket.on("connect_error", (error) => {
  console.error("❌ connect error:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("disconnected:", reason);
});
