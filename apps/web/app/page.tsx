"use client";

import { Show, SignInButton, UserButton, useAuth } from "@clerk/nextjs";

export default function Home() {
  const { getToken } = useAuth();

  async function testBackend() {
    const token = await getToken();
    console.log(`Bearer ${token}`);

    if (!token) {
      console.error("No Clerk token found");
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    console.log(data);
  }

  return (
    <main className="p-10">
      <Show when="signed-out">
        <SignInButton>
          <button className="rounded-md border px-4 py-2">Sign In</button>
        </SignInButton>
      </Show>

      <Show when="signed-in">
        <div className="flex items-center gap-4">
          <UserButton />

          <button onClick={testBackend} className="rounded-md border px-4 py-2">
            Test Backend Auth
          </button>
        </div>
      </Show>
    </main>
  );
}
