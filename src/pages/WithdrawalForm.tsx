import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const withdrawalSchema = z.object({
  bankName: z.string().min(3, "Bank name is required"),
  accountName: z.string().min(3, "Account name is required"),
  accountNumber: z.string().length(10, "Account number must be 10 digits").regex(/^\d+$/, "Must be numbers only"),
  withdrawalAmount: z.number().min(100000, "Minimum withdrawal is ₦100,000"),
});

const WithdrawalForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [currentEarnings, setCurrentEarnings] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserEarnings();
    checkPendingWithdrawals();
  }, []);

  const fetchUserEarnings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('referral_earnings')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setCurrentEarnings(data?.referral_earnings || 0);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to fetch earnings",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkPendingWithdrawals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        toast({
          variant: "destructive",
          description: "You already have a pending withdrawal request",
        });
        navigate('/earn-more');
      }
    } catch (error) {
      console.error('Error checking withdrawals:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(withdrawalAmount);
    
    try {
      withdrawalSchema.parse({ 
        bankName, 
        accountName, 
        accountNumber,
        withdrawalAmount: amount 
      });
      
      navigate("/withdrawal/payment", {
        state: { 
          bankName, 
          accountName, 
          accountNumber,
          withdrawalAmount: amount 
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          description: error.errors[0].message,
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-foreground">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold">Withdrawal Details</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="bg-card rounded-lg p-6 shadow-sm mb-6">
          <div className="bg-primary/10 rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
            <p className="text-2xl font-bold text-primary">₦{currentEarnings.toLocaleString()}</p>
          </div>

          <h2 className="text-lg font-semibold mb-4">Enter Your Bank Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Enter bank name"
                required
              />
            </div>

            <div>
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Enter account name"
                required
              />
            </div>

            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter 10-digit account number"
                maxLength={10}
                required
              />
            </div>

            <div>
              <Label htmlFor="withdrawalAmount">Withdrawal Amount</Label>
              <Input
                id="withdrawalAmount"
                type="number"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                placeholder="Enter amount (minimum ₦100,000)"
                min={100000}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum: ₦100,000
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full mt-6"
              disabled={!withdrawalAmount || parseFloat(withdrawalAmount) < 100000}
            >
              Proceed to Payment
            </Button>
          </form>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
          <p className="font-medium mb-2">📌 Important Notice:</p>
          <p>• Minimum withdrawal: ₦100,000</p>
          <p>• Activation fee: ₦13,450</p>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalForm;
