import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Upload, Sun, Moon, Circle, CircleHelp, Smartphone, Download, ChevronRight, RotateCcw, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "../stores/userStore";
import { useToast } from "@/components/ui/use-toast";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import ResetBalance from "../components/ResetBalance";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userData, setUserData, themeMode, setThemeMode } = useUserStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isResetBalanceOpen, setIsResetBalanceOpen] = useState(false);
  const [referralCode, setReferralCode] = useState<string>("");
  const [referralCount, setReferralCount] = useState<number>(0);
  
  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("referral_code, referral_count")
          .eq("id", user.id)
          .single();
        
        if (profile) {
          setReferralCode(profile.referral_code);
          setReferralCount(profile.referral_count);
        }
      }
    };
    
    fetchProfile();
  }, []);

  // Apply theme on component mount and when themeMode changes
  useEffect(() => {
    applyTheme(themeMode);
  }, [themeMode]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUserData({
          ...userData!,
          profileImage: reader.result as string
        });
        toast({
          title: "Profile updated",
          description: "Your profile image has been updated successfully",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleThemeChange = (value: string) => {
    setThemeMode(value as 'dark' | 'light' | 'system' | 'device');
    toast({
      title: "Theme updated",
      description: `Theme has been set to ${value} mode`,
    });
  };

  // Function to apply theme to the document
  const applyTheme = (mode: string) => {
    const root = document.documentElement;
    
    // Remove all theme classes first
    root.classList.remove('dark', 'light', 'system', 'device');
    
    if (mode === 'dark') {
      root.classList.add('dark');
    } else if (mode === 'system') {
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.add('light');
      }
      
      // Add listener for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          root.classList.remove('light');
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
          root.classList.add('light');
        }
      };
      
      // Remove any existing listener to prevent duplicates
      try {
        mediaQuery.removeEventListener('change', handleChange);
      } catch (e) {
        console.log('No existing listener');
      }
      
      // Add new listener
      mediaQuery.addEventListener('change', handleChange);
    } else if (mode === 'device') {
      root.classList.add('device');
    } else {
      // Light mode is default
      root.classList.add('light');
    }
  };

  const handleDownloadApp = () => {
    window.open("https://www.upload-apk.com/DGGv0TvbouKJJHW", "_blank");
    toast({
      title: "Opening download page",
      description: "Redirecting to app download...",
    });
  };

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
  };

  const handleShareReferralLink = () => {
    const referralLink = `${window.location.origin}/register?ref=${referralCode}`;
    
    if (navigator.share) {
      navigator.share({
        title: "Join BluePay",
        text: `Use my referral code ${referralCode} to get ₦20,000 bonus when you sign up!`,
        url: referralLink,
      }).catch((error) => console.log("Error sharing:", error));
    } else {
      navigator.clipboard.writeText(referralLink);
      toast({
        title: "Link Copied!",
        description: "Referral link copied to clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen bg-bluepay-blue text-white">
      <header className="p-3 flex items-center">
        <button onClick={() => navigate(-1)} className="flex items-center text-white">
          <ArrowLeft className="h-6 w-6 mr-2" />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center">Profile</h1>
        <div className="w-6"></div>
      </header>

      <div className="flex flex-col items-center p-4">
        <div className="relative mb-3">
          <Avatar className="w-20 h-20 border-2 border-white">
            {userData?.profileImage ? (
              <AvatarImage src={userData.profileImage} alt="Profile" className="object-cover" />
            ) : (
              <AvatarFallback className="bg-yellow-500 text-white text-2xl">
                <User className="h-8 w-8" />
              </AvatarFallback>
            )}
          </Avatar>
          <div 
            className="absolute bottom-0 right-0 bg-white text-bluepay-blue rounded-full p-1.5 cursor-pointer"
            onClick={triggerFileUpload}
          >
            <Upload className="h-3 w-3" />
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageUpload} 
              className="hidden" 
              accept="image/*"
            />
          </div>
        </div>

        <h2 className="text-xl font-bold">{userData?.fullName || "User"}</h2>
        <p className="text-gray-300 mb-4">{userData?.email || "No email set"}</p>

        <div className="w-full max-w-md bg-white rounded-xl p-4 text-gray-800">
          <h3 className="text-lg font-semibold mb-4">Account Information</h3>
          
          <div className="space-y-3">
            <div>
              <p className="text-gray-500 mb-1 text-sm">Full Name</p>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-400" />
                <p className="text-sm">{userData?.fullName || "Not set"}</p>
              </div>
              <div className="h-px bg-gray-200 my-2"></div>
            </div>
            
            <div>
              <p className="text-gray-500 mb-1 text-sm">Email Address</p>
              <p className="text-sm">{userData?.email || "Not set"}</p>
              <div className="h-px bg-gray-200 my-2"></div>
            </div>
            
            <div>
              <p className="text-gray-500 mb-1 text-sm">Account Level</p>
              <p className="text-sm">Basic</p>
              <div className="h-px bg-gray-200 my-2"></div>
            </div>

            {referralCode && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <p className="text-gray-700 font-semibold mb-2 text-sm">Your Referral Code</p>
                <div className="flex items-center justify-between mb-3">
                  <code className="text-2xl font-bold text-blue-600">{referralCode}</code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyReferralCode}
                    className="flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  You've referred <span className="font-bold text-blue-600">{referralCount}</span> {referralCount === 1 ? 'person' : 'people'}
                </p>
                <Button
                  onClick={handleShareReferralLink}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                  size="sm"
                >
                  <Share2 className="h-4 w-4" />
                  Share Referral Link
                </Button>
              </div>
            )}

            <div>
              <div 
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={() => setIsResetBalanceOpen(true)}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-2">
                    <RotateCcw className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Reset Balance</p>
                    <p className="text-xs text-gray-500">Reset your account balance</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
              <div className="h-px bg-gray-200 my-2"></div>
            </div>
            
            <div>
              <div 
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={handleDownloadApp}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <Download className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Download App</p>
                    <p className="text-xs text-gray-500">Get the mobile app</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
              <div className="h-px bg-gray-200 my-2"></div>
            </div>
            
            <div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 mb-1 text-sm">Theme</p>
                  <div className="flex items-center">
                    {themeMode === 'light' && <Sun className="h-4 w-4 mr-2 text-gray-500" />}
                    {themeMode === 'dark' && <Moon className="h-4 w-4 mr-2 text-gray-500" />}
                    {themeMode === 'system' && <CircleHelp className="h-4 w-4 mr-2 text-gray-500" />}
                    {themeMode === 'device' && <Smartphone className="h-4 w-4 mr-2 text-gray-500" />}
                    <p className="text-sm">{themeMode === 'light' ? 'Light Mode' : 
                                           themeMode === 'dark' ? 'Dark Mode' : 
                                           themeMode === 'system' ? 'System Mode' : 'Device Mode'}</p>
                  </div>
                </div>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-gray-100 text-xs">
                      Toggle
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-72">
                    <SheetHeader className="mb-3">
                      <SheetTitle className="text-lg">Select Theme</SheetTitle>
                      <SheetDescription className="text-sm">
                        Choose your preferred app appearance
                      </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-3 py-2">
                      <div className="space-y-2">
                        <div 
                          className={`flex items-center justify-between p-2 rounded-lg ${themeMode === 'light' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}
                          onClick={() => handleThemeChange('light')}
                        >
                          <div className="flex items-center">
                            <Sun className="h-4 w-4 mr-2 text-blue-600" />
                            <div>
                              <p className="font-medium text-sm">Light Mode</p>
                              <p className="text-xs text-gray-500">Standard light appearance</p>
                            </div>
                          </div>
                          {themeMode === 'light' && <div className="h-2 w-2 bg-blue-500 rounded-full"></div>}
                        </div>

                        <div 
                          className={`flex items-center justify-between p-2 rounded-lg ${themeMode === 'dark' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}
                          onClick={() => handleThemeChange('dark')}
                        >
                          <div className="flex items-center">
                            <Moon className="h-4 w-4 mr-2 text-blue-600" />
                            <div>
                              <p className="font-medium text-sm">Dark Mode</p>
                              <p className="text-xs text-gray-500">Easier on the eyes</p>
                            </div>
                          </div>
                          {themeMode === 'dark' && <div className="h-2 w-2 bg-blue-500 rounded-full"></div>}
                        </div>

                        <div 
                          className={`flex items-center justify-between p-2 rounded-lg ${themeMode === 'system' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}
                          onClick={() => handleThemeChange('system')}
                        >
                          <div className="flex items-center">
                            <CircleHelp className="h-4 w-4 mr-2 text-blue-600" />
                            <div>
                              <p className="font-medium text-sm">System Mode</p>
                              <p className="text-xs text-gray-500">Match system settings</p>
                            </div>
                          </div>
                          {themeMode === 'system' && <div className="h-2 w-2 bg-blue-500 rounded-full"></div>}
                        </div>

                        <div 
                          className={`flex items-center justify-between p-2 rounded-lg ${themeMode === 'device' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}
                          onClick={() => handleThemeChange('device')}
                        >
                          <div className="flex items-center">
                            <Smartphone className="h-4 w-4 mr-2 text-blue-600" />
                            <div>
                              <p className="font-medium text-sm">Device Mode</p>
                              <p className="text-xs text-gray-500">Optimized for device</p>
                            </div>
                          </div>
                          {themeMode === 'device' && <div className="h-2 w-2 bg-blue-500 rounded-full"></div>}
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="destructive"
          size="sm"
          className="mt-6 w-full max-w-md"
          onClick={() => navigate("/")}
        >
          Logout
        </Button>
      </div>

      <ResetBalance isOpen={isResetBalanceOpen} onClose={() => setIsResetBalanceOpen(false)} />
    </div>
  );
};

export default Profile;
