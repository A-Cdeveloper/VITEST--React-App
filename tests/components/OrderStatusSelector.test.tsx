import { findByRole, render, screen } from "@testing-library/react";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";
import { Theme } from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";

describe("OrderStatusSelector", () => {
  const user = userEvent.setup();
  const labelsDefault = ["New", "Processed", "Fulfilled"];
  const onChange = vi.fn();

  const renderComponent = () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={onChange} />
      </Theme>
    );

    return {
      user,
      button: screen.getByRole("combobox"),
      labelsDefault,
      getOptions: () => screen.findAllByRole("option"),
      onChange,
    };
  };

  it('should render "New" as defalut value', () => {
    const { button } = renderComponent();
    expect(button).toHaveTextContent(/new/i);
  });

  it("should render correct statuses", async () => {
    const { button, user, labelsDefault, getOptions } = renderComponent();

    await user.click(button);

    const options = await getOptions();
    expect(options).toHaveLength(3);

    const labels = options.map((option) => option.textContent);
    expect(labels).toEqual(labelsDefault);
  });

  it("should call onChange with process when 'Processed' is selected", async () => {
    const { user, button } = renderComponent();

    await user.click(button);

    const option = await screen.findByRole("option", { name: /processed/i });
    await user.click(option);
    expect(onChange).toHaveBeenCalledWith("processed");
  });
});
