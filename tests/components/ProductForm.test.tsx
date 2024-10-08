import { faker } from "@faker-js/faker";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductForm from "../../src/components/ProductForm";
import { Category, Product } from "../../src/entities";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import { Toaster } from "react-hot-toast";

describe("ProductForm", () => {
  let categories: Category[] = [];

  beforeAll(() => {
    [1, 2].forEach((item) => {
      categories.push(
        db.category.create({
          name: `Category ${faker.commerce.department()} ${item}`,
        })
      );
    });
  });
  afterAll(() => {
    const catsIds = categories.map((cat) => cat.id);
    db.category.deleteMany({
      where: {
        id: {
          in: catsIds,
        },
      },
    });
  });

  const renderComponent = (product?: Product) => {
    const onSubmit = vi.fn();
    render(
      <>
        <ProductForm onSubmit={onSubmit} product={product} />
        <Toaster />
      </>,
      {
        wrapper: AllProviders,
      }
    );

    return {
      onSubmit,
      expectErrorToBeInTheDocument: (errorMessage: RegExp) => {
        const error = screen.getByRole("alert");
        expect(error).toBeInTheDocument();
        expect(error).toHaveTextContent(errorMessage);
      },
      waitFormToLoad: async () => {
        await screen.findByRole("form");

        const nameInput = screen.getByPlaceholderText(/name/i);
        const priceInput = screen.getByPlaceholderText(/price/i);
        const categoryInput = screen.getByRole("combobox", {
          name: /category/i,
        });
        const submitButton = screen.getByRole("button");

        type FormData = {
          [K in keyof Product]: any | undefined;
        };

        const validData: FormData = {
          id: 1,
          name: "a",
          price: 1,
          categoryId: categories[0].id,
        };

        const fillForm = async (product: FormData) => {
          const user = userEvent.setup();
          if (product.name !== undefined)
            await user.type(nameInput, product.name);

          if (product.price !== undefined) {
            await user.type(priceInput, product.price.toString());
          }
          await user.tab();
          await user.click(categoryInput);
          const option = screen.getAllByRole("option");
          await user.click(option[0]);
          await user.click(submitButton);
        };

        return {
          nameInput,
          priceInput,
          categoryInput,
          submitButton,
          fillForm,
          validData,
        };
      },
    };
  };

  // RENDER TESTS
  it("should render form fields", async () => {
    const { waitFormToLoad } = renderComponent();

    const { nameInput, priceInput, categoryInput } = await waitFormToLoad();

    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(categoryInput);

    categories.forEach(async (cat) => {
      const option = screen.getByRole("option", { name: cat.name });
      await user.click(option);
      //expect(categoryInput).toHaveTextContent(cat.name);
    });
  });
  ////////////////////////////////////////////////////////////////////
  it("should render form in edit mode", async () => {
    const product = {
      id: 1,
      name: "Product 1",
      price: 100,
      categoryId: categories[0].id,
    };
    const { waitFormToLoad } = renderComponent(product);
    const { nameInput, priceInput, categoryInput } = await waitFormToLoad();

    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(categoryInput).toHaveTextContent(categories[0].name);
  });
  /////////////////
  it("should focus name field when form is loaded", async () => {
    const { waitFormToLoad } = renderComponent();
    const { nameInput } = await waitFormToLoad();

    expect(nameInput).toHaveFocus();
  });

  // vALIDATION TESTS
  it.each([
    {
      testCase: "missing",
      errorMessage: /required/i,
    },
    {
      testCase: "longer then 255 chars",
      name: "a".repeat(256),
      errorMessage: /must contain/i,
    },
  ])("display error if name is $testCase", async ({ name, errorMessage }) => {
    const { waitFormToLoad, expectErrorToBeInTheDocument } = renderComponent();
    const { fillForm, validData } = await waitFormToLoad();

    await fillForm({ ...validData, name });
    expectErrorToBeInTheDocument(errorMessage);
  });

  it.each([
    {
      testCase: "missing",
      errorMessage: /required/i,
    },
    {
      testCase: "not a number",
      price: "abc",
      errorMessage: /required/i,
    },
    {
      testCase: "0",
      price: 0,
      errorMessage: /1/i,
    },
    {
      testCase: "negative",
      price: -1,
      errorMessage: /1/i,
    },
    {
      testCase: "greater then 1000",
      price: 1001,
      errorMessage: /1000/i,
    },
  ])("display error if price is $testCase", async ({ price, errorMessage }) => {
    const { waitFormToLoad, expectErrorToBeInTheDocument } = renderComponent();
    const { fillForm, validData } = await waitFormToLoad();

    await fillForm({ ...validData, price });
    expectErrorToBeInTheDocument(errorMessage);
  });

  // SUBMITION TESTS

  it("should submit form", async () => {
    const { waitFormToLoad, onSubmit } = renderComponent();
    const { validData, fillForm } = await waitFormToLoad();
    await fillForm({ ...validData });

    const { name, price, categoryId } = validData;
    expect(onSubmit).toHaveBeenCalledWith({ name, price, categoryId });
  });

  it("should shot toas with error if form is not submited", async () => {
    const { waitFormToLoad, onSubmit } = renderComponent();
    onSubmit.mockRejectedValue({}); // Simulate failure form submission
    const { validData, fillForm } = await waitFormToLoad();
    await fillForm({ ...validData });
    //screen.debug();

    const toast = await screen.findByRole("status");

    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent(/error/i);
  });

  it("should disable submit button if form is submited", async () => {
    const { waitFormToLoad, onSubmit } = renderComponent();
    onSubmit.mockReturnValue(new Promise(() => {})); // Simulate successful form submission
    const { validData, fillForm, submitButton } = await waitFormToLoad();
    await fillForm({ ...validData });
    expect(submitButton).toBeDisabled();
  });

  it("should reenable submit button after submition", async () => {
    const { waitFormToLoad, onSubmit } = renderComponent();
    onSubmit.mockResolvedValue({}); // Simulate successful form submission
    const { validData, fillForm, submitButton } = await waitFormToLoad();
    await fillForm({ ...validData });
    expect(submitButton).not.toBeDisabled();
  });

  it("should reenable submit button if submition fail", async () => {
    const { waitFormToLoad, onSubmit } = renderComponent();
    onSubmit.mockRejectedValue({}); // Simulate failure form submission
    const { validData, fillForm, submitButton } = await waitFormToLoad();
    await fillForm({ ...validData });
    expect(submitButton).not.toBeDisabled();
  });
});
