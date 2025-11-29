import React from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WithdrawalFailed = () => {
  const navigate = useNavigate();
  const whatsappNumber = "+2347059382766";

  const handleWhatsAppSupport = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=Hello, I need help with my withdrawal request.`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b py-4 px-4 text-center sticky top-0 z-10">
        <h1 className="text-xl font-semibold">Withdrawal Status</h1>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 mb-6 flex items-center justify-center">
          <XCircle size={80} className="text-destructive" strokeWidth={2} />
        </div>
        
        <h1 className="text-2xl font-bold mb-3 text-center">Payment Not Completed</h1>
        <p className="text-base text-muted-foreground text-center mb-8 max-w-md">
          We could not verify your payment at this time. Please contact our support team for assistance with your withdrawal request.
        </p>
        
        <div className="w-full max-w-md space-y-3">
          <Button 
            onClick={handleWhatsAppSupport}
            className="w-full gap-2"
          >
            <MessageCircle size={20} />
            Contact Support on WhatsApp
          </Button>

          <Button 
            onClick={() => navigate("/earn-more")}
            variant="outline"
            className="w-full"
          >
            Back to Earnings
          </Button>
        </div>

        <div className="mt-8 bg-muted/50 rounded-lg p-4 max-w-md">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">💡 Note:</span> Our support team will help verify your payment and process your withdrawal request manually.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalFailed;
