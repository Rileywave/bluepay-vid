
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, MessageSquare, Phone, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";

const Support = () => {
  const navigate = useNavigate();

  const handleLiveChatClick = () => {
    window.open('https://t.me/Bluepay2025_bot', '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-[#222222] text-white py-3 px-4 flex justify-between items-center sticky top-0 z-10">
        <button onClick={() => navigate("/dashboard")} className="text-lg">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold">Support</h1>
        <div className="w-6 h-6"></div>
      </header>

      <div className="p-4 flex-1">
        <h2 className="text-xl font-bold mb-4">How can we help you?</h2>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-blue-100">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">Email Support</h3>
                <p className="text-gray-600 text-sm">Get comprehensive help via email</p>
              </div>
            </div>
            <Button 
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-3 text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
              onClick={() => window.open('mailto:bluepaycustomerservice25@gmail.com')}
            >
              Send Email
            </Button>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 shadow-lg border border-green-100">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">WhatsApp Support</h3>
                <p className="text-gray-600 text-sm">Quick chat on WhatsApp</p>
              </div>
            </div>
            <Button 
              className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 py-3 text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
              onClick={() => window.open('https://wa.me/2349127560865')}
            >
              Chat on WhatsApp
            </Button>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-5 shadow-lg border border-purple-100">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                <LifeBuoy className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">Live Chat Support</h3>
                <p className="text-gray-600 text-sm">Instant chat with support agents</p>
              </div>
            </div>
            <Button 
              className="w-full mt-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 py-3 text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
              onClick={handleLiveChatClick}
            >
              Start Live Chat
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">Available 24/7 for your support needs</p>
          <p className="text-blue-600 font-medium mt-1 text-sm">bluepaycustomerservice25@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default Support;
