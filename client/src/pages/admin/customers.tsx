import { ReactElement, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  useAllUsersQuery,
  useDeleteUserMutation,
} from "../../redux/api/userApi";
import { CustomError } from "../../types/api";
import toast from "react-hot-toast";
import { SkeletonLoader } from "../../components/Loader";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string | undefined;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Customers = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { isLoading, data, isError, error } = useAllUsersQuery(user?._id!);
  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = (id: string) => {
    try {
      deleteUser({ adminUserId: user?._id!, userId: id! });
      toast.success("User Deleted");
    } catch (error) {
      const err = error as CustomError;
      toast.error(err.data.message);
    }
  };

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }
  const [rows, setRows] = useState<DataType[]>([]);

  useEffect(() => {
    if (data?.users) {
      setRows(
        data?.users.map((i) => ({
          avatar: <img src={i.photo}></img>,
          name: i.name,
          email: i.email,
          gender: i.gender,
          role: i.role,
          action: (
            <button
              onClick={() => {
                handleDelete(i._id);
              }}
            >
              <FaTrash title="Delete User"/>
            </button>
          ),
        }))
      );
    }
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <SkeletonLoader length={20} /> : Table}</main>
    </div>
  );
};

export default Customers;
