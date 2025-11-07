import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import RequireAuth from "../RequireAuth";
import { UserContext } from "../../context/UserContext";

describe("RequireAuth", () => {
  it("redirects unauthenticated users to /login", () => {
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/protected"
            element={
              <RequireAuth>
                <div data-testid="protected" />
              </RequireAuth>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("renders children when authenticated", () => {
    const value = { user: { id: "1", role: "client" }, token: "abc" };

    render(
      <UserContext.Provider value={value}>
        <MemoryRouter initialEntries={["/protected"]}>
          <Routes>
            <Route
              path="/protected"
              element={
                <RequireAuth>
                  <div data-testid="protected">OK</div>
                </RequireAuth>
              }
            />
          </Routes>
        </MemoryRouter>
      </UserContext.Provider>,
    );

    expect(screen.getByTestId("protected")).toBeInTheDocument();
  });
});
