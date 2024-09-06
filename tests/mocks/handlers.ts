import { http, HttpResponse } from "msw";
import { products } from "./data";

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
