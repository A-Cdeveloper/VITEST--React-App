import {
  getByText,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { Product } from "../src/entities";
import routes from "../src/routes";
import { db } from "./mocks/db";

describe("Router", () => {
  let product: Product;

  beforeAll(() => {
    product = db.product.create();
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: product.id } } });
  });

  const renderComponent = (path: string) => {
    const router = createMemoryRouter(routes, {
      initialEntries: [path],
    });
    render(<RouterProvider router={router} />);
  };

  ///
  it("should render Home page for the route /", () => {
    renderComponent("/");
    expect(screen.getByRole("heading", { name: /home/i }));
  });

  it("should render Product page for the route /products", () => {
    renderComponent("/products");
    expect(screen.getByRole("heading", { name: /products/i }));
  });

  it("should render Product detail page for the route /products:id", async () => {
    renderComponent(`/products/${product.id}`);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    expect(
      screen.getByRole("heading", { name: product.name })
    ).toBeInTheDocument();

    expect(
      screen.getByText(RegExp(product.price.toString(), "i"))
    ).toBeInTheDocument();
  });

  it("should render Error message for the route /products:id in product not found", async () => {
    renderComponent(`/products/123456`);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });

  it("should render Error page for the invalid route", () => {
    renderComponent("/abc");
    expect(screen.getByRole("heading", { name: /oops/i }));
  });
  ///// admin area
  it("should render admin homepage for route /admin", () => {
    renderComponent("/admin");
    expect(screen.getByRole("heading", { name: /admin/i }));
  });

  it("should render admin products for route /admin/products", () => {
    renderComponent("/admin/products");
    expect(screen.getByRole("heading", { name: /products/i }));
  });

  it("should render admin products for route /admin/products/new", () => {
    renderComponent("/admin/products/new");
    expect(screen.getByRole("heading", { name: /new/i }));
  });

  it("should render loading indicator for route /admin/product/:id/edit", async () => {
    renderComponent(`/admin/products/${product.id}/edit`);
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    expect(screen.getByRole("heading", { name: /edit/i })).toBeInTheDocument();
  });
});
