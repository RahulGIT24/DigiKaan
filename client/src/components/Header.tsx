import { useState } from "react";
import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { User } from "../types/common";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { isActive } from "../redux/reducer/userReducer";

interface PropsType {
  user: User | null;
}

const Header = ({ user }: PropsType) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const logout = async () => {
    try {
      await signOut(auth);
      dispatch(isActive(false))
      toast.success("Signed Out!");
    } catch (error) {
      toast.error("Sign Out Failed");
      setIsOpen(false);
    }
  };
  return (
    <nav className="header">
      <Link
        to={"/"}
        onClick={() => {
          setIsOpen(false);
        }}
      >
        Home
      </Link>
      <Link
        to={"/search"}
        onClick={() => {
          setIsOpen(false);
        }}
      >
        <FaSearch />
      </Link>
      <Link
        to={`${user?._id ? `/cart`:"/login"}`}
        onClick={() => {
          setIsOpen(false);
        }}
      >
        <FaShoppingBag />
      </Link>
      {user?._id ? (
        <>
          <button
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            <img src={user.photo} className="profile" />
          </button>
          <dialog open={isOpen}>
            <div>
              {user.role === "admin" && (
                <Link
                  to={"/admin/dashboard"}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  Admin
                </Link>
              )}
              <Link
                to={"/orders"}
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Orders
              </Link>
              <button onClick={logout}>
                <FaSignOutAlt />
              </button>
            </div>
          </dialog>
        </>
      ) : (
        <>
          <Link to={"/login"}>
            <FaSignInAlt />
          </Link>
        </>
      )}
    </nav>
  );
};

export default Header;
