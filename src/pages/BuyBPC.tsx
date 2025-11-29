
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "../stores/userStore";
import { toast } from "@/hooks/use-toast";
import TypewriterText from "../components/ui/TypewriterText";

const BuyBPC = () => {
  const navigate = useNavigate();
  const { userData } = useUserStore();
  const [amount] = useState("₦6,200");
  const [fullName, setFullName] = useState(userData?.fullName || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTypewriter, setShowTypewriter] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email) {
      toast({
        variant: "destructive",
        description: "Please fill in all fields",
      });
      return;
    }
    
    setIsSubmitting(true);
    navigate("/buy-bpc/processing");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-[#1a237e] text-white py-3 px-4">
        <h1 className="text-xl font-bold">Buy BPC Code</h1>
      </header>

      {showTypewriter && userData && (
        <div className="bg-blue-50 p-3 border-l-4 border-blue-500 mx-4 mt-3 rounded">
          <p className="text-blue-800 text-sm">
            Welcome back, <TypewriterText text={userData.fullName || "User"} speed={100} className="font-semibold" />
          </p>
          <p className="text-blue-600 text-xs mt-1">
            Email: <TypewriterText text={userData.email || ""} speed={80} className="font-medium" />
          </p>
        </div>
      )}

      <div className="flex-1 p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-base text-gray-600 mb-1 block">Amount</label>
            <Input
              type="text"
              value={amount}
              readOnly
              className="text-base py-3 border-2 border-gray-300 rounded-lg bg-gray-100"
              placeholder="₦0.00"
            />
          </div>
          
          <div>
            <label className="text-base text-gray-600 mb-1 block">Full Name</label>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="text-base py-3 border-2 border-gray-300 rounded-lg"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label className="text-base text-gray-600 mb-1 block">Your Email Address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-base py-3 border-2 border-gray-300 rounded-lg"
              placeholder="email@example.com"
            />
          </div>
          
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-4"
          >
            {isSubmitting ? "Processing..." : "Pay"}
          </Button>
          
          <p className="text-center text-gray-500 text-sm">
            Your BPC code will be displayed on the app once your payment is confirmed.
          </p>
        </form>
      </div>
    </div>
  );
};

export default BuyBPC;
