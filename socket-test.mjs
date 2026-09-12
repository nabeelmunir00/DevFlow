import { io } from "socket.io-client";

const TOKEN =
  "eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18zSjJTSnNKbFBSWVBRSHdhN3BWUFViZ2s5Z0QiLCJvaWF0IjoxNzg5MjIyOTgwLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJleHAiOjE3ODkyMjMwNDAsImZ2YSI6WzMzMzMsLTFdLCJpYXQiOjE3ODkyMjI5ODAsImlzcyI6Imh0dHBzOi8vbmF0aXZlLW1hcmxpbi0xOTYxLmNsZXJrLmFjY291bnRzLmRldiIsIm5iZiI6MTc4OTIyMjk3MCwic2lkIjoic2Vzc18zSjdyVUZaNzRXSzFMbUFMb3ZZSzVvcVVlSmwiLCJzdHMiOiJhY3RpdmUiLCJzdWIiOiJ1c2VyXzNKMlo1bEJmQWt6ZVBnUHE2U2tyd3VRMTFXTiIsInYiOjJ9.P8uTrflF7PDBNCjcwVORtRRRoegpe94fbQqfkYuKNR3ZoVaLKlI2Zs0Otlz3t0PT08fZEMqeVhNyY6z5HzUFHjbc4MsDxxBOqDhU_Se9WyBkw5WyScz9rx8-HX1UgqTABhK-r1j3ShG6I5jJ6KH9MldmWrTKOtZk3yyRgZRDkemM4ifWW7Rv5ah6zRe6T1EZWgw8xDN7HNNdiCwrxp-znRzMSPqCNOEcqRyKOiohDtBtd-1-0jWmbV8lOKghMu2v45JS89YTRJzPdhPpupnq5EW9uqw_i45RX6E0M1KJNN3cG54F7WkjgQGbH5-NC13j4zqCBqL0C3ug0-3bS_TBlQ";

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

socket.on("connect_error", (error) => {
  console.error("❌ connect error:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("disconnected:", reason);
});
