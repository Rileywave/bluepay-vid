
import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/dashboard/Header";
import BottomNavigation from "../components/dashboard/BottomNavigation";

const Faq = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <div className="flex-1 p-5">
        <div className="mb-4 flex items-center">
          <button onClick={() => navigate("/dashboard")} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-bold">About BLUEPAY</h2>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex justify-center mb-8">
            <img 
              src="/lovable-uploads/9c19c608-d185-4699-b545-9999f7f6fe47.png" 
              alt="BLUEPAY Logo" 
              className="w-40 h-40 object-contain"
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <p className="text-gray-800 leading-relaxed">
                BLUEPAY is the new and improved version of Blue Pay, offering enhanced features, 
                better security, and a more streamlined user experience. We've taken all the feedback 
                from our users to create the ultimate financial platform.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">Our Mission</h3>
              <p className="text-gray-800 leading-relaxed">
                BLUEPAY is dedicated to providing seamless financial services to our users. 
                Our mission is to make digital transactions accessible, secure, and rewarding for everyone.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">What We Offer</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Daily withdrawals up to ₦200,000</li>
                <li>BPC token rewards system</li>
                <li>Airtime and data purchases</li>
                <li>Secure bank transfers</li>
                <li>24/7 customer support</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">How It Works</h3>
              <p className="text-gray-800 leading-relaxed">
                BLUEPAY operates on a daily reward system. Users are allocated a daily withdrawal limit which 
                resets every 24 hours. By participating in platform activities and maintaining BPC tokens, 
                users can increase their daily withdrawal limits and earn additional rewards.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">How do I increase my daily withdrawal limit?</h4>
              <p className="text-gray-700 mt-1">Purchase and hold BPC tokens to increase your daily withdrawal limit.</p>
            </div>
            
            <div>
              <h4 className="font-semibold">Is BLUEPAY available in all countries?</h4>
              <p className="text-gray-700 mt-1">Currently, BLUEPAY services are available in selected regions. We're expanding rapidly!</p>
            </div>
            
            <div>
              <h4 className="font-semibold">How do I contact customer support?</h4>
              <p className="text-gray-700 mt-1">You can reach our support team through the Support section in the app or via our Telegram channel.</p>
            </div>
            
            <div>
              <h4 className="font-semibold">Are there fees for transactions?</h4>
              <p className="text-gray-700 mt-1">BLUEPAY maintains minimal transaction fees to ensure platform sustainability.</p>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Faq;
