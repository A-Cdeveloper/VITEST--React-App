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
import { db } from "../mocks/db";
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

  const renderComponent = () => {
    render(
      <Theme>
        <CartProvider>
          <BrowseProducts />
        </CartProvider>
      </Theme>
    );

    return {
      getCategorySkeleton: () =>
        screen.getByRole("progressbar", {
          name: /categories/i,
        }),
      getProductsSkeleton: () =>
        screen.getByRole("progressbar", {
          name: /products/i,
        }),
      getCategoriesCombobox: () => screen.getByRole("combobox"),
    };
  };

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
    const { getCategorySkeleton, getCategoriesCombobox } = renderComponent();
    // await waitForElementToBeRemoved(getCategorySkeleton());

    const errorCategories = screen.queryByText(/error/i);
    expect(errorCategories).not.toBeInTheDocument();

    expect(getCategoriesCombobox).not.toBeInTheDocument();
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

    const catList = getCategoriesCombobox();
    expect(catList).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(catList!);

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
});
