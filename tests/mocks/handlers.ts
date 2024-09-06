import { http, HttpResponse } from "msw";

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
];
