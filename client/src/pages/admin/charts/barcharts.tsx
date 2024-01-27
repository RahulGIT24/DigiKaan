import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { BarChart } from "../../../components/admin/Charts";
import { UserReducerInitialState } from "../../../types/reducer";
import { useBarQuery } from "../../../redux/api/dashboard";
import toast from "react-hot-toast";
import { CustomError } from "../../../types/api";
import { SkeletonLoader } from "../../../components/Loader";
import { getLastMonth } from "../../../utils/features";

const { lastTwelveMonths, lastSixMonths } = getLastMonth();

const Barcharts = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );
  const { data, isLoading, isError, error } = useBarQuery(user?._id!);
  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }
  const charts = data?.charts;
  const users = charts?.users!;
  const orders = charts?.orders!;
  const products = charts?.products!;
  return (
    <div className="admin-container">
      <AdminSidebar />
      {isLoading ? (
        <SkeletonLoader length={10} />
      ) : (
        <main className="chart-container">
          <h1>Bar Charts</h1>
          <section>
            <BarChart
              labels={lastSixMonths}
              data_2={users}
              data_1={products}
              title_1="Products"
              title_2="Users"
              bgColor_1={`hsl(260, 50%, 30%)`}
              bgColor_2={`hsl(360, 90%, 90%)`}
            />
            <h2>Top Products & Top Customers</h2>
          </section>

          <section>
            <BarChart
              horizontal={true}
              data_1={orders}
              data_2={[]}
              title_1="Orders"
              title_2=""
              bgColor_1={`hsl(180, 40%, 50%)`}
              bgColor_2=""
              labels={lastTwelveMonths}
            />
            <h2>Orders throughout the year</h2>
          </section>
        </main>
      )}
    </div>
  );
};

export default Barcharts;
