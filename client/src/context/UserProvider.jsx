import { useState, useEffect } from "react";
import { UserContext } from "./UserContext.js";

export function UserProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [locationReady, setLocationReady] = useState(false);
  useEffect(() => {
    if (!token) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await fetch("http://localhost:3000/api/users/update-location", {
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
      value={{ user, token, login, register, logout, locationReady }}
    >
      {children}
    </UserContext.Provider>
  );
}
