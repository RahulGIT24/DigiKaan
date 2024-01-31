import { FaPlus, FaSignInAlt } from "react-icons/fa";
import { CartItem } from "../types/common";
import { UserReducerInitialState } from "../types/reducer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

type ProductProps = {
  productId: string;
  photo: string;
  price: number;
  stock: number;
  name: string;
  handler: (cartItem: CartItem) => string | undefined;
};


const ProductCard = ({
  photo,
  price,
  name,
  handler,
  productId,
  stock,
}: ProductProps) => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );
  const navigate = useNavigate();
  return (
    <div className="product-card">
      <img src={`${photo}`} alt="" />
      <p>{name}</p>
      <span>₹{price}</span>
      <div>
        {
          user?._id ? 
        <button
          onClick={() =>
            handler({
              productId,
              photo,
              price,
              stock,
              name,
              quantity: 1,
            })
          }
        >
          <FaPlus />
        </button>:<>
        <button
          onClick={() =>{navigate("/login")}}
        >
          <FaSignInAlt />
        </button>
        </>
        }
      </div>
    </div>
  );
};

export default ProductCard;
