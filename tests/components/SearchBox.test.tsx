import { render, screen } from "@testing-library/react";
import SearchBox from "../../src/components/SearchBox";
import userEvent from "@testing-library/user-event";

describe("SearchBox", () => {
  const renderComponent = () => {
    const onChange = vi.fn(); // mock function
    const user = userEvent.setup();

    render(<SearchBox onChange={onChange} />);
    return {
      input: screen.getByPlaceholderText(/search/i),
      onChange,
      user,
    };
  };

  it("should render input filed with placeholder for seraching", () => {
    const { input } = renderComponent();
    expect(input).toBeInTheDocument();
  });

  it("should call onChange when Enter is pressed", async () => {
    const { onChange, input, user } = renderComponent();
    const searchWord = "Term";

    await user.type(input, searchWord + "{enter}");
    expect(onChange).toHaveBeenLastCalledWith(searchWord);
  });

  it("not call onChange when search word is empty and Enter is pressed", async () => {
    const { onChange, input, user } = renderComponent();

    await user.type(input, "{enter}");
    expect(onChange).not.toHaveBeenCalled();
  });
});
