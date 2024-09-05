import { render, screen } from "@testing-library/react";
import ExpandableText from "../../src/components/ExpandableText";
import userEvent from "@testing-library/user-event";

describe("ExpandableText", () => {
  const limit = 255;
  const shortText = "A".repeat(limit - 1);
  const longText = "A".repeat(limit + 1);
  const truncatedText = "A".repeat(limit) + "...";

  const renderComponent = (text: string) => {
    render(<ExpandableText text={text} />);
    return {
      article: screen.getByText(text),
    };
  };

  it("should render text if it is less than 255 characters", () => {
    const { article } = renderComponent(shortText);
    expect(article).toHaveTextContent(shortText);
  });

  it("should truncate text if it is longer than 255 characters", () => {
    render(<ExpandableText text={longText} />);
    const article = screen.getByText(truncatedText);
    const button = screen.getByRole("button");

    expect(article).toBeInTheDocument();
    expect(article).toHaveTextContent(truncatedText);

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/more/i);
  });

  it("should show more text if button is clicked", async () => {
    const user = userEvent.setup();

    render(<ExpandableText text={longText} />);
    const button = screen.getByRole("button");
    await user.click(button);

    expect(screen.queryByText(longText)).toBeInTheDocument();
    expect(button).toHaveTextContent(/less/i);
  });

  it("should show less text if button is clicked", async () => {
    const user = userEvent.setup();

    render(<ExpandableText text={longText} />);
    const showMoreButton = screen.getByRole("button", { name: /more/i });
    await user.click(showMoreButton);

    const showLessButton = screen.getByRole("button", { name: /less/i });
    await user.click(showLessButton);

    expect(screen.queryByText(truncatedText)).toBeInTheDocument();
    expect(showMoreButton).toHaveTextContent(/more/i);
  });
});
