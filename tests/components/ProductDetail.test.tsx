import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import ProductDetail from "../../src/components/ProductDetail";

import { server } from "../mocks/server";
import { HttpResponse, delay, http } from "msw";

import { db } from "../mocks/db";

describe("ProductDetail", () => {
  let productId: number;

  beforeAll(() => {
    const product = db.product.create();
    productId = product.id;
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: productId } } });
  });

  it("should render product details if id is correct", async () => {
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });

    render(<ProductDetail productId={productId} />);
    const productName = await screen.findByText(new RegExp(product!.name));
    expect(productName).toBeInTheDocument();
    const price = await screen.findByText(
      new RegExp(product!.price.toString())
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

  it("should render error", async () => {
    server.use(
      http.get("/products/1", async () => {
        return HttpResponse.error();
      })
    );
    render(<ProductDetail productId={1} />);
    const message = await screen.findByText(/error/i);
    expect(message).toBeInTheDocument();
  });

  it("should render loading indicator when product is fetch", async () => {
    server.use(
      http.get("/products/1", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    render(<ProductDetail productId={1} />);
    const loading = await screen.findByText(/loading/i);
    expect(loading).toBeInTheDocument();
  });

  it("should remove loading indicator when product is fetched", async () => {
    render(<ProductDetail productId={1} />);
    waitForElementToBeRemoved(() => screen.getByText(/loading/i));
  });

  it("should remove loading indicator when product fetch fail", async () => {
    render(<ProductDetail productId={1} />);
    waitForElementToBeRemoved(() => screen.getByText(/loading/i));
  });
});
