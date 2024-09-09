import { faker } from "@faker-js/faker";
import { Theme } from "@radix-ui/themes";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Category, Product } from "../../src/entities";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { CartProvider } from "../../src/providers/CartProvider";
import { db, getProductsByCategory } from "../mocks/db";
import { simulateDelay, simulateError } from "../utils";

describe("BrowseProducts", () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    [1, 2].forEach((item) => {
      categories.push(
        db.category.create({
          name: "Category " + faker.commerce.department() + " " + item,
        })
      );
    });

    [1, 2, 3].forEach(() => {
      products.push(db.product.create());
    });
  });
  afterAll(() => {
    const catsIds = categories.map((cat) => cat.id);
    db.category.deleteMany({
      where: {
        id: { in: catsIds },
      },
    });

    const productsIds = products.map((prod) => prod.id);
    db.category.deleteMany({
      where: {
        id: { in: productsIds },
      },
    });
  });

  //
  it("should render loading skeleton durring fetchng categories", async () => {
    simulateDelay("categories");
    const { getCategorySkeleton } = renderComponent();
    expect(getCategorySkeleton()).toBeInTheDocument();
  });

  //
  it("should hide loading skeleton after categories fetched", async () => {
    const { getCategorySkeleton } = renderComponent();
    await waitForElementToBeRemoved(getCategorySkeleton);
  });

  //
  it("should render loading skeletons durring fetchng products", async () => {
    simulateDelay("products");
    const { getProductsSkeleton } = renderComponent();
    expect(getProductsSkeleton()).toBeInTheDocument();
  });

  //
  it("should hide loading skeleton after products fetched", async () => {
    const { getProductsSkeleton } = renderComponent();
    await waitForElementToBeRemoved(getProductsSkeleton);
  });

  //

  //
  it("should not render error message if categories cannot be fetched", async () => {
    simulateError("categories");
    const { getCategorySkeleton } = renderComponent();
    await waitForElementToBeRemoved(getCategorySkeleton());

    const errorCategories = screen.queryByText(/error/i);
    expect(errorCategories).not.toBeInTheDocument();
  });

  //
  it("should render error message durring fetchng products", async () => {
    simulateError("products");
    renderComponent();
    const errorProducts = await screen.findByText(/error/i);
    expect(errorProducts).toBeInTheDocument();
  });

  //
  it("should render categories", async () => {
    const { getCategorySkeleton, getCategoriesCombobox } = renderComponent();

    await waitForElementToBeRemoved(getCategorySkeleton());
    const combobox = getCategoriesCombobox();

    const user = userEvent.setup();
    await user.click(combobox!);

    expect(screen.getByRole("option", { name: /all/i })).toBeInTheDocument();

    categories.forEach((cat) => {
      expect(
        screen.getByRole("option", { name: cat.name })
      ).toBeInTheDocument();
    });
  });

  //
  it("should render products", async () => {
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);

    products.forEach((prod) => {
      expect(screen.getByText(RegExp(prod.name))).toBeInTheDocument();
    });
  });

  it("should filter products by category", async () => {
    const { selectCategory, expectProductsToBeInDocument } = renderComponent();

    const selectedCategory = categories[0];
    await selectCategory(new RegExp(selectedCategory.name));

    // Assert
    const products = getProductsByCategory(selectedCategory.id);
    expectProductsToBeInDocument(products);
  });

  it("should render all products if All category is selected", async () => {
    const { selectCategory, expectProductsToBeInDocument } = renderComponent();

    await selectCategory(new RegExp(/all/i));

    // Assert
    const products = db.product.getAll();
    expectProductsToBeInDocument(products);
  });
});

///////// HELPER FUNCTIONS    ///////
const renderComponent = () => {
  render(
    <Theme>
      <CartProvider>
        <BrowseProducts />
      </CartProvider>
    </Theme>
  );

  const getCategorySkeleton = () =>
    screen.getByRole("progressbar", {
      name: /categories/i,
    });

  const getProductsSkeleton = () =>
    screen.getByRole("progressbar", {
      name: /products/i,
    });

  const getCategoriesCombobox = () => screen.getByRole("combobox");

  const selectCategory = async (name: RegExp) => {
    await waitForElementToBeRemoved(getCategorySkeleton);
    const combobox = getCategoriesCombobox();
    const user = userEvent.setup();
    await user.click(combobox!);

    const option = screen.getByRole("option", {
      name,
    });
    await user.click(option);
  };

  const expectProductsToBeInDocument = (products: Product[]) => {
    const rows = screen.getAllByRole("row");
    const dataRows = rows.slice(1); // heading row
    expect(dataRows).toHaveLength(products.length);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  };

  return {
    getCategorySkeleton,
    getProductsSkeleton,
    getCategoriesCombobox,
    selectCategory,
    expectProductsToBeInDocument,
  };
};
