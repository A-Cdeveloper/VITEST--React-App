import { render, screen } from "@testing-library/react";
import CancelOrderButton from "../../src/components/CancelOrderButton";
import userEvent, {
  PointerEventsCheckLevel,
} from "@testing-library/user-event";

describe("CancelOrderButton", () => {
  const renderComponent = () => {
    render(<CancelOrderButton />);
    const user = userEvent.setup({
      pointerEventsCheck: PointerEventsCheckLevel.Never,
    });
    return {
      user,
      cancelButton: screen.getByRole("button", { name: /cancel order/i }),
      confirmButton: () => screen.queryByRole("button", { name: /yes/i }),
      closeButton: () => screen.queryByRole("button", { name: /no/i }),
      openDialog: () => screen.queryByRole("dialog"),
    };
  };

  it("should render Cancel Order button on initial rendering", () => {
    const { cancelButton } = renderComponent();
    expect(cancelButton).toBeInTheDocument();
  });

  it("should open Dialog on clicking Cancel Order button", async () => {
    const { user, cancelButton, openDialog } = renderComponent();
    await user.click(cancelButton);
    expect(openDialog()).toBeInTheDocument();
  });

  it("should close Dialog on clicking Yes or No button", async () => {
    const { user, cancelButton, confirmButton, closeButton } =
      renderComponent();
    await user.click(cancelButton);
    expect(screen.getByText(/Are you sure/i)).toBeInTheDocument();
    expect(confirmButton()).toBeInTheDocument();
    expect(closeButton()).toBeInTheDocument();

    await user.click(confirmButton()!);
    expect(screen.queryByText(/Are you sure/i)).not.toBeInTheDocument();

    await user.click(cancelButton);
    await user.click(closeButton()!);
    expect(screen.queryByText(/Are you sure/i)).not.toBeInTheDocument();
  });
});
