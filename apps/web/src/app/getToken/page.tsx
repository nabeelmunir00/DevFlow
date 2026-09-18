"use client";

import { useAuth } from "@clerk/nextjs";

export default function TestToken() {
  const { getToken } = useAuth();

  async function fetchToken() {
    try {
      const token = await getToken();

      if (!token) {
        console.log("No token found");
        return;
      }

      console.log("Clerk token:", token);

      return token;
    } catch (error) {
      console.error("Failed to get Clerk token:", error);
    }
  }

  return <button onClick={fetchToken}>Get Token</button>;
}
