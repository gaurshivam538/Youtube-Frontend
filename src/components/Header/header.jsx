import React, { useState, useEffect } from "react";
import { Logo, Input, Logout, CreateMenu } from "../index";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import Container from "../container/Container";
import Userprofile from "../Userprofile/Userprofile";

function Header() {
  const [searchItem, setSearchItem] = useState("");
  const [isFixed, setIsFixed] = useState(false);

  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => 
      window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
  ];

  return (
    <header
      className={`bg-gray-100 shadow-md text-black transition-all duration-300
      ${isFixed ? "fixed top-0 left-0 w-full z-50 "  : ""}`}
    >
      <Container>
        <nav className={`flex items-center justify-between py-2 lg:px-6 bg-gray-200 `}>
          <Link to="/">
            <Logo />
          </Link>

          <div className="flex items-center border rounded-full bg-white lg:w-1/2 sm:w-1/2 border-gray-600">
            <Input
              type="text"
              placeholder="Search..."
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              className="border-none outline-none lg:w-full px-9"
            />
            <button className="p-2 mx-3 rounded-md hover:bg-gray-300">
              <FaSearch />
            </button>
          </div>

          <ul className="flex items-center gap-3">
              {navItems.map(
                (item) =>
                  item.active && (
                    <li key={item.name}>
                      <button
                        onClick={() => navigate(item.slug)}
                        className="px-3 py-1 hover:text-blue-600"
                      >
                        {item.name}
                      </button>
                    </li>
                  )
              )}

            <li>{authStatus && <Logout />}</li>
            <li>{authStatus && <CreateMenu/>}</li>
            <li>{authStatus && <Userprofile />}</li>
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
