
import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const BuyBPCConfirmation = () => {
  const navigate = useNavigate();
  
  const handleSupport = () => {
    toast({
      description: "Redirecting to support...",
      duration: 2000,
    });
    navigate("/support");
  };

  const handleRecheck = () => {
    toast({
      description: "Checking payment status...",
      duration: 2000,
    });
    setTimeout(() => {
      toast({
        variant: "destructive",
        description: "Payment still not confirmed",
        duration: 3000,
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-[#f2f2f2] text-black py-3 px-4 flex justify-between items-center sticky top-0 z-10">
        <div className="text-lg font-medium">Bank Transfer</div>
        <button 
          onClick={() => navigate("/dashboard")} 
          className="text-red-500 font-medium text-sm"
        >
          Cancel
        </button>
      </header>

      <div className="flex-1 flex flex-col p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center mb-3 md:mb-0">
            <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 relative">
                <div className="absolute inset-0 rounded-full border-2 border-yellow-400"></div>
                <div className="absolute inset-1 rounded-full border-2 border-red-500"></div>
                <div className="absolute inset-2 rounded-full bg-blue-500"></div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">NGN 6,200</p>
          </div>
        </div>
        
        <div className="text-center my-6">
          <p className="text-lg font-medium">
            Proceed to your bank app to complete this Transfer
          </p>
        </div>
        
        <div className="mt-6 space-y-3">
          <Alert variant="destructive" className="border-2 border-red-500 bg-red-50">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <AlertDescription className="text-base font-medium ml-2">
              Payment not confirmed
            </AlertDescription>
          </Alert>
          
          <div className="flex items-center justify-center mt-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle size={36} className="text-red-600" />
            </div>
          </div>
          
          <div className="text-center mt-3">
            <p className="text-gray-800 text-base font-medium">
              Need help? Contact support:
            </p>
            
            <button 
              onClick={handleSupport}
              className="text-blue-600 font-medium text-base hover:underline mt-1"
            >
              here
            </button>
          </div>
          
          <Button 
            onClick={handleRecheck}
            className="w-full max-w-xs mx-auto bg-green-600 hover:bg-green-700 text-white py-3 text-lg mt-3"
          >
            Re-check
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuyBPCConfirmation;
