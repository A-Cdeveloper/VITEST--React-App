import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import { Category, Product } from "../../src/entities";
import userEvent from "@testing-library/user-event";

describe("ProductForm", () => {
  let categories: Category[] = [];

  beforeAll(() => {
    [1, 2].forEach((item) => {
      categories.push(db.category.create({ name: `Category ${item}` }));
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

  const renderComponent = (product?: Product) => {
    render(<ProductForm onSubmit={vi.fn()} product={product} />, {
      wrapper: AllProviders,
    });

    return {
      waitFormToLoad: screen.findByRole("form"),
      getinputs: () => {
        return {
          nameInput: screen.getByPlaceholderText(/name/i),
          priceInput: screen.getByPlaceholderText(/price/i),
          categoryInput: screen.getByRole("combobox", { name: /category/i }),
        };
      },
      // getNameInput: () => screen.getByPlaceholderText(/name/i),
    };
  };

  it("should render form fields", async () => {
    const { waitFormToLoad, getinputs } = renderComponent();

    await waitFormToLoad;
    const { nameInput, priceInput, categoryInput } = getinputs();

    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(categoryInput);

    categories.forEach(async (cat) => {
      const option = screen.getByRole("option", { name: cat.name });
      await user.click(option);
      expect(categoryInput).toHaveTextContent(cat.name);
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
    const { waitFormToLoad, getinputs } = renderComponent(product);
    await waitFormToLoad;
    const { nameInput, priceInput, categoryInput } = getinputs();

    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(categoryInput).toHaveTextContent(categories[0].name);
  });
});
