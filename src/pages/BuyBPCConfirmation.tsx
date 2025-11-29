import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Copy, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const BuyBPCConfirmation = () => {
  const navigate = useNavigate();
  const bpcCode = "BPC5215336";

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(bpcCode);
      alert("Code copied to clipboard");
    } catch (err) {
      alert("Failed to copy code");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-black text-white py-4 px-4 text-center sticky top-0 z-10 font-bold text-lg">
        BLUEPAY
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Success Icon */}
        <div className="w-24 h-24 mb-6 flex items-center justify-center">
          <CheckCircle size={90} className="text-blue-600" strokeWidth={2.5} />
        </div>

        <h1 className="text-2xl font-bold mb-2 text-center">Payment Confirmed</h1>
        <p className="text-base text-gray-600 text-center mb-8 max-w-md">
          Your payment has been received successfully.
        </p>

        {/* BPC Code Box */}
        <div className="w-full max-w-md bg-blue-50 border rounded-lg p-4 shadow-sm mb-6">
          <p className="text-sm text-gray-600 mb-2">Your BPC Code:</p>

          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white border rounded-md px-3 py-2 font-semibold tracking-wider">
              {bpcCode}
            </div>
            <Button size="icon" variant="outline" onClick={copyCode}>
              <Copy size={18} />
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Use this code for your withdrawals.
          </p>
        </div>

        {/* Back Button */}
        <Button className="w-full max-w-md" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      {/* Floating Chat */}
      <button className="fixed bottom-6 right-6 bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
        <MessageCircle size={26} />
      </button>
    </div>
  );
};

export default BuyBPCConfirmation;
