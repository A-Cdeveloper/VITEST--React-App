import { render, screen } from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";
import AuthStatus from "../../src/components/AuthStatus";
import { mockAuthState } from "../utils";

describe("AuthStatus", () => {
  it("should render the loading indicator when get auth status", () => {
    mockAuthState({ isLoading: true, isAuthenticated: false, user: undefined });
    render(
      <MemoryRouter>
        <AuthStatus />
      </MemoryRouter>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it.only("should render login button if user is not authenticated", () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: false,
      user: undefined,
    });
    render(
      <MemoryRouter>
        <AuthStatus />
      </MemoryRouter>
    );
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /log out/i })
    ).not.toBeInTheDocument();
  });

  it.only("should render user name if user is  authenticated", () => {
    const { user } = mockAuthState({
      isLoading: false,
      isAuthenticated: true,
      user: {
        name: "Aleksandar",
      },
    });

    render(
      <MemoryRouter>
        <AuthStatus />
      </MemoryRouter>
    );
    expect(screen.getByText(user!.name!)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /log out/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /log in/i })
    ).not.toBeInTheDocument();
  });
});
