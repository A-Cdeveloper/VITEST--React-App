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
      getOption: (label: RegExp) =>
        screen.findByRole("option", { name: label }),
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

  it.each([
    { label: /processed/i, value: "processed" },
    {
      label: /fulfilled/i,
      value: "fulfilled",
    },
  ])(
    "should call onChange with $value when $label is selected",
    async ({ label, value }) => {
      const { user, button, getOption } = renderComponent();

      await user.click(button);

      const option = await getOption(label);
      await user.click(option);
      expect(onChange).toHaveBeenCalledWith(value);
    }
  );

  it('should call onChange with "new" when New is selected', async () => {
    const { user, button, getOption } = renderComponent();

    await user.click(button);

    const processOption = await getOption(/processed/i);
    await user.click(processOption);

    await user.click(button);

    const optionNew = await getOption(/new/i);
    await user.click(optionNew);
    expect(onChange).toHaveBeenCalledWith("new");
  });
});
