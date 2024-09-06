import { render, screen } from "@testing-library/react";

import ProductDetail from "../../src/components/ProductDetail";

import { server } from "../mocks/server";
import { HttpResponse, http } from "msw";
import { products } from "../mocks/data";

describe("ProductDetail", () => {
  it("should render product details if id is correct", async () => {
    render(<ProductDetail productId={1} />);

    const productName = await screen.findByText(new RegExp(products[0].name));
    expect(productName).toBeInTheDocument();
    const price = await screen.findByText(
      new RegExp(products[0].price.toString())
    );
    expect(price).toBeInTheDocument();
  });

  it('should render "The given product was not found" if id is incorrect', async () => {
    server.use(
      http.get("/products/1", async () => {
        return HttpResponse.json(null, { status: 404 });
      })
    );
    render(<ProductDetail productId={1} />);
    const message = await screen.findByText(/not found/i);
    expect(message).toBeInTheDocument();
  });

  it('should render "The given product was not found" if id is 0', async () => {
    render(<ProductDetail productId={0} />);
    const message = await screen.findByText(/invalid /i);
    expect(message).toBeInTheDocument();
  });
});
