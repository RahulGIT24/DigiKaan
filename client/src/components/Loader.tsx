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

export const SkeletonLoader = ({width = "unset"}:{width?:string})=>{
  return <div className="skeleton-loader" style={{width}}>
    <div className="skeleton-shape"></div>
    <div className="skeleton-shape"></div>
    <div className="skeleton-shape"></div>
  </div>
}