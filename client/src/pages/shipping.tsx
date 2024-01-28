import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  CartReducerInitialState,
  UserReducerInitialState,
} from "../types/reducer";
import axios from "axios";
import { server } from "../redux/store";
import toast from "react-hot-toast";
import { saveShippingInfo } from "../redux/reducer/cartReducer";
import { ShippingInfo } from "../types/common";

const Shipping = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );
  const { cartItems, total } = useSelector(
    (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
  );
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: 0,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const changeShippingInfo = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(saveShippingInfo(shippingInfo));
    try {
      const { data } = await axios.post(
        `${server}/api/v1/payment/create`,
        {
          amount: total,
          name: user?.name,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/pay", {
        state: data.clientSecret,
      });
    } catch (error) {
      toast.error("Something Went Wrong");
      console.log(error);
    }
  };

  useEffect(() => {
    if (cartItems.length <= 0) return navigate("/cart");
  }, [cartItems]);
  return (
    <div className="shipping">
      <button
        className="backbtn"
        onClick={() => {
          navigate("/cart");
        }}
      >
        <BiArrowBack />
      </button>
      <form onSubmit={submitHandler}>
        <h1>Shipping Address</h1>
        <input
          type="text"
          placeholder="Address"
          name="address"
          required
          value={shippingInfo.address}
          onChange={changeShippingInfo}
        />
        <input
          type="text"
          placeholder="City"
          name="city"
          required
          value={shippingInfo.city}
          onChange={changeShippingInfo}
        />
        <input
          type="text"
          placeholder="State"
          name="state"
          required
          value={shippingInfo.state}
          onChange={changeShippingInfo}
        />
        <select
          name="country"
          required
          value={shippingInfo.country}
          onChange={changeShippingInfo}
        >
          <option value="">Choose Country</option>
          <option value="india">India</option>
          <option value="US">America</option>
          <option value="UK">United Kingdom</option>
        </select>
        <input
          type="number"
          placeholder="pincode"
          name="pincode"
          required
          value={shippingInfo.pincode}
          onChange={changeShippingInfo}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Shipping;
