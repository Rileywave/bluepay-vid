
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-bluepay-blue text-white">
      <div className="flex-1 flex flex-col">
        <header className="p-4">
          <div className="flex items-center">
            <div className="text-2xl font-bold relative">
              <span className="relative z-10 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
                BLUE
              </span>
              <span className="relative z-10 bg-gradient-to-r from-blue-400 via-blue-300 to-white bg-clip-text text-transparent">
                PAY
              </span>
              <span className="relative z-10 ml-1 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent text-sm font-light">
                2025
              </span>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col p-6 justify-center">
          <div className="mt-16">
            <img 
              src="/lovable-uploads/55c3f237-e0a0-487d-8665-b3f3c186b081.png" 
              alt="BLUEPAY2025" 
              className="mx-auto mb-10 max-w-xs"
            />
            <h1 className="text-4xl font-bold mb-4">Get Your Account Ready And Instantly.</h1>
            <p className="text-lg mb-10">
              Get your account ready and instantly start buying, selling airtime and data
              online and start paying all your bills in cheaper price.
            </p>
            <Button 
              className="bg-white hover:bg-gray-100 text-bluepay-blue font-bold py-3 px-8 rounded-full text-lg"
              onClick={() => navigate("/register")}
            >
              Get Started
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
