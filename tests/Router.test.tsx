import { render, screen, waitFor } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import routes from "../src/routes";
import { db } from "./mocks/db";
import { server } from "./mocks/server";
import { HttpResponse, delay, http } from "msw";
import { Product } from "../src/entities";

describe("Router", () => {
  let product: Product;

  beforeAll(() => {
    product = db.product.create();
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: product.id } } });
  });

  ///
  it("should render Home page for the route /", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });
    render(<RouterProvider router={router} />);
    expect(screen.getByRole("heading", { name: /home/i }));
  });

  it("should render Product page for the route /products", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/products"],
    });
    render(<RouterProvider router={router} />);
    expect(screen.getByRole("heading", { name: /products/i }));
  });

  it("should render Product detail page for the route /products:id", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: [`/products/${product.id}`],
    });
    render(<RouterProvider router={router} />);
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: product.name })
      ).toBeInTheDocument()
    );
  });
});
