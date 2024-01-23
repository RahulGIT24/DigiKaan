import { Hourglass } from "react-loader-spinner";

export const Loader = () => {
  return (
    <div className="loader">
      <Hourglass
        visible={true}
        height="80"
        width="80"
        ariaLabel="hourglass-loading"
        wrapperStyle={{}}
        wrapperClass=""
        colors={["black", "white"]}
      />
    </div>
  );
};

interface SkeletonProps {
  width?:string,
  length?:number
}

export const SkeletonLoader = ({width = "unset",length = 3}:SkeletonProps)=>{
  const skeletons = Array.from({length},(_,idx)=>(
    <div className="skeleton-shape" key={idx}></div>
  ))
  return <div className="skeleton-loader" style={{width}}>
    {skeletons}
  </div>
}