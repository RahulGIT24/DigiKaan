import { FaTrash } from "react-icons/fa";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Order, OrderItem } from "../../../types/common";
import { UserReducerInitialState } from "../../../types/reducer";
import { useSelector } from "react-redux";
import { useDeleteOrderMutation, useOrderDetailsQuery, useUpdateOrderMutation } from "../../../redux/api/orderApi";
import { SkeletonLoader } from "../../../components/Loader";
import { responseToast } from "../../../utils/features";

const TransactionManagement = () => {
  const navigate = useNavigate();
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
    const [updateOrder] = useUpdateOrderMutation();
    const [deleteOrder] = useDeleteOrderMutation();
  const params = useParams();

  const { isLoading, isError, data } = useOrderDetailsQuery(params.id!);

  const {
    shippingInfo: { address, city, state, country, pincode },
    orderItems,
    user: { name },
    status,
    subtotal,
    total,
    discount,
    shippingCharges,
    tax,
  } = data?.order || defaultData;

  const updateHandler = async() => {
    const res = await updateOrder({
      userId:user?._id as string ,orderId:data?.order._id as string
    })
    responseToast(res,navigate,"/admin/transaction")
  };

  const deleteHandler = async() => {
    const res = await deleteOrder({
      userId:user?._id as string ,orderId:data?.order._id as string
    })
    responseToast(res,navigate,"/admin/transaction")
  };

  if (isError) return <Navigate to={"/404"} />;
  return (
    <div className="admin-container">
      <AdminSidebar />
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
              <h2>Order Items</h2>

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
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <h1>Order Info</h1>
              <h5>User Info</h5>
              <p>Name: {name}</p>
              <p>
                Address:{" "}
                {`${address}, ${city}, ${state}, ${country} ${pincode}`}
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
              <button className="shipping-btn" onClick={updateHandler}>
                Process Status
              </button>
            </article>
          </>
        )}
      </main>
    </div>
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
    <img src={`${photo}`} alt={name} />
    <Link to={`/product/${productId}`}>{name}</Link>
    <span>
      ₹{price} X {quantity} = ₹{price * quantity}
    </span>
  </div>
);

export default TransactionManagement;
