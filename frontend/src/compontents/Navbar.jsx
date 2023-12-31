import React from "react";

function Navbar() {
  return (
    <div className="bg-black w-full h-12">
      <a className="text-white mr-4 p-6">Orcas</a>
      <a
        href="/"
        className="text-white mr-4 p-6 hover:bg-white hover:text-black text-center h-full"
      >
        Home
      </a>
    </div>
  );
}

export default Navbar;
