import { FaPlus } from 'react-icons/fa'
import { server } from '../redux/store'

type ProductProps = {
    productId:string,
    photo:string,
    price:number,
    stock:number,
    name:string,
    handler: ()=>{}
}

const ProductCard = ({photo,price,name,handler}:ProductProps) => {
  return (
    <div className='product-card'>
      <img src={`${server}/${photo}`} alt="" />
      <p>{name}</p>
      <span>
      ₹{price}
      </span>
      <div>
        <button onClick={()=>{handler()}}><FaPlus/></button>
      </div>
    </div>
  )
}

export default ProductCard
