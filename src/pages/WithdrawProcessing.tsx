
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WithdrawProcessing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);
  const { amount = 0, accountName = "", accountNumber = "", bank = "" } = location.state || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuccess(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <header className="bg-[#222222] text-white py-3 px-4 flex justify-between items-center sticky top-0 z-10">
          <button className="text-lg">
            <span className="sr-only">Menu</span>
          </button>
          <h1 className="text-xl font-semibold">BLUEPAY2025</h1>
          <div className="w-6 h-6">
            <span className="sr-only">Notifications</span>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-20 h-20 mb-6 flex items-center justify-center">
            <CheckCircle size={80} className="text-blue-600" strokeWidth={2} />
          </div>
          
          <h1 className="text-2xl font-bold mb-3 text-center">Transfer Successfully</h1>
          <p className="text-base text-gray-700 text-center mb-4">
            Your transfer of ₦{amount.toLocaleString()} has been processed successfully.
          </p>
          
          <Button 
            onClick={handleBackToDashboard}
            className="w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
          >
            Ok, I got it
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-[#222222] text-white py-3 px-4 flex justify-between items-center sticky top-0 z-10">
        <button className="text-lg">
          <span className="sr-only">Menu</span>
        </button>
        <h1 className="text-xl font-semibold">BLUEPAY2025</h1>
        <div className="w-6 h-6">
          <span className="sr-only">Notifications</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 mb-6">
          <div className="w-full h-full rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin"></div>
        </div>
        
        <h1 className="text-2xl font-bold mb-3 text-center">Processing your request</h1>
        <p className="text-base text-gray-500 text-center">
          Please wait while we prepare your payment details...
        </p>
      </div>
    </div>
  );
};

export default WithdrawProcessing;
