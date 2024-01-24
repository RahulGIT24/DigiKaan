import { useState } from "react";
import ProductCard from "../components/ProductCard";
import {
  useCategoriesQuery,
  useSearchProductsQuery,
} from "../redux/api/productApi";
import toast from "react-hot-toast";
import { CustomError } from "../types/api";
import { SkeletonLoader } from "../components/Loader";

const Search = () => {
  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
    isError,
    error,
  } = useCategoriesQuery("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const addToCart = () => {};
  const {
    data: searchedData,
    isLoading: productLoading,
    isError: productIsError,
    error: productError,
  } = useSearchProductsQuery({
    search,
    sort,
    price: maxPrice,
    category,
    page,
  });
  console.log(searchedData);

  const isNextPage = page < 4;
  const isPreviousPage = page > 1;

  if (isError) {
    toast.error((error as CustomError).data.message);
  }
  if (productIsError) {
    toast.error((productError as CustomError).data.message);
  }
  return (
    <div className="product-search">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
            }}
          >
            <option value="">None</option>
            <option value="asc">Price Low to High</option>
            <option value="desc">Price High to Low</option>
          </select>
        </div>
        <div>
          <h4>Max Price: {maxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={1000000}
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(Number(e.target.value));
            }}
          />
        </div>
        <div>
          <h4>Category</h4>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            <option value="">All</option>
            {!loadingCategories &&
              categoriesResponse?.categories.map((i) => (
                <option value={i} key={i}>
                  {i.toUpperCase()}
                </option>
              ))}
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        {productLoading ? (
          <SkeletonLoader length={10} />
        ) : (
          <div className="search-product-list">
            {searchedData?.products.map((item) => (
              <ProductCard
                productId={item._id}
                price={item.price}
                stock={item.stock}
                name={item.name}
                photo={item.photo}
                handler={() => addToCart}
              />
            ))}
          </div>
        )}
        <article>
          {searchedData && searchedData?.totalPage > 1 && (
            <>
              <button
                onClick={() => {
                  setPage((prev) => prev - 1);
                }}
                disabled={!isPreviousPage}
              >
                Prev
              </button>
              <span>
                {page} of {searchedData?.totalPage}
              </span>
              <button
                onClick={() => {
                  setPage((prev) => prev + 1);
                }}
                disabled={!isNextPage}
              >
                Next
              </button>
            </>
          )}
        </article>
      </main>
    </div>
  );
};

export default Search;
