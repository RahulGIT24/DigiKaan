import AdminSidebar from "../../../components/admin/AdminSidebar";
import { DoughnutChart, PieChart } from "../../../components/admin/Charts";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../../types/reducer";
import { usePieQuery } from "../../../redux/api/dashboard";
import { CustomError } from "../../../types/api";
import toast from "react-hot-toast";
import { SkeletonLoader } from "../../../components/Loader";

const PieCharts = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );
  const { data, isLoading, isError, error } = usePieQuery(user?._id!);
  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }
  const charts = data?.charts!;

  return (
    <div className="admin-container">
      <AdminSidebar />
      {isLoading ? (
        <SkeletonLoader length={20} />
      ) : (
        <main className="chart-container">
          <h1>Pie & Doughnut Charts</h1>
          <section>
            <div>
              {charts.orderFullFillMent.processing == 0 &&
              charts.orderFullFillMent.shipped == 0 &&
              charts.orderFullFillMent.delivered == 0 ? (
                <h1 className="pie-head">No data to show</h1>
              ) : (
                <PieChart
                  labels={["Processing", "Shipped", "Delivered"]}
                  data={[
                    charts.orderFullFillMent.processing,
                    charts.orderFullFillMent.shipped,
                    charts.orderFullFillMent.delivered,
                  ]}
                  backgroundColor={[
                    `hsl(110,80%, 80%)`,
                    `hsl(110,80%, 50%)`,
                    `hsl(110,40%, 50%)`,
                  ]}
                  offset={[0, 0, 50]}
                />
              )}
            </div>
            <h2>Order Fulfillment Ratio</h2>
          </section>

          <section>
            <div>
              {!charts.productCategories ? (
                <h1 className="pie-head">No data to show</h1>
              ) : (
                <DoughnutChart
                  labels={charts.productCategories.map((i) => {
                    const [category] = Object.entries(i);
                    return category[0];
                  })}
                  data={charts.productCategories.map((i) => {
                    const [value] = Object.entries(i);
                    return value[1];
                  })}
                  backgroundColor={charts.productCategories.map((i) => {
                    const [value] = Object.entries(i);
                    return `hsl(${value[1] * 4}, ${value[1]}%, 50%)`;
                  })}
                  legends={false}
                  offset={[0, 0, 0, 80]}
                />
              )}
            </div>
            <h2>Product Categories Ratio</h2>
          </section>

          <section>
            <div>
              <DoughnutChart
                labels={["In Stock", "Out Of Stock"]}
                data={[
                  charts.stockAvailability.inStock,
                  charts.stockAvailability.outOfStock,
                ]}
                backgroundColor={["hsl(269,80%,40%)", "rgb(53, 162, 255)"]}
                legends={false}
                offset={[0, 80]}
                cutout={"70%"}
              />
            </div>
            <h2> Stock Availability</h2>
          </section>

          <section>
            <div>
              {charts.revenueDistribution.marketingCost === 0 &&
              charts.revenueDistribution.discount === 0 &&
              charts.revenueDistribution.burn === 0 &&
              charts.revenueDistribution.productionCost === 0 &&
              charts.revenueDistribution.netMargin === 0 ? (
                <h1 className="pie-head">No data to show</h1>
              ) : (
                <DoughnutChart
                  labels={[
                    "Marketing Cost",
                    "Discount",
                    "Burnt",
                    "Production Cost",
                    "Net Margin",
                  ]}
                  data={[
                    charts.revenueDistribution.marketingCost,
                    charts.revenueDistribution.discount,
                    charts.revenueDistribution.burn,
                    charts.revenueDistribution.productionCost,
                    charts.revenueDistribution.netMargin,
                  ]}
                  backgroundColor={[
                    "hsl(110,80%,40%)",
                    "hsl(19,80%,40%)",
                    "hsl(69,80%,40%)",
                    "hsl(300,80%,40%)",
                    "rgb(53, 162, 255)",
                  ]}
                  legends={false}
                  offset={[20, 30, 20, 30, 80]}
                />
              )}
            </div>
            <h2>Revenue Distribution</h2>
          </section>

          <section>
            <div>
              {charts.usersAgeGroup.teen === 0 &&
              charts.usersAgeGroup.adult === 0 &&
              charts.usersAgeGroup.old === 0 ? (
                <h1 className="pie-head">No data to show</h1>
              ) : (
                <PieChart
                  labels={[
                    "Teenager(Below 20)",
                    "Adult (20-40)",
                    "Older (above 40)",
                  ]}
                  data={[
                    charts.usersAgeGroup.teen,
                    charts.usersAgeGroup.adult,
                    charts.usersAgeGroup.old,
                  ]}
                  backgroundColor={[
                    `hsl(10, ${80}%, 80%)`,
                    `hsl(10, ${80}%, 50%)`,
                    `hsl(10, ${40}%, 50%)`,
                  ]}
                  offset={[0, 0, 50]}
                />
              )}
            </div>
            <h2>Users Age Group</h2>
          </section>

          <section>
            <div>
              {charts.adminCustomer.admin === 0 &&
              charts.adminCustomer.customers == 0 ? (
                <h1 className="pie-head">No data to show</h1>
              ) : (
                <DoughnutChart
                  labels={["Admin", "Customers"]}
                  data={[
                    charts.adminCustomer.admin,
                    charts.adminCustomer.customers,
                  ]}
                  backgroundColor={[`hsl(335, 100%, 38%)`, "hsl(44, 98%, 50%)"]}
                  offset={[0, 50]}
                />
              )}
            </div>
          </section>
        </main>
      )}
    </div>
  );
};

export default PieCharts;
