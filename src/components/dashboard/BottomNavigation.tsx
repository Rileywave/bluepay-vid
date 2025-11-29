
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const BottomNavigation = () => {
  const navigate = useNavigate();

  return (
    <div className="h-16 bg-white border-t border-gray-200 fixed bottom-0 w-full flex justify-around items-center px-4 shadow-md">
      <div 
        className="flex flex-col items-center cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        <span className="text-lg text-bluepay-blue">💰</span>
        <span className="text-xs font-medium mt-1">Wallet</span>
      </div>
      <div 
        className="flex flex-col items-center cursor-pointer" 
        onClick={() => navigate("/platform")}
      >
        <span className="text-lg text-gray-500">🌐</span>
        <span className="text-xs font-medium mt-1 text-gray-500">Social</span>
      </div>
      <div className="flex flex-col items-center">
        <Button 
          className="rounded-full h-12 w-12 -mt-5 bg-bluepay-blue text-white hover:bg-blue-700 shadow-lg"
          onClick={() => navigate("/buy-bpc")}
        >
          <span className="text-xl">🛍</span>
        </Button>
      </div>
      <div 
        className="flex flex-col items-center cursor-pointer" 
        onClick={() => navigate("/data")}
      >
        <span className="text-lg text-gray-500">📶</span>
        <span className="text-xs font-medium mt-1 text-gray-500">Data</span>
      </div>
      <div 
        className="flex flex-col items-center cursor-pointer" 
        onClick={() => navigate("/profile")}
      >
        <span className="text-lg text-gray-500">👤</span>
        <span className="text-xs font-medium mt-1 text-gray-500">Profile</span>
      </div>
    </div>
  );
};

export default BottomNavigation;
