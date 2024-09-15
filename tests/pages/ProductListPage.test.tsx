import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Product } from "../../src/entities";
import ProductListPage from "../../src/pages/ProductListPage";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import { simulateDelay, simulateError } from "../utils";

describe("ProductListPage", () => {
  let products: Product[] = [];

  beforeAll(() => {
    products = new Array(3).fill(db.product.create());
  });
  afterAll(() => {
    db.product.deleteMany({
      where: {
        id: {
          in: products.map((product) => product.id),
        },
      },
    });
  });

  const renderComponent = () => {
    render(
      <MemoryRouter>
        <ProductListPage />
      </MemoryRouter>,
      { wrapper: AllProviders }
    );
  };

  it("should render loading indicator when fetch data", () => {
    simulateDelay("products");
    renderComponent();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should render error message when fetch data fail", async () => {
    simulateError("products");
    renderComponent();
    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  it("should render list of products when data is fetched and no products", async () => {
    simulateDelay("products");
    renderComponent();
    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
    expect(screen.getByText(/no product/i)).toBeInTheDocument();
  });

  it("should render list of products when data is fetched", async () => {
    renderComponent();
    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
    products.forEach((product) => {
      expect(screen.getByText(RegExp(product.name, "i"))).toBeInTheDocument();
    });
  });
});
