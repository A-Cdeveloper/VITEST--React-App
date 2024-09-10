import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import { Category } from "../../src/entities";
import userEvent from "@testing-library/user-event";

describe("ProductForm", () => {
  const categories: Category[] = [];

  beforeAll(() => {
    [1, 2, 3, 4, 5].forEach(() => {
      categories.push(db.category.create());
    });
  });
  afterAll(() => {
    const catsIds = categories.map((cat) => cat.id);
    db.category.deleteMany({
      where: {
        id: {
          in: catsIds,
        },
      },
    });
  });

  it("should render form fields", async () => {
    render(<ProductForm onSubmit={vi.fn()} />, { wrapper: AllProviders });

    await screen.findByRole("form");

    // wait for loader to be removed
    // const loader = screen.getByText(/loading/i);
    // await waitForElementToBeRemoved(loader);

    // const nameField = await screen.findByPlaceholderText(/name/i);
    const nameField = screen.getByPlaceholderText(/name/i);
    expect(nameField).toBeInTheDocument();

    const priceField = screen.getByPlaceholderText(/price/i);
    expect(priceField).toBeInTheDocument();

    const selectField = screen.getByRole("combobox", { name: /category/i });
    expect(selectField).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(selectField);

    categories.forEach(async (cat) => {
      const option = screen.getByRole("option", { name: cat.name });
      expect(option).toBeInTheDocument();
      await user.click(option);
      expect(selectField).toHaveValue(cat.id.toString());
    });
  });
});
