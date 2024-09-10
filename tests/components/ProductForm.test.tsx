import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import AllProviders from "../AllProviders";

describe("ProductForm", () => {
  it("should render form fields", async () => {
    render(<ProductForm onSubmit={vi.fn()} />, { wrapper: AllProviders });

    await screen.findByRole("form");

    // wait for loader to be removed
    // const loader = screen.getByText(/loading/i);
    // await waitForElementToBeRemoved(loader);

    // const nameField = await screen.findByPlaceholderText(/name/i);
    const nameField = screen.getByPlaceholderText(/name/i);
    expect(nameField).toBeInTheDocument();

    const priceField = screen.getByPlaceholderText(/price/i);
    expect(priceField).toBeInTheDocument();

    const selectField = screen.getByRole("combobox", { name: /category/i });
    expect(selectField).toBeInTheDocument();
  });
});
