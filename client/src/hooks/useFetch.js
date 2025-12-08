import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { fetchWithRefresh } from "../util/fetchWithRefresh.js";

const useFetch = (route, onReceived) => {
  const { token, setToken } = useContext(UserContext);
  const controller = new AbortController();
  const signal = controller.signal;
  const cancelFetch = () => {
    controller.abort();
  };

  if (route.includes("api/")) {
    throw Error(
      "when using the useFetch hook, the route should not include the /api/ part",
    );
  }

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const performFetch = (options) => {
    setError(null);
    setIsLoading(true);

    const baseOptions = {
      method: "GET",
      headers: {
        "content-type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };

    const fetchData = async () => {
      const url = `/api${route}`;
      const res = await fetchWithRefresh(
        url,
        { ...baseOptions, ...options, signal },
        token,
        setToken,
      );

      if (!res.ok) {
        setError(
          `Fetch for ${url} returned an invalid status (${
            res.status
          }). Received: ${JSON.stringify(res)}`,
        );
      }

      const jsonResult = await res.json();

      if (jsonResult.success === true) {
        onReceived(jsonResult);
      } else {
        setError(
          jsonResult.msg ||
            `The result from our API did not have an error message. Received: ${JSON.stringify(
              jsonResult,
            )}`,
        );
      }

      setIsLoading(false);
    };

    fetchData().catch((error) => {
      setError(error);
      setIsLoading(false);
    });
  };

  return { isLoading, error, performFetch, cancelFetch };
};

export default useFetch;
