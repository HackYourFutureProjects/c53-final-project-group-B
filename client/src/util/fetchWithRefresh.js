import { refreshAccessToken } from "./refreshService";

export async function fetchWithRefresh(url, options, token, setToken) {
  // Add Authorization header
  const finalOptions = {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  // First try
  let response = await fetch(url, finalOptions);

  // If token expired (401)
  if (response.status === 401) {
    const newToken = await refreshAccessToken();

    if (!newToken) {
      return response; // refresh failed → user must login
    }

    // Save new token in context
    setToken(newToken);

    // Retry request with new token
    const retryOptions = {
      ...finalOptions,
      headers: {
        ...finalOptions.headers,
        Authorization: `Bearer ${newToken}`,
      },
    };

    response = await fetch(url, retryOptions);
  }

  return response;
}
