import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useSingleProductQuery } from "../redux/api/productApi";
import { SkeletonLoader } from "../components/Loader";
import { IoMdCart } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { UserReducerInitialState } from "../types/reducer";
import toast from "react-hot-toast";
import { useState } from "react";
import { CartItem } from "../types/common";
import { addToCart } from "../redux/reducer/cartReducer";

const Product = () => {
  let { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useSingleProductQuery(id!);
  const product = data?.product;
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );
  const [quantity, setQuantity] = useState(0);
  const [disabled, setDisabled] = useState(false);
  if (isError) return <Navigate to={"/404"} />;

  const incrementHandler = () => {
    if (quantity >= product?.stock!) return;
    setQuantity(quantity + 1);
  };
  const decrementHandler = () => {
    if (quantity <= 0) return;
    setQuantity(quantity - 1);
  };

  const addToCartHandler = (cartItem: CartItem) => {
    if (product?.stock! <= 0) {
      return toast.error("Out of stock");
    }
    if (quantity === 0) return;
    setDisabled(true);
    dispatch(addToCart(cartItem));
    setDisabled(false);
    toast.success("Added to cart");
    navigate("/cart");
  };
  return (
    <>
      {isLoading ? (
        <SkeletonLoader length={10} />
      ) : (
        <main className="product-management">
          <section
            style={{
              padding: "2rem",
            }}
          >
            <h2>{product?.name}</h2>
            <img src={product?.photo} alt="" />
          </section>

          <article>
            <div className="single-product">
              <h1>Product Info</h1>
              <p>Name: {product?.name}</p>
              <p>Price: {product?.price}</p>
              <p>Stock: {product?.stock}</p>
              <p>
                Status:{" "}
                <span className={product?.stock! > 0 ? "green" : "red"}>
                  {" "}
                  {product?.stock! > 0 ? "In stock" : "Out of Stock"}
                </span>
              </p>
            </div>
            {user?._id && (
              <>
                <p className="quantity">Select Quantity</p>
                <div className="quantity">
                  <button onClick={decrementHandler}>-</button>
                  <p>{quantity}</p>
                  <button onClick={incrementHandler}>+</button>
                </div>
                <main className="cart-btn">
                  <button
                    className="addtocart"
                    disabled={disabled}
                    onClick={() => {
                      addToCartHandler({
                        productId: product?._id || "",
                        name: product?.name || "",
                        photo: product?.photo || "",
                        price: product?.price || 0,
                        quantity: quantity || 0,
                        stock: product?.stock || 0,
                      });
                    }}
                  >
                    <p>Add to Cart</p>{" "}
                    <p>
                      <IoMdCart />
                    </p>
                  </button>
                </main>
              </>
            )}
          </article>
        </main>
      )}
    </>
  );
};

export default Product;
