import { render, screen } from "@testing-library/react";
import QuantitySelector from "../../src/components/QuantitySelector";
import { Product } from "../../src/entities";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";

import userEvent from "@testing-library/user-event";

describe("QuantitySelector", () => {
  let product: Product;

  beforeAll(() => {
    product = db.product.create();
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: product.id } } });
  });

  const renderComponent = async () => {
    render(<QuantitySelector product={product} />, { wrapper: AllProviders });

    const mainButton = screen.getByRole("button", {
      name: /add to cart/i,
    });
    const getQuantity = () => screen.getByRole("status");
    const plusButton = () => screen.getByRole("button", { name: "+" });
    const minusButton = () => screen.getByRole("button", { name: "-" });
    const user = userEvent.setup();

    const addProductToCart = async () => {
      await user.click(mainButton);
    };

    const increaseProducts = async () => {
      await user.click(plusButton());
    };

    const descreaseProducts = async () => {
      await user.click(minusButton());
    };

    const productIsInTheCart = () => {
      expect(plusButton()).toBeInTheDocument();
      expect(minusButton()).toBeInTheDocument();
    };

    const productIsNotInTheCart = () => {
      expect(plusButton()).not.toBeInTheDocument();
      expect(minusButton()).not.toBeInTheDocument();
    };

    return {
      mainButton,
      getQuantity,
      plusButton,
      minusButton,
      addProductToCart,
      increaseProducts,
      descreaseProducts,
      productIsInTheCart,
      productIsNotInTheCart,
    };
  };

  it('should render "Add to cart" button initial', async () => {
    const { mainButton } = await renderComponent();
    expect(mainButton).toHaveTextContent(/add to cart/i);
  });

  ///

  it('should render "quantity" if product add to cart', async () => {
    const { addProductToCart, getQuantity, productIsInTheCart } =
      await renderComponent();
    await addProductToCart();
    expect(getQuantity()).toHaveTextContent("1");
    productIsInTheCart();
  });

  ///
  it('should render "quantity" if product quantity increase', async () => {
    const {
      addProductToCart,
      increaseProducts,
      getQuantity,
      productIsInTheCart,
    } = await renderComponent();
    await addProductToCart();
    await increaseProducts();
    expect(getQuantity()).toHaveTextContent("2");
    productIsInTheCart();
  });
  ///

  it('should render "quantity" if product quantity descrease until last product', async () => {
    const {
      addProductToCart,
      descreaseProducts,
      increaseProducts,
      productIsInTheCart,
    } = await renderComponent();
    await addProductToCart();
    await increaseProducts();
    await descreaseProducts();
    productIsInTheCart();
  });
  ///

  it('should show "Add to cart" if product removed from cart', async () => {
    const { addProductToCart, descreaseProducts, mainButton } =
      await renderComponent();
    await addProductToCart();
    await descreaseProducts();
    expect(mainButton).toHaveTextContent(/add to cart/i);
  });
});
