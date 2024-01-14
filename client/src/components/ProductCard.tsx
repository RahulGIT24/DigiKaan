import { FaPlus } from 'react-icons/fa'

const server = "dfgdfg"

type ProductProps = {
    productId:string,
    photo:string,
    price:number,
    stock:number,
    name:string,
    handler: ()=>{}
}

const ProductCard = ({productId,photo,price,stock,name,handler}:ProductProps) => {
  return (
    <div className='product-card'>
      <img src={`${photo}`} alt="" />
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
