import { FormEvent, useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { UserReducerInitialState } from "../../../types/reducer";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../../redux/store";
import toast from "react-hot-toast";

const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const allNumbers = "1234567890";
const allSymbols = "!@#$%^&*()_+";

const Coupon = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );
  const [size, setSize] = useState<number>(8);
  const [prefix, setPrefix] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
  const [includeCharacters, setIncludeCharacters] = useState<boolean>(false);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const [coupon, setCoupon] = useState<string>("");

  const copyText = async (coupon: string) => {
    await window.navigator.clipboard.writeText(coupon);
    setIsCopied(true);
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (amount === 0) {
      toast.error("Amount can't be 0");
      return;
    }
    try {
      if (!includeNumbers && !includeCharacters && !includeSymbols)
        return alert("Please Select One At Least");

      let result: string = prefix || "";
      const loopLength: number = size - result.length;

      for (let i = 0; i < loopLength; i++) {
        let entireString: string = "";
        if (includeCharacters) entireString += allLetters;
        if (includeNumbers) entireString += allNumbers;
        if (includeSymbols) entireString += allSymbols;

        const randomNum: number = ~~(Math.random() * entireString.length);
        result += entireString[randomNum];
      }

      await axios.post(
        `${server}/api/v1/payment/coupon/new?id=${user?._id}`,
        {
          coupon: result.toUpperCase(),
          amount: amount,
        }
      );
      setCoupon(result.toUpperCase());
      toast.success("Coupon added successfully");
      return;
    } catch (e) {
      toast.error("Coupon is not added. Error Occured!");
      console.log(e);
    }
  };

  useEffect(() => {
    setIsCopied(false);
  }, [coupon]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard-app-container">
        <h1>Coupon</h1>
        <section>
          <form className="coupon-form" onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="Text to include"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              maxLength={size}
            />

            <input
              type="number"
              placeholder="Coupon Length"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              min={8}
              max={25}
            />

            <input
              type="number"
              placeholder="Amount"
              className="amount"
              value={amount!}
              onChange={(e) => setAmount(Number(e.target.value))}
            />

            <fieldset>
              <legend>Include</legend>

              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={() => setIncludeNumbers((prev) => !prev)}
              />
              <span>Numbers</span>

              <input
                type="checkbox"
                checked={includeCharacters}
                onChange={() => setIncludeCharacters((prev) => !prev)}
              />
              <span>Characters</span>

              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={() => setIncludeSymbols((prev) => !prev)}
              />
              <span>Symbols</span>
            </fieldset>
            <button type="submit">Add Coupon</button>
          </form>

          {coupon && (
            <code>
              {coupon}{" "}
              <span onClick={() => copyText(coupon)}>
                {isCopied ? "Copied" : "Copy"}
              </span>{" "}
            </code>
          )}
        </section>
      </main>
    </div>
  );
};

export default Coupon;
