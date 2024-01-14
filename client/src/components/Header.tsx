import { useState } from "react";
import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const user = { _id: "mnc m", role: "user" };

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const logout = ()=>{
    setIsOpen(false);
  }
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
        to={"/cart"}
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
            <FaUser />
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
              <button
                onClick={logout}
              >
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
