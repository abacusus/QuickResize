import React from "react";

const Navbar = () => {
  return (
    <div>
      <div className="navbar h-2 w-full flex items-center justify-between mt-2 p-4">
        <div>
          <p className="cursor-pointer font-bold text-2xl">Quick Resizer</p>
        </div>
        <div>
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
      </div>
    </div>
  );
};

export default Navbar;
