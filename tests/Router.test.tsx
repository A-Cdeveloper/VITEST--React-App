import { render, screen, waitFor } from "@testing-library/react";
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

    expect(
      await screen.findByRole("heading", { name: product.name })
    ).toBeVisible();

    // await waitFor(() =>
    //   expect(
    //     screen.getByRole("heading", { name: product.name })
    //   ).toBeInTheDocument()
    // );
  });
});
