import { render, screen } from "@testing-library/react";
import TermsAndConditions from "../../src/components/TermsAndConditions";
import userEvent from "@testing-library/user-event";

describe("TermsAndConditions", () => {
  it("should render with correct text and initial state", () => {
    render(<TermsAndConditions />);

    const heading = screen.getByRole("heading");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Terms & Conditions");

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it("should enable button when checkbox is checked", async () => {
    render(<TermsAndConditions />);

    const user = userEvent.setup();
    const checkbox = screen.getByRole("checkbox");
    const button = screen.getByRole("button", { name: /submit/i });

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(button).not.toBeDisabled();
  });
});
