
import React from "react";
import { Bell, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  
  const handleMenuClick = () => {
    navigate("/admin");
  };

  return (
    <header className="bg-bluepay-blue text-white py-4 px-5 flex justify-between items-center sticky top-0 z-10">
      <button className="text-xl" onClick={handleMenuClick}>
        <Menu size={24} />
      </button>
      <h1 className="text-2xl font-semibold">BLUEPAY</h1>
      <div className="w-8 h-8">
        <Bell size={24} />
      </div>
    </header>
  );
};

export default Header;
