import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import { Category, Product } from "../../src/entities";
import userEvent from "@testing-library/user-event";
import { faker } from "@faker-js/faker";

describe("ProductForm", () => {
  let categories: Category[] = [];

  beforeAll(() => {
    [1, 2].forEach((item) => {
      categories.push(
        db.category.create({
          name: `Category ${faker.commerce.department()} ${item}`,
        })
      );
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
      waitFormToLoad: async () => {
        await screen.findByRole("form");
        return {
          nameInput: screen.getByPlaceholderText(/name/i),
          priceInput: screen.getByPlaceholderText(/price/i),
          categoryInput: screen.getByRole("combobox", { name: /category/i }),
          submitButton: screen.getByRole("button", { name: /submit/i }),
        };
      },
    };
  };

  it("should render form fields", async () => {
    const { waitFormToLoad } = renderComponent();

    const { nameInput, priceInput, categoryInput } = await waitFormToLoad();

    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(categoryInput);

    categories.forEach(async (cat) => {
      const option = screen.getByRole("option", { name: cat.name });
      await user.click(option);
      //expect(categoryInput).toHaveTextContent(cat.name);
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
    const { waitFormToLoad } = renderComponent(product);
    const { nameInput, priceInput, categoryInput } = await waitFormToLoad();

    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(categoryInput).toHaveTextContent(categories[0].name);
  });
  /////////////////
  it("should focus name field when form is loaded", async () => {
    const { waitFormToLoad } = renderComponent();
    const { nameInput } = await waitFormToLoad();

    expect(nameInput).toHaveFocus();
  });

  /////
  it("display error if name is missing", async () => {
    const { waitFormToLoad } = renderComponent();
    const form = await waitFormToLoad();
    const user = userEvent.setup();
    await user.type(form.priceInput, "10");
    await user.click(form.categoryInput);
    const option = screen.getAllByRole("option");
    await user.click(option[0]);
    await user.click(form.submitButton);
    const error = screen.getByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent(/required/i);
  });
});
