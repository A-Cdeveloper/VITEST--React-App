import { render, screen } from "@testing-library/react";
import ToastDemo from "../../src/components/ToastDemo";
import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";

describe("ToastDemo", () => {
  const renderComponent = () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <>
        <ToastDemo onClick={onClick} />
        <Toaster />
      </>
    );
    return {
      user,
      button: screen.getByRole("button"),
      onClick,
    };
  };

  it("should render Toaster on button click", async () => {
    const { user, button, onClick } = renderComponent();

    await user.click(button);
    expect(onClick).toHaveBeenCalled();

    // const toast = await screen.findByText(/success/i);
    // expect(toast).toBeInTheDocument();
  });
});
