import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import { Category, Product } from "../../src/entities";
import userEvent from "@testing-library/user-event";

describe("ProductForm", () => {
  let categories: Category[] = [];

  beforeAll(() => {
    [1, 2].forEach(() => {
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

  it.skip("should render form fields", async () => {
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
      await user.click(option);
      expect(selectField).toHaveValue(cat.id.toString());
    });
  });
  ////////////////////////////////////////////////////////////////////
  it("should render form in edit mode", async () => {
    const product = {
      id: 1,
      name: "Product 1",
      price: 100,
      categoryId: categories[0].id,
    };

    render(<ProductForm onSubmit={vi.fn()} product={product} />, {
      wrapper: AllProviders,
    });

    await screen.findByRole("form");
    console.log(product.categoryId.toString());
    const nameField = screen.getByPlaceholderText(/name/i);
    expect(nameField).toHaveValue(product.name);

    const priceField = screen.getByPlaceholderText(/price/i);
    expect(priceField).toHaveValue(product.price.toString());

    const selectField = screen.getByRole("combobox", { name: /category/i });
    expect(selectField).toHaveTextContent(categories[0].name);
  });
});
