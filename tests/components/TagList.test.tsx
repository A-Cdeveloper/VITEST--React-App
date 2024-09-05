import { render, screen } from "@testing-library/react";
import TagList from "../../src/components/TagList";

describe("TagList", () => {
  it("should render tags", async () => {
    render(<TagList />);

    // await waitFor(
    //   () => {
    //     const tags = screen.getAllByRole("listitem");
    //     expect(tags.length).toBeGreaterThan(0);
    //   },
    //   { timeout: 1500 }
    // );

    const listItems = await screen.findAllByRole("listitem");
    expect(listItems.length).toBeGreaterThan(0);
  });
});
