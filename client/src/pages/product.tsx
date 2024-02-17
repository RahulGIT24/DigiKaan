import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  useDeleteReviewMutation,
  usePostReviewsMutation,
  useSingleProductQuery,
} from "../redux/api/productApi";
import { SkeletonLoader } from "../components/Loader";
import { IoMdCart } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { UserReducerInitialState } from "../types/reducer";
import toast from "react-hot-toast";
import { useState } from "react";
import { CartItem } from "../types/common";
import { addToCart } from "../redux/reducer/cartReducer";
import { FaSignInAlt, FaTrash } from "react-icons/fa";
import star from "../assets/stars.svg";
import ReactStars from "react-rating-star-with-type";

const Product = () => {
  let { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useSingleProductQuery(id!);
  const [postReviews] = usePostReviewsMutation();
  const [deleteReview] = useDeleteReviewMutation();
  const product = data?.product;
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );
  const [quantity, setQuantity] = useState(0);
  const [rating, setRating] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [review, setReview] = useState<string>("");
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

  const delReview = async ({ reviewId }: { reviewId: string }) => {
    try {
      await deleteReview({ productId: id!, reviewId: reviewId });
      toast.success("Review Deleted");
      return;
    } catch (e) {
      toast.error("Error while deleting review");
    }
  };

  const ratingChanged = (newRating: number) => {
    setRating(newRating);
  };

  const postReview = async () => {
    try {
      setDisabled(true);
      if (!review || !rating || rating === 0) {
        return toast.error("Please give rating and review both");
      }
      await postReviews({
        productId: id!,
        review,
        stars: rating,
        userId: user?._id!,
      });
      setReview("");
      setRating(0);
      toast.success("Review Posted");
      return;
    } catch (error) {
      toast.error("Error while posting review");
    } finally {
      setDisabled(false);
    }
  };

  const renderStars = ({ numberOfItems }: { numberOfItems: number }) => {
    return Array.from({ length: numberOfItems }, (_) => (
      <img className="star" src={star} />
    ));
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
          <article className="product-article">
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
              <p>
                Rating: {" "}
                <b>
                  {product?.avgRating === 0
                    ? `No Rating`
                    : `${String(product?.avgRating)}`}
                </b>{" "}
                {product?.avgRating !== 0 && (
                  <img src={star} className="star" />
                )}
              </p>
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

                <div className="review-box">
                  <h1>
                    <strong>Write a Review</strong>
                  </h1>
                  <textarea
                    name="review"
                    id=""
                    cols={40}
                    rows={7}
                    placeholder="Add your review"
                    value={review}
                    onChange={(e) => {
                      setReview(e.target.value);
                    }}
                  ></textarea>
                  <ReactStars
                    count={5}
                    isEdit={true}
                    size={20}
                    onChange={ratingChanged}
                    value={rating}
                    activeColor="orange"
                  />
                  <button
                    className="addtocart"
                    disabled={disabled}
                    onClick={postReview}
                  >
                    Post Review
                  </button>
                </div>
              </>
            )}
            {!user?._id && (
              <main className="cart-btn">
                <button
                  className="addtocart"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  <p>Sign In to Buy</p>{" "}
                  <p>
                    <FaSignInAlt />
                  </p>
                </button>
              </main>
            )}
            </div>
          </article>
          <article className="review-article">
            <div className="single-product">
              <h1>Reviews</h1>
            </div>
            {product?.reviews &&
              product.reviews.map((review, index) => (
                <div className="single-product reviews" key={index}>
                  <div className="review">
                    <img src={review.user.photo} />
                    <div className="review-function">
                      <div className="text">
                        <p>
                          <b>{review.user.name}</b>
                        </p>
                        <p>
                          <i>{review.review}</i>
                        </p>
                        {renderStars({ numberOfItems: review.stars })}
                      </div>
                      {review.user._id === user?._id && (
                        <div className="button" title="Delete Review">
                          <FaTrash
                            onClick={() => {
                              delReview({ reviewId: review._id });
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </article>
        </main>
      )}
    </>
  );
};

export default Product;
