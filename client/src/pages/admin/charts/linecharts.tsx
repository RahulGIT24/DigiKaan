import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { LineChart } from "../../../components/admin/Charts";
import { UserReducerInitialState } from "../../../types/reducer";
import { useLineQuery } from "../../../redux/api/dashboard";
import { CustomError } from "../../../types/api";
import toast from "react-hot-toast";
import { SkeletonLoader } from "../../../components/Loader";
import { getLastMonth } from "../../../utils/features";

const {lastTwelveMonths:months} = getLastMonth();

const Linecharts = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );
  const { data, isLoading, isError, error } = useLineQuery(user?._id!);
  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }
  const chart = data?.charts;
  const discount = chart?.discount!;
  const products = chart?.products!;
  const revenue = chart?.revenue!;
  const users = chart?.users!;
  return (
    <div className="admin-container">
      <AdminSidebar />
      {isLoading ? (
        <SkeletonLoader length={20} />
      ) : (
        <main className="chart-container">
          <h1>Line Charts</h1>
          <section>
            <LineChart
              data={users}
              label="Users"
              borderColor="rgb(53, 162, 255)"
              labels={months}
              backgroundColor="rgba(53, 162, 255, 0.5)"
            />
            <h2>Active Users</h2>
          </section>

          <section>
            <LineChart
              data={products}
              backgroundColor={"hsla(269,80%,40%,0.4)"}
              borderColor={"hsl(269,80%,40%)"}
              labels={months}
              label="Products"
            />
            <h2>Total Products (SKU)</h2>
          </section>

          <section>
            <LineChart
              data={revenue}
              backgroundColor={"hsla(129,80%,40%,0.4)"}
              borderColor={"hsl(129,80%,40%)"}
              label="Revenue"
              labels={months}
            />
            <h2>Total Revenue </h2>
          </section>

          <section>
            <LineChart
              data={discount}
              backgroundColor={"hsla(29,80%,40%,0.4)"}
              borderColor={"hsl(29,80%,40%)"}
              label="Discount"
              labels={months}
            />
            <h2>Discount Allotted </h2>
          </section>
        </main>
      )}
    </div>
  );
};

export default Linecharts;
