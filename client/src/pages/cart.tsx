import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../components/CartItem";
import { Link } from "react-router-dom";

const cartItems = [
  {
    productId:"dd",
    photo:"https://m.media-amazon.com/images/I/71eXNIDUGjL._SX679_.jpg",
    name:"Mac",
    price:3000,
    quantity:4,
    stock:40
  }
];
const subTotal = 4000;
const tax = Math.round(subTotal * 0.18);
const shippingCharges = 200;
const total = subTotal + tax + shippingCharges;
const discount = 400;

const Cart = () => {
  const [couponCode, setCouponCode] = useState<string>("");
  const [isValid, setisValid] = useState<boolean>(false);

  useEffect(() => {
    const id = setTimeout(() => {
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

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? cartItems.map((item,index)=>{
          return <CartItem key={index} cartItem={item}/>
        }):(<h1>No items added</h1>)}
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
          {
            cartItems.length>0 && <Link to={"/shipping"}>
              Checkout
            </Link>
          }
      </aside>
    </div>
  );
};

export default Cart;
