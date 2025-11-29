
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "../stores/userStore";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DataPurchase = () => {
  const navigate = useNavigate();
  const { balance, updateBalance, addTransaction } = useUserStore();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [network, setNetwork] = useState("");
  const [dataBundle, setDataBundle] = useState("");
  const [bpcCode, setBpcCode] = useState("");
  
  const networks = ["MTN", "Airtel", "Glo", "9Mobile"];
  
  const dataBundles = [
    { id: "1", name: "1GB (30 Days)", price: 500 },
    { id: "2", name: "2GB (30 Days)", price: 1000 },
    { id: "3", name: "5GB (30 Days)", price: 2000 },
    { id: "4", name: "10GB (30 Days)", price: 3500 },
    { id: "5", name: "20GB (30 Days)", price: 5000 },
  ];
  
  const selectedBundle = dataBundles.find(bundle => bundle.id === dataBundle);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || !network || !dataBundle || !bpcCode) {
      toast({
        variant: "destructive",
        description: "Please fill in all required fields",
      });
      return;
    }

    if (phoneNumber.length !== 11) {
      toast({
        variant: "destructive",
        description: "Please enter a valid 11-digit phone number",
      });
      return;
    }

    if (bpcCode !== "BPC55262527") {
      toast({
        variant: "destructive",
        description: "Invalid BPC code. Please enter a valid code.",
      });
      return;
    }

    if (!selectedBundle) {
      toast({
        variant: "destructive",
        description: "Please select a valid data bundle",
      });
      return;
    }

    updateBalance(-selectedBundle.price);
    
    addTransaction({
      id: Date.now(),
      type: `${network} Data Bundle`,
      amount: `-₦${selectedBundle.price.toLocaleString()}`,
      date: new Date().toLocaleString(),
      status: "Completed",
      recipient: phoneNumber,
    });
    
    toast({
      description: "Data purchase successful!",
    });
    
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-600 text-white py-3 px-4">
        <div className="flex items-center">
          <button onClick={() => navigate("/dashboard")} className="mr-2">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">Buy Data Bundle</h1>
        </div>
      </header>

      <div className="p-4 flex-1">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1 text-sm">Select Network</label>
            <Select value={network} onValueChange={setNetwork}>
              <SelectTrigger className="w-full border-2 border-blue-600 rounded-lg p-3 h-12 text-base">
                <SelectValue placeholder="Select Network" />
              </SelectTrigger>
              <SelectContent>
                {networks.map((net) => (
                  <SelectItem key={net} value={net}>
                    {net}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1 text-sm">Phone Number</label>
            <Input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border-2 border-blue-600 rounded-lg p-3 text-base"
              placeholder="Enter 11-digit phone number"
              maxLength={11}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1 text-sm">Data Bundle</label>
            <Select value={dataBundle} onValueChange={setDataBundle}>
              <SelectTrigger className="w-full border-2 border-blue-600 rounded-lg p-3 h-12 text-base">
                <SelectValue placeholder="Select Data Bundle" />
              </SelectTrigger>
              <SelectContent>
                {dataBundles.map((bundle) => (
                  <SelectItem key={bundle.id} value={bundle.id}>
                    {bundle.name} - ₦{bundle.price.toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1 text-sm">BPC CODE</label>
            <Input
              type="text"
              value={bpcCode}
              onChange={(e) => setBpcCode(e.target.value)}
              className="w-full border-2 border-blue-600 rounded-lg p-3 text-base"
              placeholder="Enter BPC code"
            />
          </div>
          
          <div className="mt-6">
            <p className="text-lg font-bold">Available Balance: ₦{balance.toLocaleString()}</p>
          </div>
          
          <Button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-base py-4 mt-3"
          >
            Purchase Data
          </Button>
        </form>
      </div>
    </div>
  );
};

export default DataPurchase;
