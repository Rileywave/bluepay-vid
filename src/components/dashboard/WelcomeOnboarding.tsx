import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/stores/userStore";

const WelcomeOnboarding = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { userData } = useUserStore();
  
  // Extract first name from full name
  const getFirstName = () => {
    if (userData?.fullName) {
      return userData.fullName.split(' ')[0];
    }
    return "User";
  };

  const steps = [
    {
      emoji: "🎁",
      title: "Happy new month 🤗",
      description: "Welcome to the ultimate bonus claim trusted platform click on \"claim bonus\" to start earning which can be withdrawn after purchasing a BPC code.",
      buttonText: "Next →"
    },
    {
      emoji: "🛍",
      title: "Get Your BPC Code",
      description: "To withdraw funds, you'll need to purchase a BPC Code for ₦6,200. This is a one-time purchase that unlocks all features of the app.",
      buttonText: "Next →"
    },
    {
      emoji: "☎",
      title: "Airtime & Data",
      description: "You can purchase airtime and data for all major networks directly from the app. Simply select the service, enter the phone number, choose your plan, and complete your purchase.",
      buttonText: "Next →"
    },
    {
      emoji: "💰",
      title: "Withdrawal Process",
      description: "To withdraw your funds, tap the \"Withdraw\" button on your dashboard, enter your bank details and BPC Code, and submit your request. Withdrawals are processed within 24 hours.",
      buttonText: "Next →"
    },
    {
      emoji: "💲",
      title: "Earn More",
      description: "Explore our app to discover ways to earn more! Refer friends to earn ₦500 per referral, join our communities, and take advantage of special promotions.",
      buttonText: "Get Started →",
      hasActions: true
    }
  ];

  useEffect(() => {
    // Check if user has already seen this onboarding
    const hasSeenOnboarding = localStorage.getItem("bluepay-onboarding-completed");
    if (!hasSeenOnboarding) {
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem("bluepay-onboarding-completed", "true");
    setIsOpen(false);
  };

  const handleSkip = () => {
    localStorage.setItem("bluepay-onboarding-completed", "true");
    setIsOpen(false);
  };

  const handleCommunities = () => {
    window.open("https://t.me/Officialbluepay", "_blank");
  };

  const handleSupport = () => {
    navigate("/support");
    handleComplete();
  };

  const currentStepData = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-sm mx-auto bg-white dark:bg-gray-800 border-none p-0 gap-0">
        {/* Header */}
        <div className="bg-bluepay-blue text-white p-4 rounded-t-lg">
          <DialogHeader className="text-center">
            <div className="flex justify-between items-center mb-2">
              <DialogTitle className="text-lg font-bold text-white flex-1">
                Welcome to BLUEPAY, {getFirstName()}!
              </DialogTitle>
              <button
                onClick={handleSkip}
                className="p-1 hover:bg-white/10 rounded"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
            <p className="text-sm text-white/80">Step {currentStep + 1} of {steps.length}</p>
          </DialogHeader>
          
          {/* Progress Bar */}
          <div className="flex gap-2 mt-3">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1 rounded ${
                  index <= currentStep ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-bluepay-blue/10 flex items-center justify-center">
              <span className="text-3xl">{currentStepData.emoji}</span>
            </div>
          </div>

          {/* Title and Description */}
          <div className="text-center space-y-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {currentStepData.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {currentStepData.description}
            </p>
          </div>

          {/* Action Buttons for Last Step */}
          {currentStepData.hasActions && (
            <div className="flex justify-center gap-4 mb-4">
              <button
                onClick={handleCommunities}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span className="text-2xl">🌐</span>
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Communities</span>
              </button>
              
              <button
                onClick={handleSupport}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                  <span className="text-2xl">📡</span>
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Support</span>
              </button>
            </div>
          )}

          {/* Next Button */}
          <Button
            onClick={handleNext}
            className="w-full bg-bluepay-blue hover:bg-bluepay-blue/90 text-white py-3 rounded-lg font-medium"
          >
            {currentStepData.buttonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeOnboarding;
