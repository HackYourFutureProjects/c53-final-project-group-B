import { useState, useEffect } from "react";
import { UserContext } from "./UserContext.js";
import decodeToken from "../util/decodeToken.js";

export function UserProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [locationReady, setLocationReady] = useState(false);
  const [coordinates, setCoordinates] = useState(null);

  async function tryRefresh() {
    try {
      const res = await fetch("/api/auth/refresh-token", {
        method: "POST",
        credentials: "include", // send HttpOnly refresh cookie
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token); // update token state
        localStorage.setItem("token", data.token);
        setUser(data.user); // update user state if returned
      } else {
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error("Refresh token failed", err);
      setToken(null);
      setUser(null);
    }
  }
  useEffect(() => {
    if (!token) tryRefresh();
  }, []);

  useEffect(() => {
    if (!token) return;

    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return;

    const expiresInMs = decoded.exp * 1000 - Date.now();
    const refreshBefore = expiresInMs - 5000;

    if (refreshBefore <= 0) {
      tryRefresh();
      return;
    }

    const timer = setTimeout(() => {
      tryRefresh();
    }, refreshBefore);

    return () => clearTimeout(timer);
  }, [token]);

  useEffect(() => {
    if (!token) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await fetch("/api/users/update-location", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }),
          });
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        } catch (err) {
          console.error("Failed to update location:", err);
        } finally {
          setLocationReady(true);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationReady(true);
      },
    );
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        // Successful login - server returns { token, user }
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        return { success: true, user: data.user, token: data.token };
      } else {
        // Pass through any server-provided flags like needVerification
        return {
          success: false,
          message: data.message || "Login failed",
          needVerification: data.needVerification || false,
        };
      }
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Login failed" };
    }
  };

  const register = async (
    name,
    email,
    password,
    role,
    phone,
    taskType,
    maxDistance,
    minPrice,
  ) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          phone,
          taskType,
          maxDistance,
          minPrice,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error("Registration error:", err);
      return { success: false, message: "Registration failed" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        locationReady,
        coordinates,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
