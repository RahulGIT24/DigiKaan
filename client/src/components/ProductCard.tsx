import { FaPlus } from "react-icons/fa";
import { CartItem } from "../types/common";

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
  return (
    <div className="product-card">
      <img src={`${photo}`} alt="" />
      <p>{name}</p>
      <span>₹{price}</span>
      <div>
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
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
