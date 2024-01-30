import { Link, Navigate, useParams } from "react-router-dom";
import { server } from "../redux/store";
import { Order, OrderItem } from "../types/common";
import { useOrderDetailsQuery } from "../redux/api/orderApi";
import { SkeletonLoader } from "../components/Loader";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../types/reducer";

const OrderDetails = () => {
  const defaultData: Order = {
    shippingInfo: {
      address: "",
      city: "",
      state: "",
      country: "",
      pincode: 0,
    },
    status: "",
    subtotal: 0,
    discount: 0,
    shippingCharges: 0,
    tax: 0,
    total: 0,
    orderItems: [],
    user: {
      name: "",
      _id: "",
    },
    _id: "",
  };

  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const params = useParams();

  const { isLoading, isError, data } = useOrderDetailsQuery(params.id!);

  const {
    shippingInfo: { address, city, state, country, pincode },
    orderItems,
    user: { name,_id },
    status,
    subtotal,
    total,
    discount,
    shippingCharges,
    tax,
  } = data?.order || defaultData;

  if (isError) return <Navigate to={"/404"} />;

  if(user?._id !== _id) return <Navigate to={"/"} />;
  return (
    <main className="product-management">
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <>
          <section
            style={{
              padding: "2rem",
            }}
          >
            <h2>Ordered Items</h2>

            {orderItems.map((i) => (
              <ProductCard
                key={i._id}
                name={i.name}
                photo={i.photo}
                productId={i.productId}
                _id={i._id}
                quantity={i.quantity}
                price={i.price}
              />
            ))}
          </section>

          <article className="shipping-info-card">
            <h1>Your Order Info</h1>
            <h5>Shipping Info</h5>
            <p>Name: {name}</p>
            <p>
              Address: {`${address}, ${city}, ${state}, ${country} ${pincode}`}
            </p>
            <h5>Amount Info</h5>
            <p>Subtotal: {subtotal}</p>
            <p>Shipping Charges: {shippingCharges}</p>
            <p>Tax: {tax}</p>
            <p>Discount: {discount}</p>
            <p>Total: {total}</p>

            <h5>Status Info</h5>
            <p>
              Status:{" "}
              <span
                className={
                  status === "Delivered"
                    ? "purple"
                    : status === "Shipped"
                    ? "green"
                    : "red"
                }
              >
                {status}
              </span>
            </p>
          </article>
        </>
      )}
    </main>
  );
};

const ProductCard = ({
  name,
  photo,
  price,
  quantity,
  productId,
}: OrderItem) => (
  <div className="transaction-product-card">
    <img src={`${server}/${photo}`} alt={name} />
    <Link to={`/product/${productId}`}>{name}</Link>
    <span>
      ₹{price} X {quantity} = ₹{price * quantity}
    </span>
  </div>
);

export default OrderDetails;
