import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import TypewriterText from "../ui/TypewriterText";
import { useUserStore } from "../../stores/userStore";

const ImportantInformation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const { toggleBalanceVisibility } = useUserStore();
  
  const steps = [
    'Click "Buy BPC" from dashboard',
    'Fill details and amount',
    'Complete payment for BPC code',
    'Use code for airtime & withdrawals'
  ];

  const slides = [
    {
      type: 'image',
      src: '/lovable-uploads/e725b10a-6245-4970-815e-10be41430d6d.png',
      alt: 'BLUEPAY2025 App Interface',
      clickable: false
    },
    {
      type: 'image',
      src: '/lovable-uploads/3a8d935d-3aaa-4dba-baf7-3a9f6f69b654.png',
      alt: 'WooCommerce BluePay Payment Gateway',
      clickable: true
    },
    {
      type: 'info',
      content: 'information'
    }
  ];

  const [currentStepText, setCurrentStepText] = useState(steps[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const nextStep = (prev + 1) % steps.length;
        setCurrentStepText(steps[nextStep]);
        return nextStep;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [steps.length]);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(slideInterval);
  }, [slides.length]);

  const handleImageClick = (clickable: boolean) => {
    if (clickable) {
      toggleBalanceVisibility();
    }
  };

  return (
    <div className="relative overflow-hidden mb-2">
      <div className="relative w-full h-[200px]">
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : 
              index < currentSlide ? '-translate-x-full' : 'translate-x-full'
            }`}
          >
            {slide.type === 'image' ? (
              <Card 
                className={`w-full h-full p-0 overflow-hidden shadow-lg ${
                  slide.clickable ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''
                }`}
                onClick={() => handleImageClick(slide.clickable)}
              >
                <img 
                  src={slide.src} 
                  alt={slide.alt} 
                  className="w-full h-full object-cover rounded-lg"
                />
              </Card>
            ) : (
              <Card className="bg-gradient-to-r from-blue-500 to-purple-600 w-full h-full p-3 text-white shadow-lg flex flex-col">
                <h3 className="text-base font-bold mb-2 text-white">Important Information</h3>
                
                <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm flex-1 flex flex-col">
                  <h4 className="text-sm font-semibold mb-2 text-white">How to Buy BPC Code</h4>
                  
                  <div className="space-y-2 flex-1">
                    {steps.map((step, stepIndex) => (
                      <div 
                        key={stepIndex}
                        className={`flex items-center transition-all duration-500 transform ${
                          stepIndex === currentStep 
                            ? 'scale-105 opacity-100 translate-x-1' 
                            : 'scale-100 opacity-70 translate-x-0'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center mr-2 transition-all duration-500 flex-shrink-0 ${
                          stepIndex === currentStep 
                            ? 'bg-yellow-400 text-blue-900 shadow-lg' 
                            : 'bg-white/30 text-white'
                        }`}>
                          <span className="text-xs font-bold">{stepIndex + 1}</span>
                        </div>
                        <p className={`text-xs transition-all duration-500 ${
                          stepIndex === currentStep ? 'font-semibold text-yellow-100' : 'text-white/90'
                        }`}>
                          {stepIndex === currentStep ? (
                            <TypewriterText 
                              text={currentStepText} 
                              speed={80}
                              className="text-yellow-100"
                            />
                          ) : (
                            step
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex space-x-1 mt-2 justify-center">
                    {steps.map((_, stepIndex) => (
                      <div
                        key={stepIndex}
                        className={`w-1 h-1 rounded-full transition-all duration-300 ${
                          stepIndex === currentStep ? 'bg-yellow-400' : 'bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        ))}
      </div>
      
      {/* Slide indicators */}
      <div className="flex justify-center mt-2 space-x-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImportantInformation;