import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import ProductList from "../../src/components/ProductList";
import { server } from "../mocks/server";
import { HttpResponse, http } from "msw";

import { db } from "../mocks/db";
import delay from "delay";
import { QueryClient, QueryClientProvider } from "react-query";

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

  const renderComponent = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ProductList />
      </QueryClientProvider>
    );
  };

  it("should render list of products", async () => {
    renderComponent();
    const products = await screen.findAllByRole("listitem");
    expect(products.length).toBeGreaterThan(0);
  });

  it('should render "No products available." if products list is empty', async () => {
    server.use(
      http.get("/products", () => {
        return HttpResponse.json([]);
      })
    );
    renderComponent();
    const message = await screen.findByText(/no products/i);
    expect(message).toBeInTheDocument();
  });

  it("should render erorr message", async () => {
    server.use(
      http.get("/products", () => {
        return HttpResponse.error();
      })
    );
    renderComponent();
    const message = await screen.findByText(/error/i);
    expect(message).toBeInTheDocument();
  });

  it("should render loading indicator when fetch data", async () => {
    server.use(
      http.get("/products", async () => {
        await delay(500);
        return HttpResponse.json([]);
      })
    );

    renderComponent();
    const loading = await screen.findByText(/loading/i);
    expect(loading).toBeInTheDocument();
  });

  it("should remove loading indicator when data is fetched", async () => {
    renderComponent();
    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
  });

  it("should remove loading indicator when data fetch fail", async () => {
    server.use(
      http.get("/products", () => {
        return HttpResponse.error();
      })
    );
    renderComponent();
    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
  });
});
