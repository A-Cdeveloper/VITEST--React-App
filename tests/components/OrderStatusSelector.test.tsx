import { render, screen } from "@testing-library/react";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";
import { Theme } from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";

describe("OrderStatusSelector", () => {
  it('should render "New" as defalut value', () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={vi.fn()} />
      </Theme>
    );

    const button = screen.getByRole("combobox");
    expect(button).toHaveTextContent(/new/i);
  });

  it("should render choosen status", async () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={vi.fn()} />
      </Theme>
    );

    const user = userEvent.setup();
    const button = screen.getByRole("combobox");

    await user.click(button);

    const options = await screen.findAllByRole("option");
    expect(options).toHaveLength(3);

    const labels = options.map((option) => option.textContent);
    expect(labels).toEqual(["New", "Processed", "Fulfilled"]);

    // My tests Aleksandar
    // options.forEach(async (option) => {
    //   await user.click(option);
    //   expect(button).toHaveTextContent(String(option.textContent));
    // });
  });
});
