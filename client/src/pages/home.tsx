import { Link } from "react-router-dom"
import ProductCard from "../components/ProductCard"

const Home = () => {
  const addToCart = ()=>{
    console.log("added")
  };
  return (
    <div className="home">
      <section>

      </section>
      <h1>
        Latest Product
        <Link to={"/search"} className="find-more">More</Link>
      </h1>
      <main>
        <ProductCard productId="jksnksd" price={837483} stock={1} name="Mac" photo="https://m.media-amazon.com/images/I/71eXNIDUGjL._SX679_.jpg" handler={()=>addToCart}/>
      </main>
    </div>
  )
}

export default Home
