import axios from "axios";
import { Product } from "../entities";
import { Table } from "@radix-ui/themes";
import Skeleton from "react-loading-skeleton";
import QuantitySelector from "./QuantitySelector";
import { useQuery } from "react-query";

const ProductTable = ({
  selectedCategoryId,
}: {
  selectedCategoryId?: number;
}) => {
  const {
    data: products,
    isLoading: isProductsLoading,
    error: errorProducts,
  } = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: () => axios.get("/products").then((res) => res.data),
  });

  const renderProducts = () => {
    const skeletons = [1, 2, 3, 4, 5];

    const visibleProducts = selectedCategoryId
      ? products?.filter((p) => p.categoryId === selectedCategoryId)
      : products;

    return (
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body
          role={isProductsLoading ? "progressbar" : undefined}
          aria-label={isProductsLoading ? "Loading products..." : undefined}
        >
          {isProductsLoading &&
            skeletons.map((skeleton) => (
              <Table.Row key={skeleton}>
                <Table.Cell>
                  <Skeleton />
                </Table.Cell>
                <Table.Cell>
                  <Skeleton />
                </Table.Cell>
                <Table.Cell>
                  <Skeleton />
                </Table.Cell>
              </Table.Row>
            ))}
          {!isProductsLoading &&
            visibleProducts!.map((product) => (
              <Table.Row key={product.id}>
                <Table.Cell>{product.name}</Table.Cell>
                <Table.Cell>${product.price}</Table.Cell>
                <Table.Cell>
                  <QuantitySelector product={product} />
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
    );
  };

  if (errorProducts) return <div>Error: {errorProducts.message}</div>;

  return renderProducts();
};

export default ProductTable;
