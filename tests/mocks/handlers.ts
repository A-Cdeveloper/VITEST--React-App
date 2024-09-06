import { http, HttpResponse } from "msw";

export const products = [
  { id: 1, name: "Product 1", price: 10, categoryId: 1 },
  { id: 2, name: "Product 2", price: 20, categoryId: 1 },
  { id: 3, name: "Product 3", price: 30, categoryId: 1 },
  { id: 4, name: "Product 4", price: 40, categoryId: 2 },
];

export const handlers = [
  http.get("/categories", () => {
    return HttpResponse.json([
      { id: 1, name: "Electronics" },
      { id: 2, name: "Appliances" },
      { id: 3, name: "Accessories" },
      { id: 4, name: "Books" },
      { id: 5, name: "Movies" },
    ]);
  }),
  http.get("/products", () => {
    return HttpResponse.json(products);
  }),

  http.get("/products/:id", ({ params }) => {
    const { id } = params;
    const product = products.find((p) => p.id === Number(id));

    if (!product) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(product);
  }),
];
