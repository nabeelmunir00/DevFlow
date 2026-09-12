import { io } from "socket.io-client";

const TOKEN =
  "eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18zSjJTSnNKbFBSWVBRSHdhN3BWUFViZ2s5Z0QiLCJvaWF0IjoxNzg5MjMyODk3LCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJleHAiOjE3ODkyMzI5NTcsImZ2YSI6WzM0OTgsLTFdLCJpYXQiOjE3ODkyMzI4OTcsImlzcyI6Imh0dHBzOi8vbmF0aXZlLW1hcmxpbi0xOTYxLmNsZXJrLmFjY291bnRzLmRldiIsIm5iZiI6MTc4OTIzMjg4Nywic2lkIjoic2Vzc18zSjdyVUZaNzRXSzFMbUFMb3ZZSzVvcVVlSmwiLCJzdHMiOiJhY3RpdmUiLCJzdWIiOiJ1c2VyXzNKMlo1bEJmQWt6ZVBnUHE2U2tyd3VRMTFXTiIsInYiOjJ9.Emlu4zsNwvjpHLDRDBIw2YACObM4TvEYY0AXOBjXfzipkd_u8Lbn0Ahfn3TVbRNDmTkUnDBO6gtUKJT5vjIi4NofYtQ7i1Wx6lAGqoqOlk7pK-2rro3XjeGymKMw29XWpoVo7NjHVRTp_wZYtVsC88nF1HY7wUX0errs60cFA8qi1Tr42XsJJI2XNaLmzkFk3gLPSZgeK7MYvXOuJAoyeCBtlWZjKGms_iGwuMYjHgAj4yr4eVcy4Q247Tvglyj6saOwrw8xDE8KcFvyK6Ys2wcogwDUKi1Fezn25_gYpIiniauTXLCZtEv_CMl4pRrKYWYuDvKlsfx_4bxojZK22Q";

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

socket.on("connect_error", (error) => {
  console.error("❌ connect error:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("disconnected:", reason);
});
