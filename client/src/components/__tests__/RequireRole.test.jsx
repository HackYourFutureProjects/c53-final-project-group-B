import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import RequireRole from "../RequireRole";
import { UserContext } from "../../context/UserContext";

describe("RequireRole", () => {
  it("redirects unauthenticated users to /login", () => {
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/protected"
            element={
              <RequireRole allowed={["client"]}>
                <div data-testid="protected" />
              </RequireRole>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("redirects unauthorized users to /forbidden", () => {
    const value = { user: { id: "1", role: "courier" } };

    render(
      <UserContext.Provider value={value}>
        <MemoryRouter initialEntries={["/protected"]}>
          <Routes>
            <Route path="/forbidden" element={<div>Forbidden</div>} />
            <Route
              path="/protected"
              element={
                <RequireRole allowed={["client"]}>
                  <div data-testid="protected" />
                </RequireRole>
              }
            />
          </Routes>
        </MemoryRouter>
      </UserContext.Provider>,
    );

    expect(screen.getByText("Forbidden")).toBeInTheDocument();
  });

  it("renders children when role is allowed", () => {
    const value = { user: { id: "1", role: "client" } };

    render(
      <UserContext.Provider value={value}>
        <MemoryRouter initialEntries={["/protected"]}>
          <Routes>
            <Route
              path="/protected"
              element={
                <RequireRole allowed={["client"]}>
                  <div data-testid="protected">OK</div>
                </RequireRole>
              }
            />
          </Routes>
        </MemoryRouter>
      </UserContext.Provider>,
    );

    expect(screen.getByTestId("protected")).toBeInTheDocument();
  });
});
