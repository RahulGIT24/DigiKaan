import { BiMaleFemale } from "react-icons/bi";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { BarChart, DoughnutChart } from "../../components/admin/Charts";
import { useStatsQuery } from "../../redux/api/dashboard";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Table from "../../components/admin/DashboardTable";
import toast from "react-hot-toast";
import { CustomError } from "../../types/api";
import { SkeletonLoader } from "../../components/Loader";
import { getLastMonth } from "../../utils/features";

const Dashboard = () => {
  const { lastSixMonths } = getLastMonth();
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { data, isLoading, error, isError } = useStatsQuery(
    user?._id as string
  );
  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  const stats = data?.stats!;
  const transaction = stats?.chart.revenue;
  return (
    <div className="admin-container">
      <AdminSidebar />
      {isLoading ? (
        <SkeletonLoader length={20} />
      ) : (
        <main className="dashboard">
          <section className="widget-container">
            <WidgetItem
              percent={stats?.thisMonthRevenue || 0}
              amount={true}
              value={stats?.count.totalRevenue || 0}
              heading="Revenue"
              color="rgb(0, 115, 255)"
            />
            <WidgetItem
              percent={stats?.user || 0}
              value={stats?.count.userCount || 0}
              color="rgb(0 198 202)"
              heading="Users"
            />
            <WidgetItem
              percent={stats?.order || 0}
              value={stats?.count.orderCount || 0}
              color="rgb(255 196 0)"
              heading="Transactions"
            />

            <WidgetItem
              percent={stats?.product || 0}
              value={stats?.count.productCount || 0}
              color="rgb(76 0 255)"
              heading="Products"
            />
          </section>

          <section className="graph-container">
            <div className="revenue-chart">
              <h2>Month Wise Revenue</h2>
              <BarChart
                labels={lastSixMonths}
                data_2={transaction}
                title_1="Revenue"
                title_2="Transaction"
                bgColor_1="rgb(0, 115, 255)"
                bgColor_2="rgba(53, 162, 235, 0.8)"
              />
            </div>

            <div className="dashboard-categories">
              <h2>Inventory</h2>

              <div>
                {stats?.categoryCount.map((i, index) => {
                  const [category] = Object.entries(i);
                  return (
                    <CategoryItem
                      key={index}
                      value={category[1]}
                      heading={category[0]}
                      color={`hsl(${category[1] * 4}, ${category[1]}%, 50%)`}
                    />
                  );
                })}
              </div>
            </div>
          </section>

          <section className="transaction-container">
            <div className="gender-chart">
              <h2>Gender Ratio</h2>
              <DoughnutChart
                labels={["Female", "Male"]}
                data={[
                  data?.stats.userRatio.female || 0,
                  data?.stats.userRatio.male || 0,
                ]}
                backgroundColor={[
                  "hsl(340, 82%, 56%)",
                  "rgba(53, 162, 235, 0.8)",
                ]}
                cutout={90}
              />
              <p>
                <BiMaleFemale />
              </p>
            </div>
            <Table data={stats.latestTransactions} />
          </section>
        </main>
      )}
    </div>
  );
};

interface WidgetItemProps {
  heading: string;
  value: number;
  percent: number;
  color: string;
  amount?: boolean;
}

const WidgetItem = ({
  heading,
  value,
  percent,
  color,
  amount = false,
}: WidgetItemProps) => (
  <article className="widget">
    <div className="widget-info">
      <p>{heading}</p>
      <h4>{amount ? `₹${value}` : value}</h4>
      {percent > 0 ? (
        <span className="green">
          <HiTrendingUp /> +
          {percent >= 0 && `${percent > 10000 ? 9999 : percent}`}%{" "}
        </span>
      ) : (
        <span className="red">
          <HiTrendingDown />{" "}
          {percent <= 0 && `${percent < -10000 ? -9999 : percent}`}%{" "}
        </span>
      )}
    </div>

    <div
      className="widget-circle"
      style={{
        background: `conic-gradient(
        ${color} ${(Math.abs(percent) / 100) * 360}deg,
        rgb(255, 255, 255) 0
      )`,
      }}
    >
      <span
        style={{
          color,
        }}
      >
        {percent >= 0 && `${percent > 10000 ? 9999 : percent}`}
        {percent < 0 && `${percent < -10000 ? -9999 : percent}`}%
      </span>
    </div>
  </article>
);

interface CategoryItemProps {
  color: string;
  value: number;
  heading: string;
}

const CategoryItem = ({ color, value, heading }: CategoryItemProps) => (
  <div className="category-item">
    <h5>{heading}</h5>
    <div>
      <div
        style={{
          backgroundColor: color,
          width: `${value}%`,
        }}
      ></div>
    </div>
    <span>{value}%</span>
  </div>
);

export default Dashboard;
