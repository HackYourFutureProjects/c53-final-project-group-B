import { refreshAccessToken } from "./refreshService";

export async function fetchWithRefresh(url, options, token, setToken) {
  const finalOptions = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  let response = await fetch(url, finalOptions);

  if (response.status === 401) {
    const newToken = await refreshAccessToken();

    if (!newToken) {
      return response;
    }

    setToken(newToken);
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
