import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import CategoryList from "../../src/components/CategoryList";

import { faker } from "@faker-js/faker";
import { Category } from "../../src/entities";
import ReduxProvider from "../../src/providers/ReduxProvider";
import { db } from "../mocks/db";
import { simulateDelay, simulateError } from "../utils";

describe("CategoryList", () => {
  let categories: Category[] = [];
  beforeAll(() => {
    [1, 2, 3].forEach((item) => {
      categories.push(
        db.category.create({ name: `${faker.commerce.department()} ${item}` })
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

  const renderComponent = () => {
    render(<CategoryList />, { wrapper: ReduxProvider });
  };

  ////////////////////////////////////////
  it("should display loading indicator before fetching categories", () => {
    renderComponent();
    simulateDelay("categories");
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should remove loading indicator when categories fetch fail", async () => {
    simulateError("categories");
    renderComponent();
    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
  });

  it("should render erorr message", async () => {
    simulateError("categories");
    renderComponent();
    const message = await screen.findByText(/error/i);
    expect(message).toBeInTheDocument();
  });

  it("should render list of categories", async () => {
    renderComponent();
    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
    // const cats = await screen.findAllByRole("listitem");
    // expect(cats.length).toBeGreaterThan(0);
    categories.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });
});
