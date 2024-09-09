import axios from "axios";

import { useQuery } from "react-query";
import { Category } from "../entities";
import { Select } from "@radix-ui/themes";
import Skeleton from "react-loading-skeleton";

type Props = {
  onSelectedCategoryId: (categoryId: number) => void;
};

const CategorySelect = ({ onSelectedCategoryId }: Props) => {
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    error: errorCategories,
  } = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: () => axios.get("/categories").then((res) => res.data),
  });

  const renderCategories = () => {
    if (isCategoriesLoading)
      return (
        <div role="progressbar" aria-label="categories">
          <Skeleton />
        </div>
      );
    // if (errorCategories) return <div>Error: {errorCategories}</div>;
    if (errorCategories) return null;
    return (
      <Select.Root
        onValueChange={(categoryId) =>
          onSelectedCategoryId(parseInt(categoryId))
        }
      >
        <Select.Trigger placeholder="Filter by Category" />
        <Select.Content>
          <Select.Group>
            <Select.Label>Category</Select.Label>
            <Select.Item value="all">All</Select.Item>
            {categories?.map((category) => (
              <Select.Item key={category.id} value={category.id.toString()}>
                {category.name}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    );
  };

  return <div className="max-w-xs">{renderCategories()}</div>;
};

export default CategorySelect;
