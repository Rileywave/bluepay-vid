
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const QuickActions = () => {
  const navigate = useNavigate();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  
  // Preload video after component mounts
  React.useEffect(() => {
    const timer = setTimeout(() => setIsVideoLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  const handleWatch = () => {
    setIsVideoOpen(true);
  };

  const quickActions = [
    {
      id: 'buy-bpc',
      title: 'Buy BPC',
      emoji: '🛍',
      bgColor: 'bg-purple-100',
      onClick: () => navigate("/buy-bpc")
    },
    {
      id: 'watch',
      title: 'Watch',
      emoji: '📺',
      bgColor: 'bg-blue-100',
      onClick: handleWatch
    },
    {
      id: 'airtime',
      title: 'Airtime',
      emoji: '☎',
      bgColor: 'bg-orange-100',
      onClick: () => navigate("/airtime")
    },
    {
      id: 'data',
      title: 'Data',
      emoji: '📶',
      bgColor: 'bg-gray-100',
      onClick: () => navigate("/data")
    }
  ];

  return (
    <>
      <div className="bg-white rounded-xl p-3 mb-2 shadow-sm">
        <div className="grid grid-cols-4 gap-2">
          {quickActions.map((action) => {
            return (
              <div 
                key={action.id}
                className="flex flex-col items-center cursor-pointer"
                onClick={action.onClick}
              >
                <div className={`h-10 w-10 ${action.bgColor} rounded-lg mb-1 flex items-center justify-center`}>
                  <span className="text-lg">{action.emoji}</span>
                </div>
                <p className="text-xs font-medium text-center text-gray-800">{action.title}</p>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black">
          <DialogHeader className="p-4 pb-0">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-white">BluPay Tutorial</DialogTitle>
              <button 
                onClick={() => setIsVideoOpen(false)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </DialogHeader>
          <div className="aspect-video w-full">
            <iframe
              width="100%"
              height="100%"
              src="https://www.dailymotion.com/embed/video/x9qytu2"
              frameBorder="0"
              allowFullScreen
              className="rounded-b-lg"
              title="BluPay Tutorial"
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuickActions;
