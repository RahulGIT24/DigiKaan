import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useLatestProductsQuery } from "../redux/api/productApi";
import toast from "react-hot-toast";
import { SkeletonLoader} from "../components/Loader";

const Home = () => {
  const addToCart = () => {
    console.log("added");
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
        {isLoading ? (
          <SkeletonLoader width="80vw"/>
        ) : (
          data?.products.map((item) => (
            <ProductCard
              productId={item._id}
              price={item.price}
              stock={item.stock}
              name={item.name}
              photo={item.photo}
              handler={() => addToCart}
              key={item._id}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default Home;
