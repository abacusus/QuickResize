import React, { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="navbar w-full mb-10 bg-white shadow-md flex items-center justify-between mt-2 p-2">
        {/* Logo */}
        <div>
          <p className="cursor-pointer font-bold text-3xl text-purple-500">
            Quick Resizer
          </p>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:block">
          <nav>
            <ul className="flex justify-center gap-4 flex-row items-center">
              <li className="cursor-pointer px-4 p-1 hover:bg-green-200 rounded-2xl">
                Home
              </li>
              <li className="cursor-pointer px-4 p-1 hover:bg-green-200 rounded-2xl">
                About
              </li>
              <button
                className="text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-all"
                style={{
                  background:
                    "linear-gradient(to right, white -123%, black 74%)",
                }}
              >
                Get Started
              </button>
            </ul>
          </nav>
        </div>

        {/* Hamburger Button (mobile only) */}
        <button
          className="md:hidden block focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            // X icon
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Hamburger icon
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md flex flex-col items-start gap-2 p-4">
          <a className="cursor-pointer hover:bg-green-200 w-full rounded p-2">
            Home
          </a>
          <a className="cursor-pointer hover:bg-green-200 w-full rounded p-2">
            About
          </a>
          <button
            className="text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-all w-full"
            style={{
              background: "linear-gradient(to right, white -123%, black 74%)",
            }}
          >
            Get Started
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
