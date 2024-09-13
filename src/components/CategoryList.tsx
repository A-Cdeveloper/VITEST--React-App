import { useEffect } from "react";
import { fetchCategories } from "../store/categorySlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

function CategoryList() {
  const dispatch = useAppDispatch();
  const {
    list: categories,
    loading,
    error,
  } = useAppSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Category List</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {categories!.map((category) => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CategoryList;
