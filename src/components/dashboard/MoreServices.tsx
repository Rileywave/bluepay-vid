
import React from "react";
import { useNavigate } from "react-router-dom";

const MoreServices = () => {
  const navigate = useNavigate();

  const moreServices = [
    {
      id: 'support',
      title: 'Support',
      emoji: '📡',
      bgColor: 'bg-gray-100',
      onClick: () => navigate("/support")
    },
    {
      id: 'group',
      title: 'Group',
      emoji: '🌐',
      bgColor: 'bg-blue-100',
      onClick: () => navigate("/platform")
    },
    {
      id: 'earn',
      title: 'Earn More',
      emoji: '💲',
      bgColor: 'bg-yellow-100',
      onClick: () => navigate("/earn-more")
    },
    {
      id: 'profile',
      title: 'Profile',
      emoji: '👤',
      bgColor: 'bg-gray-100',
      onClick: () => navigate("/profile")
    }
  ];

  return (
    <div className="bg-white rounded-xl p-3 mb-2 shadow-sm">
      <h3 className="font-bold text-base mb-2 text-gray-800">More Services</h3>
      <div className="grid grid-cols-4 gap-2">
        {moreServices.map((service) => {
          return (
            <div 
              key={service.id}
              className="flex flex-col items-center cursor-pointer"
              onClick={service.onClick}
            >
              <div className={`h-10 w-10 ${service.bgColor} rounded-lg mb-1 flex items-center justify-center`}>
                <span className="text-lg">{service.emoji}</span>
              </div>
              <p className="text-xs font-medium text-center text-gray-800">{service.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MoreServices;
