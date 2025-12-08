export async function refreshAccessToken() {
  try {
    const res = await fetch("/api/auth/refresh-token", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.token;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    return null;
  }
}
