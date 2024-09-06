import { render, screen } from "@testing-library/react";
import ProductList from "../../src/components/ProductList";
import { server } from "../mocks/server";
import { HttpResponse, http } from "msw";

import { db } from "../mocks/db";

describe("ProductList", () => {
  const productsIds: number[] = [];

  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.product.create();
      productsIds.push(product.id);
    });
  });
  afterAll(() => {
    db.product.deleteMany({
      where: {
        id: {
          in: productsIds,
        },
      },
    });
  });

  it("should render list of products", async () => {
    render(<ProductList />);
    const products = await screen.findAllByRole("listitem");
    expect(products.length).toBeGreaterThan(0);
  });

  it('should render "No products available." if products list is empty', async () => {
    server.use(
      http.get("/products", () => {
        return HttpResponse.json([]);
      })
    );
    render(<ProductList />);
    const message = await screen.findByText(/no products/i);
    expect(message).toBeInTheDocument();
  });

  it("should render erorr message", async () => {
    server.use(
      http.get("/products", () => {
        return HttpResponse.error();
      })
    );
    render(<ProductList />);
    const message = await screen.findByText(/error/i);
    expect(message).toBeInTheDocument();
  });
});
