import { useEffect, useState } from "react";
import { Product } from "../entities";
import { useQuery } from "react-query";

const ProductDetail = ({ productId }: { productId: number }) => {
  const {
    data: product,
    isLoading,
    error,
  } = useQuery<Product, Error>({
    queryKey: ["products", productId],
    queryFn: () =>
      fetch("/products/" + productId)
        .then((res) => res.json())
        .then((data) => data),
  });

  if (!productId) {
    return <div>invalid product id.</div>;
  }

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  if (!product) return <div>The given product was not found.</div>;

  return (
    <div>
      <h1>Product Detail</h1>
      <div>Name: {product.name}</div>
      <div>Price: ${product.price}</div>
    </div>
  );
};

export default ProductDetail;
