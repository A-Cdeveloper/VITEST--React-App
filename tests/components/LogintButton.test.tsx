import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import LoginButton from "../../src/components/LoginButton";
import { mockAuthState } from "../utils";

describe("LoginButton", () => {
  /////////////////
  const renderComponent = () => {
    render(
      <MemoryRouter>
        <LoginButton />
      </MemoryRouter>
    );
  };

  it("call login on click", async () => {
    const { logMockFn } = mockAuthState({
      isLoading: false,
      isAuthenticated: true,
      user: undefined,
    });

    renderComponent();

    const user = userEvent.setup();
    const button = screen.getByRole("button", { name: /log in/i });
    await user.click(button);
    expect(logMockFn).toHaveBeenCalled();
  });
});
