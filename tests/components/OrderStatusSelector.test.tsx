import { render, screen } from "@testing-library/react";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";
import { Theme } from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";

describe("OrderStatusSelector", () => {
  const renderComponent = () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={vi.fn()} />
      </Theme>
    );

    const user = userEvent.setup();
    const labelsDefault = ["New", "Processed", "Fulfilled"];

    return {
      user,
      button: screen.getByRole("combobox"),
      labelsDefault,
      getOptions: () => screen.findAllByRole("option"),
    };
  };

  it('should render "New" as defalut value', () => {
    const { button } = renderComponent();
    expect(button).toHaveTextContent(/new/i);
  });

  it("should render choosen status", async () => {
    const { button, user, labelsDefault, getOptions } = renderComponent();

    await user.click(button);

    const options = await getOptions();
    expect(options).toHaveLength(3);

    const labels = options.map((option) => option.textContent);
    expect(labels).toEqual(labelsDefault);

    // My tests Aleksandar
    // options.forEach(async (option) => {
    //   await user.click(option);
    //   expect(button).toHaveTextContent(String(option.textContent));
    // });
  });
});
