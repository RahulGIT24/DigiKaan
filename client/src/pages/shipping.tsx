import { ChangeEvent, useState } from "react"
import { BiArrowBack } from "react-icons/bi"
import { useNavigate } from "react-router-dom"

const Shipping = () => {
    const [shippingInfo, setShippingInfo] = useState({
        address:"",
        city:"",
        state:"",
        country:"",
        pincode:""
    })
    const navigate = useNavigate();
    const changeShippingInfo = (e:ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>{
        setShippingInfo(prev=>({...prev,[e.target.name]:e.target.value}))
    }
  return (
    <div className="shipping">
      <button className="backbtn" onClick={()=>{navigate("/cart")}}>
        <BiArrowBack/>
      </button>
      <form >
        <h1>Shipping Address</h1>
        <input type="text" placeholder="Address" name="address"
        required value={shippingInfo.address} onChange={changeShippingInfo}/>
        <input type="text" placeholder="City" name="city"
        required value={shippingInfo.city} onChange={changeShippingInfo}/>
        <input type="text" placeholder="State" name="state"
        required value={shippingInfo.state} onChange={changeShippingInfo}/>
        <select name="country" required value={shippingInfo.country}onChange={changeShippingInfo}>
        <option value="">Choose Country</option>
        <option value="india">India</option>
        <option value="US">America</option>
        <option value="UK">United Kingdom</option>
        </select>
        <input type="number" placeholder="Pincode" name="pincode"
        required value={shippingInfo.pincode} onChange={changeShippingInfo}/>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default Shipping