import { render, screen } from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";
import AuthStatus from "../../src/components/AuthStatus";
import { mockAuthState } from "../utils";

describe("AuthStatus", () => {
  const renderComponent = (
    isLoading = false,
    isAuthenticated = false,
    user = undefined as { name: string } | undefined
  ) => {
    const { user: userauth } = mockAuthState({
      isLoading,
      isAuthenticated,
      user,
    });

    render(
      <MemoryRouter>
        <AuthStatus />
      </MemoryRouter>
    );
    return {
      userauth,
    };
  };

  it("should render the loading indicator when get auth status", () => {
    renderComponent(true, false, undefined);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should render login button if user is not authenticated", () => {
    renderComponent(false, false, undefined);
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /log out/i })
    ).not.toBeInTheDocument();
  });

  it("should render user name if user is authenticated", () => {
    const { userauth } = renderComponent(false, true, { name: "Aleksandar" });

    expect(screen.getByText(userauth!.name!)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /log out/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /log in/i })
    ).not.toBeInTheDocument();
  });
});
