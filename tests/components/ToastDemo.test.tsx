import { render, screen } from "@testing-library/react";
import ToastDemo from "../../src/components/ToastDemo";
import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";

describe("ToastDemo", () => {
  const renderComponent = () => {
    const user = userEvent.setup();
    render(
      <>
        <ToastDemo />
        <Toaster />
      </>
    );
    return {
      user,
      button: screen.getByRole("button"),
    };
  };

  it("should render Toaster on button click", async () => {
    const { user, button } = renderComponent();

    await user.click(button);

    const toast = await screen.findByText(/success/i);
    expect(toast).toBeInTheDocument();
  });
});
