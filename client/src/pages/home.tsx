import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useLatestProductsQuery } from "../redux/api/productApi";
import toast from "react-hot-toast";
import { SkeletonLoader } from "../components/Loader";
import { CartItem } from "../types/common";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";

const Home = () => {
  const dispatch = useDispatch();
  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };
  const { data, isLoading, isError } = useLatestProductsQuery("");
  if (isError) toast.error("Can't fetch Products");
  return (
    <div className="home">
      <section></section>
      <h1>
        Latest Product
        <Link to={"/search"} className="find-more">
          More
        </Link>
      </h1>
      <main>
        {/* <div> */}
          {isLoading ? (
            <SkeletonLoader width="80vw" />
          ) : (
            data?.products.map((item) => (
              <ProductCard
                productId={item._id}
                price={item.price}
                stock={item.stock}
                name={item.name}
                photo={item.photo}
                handler={addToCartHandler}
                key={item._id}
              />
            ))
          )}
        {/* </div> */}
      </main>
    </div>
  );
};

export default Home;
