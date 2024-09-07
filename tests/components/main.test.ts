import { render, screen } from "@testing-library/react";
import { faker } from "@faker-js/faker";
import { db } from "../mocks/db";

describe("main", () => {
  it("should test", () => {});

  //const product = db.product.create();
  //console.log(product);
  //console.log(db.product.getAll());

  const category = db.category.create();
  console.log(category);

  // const product = {
  //   name: faker.commerce.productName(),
  //   price: faker.commerce.price(),
  //   category: faker.commerce.department(),
  // };
  // console.log(product);
});
