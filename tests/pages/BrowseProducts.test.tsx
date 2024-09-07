import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { Theme } from "@radix-ui/themes";
import { server } from "../mocks/server";
import { HttpResponse, delay, http } from "msw";

describe("BrowseProducts", () => {
  const renderComponent = () => {
    render(<BrowseProducts />, { wrapper: Theme });

    return {
      progressbarCategories: () =>
        screen.getByRole("progressbar", {
          name: /categories/i,
        }),
      progressbarProducts: () =>
        screen.getByRole("progressbar", {
          name: /products/i,
        }),
    };
  };

  //
  it("should render loading skeleton durring fetchng categories", async () => {
    server.use(
      http.get("/categories", async () => {
        return HttpResponse.json([]);
      })
    );
    const { progressbarCategories } = renderComponent();
    expect(progressbarCategories()).toBeInTheDocument();
  });

  //
  it("should hide loading skeleton after categories fetched", async () => {
    const { progressbarCategories } = renderComponent();
    await waitForElementToBeRemoved(progressbarCategories);
  });

  //
  it("should render loading skeletons durring fetchng products", async () => {
    server.use(
      http.get("/products", async () => {
        await delay(1000);
        return HttpResponse.json([]);
      })
    );
    const { progressbarProducts } = renderComponent();
    expect(progressbarProducts()).toBeInTheDocument();
  });

  //
  it("should hide loading skeleton after products fetched", async () => {
    renderComponent();
    const progressbarProducts = () =>
      screen.getByRole("progressbar", {
        name: /products/i,
      });
    await waitForElementToBeRemoved(progressbarProducts);
  });

  //

  //
  it("should not render error message if categories cannot be fetched", async () => {
    server.use(
      http.get("/categories", () => {
        return HttpResponse.error();
      })
    );
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", {
        name: /categories/i,
      })
    );

    const errorCategories = screen.queryByText(/error/i);
    expect(errorCategories).not.toBeInTheDocument();
    const catList = screen.queryByRole("combobox", { name: /categories/i });
    expect(catList).not.toBeInTheDocument();
  });

  //
  it("should render error message durring fetchng products", async () => {
    server.use(
      http.get("/products", async () => {
        return HttpResponse.error();
      })
    );
    renderComponent();
    const errorProducts = await screen.findByText(/error/i);
    expect(errorProducts).toBeInTheDocument();
  });
});
