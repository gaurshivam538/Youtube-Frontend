import React, { useState } from "react";
import { Logo, Input,Logout } from "../index";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import Container from "../container/Container";
import Userprofile from "../Userprofile/Userprofile";



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

  ];

  
  return (
    <header className="bg-gray-100 shadow-md text-black">
      <Container>
        <nav className="flex items-center justify-between py-2 lg:px-6 bg-gray-200">
          {/* Logo */}
          <Link to="/">
            <Logo />
          </Link>

          {/* Search Bar */}
          <div className="flex items-center border rounded-full  overflow-hidden bg-white lg:w-1/2 sm:w-1/2 border-gray-600">
            <Input
              type="text"
              placeholder="Search..."
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              className="border-none outline-none lg:w-full px-9 "
            />
            <button className="p-2 mx-3 rounded-md px-2 hover:bg-gray-300">
              <FaSearch className=" border-gray-900"/>
            </button>
          </div>

          {/* Navigation */}
          <ul className="flex items-center gap-3">
            <li className="flex">
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
           <li>
             {
              authStatus ?<Logout/> :null
            }
           </li>
           <li>
            {
              authStatus ? <Userprofile/>: null
            }
           </li>
            
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
