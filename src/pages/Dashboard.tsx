
import React, { useEffect, useRef } from "react";
import { useUserStore } from "../stores/userStore";
import Header from "../components/dashboard/Header";
import UserGreeting from "../components/dashboard/UserGreeting";
import BalanceCard from "../components/dashboard/BalanceCard";
import QuickActions from "../components/dashboard/QuickActions";
import MoreServices from "../components/dashboard/MoreServices";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import BottomNavigation from "../components/dashboard/BottomNavigation";
import OpayNotificationBanner from "../components/dashboard/OpayNotificationBanner";
import ImportantInformation from "../components/dashboard/ImportantInformation";
import WithdrawalNotifications from "../components/dashboard/WithdrawalNotifications";
import WelcomeOnboarding from "../components/dashboard/WelcomeOnboarding";
import DraggableBadge from "../components/dashboard/DraggableBadge";

const Dashboard = () => {
  const { userData, balance, transactions } = useUserStore();
  const hasPlayedWelcome = useRef(false);

  useEffect(() => {
    const playWelcomeMessage = () => {
      if (hasPlayedWelcome.current || !userData?.fullName) return;
      
      // Check if speech synthesis is supported
      if (!('speechSynthesis' in window)) {
        console.log('Speech synthesis not supported');
        return;
      }

      hasPlayedWelcome.current = true;

      const welcomeText = `Hi ${userData.fullName}, welcome to bluepay to the latest version of bluepay, where you can make 200,000 naira daily just by purchasing your BPC code for the sum of 6,200 naira, kindly click on the BPC button to purchase your code directly from the application, have a nice day.`;

      const speak = () => {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(welcomeText);
        
        // Configure speech settings for mobile compatibility
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        utterance.lang = 'en-US';
        
        // Get voices and select the best one
        const voices = window.speechSynthesis.getVoices();
        
        // For mobile devices, prefer specific voices
        const preferredVoice = voices.find(voice => 
          voice.lang.includes('en') && 
          (voice.name.includes('Female') || 
           voice.name.includes('Samantha') ||
           voice.name.includes('Google') ||
           voice.name.includes('Microsoft'))
        ) || voices.find(voice => voice.lang.includes('en')) || voices[0];
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        // Error handling for mobile
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
        };

        utterance.onend = () => {
          console.log('Welcome message completed');
        };

        // Speak with a delay to ensure everything is loaded
        window.speechSynthesis.speak(utterance);
      };

      // For iOS and Android, we need to ensure voices are loaded
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        // Voices not loaded yet, wait for them
        window.speechSynthesis.onvoiceschanged = () => {
          setTimeout(speak, 500);
        };
        // Also try loading voices manually (helps on some Android devices)
        window.speechSynthesis.getVoices();
      } else {
        // Voices already loaded
        setTimeout(speak, 800);
      }
    };

    // Small delay to ensure page is fully loaded
    const timer = setTimeout(playWelcomeMessage, 1000);
    return () => clearTimeout(timer);
  }, [userData]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 pb-16 relative">
      <WelcomeOnboarding />
      <WithdrawalNotifications />
      <OpayNotificationBanner />
      <Header />

      <div className="p-2 space-y-2">
        <UserGreeting userData={userData} />
        <BalanceCard balance={balance} />
        <QuickActions />
        <MoreServices />
        <ImportantInformation />
        <RecentTransactions transactions={transactions} />
      </div>
      
      <BottomNavigation />
      <DraggableBadge />
    </div>
  );
};

export default Dashboard;
