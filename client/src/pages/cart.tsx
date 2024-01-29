import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItemCard from "../components/CartItem";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer";
import { CartItem } from "../types/common";
import {
  addToCart,
  appliedDiscount,
  calculatePrice,
  removeFromCart,
} from "../redux/reducer/cartReducer";
import axios from "axios";
import { server } from "../redux/store";

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems, subtotal:subTotal, tax, total, shippingCharges, discount } =
    useSelector(
      (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
    );
  const [couponCode, setCouponCode] = useState<string>("");
  const [isValid, setisValid] = useState<boolean>(false);

  const incrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity >= cartItem.stock) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };
  const decrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity <= 1) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };
  const removeHanlder = (id: string) => {
    dispatch(removeFromCart(id));
  };

  useEffect(() => {
    const id = setTimeout(() => {
      axios
        .get(`${server}/api/v1/payment/discount?coupon=${couponCode}`)
        .then((res) => {
          dispatch(appliedDiscount(res.data.discount));
          setisValid(true);
        })
        .catch(() => {
          dispatch(appliedDiscount(0));
          dispatch(calculatePrice());
          setisValid(false);
        });
      if (Math.random() > 0.5) {
        setisValid(true);
      } else {
        setisValid(false);
      }
    }, 1000);
    return () => {
      clearTimeout(id);
      setisValid(false);
    };
  }, [couponCode]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => {
            return (
              <CartItemCard
                key={index}
                cartItem={item}
                incrementHandler={incrementHandler}
                decrementHandler={decrementHandler}
                removeHandler={removeHanlder}
              />
            );
          })
        ) : (
          <h1>No items added</h1>
        )}
      </main>
      <aside>
        <p>Subtotal: ₹{subTotal}</p>
        <p>Shipping Charges: ₹{shippingCharges}</p>
        <p>Tax: ₹{tax}</p>
        <p>
          Discount - <em>- ₹{discount}</em>
        </p>
        <p>
          <b>Total - ₹{total}</b>
        </p>
        <input
          type="text"
          name="coupon"
          value={couponCode}
          onChange={(e) => {
            setCouponCode(e.target.value);
          }}
          placeholder="Enter coupon code"
        />

        {couponCode &&
          (isValid ? (
            <span className="green">
              {discount} off using the <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              Invalid Coupon <VscError />
            </span>
          ))}
        {cartItems.length > 0 && <Link to={"/shipping"}>Checkout</Link>}
      </aside>
    </div>
  );
};

export default Cart;
