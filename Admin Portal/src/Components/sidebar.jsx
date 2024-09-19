import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isdarkmode, setIsdarkmode] = useState(false);

  useEffect(() => {
    if (Cookies.get("mode") == "light") {
      setIsdarkmode(true);
    } else {
      setIsdarkmode(false);
    }
  }, []);

  const location = useLocation();

  const toggleDarkMode = () => {
    if (isdarkmode == false) {
      setIsdarkmode(true);
      document.body.className = "light-mode";
      Cookies.set("mode", "light", { expires: 10 });
    } else {
      setIsdarkmode(false);
      document.body.className = "dark-mode";
      Cookies.set("mode", "dark", { expires: 10 });
    }
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <div
      id="sidebar"
      style={{ borderRadius: 0, height: "100vh" }}
      className={`lg:w-16 lg:flex ${
        isSidebarOpen ? "lg:w-64" : ""
      } fixed lg:h-screen overflow-y-auto text-gray-400 transition-all duration-300`}
    >
      <div className="flex flex-col items-center w-16 lg:w-64 h-full overflow-hidden text-gray-400">
        <a className="flex items-center justify-center mt-3" href="#">
          <svg
            class="w-8 h-8 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
          </svg>
        </a>
        <a className="flex items-center justify-center mt-3">
          <button
            className={`w-10 h-5 bg-gray-300 p-1 ${
              isdarkmode ? "" : "bg-gray-600"
            }`}
            onClick={toggleDarkMode}
          >
            <div
              className={`bg-white w-3 h-3 shadow-md transform ${
                isdarkmode ? "translate-x-5" : ""
              }`}
            />
          </button>
        </a>
        <div className="flex flex-col items-center mt-3 border-t border-gray-700">
          <Link
            className={`flex items-center justify-center w-12 h-12 mt-2 rounded ${
              isActiveLink("/dashboard")
                ? "bg-gray-500 text-gray-300"
                : "hover:bg-gray-700 hover:text-gray-300"
            }`}
            to="/dashboard"
          >
            <i className="fas fa-tachometer-alt fa-lg"></i>
          </Link>
          <Link
            className={`flex items-center justify-center w-12 h-12 mt-2 rounded ${
              isActiveLink("/manage-users")
                ? "bg-gray-500 text-gray-300"
                : "hover:bg-gray-700 hover:text-gray-300"
            }`}
            to="/manage-users"
          >
            <i className="fa fa-users"></i>
          </Link>
          <Link
            className={`flex items-center justify-center w-12 h-12 mt-2 rounded ${
              isActiveLink("/inventory")
                ? "bg-gray-500 text-gray-300"
                : "hover:bg-gray-700 hover:text-gray-300"
            }`}
            to="/inventory"
          >
            <i className="fa fa-box"></i>
          </Link>
          <Link
            className={`flex items-center justify-center w-12 h-12 mt-2 rounded ${
              isActiveLink("/brands")
                ? "bg-gray-500 text-gray-300"
                : "hover:bg-gray-700 hover:text-gray-300"
            }`}
            to="/brands"
          >
            <i className="fa fa-columns"></i>
          </Link>
          <Link
            className={`flex items-center justify-center w-12 h-12 mt-2 rounded ${
              isActiveLink("/manage-orders")
                ? "bg-gray-500 text-gray-300"
                : "hover:bg-gray-700 hover:text-gray-300"
            }`}
            to="/manage-orders"
          >
            <i className="fa fa-shopping-cart"></i>
          </Link>
        </div>
        <div class="flex flex-col items-center mt-2">
          <Link
            className={`flex items-center justify-center w-12 h-12 mt-2 rounded ${
              isActiveLink("/reports")
                ? "bg-gray-500 text-gray-300"
                : "hover:bg-gray-700 hover:text-gray-300"
            }`}
            to="/reports"
          >
            <i className="fas fa-chart-bar"></i>
          </Link>
          <Link
            className={`flex items-center justify-center w-12 h-12 mt-2 rounded ${
              isActiveLink("/customer-support")
                ? "bg-gray-500 text-gray-300"
                : "hover:bg-gray-700 hover:text-gray-300"
            }`}
            to="/customer-support"
          >
            <i className="fas fa-life-ring"></i>
          </Link>
          <Link
            className={`flex items-center justify-center w-12 h-12 mt-2 rounded ${
              isActiveLink("/")
                ? "bg-gray-500 text-gray-300"
                : "hover:bg-gray-700 hover:text-gray-300"
            }`}
          >
            <i className="fas fa-sign-out-alt" onClick={()=>{
              if(window.confirm("Are you sure you want to Logout?")){
                Cookies.remove("email");
                Cookies.remove("token");
                Cookies.remove("username");
                window.location.href="/";
              }
              }}></i>
          </Link>
        </div>
        <Link
          className={`flex items-center justify-center w-16 h-16 mt-auto ${
            isActiveLink("/my-accounts")
              ? "bg-gray-500 text-gray-300"
              : "hover:bg-gray-700 hover:text-gray-300"
          }`}
          to="/my-accounts"
        >
          <svg
            class="w-6 h-6 stroke-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
