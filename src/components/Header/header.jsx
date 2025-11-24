import React, { useState } from "react";
import { Logo, Input } from "../index";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import Container from "../container/Container";
import { Logout as serviceLogout } from "../../services/user.service"
import { logout as authLogout } from "../../store/auth.slice"



function Header() {
  const [searchItem, setSearchItem] = useState("");
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navItems = [
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    // { name: "Logout", slug: "/logout", active: authStatus },
    { name: "Create", slug: "/create", active: authStatus },
    { name: "UserProfile", slug: "/user-account-info", active: authStatus },

  ];

  const logout = async () => {
    try {
      await serviceLogout();
      dispatch(authLogout())

    } catch (error) {

    }
  }

  return (
    <header className="bg-gray-100 shadow-md text-black">
      <Container>
        <nav className="flex items-center justify-between py-2 lg:px-6 ">
          {/* Logo */}
          <Link to="/">
            <Logo />
          </Link>

          {/* Search Bar */}
          <div className="flex items-center border rounded-full  overflow-hidden bg-white lg:w-1/2 sm:w-1/2">
            <Input
              type="text"
              placeholder="Search..."
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              className="border-none outline-none lg:w-full px-9 "
            />
            <button className="p-2 mx-3 rounded-md px-2 hover:bg-gray-300">
              <FaSearch />
            </button>
          </div>

          {/* Navigation */}
          <ul className="flex items-center gap-3">
            <li>
              {navItems.map((item) =>
                item.active ? (
                  <li key={item.name} className="flex ">
                    <button
                      onClick={() => navigate(item.slug)}
                      className="px-3 py-1 hover:text-blue-600"
                    >
                      {item.name}
                    </button>
                  </li>
                ) : null
              )}
            </li>
            {
              authStatus ?<button onClick={() => logout()} className="hover:text-blue-500 cursor-pointer">
              Logout
            </button> :null
            }
            
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
