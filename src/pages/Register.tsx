
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useUserStore } from "../stores/userStore";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// Password validation schema
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUserData } = useUserStore();
  const [searchParams] = useSearchParams();
  const [referralCode, setReferralCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    enteredReferralCode: "",
  });

  useEffect(() => {
    // Check URL parameter first
    const refCode = searchParams.get('ref');
    
    if (refCode) {
      const upperRefCode = refCode.trim().toUpperCase();
      // Store in localStorage for persistence
      localStorage.setItem('referralCode', upperRefCode);
      setReferralCode(upperRefCode);
      setFormData((prev) => ({ ...prev, enteredReferralCode: upperRefCode }));
      toast({
        title: "Referral Code Applied!",
        description: `Using referral code: ${upperRefCode}`,
      });
    } else {
      // If no URL parameter, check localStorage
      const storedRefCode = localStorage.getItem('referralCode');
      if (storedRefCode) {
        setReferralCode(storedRefCode);
        setFormData((prev) => ({ ...prev, enteredReferralCode: storedRefCode }));
        toast({
          title: "Referral Code Restored!",
          description: `Using referral code: ${storedRefCode}`,
        });
      }
    }
  }, [searchParams, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate password strength
      const passwordValidation = passwordSchema.safeParse(formData.password);
      if (!passwordValidation.success) {
        toast({
          title: "Weak Password",
          description: passwordValidation.error.errors[0].message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Sign up with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (signUpError) throw signUpError;

      if (!authData.user) {
        throw new Error("Failed to create user account");
      }

      // Process referral code if provided
      const codeToUse = formData.enteredReferralCode.trim().toUpperCase();
      if (codeToUse) {
        const { error: referralError } = await supabase.rpc("process_referral", {
          referrer_code: codeToUse,
          new_user_id: authData.user.id,
        });

        if (referralError) {
          toast({
            title: "Registration Successful",
            description: "Account created, but referral code could not be applied.",
            variant: "default",
          });
        } else {
          toast({
            title: "Registration Successful!",
            description: `Welcome! Your referrer has been credited.`,
          });
        }
      } else {
        toast({
          title: "Registration Successful!",
          description: "Your account has been created.",
        });
      }

      // Store user data locally
      setUserData({
        fullName: formData.fullName,
        email: formData.email,
      });

      // Clear referral code from localStorage after successful registration
      localStorage.removeItem('referralCode');

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: "Unable to complete registration. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleHelpClick = () => {
    window.open("https://t.me/Officialbluepay", "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-bluepay-blue text-white">
      <header className="p-3">
        <button onClick={() => navigate("/")} className="flex items-center text-white">
          <ArrowLeft className="h-5 w-5 mr-2" />
        </button>
        <div className="absolute top-3 right-3">
          <span className="text-white cursor-pointer text-sm" onClick={handleHelpClick}>You Need Help?</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col justify-center p-4">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-2xl font-bold mb-2 text-white text-center">BLUEPAY</h1>
          <h2 className="text-xl font-bold mb-3 text-white">Welcome!</h2>
          
          {referralCode && (
            <div className="bg-green-500/20 border border-green-400 rounded-lg p-2 mb-3">
              <p className="text-green-100 text-xs">
                🎉 Referral code detected: <span className="font-bold">{referralCode}</span>
              </p>
              <p className="text-green-100 text-xs">Your referrer will be credited when you register!</p>
            </div>
          )}
          
          <p className="text-gray-100 mb-4 text-sm">
            Get your account ready and instantly start buying, selling airtime and data online and start paying all your bills in cheaper price.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              name="fullName"
              placeholder="Your Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="rounded-md bg-white/10 border-white/20 px-3 py-2 text-white placeholder:text-gray-300"
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="rounded-md bg-white/10 border-white/20 px-3 py-2 text-white placeholder:text-gray-300"
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="rounded-md bg-white/10 border-white/20 px-3 py-2 text-white placeholder:text-gray-300"
              required
            />
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-sm">+234</span>
              <Input
                name="phoneNumber"
                type="tel"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="rounded-md bg-white/10 border-white/20 pl-12 py-2 text-white placeholder:text-gray-300"
                required
              />
            </div>

            <Input
              name="enteredReferralCode"
              placeholder="Referral Code (Optional)"
              value={formData.enteredReferralCode}
              onChange={handleChange}
              className="rounded-md bg-white/10 border-white/20 px-3 py-2 text-white placeholder:text-gray-300 uppercase"
              maxLength={6}
            />

            <p className="text-xs text-gray-200">
              Any further actions indicates that you agree with our terms & conditions!
            </p>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-100 text-bluepay-blue py-2 font-bold rounded-full disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-200 text-sm">Already have an account? </span>
            <button 
              onClick={() => navigate("/pin")} 
              className="text-white font-medium underline text-sm"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
