import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AccountUpgrade = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const bluepayAccount = {
    bankName: "Moniepoint MFB",
    accountNumber: "6709023538",
    accountName: "OFORAH MATTHEW"
  };

  const upgradeAmount = 15000;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: `${label} copied to clipboard!`,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          description: "File size must be less than 5MB",
        });
        return;
      }
      setScreenshot(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleConfirm = async () => {
    if (!screenshot) {
      toast({
        variant: "destructive",
        description: "Please upload payment screenshot",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("Not authenticated");

      const fileExt = screenshot.name.split('.').pop();
      const fileName = `upgrade_${user.data.user.id}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('upgrade-proofs')
        .upload(fileName, screenshot);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('upgrade-proofs')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          account_upgraded: true 
        })
        .eq('id', user.data.user.id);

      if (updateError) throw updateError;

      await supabase.from('referral_upgrades').insert({
        user_id: user.data.user.id,
        previous_rate: 15000,
        new_rate: 15000,
        payment_amount: upgradeAmount,
        payment_proof: publicUrl,
        payment_status: 'pending'
      });

      toast({
        description: "Account upgraded successfully! You can now make withdrawals.",
      });

      setTimeout(() => {
        setIsProcessing(false);
        navigate("/earn-more");
      }, 2000);

    } catch (error) {
      setIsProcessing(false);
      toast({
        variant: "destructive",
        description: "Failed to process upgrade. Please try again.",
      });
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 mb-6">
          <div className="w-full h-full rounded-full border-4 border-muted border-t-primary animate-spin"></div>
        </div>
        <h1 className="text-2xl font-bold mb-3 text-center">Processing Upgrade...</h1>
        <p className="text-muted-foreground text-center">
          Please wait while we activate your account
        </p>
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
          <h1 className="text-xl font-semibold">Upgrade Account</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-2xl font-bold mb-2">Unlock Withdrawals</h2>
          <p className="text-muted-foreground mb-4">
            Upgrade your account to access withdrawal features and start earning!
          </p>
          <div className="bg-card rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Upgrade Fee</p>
            <p className="text-3xl font-bold text-primary">₦{upgradeAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm mb-6">
          <h3 className="font-semibold mb-4">Make Payment To:</h3>

          <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Bank Name</p>
                <p className="font-semibold">{bluepayAccount.bankName}</p>
              </div>
              <button onClick={() => handleCopy(bluepayAccount.bankName, "Bank name")}>
                <Copy size={18} className="text-muted-foreground" />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Account Number</p>
                <p className="font-semibold">{bluepayAccount.accountNumber}</p>
              </div>
              <button onClick={() => handleCopy(bluepayAccount.accountNumber, "Account number")}>
                <Copy size={18} className="text-muted-foreground" />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Account Name</p>
                <p className="font-semibold">{bluepayAccount.accountName}</p>
              </div>
              <button onClick={() => handleCopy(bluepayAccount.accountName, "Account name")}>
                <Copy size={18} className="text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm mb-6">
          <h3 className="font-semibold mb-4">Upload Payment Screenshot</h3>
          
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="screenshot-upload"
            />
            <label htmlFor="screenshot-upload" className="cursor-pointer">
              {previewUrl ? (
                <div className="space-y-4">
                  <img src={previewUrl} alt="Payment proof" className="max-h-48 mx-auto rounded" />
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle size={20} />
                    <span>Screenshot uploaded</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload size={32} className="mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload screenshot</p>
                </div>
              )}
            </label>
          </div>
        </div>

        <Button 
          onClick={handleConfirm} 
          className="w-full"
          disabled={!screenshot}
        >
          Confirm & Upgrade Account
        </Button>

        <div className="bg-primary/10 rounded-lg p-4 mt-6 text-sm">
          <p className="font-medium">✨ Benefits After Upgrade:</p>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li>• Access to withdrawal features</li>
            <li>• Withdraw earnings from ₦120,000</li>
            <li>• Priority support</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AccountUpgrade;
