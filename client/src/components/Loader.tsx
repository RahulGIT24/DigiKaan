import { Hourglass } from "react-loader-spinner";

const Loader = () => {
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

export default Loader;
