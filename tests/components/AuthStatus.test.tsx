import { render, screen } from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";
import AuthStatus from "../../src/components/AuthStatus";
import { mockAuthState } from "../utils";

describe("AuthStatus", () => {
  const renderComponent = ({
    isLoading = false,
    isAuthenticated = false,
    user = undefined as { name: string } | undefined,
  }) => {
    const authState = mockAuthState({
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
      authState,
    };
  };

  it("should render the loading indicator when get auth status", () => {
    renderComponent({});
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it.only("should render login button if user is not authenticated", () => {
    renderComponent({
      isLoading: false,
      isAuthenticated: false,
      user: undefined,
    });
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /log out/i })
    ).not.toBeInTheDocument();
  });

  it.only("should render user name if user is  authenticated", () => {
    const { authState } = renderComponent({
      isLoading: false,
      isAuthenticated: true,
      user: {
        name: "Aleksandar",
      },
    });
    expect(screen.getByText(authState!.user!.name!)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /log out/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /log in/i })
    ).not.toBeInTheDocument();
  });
});
