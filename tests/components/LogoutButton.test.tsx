import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import LogoutButton from "../../src/components/LogoutButton";

import { mockAuthState } from "../utils";

describe("LogoutButton", () => {
  /////////////////
  const renderComponent = () => {
    render(
      <MemoryRouter>
        <LogoutButton />
      </MemoryRouter>
    );
  };

  it("call logout on click", async () => {
    const { logMockFn } = mockAuthState({
      isLoading: false,
      isAuthenticated: true,
      user: { name: "Aleksandar" },
    });

    renderComponent();

    const user = userEvent.setup();
    const button = screen.getByRole("button", { name: /log out/i });
    await user.click(button);
    expect(logMockFn).toHaveBeenCalled();
  });
});
